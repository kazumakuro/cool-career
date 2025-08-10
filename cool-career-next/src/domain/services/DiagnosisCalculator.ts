import { Answer } from '../entities/Answer'
import { Question } from '../entities/Question'
import { MBTIType } from '../value-objects/MBTIType'
import { CareerDNA } from '../value-objects/CareerDNA'
import { DiagnosisResult } from '../value-objects/DiagnosisResult'
import { MBTIScores, DNAScores, DNAType } from '../types'

/**
 * 診断計算サービス
 * 回答から診断結果を計算するドメインサービス
 */
export class DiagnosisCalculator {
  /**
   * 診断結果を計算
   */
  calculateResult(
    sessionId: string,
    answers: ReadonlyArray<Answer>,
    questions: ReadonlyArray<Question>
  ): DiagnosisResult {
    // 質問と回答のマッピングを作成
    const questionMap = new Map(questions.map(q => [q.id, q]))
    
    // MBTIスコアを計算
    const mbtiScores = this.calculateMBTIScores(answers, questionMap)
    const mbtiType = MBTIType.fromScores(mbtiScores)
    
    // キャリアDNAスコアを計算
    const dnaScores = this.calculateDNAScores(answers, questionMap)
    const careerDNA = CareerDNA.fromScores(dnaScores)
    
    // 信頼度を計算
    const confidence = this.calculateConfidence(answers)
    
    return DiagnosisResult.create({
      sessionId,
      mbtiType,
      careerDNA,
      confidence
    })
  }

  /**
   * MBTIスコアを計算
   */
  private calculateMBTIScores(
    answers: ReadonlyArray<Answer>,
    questionMap: Map<string, Question>
  ): MBTIScores {
    const scores: MBTIScores = {
      E_I: 0,
      S_N: 0,
      T_F: 0,
      J_P: 0
    }

    const counts = {
      E_I: 0,
      S_N: 0,
      T_F: 0,
      J_P: 0
    }

    answers.forEach(answer => {
      const question = questionMap.get(answer.questionId)
      if (!question || !question.isMBTIQuestion()) return

      const option = question.getOptionByValue(answer.value)
      if (!option || !option.mbtiAxis) return

      // オプションのスコアと回答の信頼度を考慮
      const score = (option.score || 1) * answer.getReliabilityScore()
      const axis = option.mbtiAxis

      // E/I軸の場合
      if (axis === 'E_I') {
        scores.E_I += option.value === 'E' ? score : -score
        counts.E_I++
      }
      // S/N軸の場合
      else if (axis === 'S_N') {
        scores.S_N += option.value === 'S' ? score : -score
        counts.S_N++
      }
      // T/F軸の場合
      else if (axis === 'T_F') {
        scores.T_F += option.value === 'T' ? score : -score
        counts.T_F++
      }
      // J/P軸の場合
      else if (axis === 'J_P') {
        scores.J_P += option.value === 'J' ? score : -score
        counts.J_P++
      }
    })

    // 正規化（-100 から +100 の範囲に）
    Object.keys(scores).forEach(axis => {
      const key = axis as keyof MBTIScores
      if (counts[key] > 0) {
        scores[key] = (scores[key] / counts[key]) * 20
        scores[key] = Math.max(-100, Math.min(100, scores[key]))
      }
    })

    return scores
  }

  /**
   * キャリアDNAスコアを計算
   */
  private calculateDNAScores(
    answers: ReadonlyArray<Answer>,
    questionMap: Map<string, Question>
  ): DNAScores {
    const rawScores: DNAScores = {
      Pioneer: 0,
      Builder: 0,
      Specialist: 0,
      Connector: 0,
      Guardian: 0
    }

    let totalWeight = 0

    answers.forEach(answer => {
      const question = questionMap.get(answer.questionId)
      if (!question || !question.isDNAQuestion()) return

      const option = question.getOptionByValue(answer.value)
      if (!option || !option.dna) return

      // 質問の重みと回答の信頼度を考慮
      const weight = question.weight * answer.getReliabilityScore()
      const score = (option.score || 3) * weight

      rawScores[option.dna] += score
      totalWeight += weight
    })

    // 正規化（合計が100になるように）
    const normalizedScores: DNAScores = {
      Pioneer: 0,
      Builder: 0,
      Specialist: 0,
      Connector: 0,
      Guardian: 0
    }

    if (totalWeight > 0) {
      const total = Object.values(rawScores).reduce((sum, score) => sum + score, 0)
      
      Object.keys(rawScores).forEach(dna => {
        const key = dna as DNAType
        normalizedScores[key] = total > 0 
          ? Math.round((rawScores[key] / total) * 100 * 10) / 10
          : 20 // デフォルト値
      })
    } else {
      // 回答がない場合は均等に配分
      Object.keys(normalizedScores).forEach(dna => {
        normalizedScores[dna as DNAType] = 20
      })
    }

    return normalizedScores
  }

  /**
   * 診断の信頼度を計算
   */
  private calculateConfidence(answers: ReadonlyArray<Answer>): number {
    if (answers.length === 0) return 0

    let confidence = 100

    // 1. 回答の信頼度スコアの平均
    const avgReliability = answers.reduce(
      (sum, answer) => sum + answer.getReliabilityScore(),
      0
    ) / answers.length
    confidence *= avgReliability

    // 2. 回答時間の一貫性をチェック
    const responseTimes = answers.map(a => a.responseTime)
    const avgTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    const variance = responseTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / responseTimes.length
    const stdDev = Math.sqrt(variance)
    
    // 標準偏差が大きすぎる場合は信頼度を下げる
    if (stdDev > avgTime * 0.8) {
      confidence *= 0.9
    }

    // 3. 極端に速い回答の割合
    const instantAnswers = answers.filter(a => a.isInstantAnswer()).length
    const instantRatio = instantAnswers / answers.length
    if (instantRatio > 0.3) {
      confidence *= (1 - instantRatio * 0.3)
    }

    // 4. 極端に遅い回答の割合
    const slowAnswers = answers.filter(a => a.isSlowAnswer()).length
    const slowRatio = slowAnswers / answers.length
    if (slowRatio > 0.3) {
      confidence *= (1 - slowRatio * 0.1)
    }

    return Math.round(Math.max(0, Math.min(100, confidence)))
  }

  /**
   * 回答パターンの一貫性をチェック
   */
  private checkConsistency(answers: ReadonlyArray<Answer>): number {
    // 実装例：似た質問への回答の一貫性をチェック
    // ここでは簡略化のため、常に高い一貫性を返す
    return 0.95
  }
}