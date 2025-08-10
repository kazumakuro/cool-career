import { IQuestionRepository } from '../../application/interfaces/IQuestionRepository'
import { Question } from '../../domain/entities/Question'
import { DiagnosisType, QuestionOption, MBTIAxis, DNAType, QuestionCategory } from '../../domain/types'
import quickQuestionsData from '../../../data/questions/quick-questions.json'
import fullQuestionsData from '../../../data/questions/full-questions.json'

/**
 * 静的ファイルベースの質問リポジトリ実装
 */
export class StaticQuestionRepository implements IQuestionRepository {
  private quickQuestions: Question[] = []
  private fullQuestions: Question[] = []
  private initialized = false

  /**
   * 初期化処理
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return

    // クイック診断の質問をロード
    this.quickQuestions = quickQuestionsData.questions.map(q =>
      Question.create({
        id: q.id,
        text: q.text,
        options: q.options.map(o => ({
          value: o.value,
          text: o.text,
          score: o.score,
          mbtiAxis: 'mbtiAxis' in o ? o.mbtiAxis as MBTIAxis : undefined,
          dna: 'dna' in o ? o.dna as DNAType : undefined
        })) as QuestionOption[],
        category: q.category as QuestionCategory,
        subcategory: q.subcategory,
        weight: q.weight
      })
    )

    // フル診断の質問をロード（まだファイルがない場合はクイック診断の質問を使用）
    try {
      this.fullQuestions = fullQuestionsData.questions.filter((q) => q.id !== 'placeholder_note').map(q =>
        Question.create({
          id: q.id,
          text: q.text,
          options: q.options.map((o) => ({
            value: o.value,
            text: o.text,
            score: o.score,
            mbtiAxis: 'mbtiAxis' in o ? o.mbtiAxis as MBTIAxis : undefined,
            dna: 'dna' in o ? o.dna as DNAType : undefined
          })) as QuestionOption[],
          category: q.category as QuestionCategory,
          subcategory: q.subcategory,
          weight: q.weight
        })
      )
    } catch {
      // フル診断のデータがまだない場合は、仮でクイック診断の質問を使用
      this.fullQuestions = [...this.quickQuestions]
    }

    this.initialized = true
  }

  /**
   * 診断タイプに応じた質問を取得
   */
  async getQuestions(type: DiagnosisType): Promise<Question[]> {
    await this.initialize()
    
    return type === 'quick' 
      ? [...this.quickQuestions]
      : [...this.fullQuestions]
  }

  /**
   * IDから質問を取得
   */
  async findById(id: string): Promise<Question | null> {
    await this.initialize()
    
    const question = 
      this.quickQuestions.find(q => q.id === id) ||
      this.fullQuestions.find(q => q.id === id)
    
    return question || null
  }

  /**
   * すべての質問を取得
   */
  async getAllQuestions(): Promise<Question[]> {
    await this.initialize()
    
    // 重複を除いたすべての質問を返す
    const allQuestions = [...this.quickQuestions, ...this.fullQuestions]
    const uniqueQuestions = Array.from(
      new Map(allQuestions.map(q => [q.id, q])).values()
    )
    
    return uniqueQuestions
  }

  /**
   * カテゴリごとの質問を取得
   */
  async getByCategory(category: string): Promise<Question[]> {
    await this.initialize()
    
    const allQuestions = await this.getAllQuestions()
    return allQuestions.filter(q => q.category === category)
  }

  /**
   * サブカテゴリごとの質問を取得
   */
  async getBySubcategory(subcategory: string): Promise<Question[]> {
    await this.initialize()
    
    const allQuestions = await this.getAllQuestions()
    return allQuestions.filter(q => q.subcategory === subcategory)
  }
}