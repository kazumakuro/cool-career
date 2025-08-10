// ドメイン層の基本的な型定義

export type DiagnosisType = 'quick' | 'full'

export type MBTIAxis = 'E_I' | 'S_N' | 'T_F' | 'J_P'

export type DNAType = 'Pioneer' | 'Builder' | 'Specialist' | 'Connector' | 'Guardian'

export type QuestionCategory = 'mbti' | 'dna'

export interface QuestionOption {
  value: string
  text: string
  score?: number
  dna?: DNAType
  mbtiAxis?: MBTIAxis
}

export interface MBTIScores {
  E_I: number  // -100 (極度のI) ～ +100 (極度のE)
  S_N: number  // -100 (極度のN) ～ +100 (極度のS)
  T_F: number  // -100 (極度のF) ～ +100 (極度のT)
  J_P: number  // -100 (極度のP) ～ +100 (極度のJ)
}

export interface DNAScores {
  Pioneer: number     // 0-100
  Builder: number     // 0-100
  Specialist: number  // 0-100
  Connector: number   // 0-100
  Guardian: number    // 0-100
}

export interface TypeDescription {
  type: string
  title: string
  description: string
  strengths: string[]
  challenges: string[]
  careers: string[]
  workStyle: string
}