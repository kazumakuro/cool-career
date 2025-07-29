# Cool Career 診断質問設計書

## 概要
80タイプ診断を実現するための70問の詳細設計書です。MBTI判定50問とキャリアDNA判定20問で構成され、各質問は心理学的根拠に基づいて設計されています。

## 質問設計の原則

### 1. 基本原則
- **具体的なシチュエーション**: 抽象的な質問を避け、日常的な場面を設定
- **中立的な表現**: 社会的望ましさバイアスを最小化
- **バランスの取れた選択肢**: どの選択肢も等しく魅力的に
- **文化的配慮**: 日本の文化・職場環境を考慮

### 2. 質問の種類
```yaml
直接質問: 行動や好みを直接聞く
  例: "休日はどう過ごしますか？"

シチュエーション質問: 特定の状況での反応を聞く
  例: "締切が迫るプロジェクトで..."

価値観質問: 大切にしていることを聞く
  例: "仕事で最も重要だと思うのは？"

経験質問: 過去の体験から傾向を探る
  例: "学生時代に得意だったのは？"
```

## MBTI診断質問（Q1-Q50）

### E-I軸（外向-内向）: 12問

#### Q1-Q4: 社交性
```yaml
Q1:
  text: "金曜日の夜、仕事が終わりました。あなたは？"
  options:
    a: "同僚を誘って飲みに行く" # E+3
    b: "一人で行きつけの店でゆっくり" # I+1
    c: "まっすぐ家に帰ってリラックス" # I+3
    d: "その日の気分で決める" # 0
  category: "social_preference"
  weight: 1.0

Q2:
  text: "新しいプロジェクトチームが発足。あなたの理想は？"
  options:
    a: "大人数でワイワイと進める" # E+3
    b: "少人数で密にコミュニケーション" # E+1
    c: "基本は個人作業、必要時のみ会議" # I+2
    d: "一人で黙々と進められる環境" # I+3
  category: "work_style"
  weight: 1.2

Q3:
  text: "休憩時間、あなたはどこにいる？"
  options:
    a: "休憩室で同僚と雑談" # E+3
    b: "自席で SNS チェック" # E+1
    c: "一人になれる場所で音楽を聴く" # I+2
    d: "外に出て一人で散歩" # I+3
  category: "break_preference"
  weight: 0.8

Q4:
  text: "アイデアを考えるとき、あなたは？"
  options:
    a: "人と話しながら考えがまとまる" # E+3
    b: "議論の中で新しい発想が生まれる" # E+2
    c: "一人で考えてから人に相談" # I+2
    d: "静かな環境で一人で熟考" # I+3
  category: "thinking_process"
  weight: 1.0
```

#### Q5-Q8: エネルギー源
```yaml
Q5:
  text: "一日中会議が続いた日の夜、あなたは？"
  options:
    a: "まだ元気！誰かと話したい" # E+3
    b: "少し疲れたけど、飲みに行ける" # E+1
    c: "疲れた。家でゆっくりしたい" # I+2
    d: "人と話すエネルギーが残ってない" # I+3
  category: "energy_source"
  weight: 1.3

Q6:
  text: "最も充実感を感じるのは？"
  options:
    a: "大勢の前でプレゼンが成功したとき" # E+3
    b: "チームで目標を達成したとき" # E+1
    c: "一人で難問を解決したとき" # I+2
    d: "誰にも邪魔されず集中できたとき" # I+3
  category: "fulfillment"
  weight: 1.0

Q7:
  text: "ストレス解消法は？"
  options:
    a: "友達と会って話を聞いてもらう" # E+3
    b: "スポーツやアクティビティで発散" # E+2
    c: "一人で趣味に没頭" # I+2
    d: "誰とも会わず、一人の時間を過ごす" # I+3
  category: "stress_relief"
  weight: 0.9

Q8:
  text: "理想の週末の過ごし方は？"
  options:
    a: "友人とのパーティーやイベント" # E+3
    b: "家族や親しい人と外出" # E+1
    c: "一人でカフェや美術館巡り" # I+2
    d: "家で読書やNetflix" # I+3
  category: "weekend_preference"
  weight: 0.8
```

#### Q9-Q12: 行動パターン
```yaml
Q9:
  text: "初対面の人が多いパーティーで、あなたは？"
  options:
    a: "積極的に話しかけて回る" # E+3
    b: "興味のありそうな人に話しかける" # E+1
    c: "話しかけられたら応じる" # I+1
    d: "知り合いとだけ話す" # I+3
  category: "social_behavior"
  weight: 1.1

Q10:
  text: "会議での発言スタイルは？"
  options:
    a: "思いついたらすぐ発言" # E+3
    b: "活発に意見交換に参加" # E+2
    c: "聞かれたら答える" # I+1
    d: "後でメールで意見を送る" # I+3
  category: "meeting_style"
  weight: 1.0

Q11:
  text: "電話とメール、どちらが好き？"
  options:
    a: "断然電話！すぐ話せる" # E+3
    b: "急ぎなら電話、それ以外はメール" # E+1
    c: "基本メール、必要なら電話" # I+1
    d: "できる限りメールかチャット" # I+3
  category: "communication_preference"
  weight: 0.9

Q12:
  text: "在宅勤務についてどう思う？"
  options:
    a: "寂しい。オフィスの方が好き" # E+3
    b: "たまには良いけど、基本は出社" # E+1
    c: "在宅の方が集中できて良い" # I+2
    d: "ずっと在宅が理想" # I+3
  category: "work_environment"
  weight: 1.0
```

### S-N軸（感覚-直観）: 12問

#### Q13-Q16: 情報処理
```yaml
Q13:
  text: "新しい仕事を任されたとき、まず何をする？"
  options:
    a: "過去の成功事例を詳しく調べる" # S+3
    b: "具体的な手順を確認する" # S+2
    c: "全体像を把握してから詳細へ" # N+1
    d: "新しいアプローチを考える" # N+3
  category: "information_processing"
  weight: 1.2

Q14:
  text: "説明を聞くとき、どちらが理解しやすい？"
  options:
    a: "具体例や実例を交えた説明" # S+3
    b: "ステップバイステップの説明" # S+2
    c: "概念や理論から始まる説明" # N+2
    d: "比喩や例えを使った説明" # N+3
  category: "learning_preference"
  weight: 1.0

Q15:
  text: "データを見るとき、最初に注目するのは？"
  options:
    a: "具体的な数値や事実" # S+3
    b: "前回との比較や変化" # S+2
    c: "全体的な傾向やパターン" # N+2
    d: "数字の背後にある意味" # N+3
  category: "data_analysis"
  weight: 1.1

Q16:
  text: "旅行の計画を立てるとき、あなたは？"
  options:
    a: "詳細なスケジュールを組む" # S+3
    b: "主要な場所と時間を決める" # S+1
    c: "大まかな方向性だけ決める" # N+1
    d: "行き当たりばったりを楽しむ" # N+3
  category: "planning_style"
  weight: 0.8
```

#### Q17-Q20: 学習スタイル
```yaml
Q17:
  text: "新しいスキルを学ぶとき、どの方法が好き？"
  options:
    a: "実践しながら覚える" # S+3
    b: "マニュアルを読んでから実践" # S+2
    c: "理論を理解してから応用" # N+2
    d: "直感的に試行錯誤" # N+3
  category: "skill_acquisition"
  weight: 1.0

Q18:
  text: "記憶に残りやすいのは？"
  options:
    a: "実際に体験したこと" # S+3
    b: "具体的な事実や数字" # S+2
    c: "全体的な印象や雰囲気" # N+2
    d: "アイデアや概念" # N+3
  category: "memory_preference"
  weight: 0.9

Q19:
  text: "説明書を読むタイミングは？"
  options:
    a: "使う前に全部読む" # S+3
    b: "基本部分だけ読んで始める" # S+1
    c: "困ったときだけ読む" # N+1
    d: "読まずに直感で使う" # N+3
  category: "instruction_usage"
  weight: 0.8

Q20:
  text: "仕事で評価されたいのは？"
  options:
    a: "正確性と信頼性" # S+3
    b: "実績と成果" # S+2
    c: "創造性とアイデア" # N+2
    d: "先見性とビジョン" # N+3
  category: "work_values"
  weight: 1.1
```

#### Q21-Q24: 問題解決
```yaml
Q21:
  text: "問題に直面したとき、最初にすることは？"
  options:
    a: "過去の似た事例を探す" # S+3
    b: "現状を詳しく分析する" # S+2
    c: "根本原因を探る" # N+2
    d: "新しい解決策をブレスト" # N+3
  category: "problem_solving"
  weight: 1.2

Q22:
  text: "アイデアを出すとき、得意なのは？"
  options:
    a: "既存の改善案" # S+3
    b: "実現可能な提案" # S+2
    c: "斬新な発想" # N+2
    d: "未来志向のビジョン" # N+3
  category: "ideation"
  weight: 1.0

Q23:
  text: "プレゼンで重視するのは？"
  options:
    a: "具体的なデータと事例" # S+3
    b: "実行可能な計画" # S+2
    c: "コンセプトとストーリー" # N+2
    d: "ビジョンと可能性" # N+3
  category: "presentation_focus"
  weight: 0.9

Q24:
  text: "「成功」の定義は？"
  options:
    a: "目標を確実に達成すること" # S+3
    b: "具体的な成果を出すこと" # S+2
    c: "新しい価値を生み出すこと" # N+2
    d: "不可能を可能にすること" # N+3
  category: "success_definition"
  weight: 1.0
```

### T-F軸（思考-感情）: 13問

#### Q25-Q29: 意思決定
```yaml
Q25:
  text: "重要な決断をするとき、最も重視するのは？"
  options:
    a: "論理的な分析結果" # T+3
    b: "客観的なデータ" # T+2
    c: "関係者への影響" # F+2
    d: "自分の価値観や感情" # F+3
  category: "decision_making"
  weight: 1.3

Q26:
  text: "部下がミスをしたとき、最初に考えるのは？"
  options:
    a: "なぜミスが起きたか原因分析" # T+3
    b: "再発防止策の検討" # T+2
    c: "部下の気持ちやモチベーション" # F+2
    d: "どうフォローするか" # F+3
  category: "management_style"
  weight: 1.1

Q27:
  text: "議論で意見が対立したとき、あなたは？"
  options:
    a: "論理的に正しい方を支持" # T+3
    b: "データで判断" # T+2
    c: "みんなが納得する落とし所を探る" # F+2
    d: "人間関係を優先" # F+3
  category: "conflict_resolution"
  weight: 1.0

Q28:
  text: "フィードバックをするとき、重視するのは？"
  options:
    a: "客観的な事実に基づく評価" # T+3
    b: "改善点の明確な指摘" # T+2
    c: "相手の成長を促す伝え方" # F+2
    d: "相手の感情に配慮した表現" # F+3
  category: "feedback_style"
  weight: 1.0

Q29:
  text: "プロジェクトの成功基準は？"
  options:
    a: "目標数値の達成" # T+3
    b: "効率性と生産性" # T+2
    c: "チームの満足度" # F+2
    d: "メンバーの成長" # F+3
  category: "success_criteria"
  weight: 0.9
```

#### Q30-Q33: 価値観
```yaml
Q30:
  text: "仕事で最も大切なのは？"
  options:
    a: "成果と効率" # T+3
    b: "公平性と合理性" # T+2
    c: "チームワークと協調" # F+2
    d: "人の幸せと成長" # F+3
  category: "work_values"
  weight: 1.2

Q31:
  text: "理想の上司は？"
  options:
    a: "明確な指示と公正な評価" # T+3
    b: "論理的で一貫性がある" # T+2
    c: "部下を理解し支援する" # F+2
    d: "温かく人間味がある" # F+3
  category: "leadership_preference"
  weight: 0.9

Q32:
  text: "批判されたとき、最初に感じるのは？"
  options:
    a: "なるほど、論理的に正しい" # T+3
    b: "改善点が明確になった" # T+2
    c: "ちょっとショック" # F+2
    d: "個人的に否定された気分" # F+3
  category: "criticism_response"
  weight: 1.0

Q33:
  text: "褒められたとき、嬉しいのは？"
  options:
    a: "成果を認められたとき" # T+3
    b: "能力を評価されたとき" # T+2
    c: "努力を認められたとき" # F+2
    d: "人柄を褒められたとき" # F+3
  category: "recognition_preference"
  weight: 0.8
```

#### Q34-Q37: 対人関係
```yaml
Q34:
  text: "同僚との関係で重視するのは？"
  options:
    a: "プロフェッショナルな関係" # T+3
    b: "お互いの専門性を尊重" # T+2
    c: "信頼し合える関係" # F+2
    d: "心が通じ合う関係" # F+3
  category: "interpersonal_relations"
  weight: 1.0

Q35:
  text: "チームで問題が起きたとき、まず考えるのは？"
  options:
    a: "問題の本質は何か" # T+3
    b: "最も効率的な解決策" # T+2
    c: "みんなの気持ち" # F+2
    d: "人間関係への影響" # F+3
  category: "team_problem"
  weight: 1.1

Q36:
  text: "交渉するとき、あなたのスタイルは？"
  options:
    a: "論理と事実で説得" # T+3
    b: "Win-Winを論理的に構築" # T+2
    c: "相手の立場を理解し共感" # F+2
    d: "信頼関係を最優先" # F+3
  category: "negotiation_style"
  weight: 0.9

Q37:
  text: "職場で最もストレスを感じるのは？"
  options:
    a: "非論理的な決定" # T+3
    b: "非効率な仕組み" # T+2
    c: "人間関係の対立" # F+2
    d: "冷たい雰囲気" # F+3
  category: "workplace_stress"
  weight: 1.0
```

### J-P軸（判断-知覚）: 13問

#### Q38-Q42: 計画性
```yaml
Q38:
  text: "旅行の準備はいつから始める？"
  options:
    a: "数ヶ月前から綿密に計画" # J+3
    b: "1ヶ月前には大体決める" # J+2
    c: "2週間前くらいから" # P+1
    d: "直前or当日に決める" # P+3
  category: "planning_tendency"
  weight: 0.8

Q39:
  text: "ToDoリストについて、あなたは？"
  options:
    a: "毎日必ず作成し、全て消化" # J+3
    b: "重要なことはリスト化" # J+1
    c: "たまに作るが、あまり見ない" # P+1
    d: "リストは作らない、頭で管理" # P+3
  category: "task_management"
  weight: 1.0

Q40:
  text: "締切に対する考え方は？"
  options:
    a: "余裕を持って必ず前倒し" # J+3
    b: "期限通りに確実に" # J+2
    c: "ギリギリになることが多い" # P+2
    d: "締切は目安、柔軟に対応" # P+3
  category: "deadline_approach"
  weight: 1.2

Q41:
  text: "1日のスケジュールは？"
  options:
    a: "分単位で計画" # J+3
    b: "時間帯で大まかに計画" # J+1
    c: "その日の流れで調整" # P+2
    d: "完全に自由、計画しない" # P+3
  category: "daily_schedule"
  weight: 0.9

Q42:
  text: "プロジェクトの進め方は？"
  options:
    a: "最初に全体計画を詳細に作成" # J+3
    b: "マイルストーンを決めて進行" # J+2
    c: "大枠だけ決めて、随時調整" # P+2
    d: "やりながら考える" # P+3
  category: "project_approach"
  weight: 1.1
```

#### Q43-Q46: 柔軟性
```yaml
Q43:
  text: "予定が急に変更になったとき、あなたは？"
  options:
    a: "困る、計画が崩れる" # J+3
    b: "少し戸惑うが対応" # J+1
    c: "特に問題ない" # P+1
    d: "むしろ楽しい、新鮮" # P+3
  category: "change_adaptation"
  weight: 1.0

Q44:
  text: "複数のタスクがあるとき、どう進める？"
  options:
    a: "優先順位を決めて順番に" # J+3
    b: "計画的に並行処理" # J+1
    c: "気分で切り替えながら" # P+2
    d: "興味のあるものから自由に" # P+3
  category: "multitasking"
  weight: 0.9

Q45:
  text: "ルールや規則について、どう思う？"
  options:
    a: "必ず守るべき" # J+3
    b: "基本的に従う" # J+1
    c: "状況に応じて柔軟に" # P+2
    d: "ガイドライン程度" # P+3
  category: "rule_adherence"
  weight: 0.8

Q46:
  text: "仕事の進捗管理は？"
  options:
    a: "細かくチェックし記録" # J+3
    b: "定期的に確認" # J+1
    c: "大まかに把握" # P+1
    d: "特に管理しない" # P+3
  category: "progress_tracking"
  weight: 1.0
```

#### Q47-Q50: 時間管理
```yaml
Q47:
  text: "会議の時間について、あなたは？"
  options:
    a: "時間通り始めて時間通り終わる" # J+3
    b: "なるべく時間を守る" # J+1
    c: "内容次第で延長もあり" # P+2
    d: "時間より内容重視" # P+3
  category: "time_management"
  weight: 0.9

Q48:
  text: "片付けのタイミングは？"
  options:
    a: "使ったらすぐ片付ける" # J+3
    b: "定期的に整理整頓" # J+1
    c: "散らかってきたら片付ける" # P+2
    d: "必要に迫られたとき" # P+3
  category: "organization"
  weight: 0.7

Q49:
  text: "決断のスピードは？"
  options:
    a: "情報を集めて素早く決断" # J+3
    b: "ある程度検討して決める" # J+1
    c: "じっくり時間をかける" # P+1
    d: "なるべく決断を先延ばし" # P+3
  category: "decision_speed"
  weight: 1.0

Q50:
  text: "理想の働き方は？"
  options:
    a: "決まった時間に決まった場所で" # J+3
    b: "ある程度の枠組みの中で" # J+1
    c: "フレックスで自由に" # P+2
    d: "完全に自由、ノマド的" # P+3
  category: "work_style_preference"
  weight: 1.1
```

## キャリアDNA診断質問（Q51-Q70）

### 価値観質問（Q51-Q55）

```yaml
Q51:
  text: "仕事で最もワクワクする瞬間は？"
  options:
    a: "誰も考えつかないアイデアを思いついたとき"
    b: "チームが効率的に機能し始めたとき"
    c: "自分の専門性が認められたとき"
    d: "人と人をつないで価値が生まれたとき"
    e: "リスクを回避して安定を保てたとき"
  dna_points:
    a: [{dna: "pioneer", value: 4}]
    b: [{dna: "builder", value: 4}]
    c: [{dna: "specialist", value: 4}]
    d: [{dna: "connector", value: 4}]
    e: [{dna: "guardian", value: 4}]
  weight: 1.5

Q52:
  text: "理想の10年後、あなたは？"
  options:
    a: "自分の会社を経営している"
    b: "大きな組織のリーダーとして活躍"
    c: "その道の第一人者として認知されている"
    d: "多くの人に慕われ、頼られている"
    e: "安定した地位で着実に貢献している"
  dna_points:
    a: [{dna: "pioneer", value: 4}]
    b: [{dna: "builder", value: 4}]
    c: [{dna: "specialist", value: 4}]
    d: [{dna: "connector", value: 4}]
    e: [{dna: "guardian", value: 4}]
  weight: 1.3

Q53:
  text: "仕事における「成功」とは？"
  options:
    a: "新しい市場や価値を創造すること"
    b: "組織を成長させ、大きな成果を出すこと"
    c: "専門分野で卓越した成果を出すこと"
    d: "多くの人の成長や幸せに貢献すること"
    e: "長期的に安定した価値を提供し続けること"
  dna_points:
    a: [{dna: "pioneer", value: 3}]
    b: [{dna: "builder", value: 3}]
    c: [{dna: "specialist", value: 3}]
    d: [{dna: "connector", value: 3}]
    e: [{dna: "guardian", value: 3}]
  weight: 1.2

Q54:
  text: "最も避けたい仕事環境は？"
  options:
    a: "新しいことに挑戦できない保守的な環境"
    b: "個人プレーが中心で組織力がない環境"
    c: "専門性が評価されない環境"
    d: "人間関係が希薄で孤独な環境"
    e: "変化が激しく不安定な環境"
  dna_points:
    a: [{dna: "pioneer", value: 3}]
    b: [{dna: "builder", value: 3}]
    c: [{dna: "specialist", value: 3}]
    d: [{dna: "connector", value: 3}]
    e: [{dna: "guardian", value: 3}]
  weight: 1.0

Q55:
  text: "給料が同じなら、どの役割を選ぶ？"
  options:
    a: "新規事業の立ち上げ責任者"
    b: "既存事業の拡大責任者"
    c: "専門領域の研究開発者"
    d: "人材育成・組織開発の責任者"
    e: "リスク管理・品質保証の責任者"
  dna_points:
    a: [{dna: "pioneer", value: 4}]
    b: [{dna: "builder", value: 4}]
    c: [{dna: "specialist", value: 4}]
    d: [{dna: "connector", value: 4}]
    e: [{dna: "guardian", value: 4}]
  weight: 1.4
```

### 行動傾向質問（Q56-Q60）

```yaml
Q56:
  text: "プロジェクトでの理想的な役割は？"
  options:
    a: "新しいコンセプトを提案する人"
    b: "計画を立てて実行する人"
    c: "技術的な課題を解決する人"
    d: "メンバー間の調整役"
    e: "品質とリスクを管理する人"
  dna_points:
    a: [{dna: "pioneer", value: 3}]
    b: [{dna: "builder", value: 3}]
    c: [{dna: "specialist", value: 3}]
    d: [{dna: "connector", value: 3}]
    e: [{dna: "guardian", value: 3}]
  weight: 1.1

Q57:
  text: "困難な状況での行動パターンは？"
  options:
    a: "全く新しい解決策を模索"
    b: "リソースを再編成して対処"
    c: "専門知識を深めて解決"
    d: "周囲の協力を得て解決"
    e: "リスクを最小化する方法を選択"
  dna_points:
    a: [{dna: "pioneer", value: 3}]
    b: [{dna: "builder", value: 3}]
    c: [{dna: "specialist", value: 3}]
    d: [{dna: "connector", value: 3}]
    e: [{dna: "guardian", value: 3}]
  weight: 1.0

Q58:
  text: "学習の仕方として好むのは？"
  options:
    a: "実験と試行錯誤から学ぶ"
    b: "体系的なプログラムで学ぶ"
    c: "一つの分野を深く掘り下げる"
    d: "人との対話から学ぶ"
    e: "確立された方法論を学ぶ"
  dna_points:
    a: [{dna: "pioneer", value: 2}]
    b: [{dna: "builder", value: 2}]
    c: [{dna: "specialist", value: 2}]
    d: [{dna: "connector", value: 2}]
    e: [{dna: "guardian", value: 2}]
  weight: 0.9

Q59:
  text: "会議での典型的な行動は？"
  options:
    a: "斬新なアイデアを次々提案"
    b: "議論を整理し、次のステップを提示"
    c: "専門的な観点から詳細な分析"
    d: "全員の意見を引き出す"
    e: "リスクや問題点を指摘"
  dna_points:
    a: [{dna: "pioneer", value: 2}]
    b: [{dna: "builder", value: 2}]
    c: [{dna: "specialist", value: 2}]
    d: [{dna: "connector", value: 2}]
    e: [{dna: "guardian", value: 2}]
  weight: 0.8

Q60:
  text: "ストレス解消法として効果的なのは？"
  options:
    a: "新しい場所や体験を求める"
    b: "計画を立てて物事を整理する"
    c: "趣味や専門分野に没頭する"
    d: "親しい人と時間を過ごす"
    e: "ルーティンを守り、規則正しい生活"
  dna_points:
    a: [{dna: "pioneer", value: 2}]
    b: [{dna: "builder", value: 2}]
    c: [{dna: "specialist", value: 2}]
    d: [{dna: "connector", value: 2}]
    e: [{dna: "guardian", value: 2}]
  weight: 0.7
```

### 将来像質問（Q61-Q65）

```yaml
Q61:
  text: "5年後の理想の働き方は？"
  options:
    a: "スタートアップで革新的なサービスを"
    b: "組織をリードして事業を拡大"
    c: "専門家として独立or第一人者に"
    d: "人を育て、組織文化を作る立場"
    e: "安定した組織で確実な貢献"
  dna_points:
    a: [{dna: "pioneer", value: 3}, {dna: "builder", value: 1}]
    b: [{dna: "builder", value: 3}, {dna: "pioneer", value: 1}]
    c: [{dna: "specialist", value: 4}]
    d: [{dna: "connector", value: 3}, {dna: "builder", value: 1}]
    e: [{dna: "guardian", value: 4}]
  weight: 1.2

Q62:
  text: "キャリアの最終目標は？"
  options:
    a: "業界を変革するイノベーション"
    b: "大規模な事業の成功"
    c: "分野の権威として認められる"
    d: "多くの人のキャリアに良い影響"
    e: "組織の持続的発展に貢献"
  dna_points:
    a: [{dna: "pioneer", value: 4}]
    b: [{dna: "builder", value: 4}]
    c: [{dna: "specialist", value: 4}]
    d: [{dna: "connector", value: 4}]
    e: [{dna: "guardian", value: 4}]
  weight: 1.3

Q63:
  text: "理想の職場文化は？"
  options:
    a: "挑戦を奨励し、失敗を恐れない"
    b: "目標達成に向けて一丸となる"
    c: "専門性を尊重し、深い議論ができる"
    d: "温かく、お互いを支え合う"
    e: "ルールが明確で、安心して働ける"
  dna_points:
    a: [{dna: "pioneer", value: 3}]
    b: [{dna: "builder", value: 3}]
    c: [{dna: "specialist", value: 3}]
    d: [{dna: "connector", value: 3}]
    e: [{dna: "guardian", value: 3}]
  weight: 1.0

Q64:
  text: "引退する時に残したいものは？"
  options:
    a: "革新的な製品やサービス"
    b: "成功した事業や組織"
    c: "専門分野への貢献や発見"
    d: "育てた人材やコミュニティ"
    e: "安定した仕組みや基盤"
  dna_points:
    a: [{dna: "pioneer", value: 3}]
    b: [{dna: "builder", value: 3}]
    c: [{dna: "specialist", value: 3}]
    d: [{dna: "connector", value: 3}]
    e: [{dna: "guardian", value: 3}]
  weight: 1.1

Q65:
  text: "社会への貢献の仕方は？"
  options:
    a: "新しい価値や可能性を創造"
    b: "雇用創出や経済発展"
    c: "専門知識による問題解決"
    d: "人々の繋がりや成長支援"
    e: "社会の安定と継続性維持"
  dna_points:
    a: [{dna: "pioneer", value: 3}]
    b: [{dna: "builder", value: 3}]
    c: [{dna: "specialist", value: 3}]
    d: [{dna: "connector", value: 3}]
    e: [{dna: "guardian", value: 3}]
  weight: 1.0
```

### 経験質問（Q66-Q70）

```yaml
Q66:
  text: "学生時代に最も熱中したことは？"
  options:
    a: "新しいことへの挑戦（起業、発明など）"
    b: "組織運営（部活の部長、イベント企画）"
    c: "一つの分野の探求（研究、創作活動）"
    d: "人との交流（サークル、ボランティア）"
    e: "堅実な活動（資格取得、アルバイト）"
  dna_points:
    a: [{dna: "pioneer", value: 2}]
    b: [{dna: "builder", value: 2}]
    c: [{dna: "specialist", value: 2}]
    d: [{dna: "connector", value: 2}]
    e: [{dna: "guardian", value: 2}]
  weight: 0.8

Q67:
  text: "これまでで最も達成感を感じたのは？"
  options:
    a: "誰もやったことのないことを実現"
    b: "チームで大きな目標を達成"
    c: "専門スキルで難問を解決"
    d: "誰かの人生に良い影響を与えた"
    e: "長期的な努力が実を結んだ"
  dna_points:
    a: [{dna: "pioneer", value: 2}]
    b: [{dna: "builder", value: 2}]
    c: [{dna: "specialist", value: 2}]
    d: [{dna: "connector", value: 2}]
    e: [{dna: "guardian", value: 2}]
  weight: 0.9

Q68:
  text: "失敗から学んだ最大の教訓は？"
  options:
    a: "リスクを恐れず挑戦することの大切さ"
    b: "計画と実行の重要性"
    c: "専門性を磨き続けることの必要性"
    d: "人間関係の大切さ"
    e: "慎重さとリスク管理の重要性"
  dna_points:
    a: [{dna: "pioneer", value: 2}]
    b: [{dna: "builder", value: 2}]
    c: [{dna: "specialist", value: 2}]
    d: [{dna: "connector", value: 2}]
    e: [{dna: "guardian", value: 2}]
  weight: 0.7

Q69:
  text: "影響を受けた人物のタイプは？"
  options:
    a: "革新的な起業家やイノベーター"
    b: "優れた経営者やリーダー"
    c: "その道の達人や専門家"
    d: "人を繋ぎ、育てる人"
    e: "堅実で信頼できる人"
  dna_points:
    a: [{dna: "pioneer", value: 2}]
    b: [{dna: "builder", value: 2}]
    c: [{dna: "specialist", value: 2}]
    d: [{dna: "connector", value: 2}]
    e: [{dna: "guardian", value: 2}]
  weight: 0.6

Q70:
  text: "子供の頃の夢や憧れは？"
  options:
    a: "発明家、冒険家、起業家"
    b: "社長、リーダー、監督"
    c: "博士、職人、アーティスト"
    d: "先生、カウンセラー、外交官"
    e: "公務員、銀行員、医師"
  dna_points:
    a: [{dna: "pioneer", value: 1}]
    b: [{dna: "builder", value: 1}]
    c: [{dna: "specialist", value: 1}]
    d: [{dna: "connector", value: 1}]
    e: [{dna: "guardian", value: 1}]
  weight: 0.5
```

## 質問バリエーション（A/Bテスト用）

### 代替質問例
各質問には2-3個の代替バージョンを用意し、A/Bテストで最適な質問を選定します。

```yaml
Q1_alternative_1:
  text: "仕事帰り、エネルギーが残っているとき何をする？"
  options:
    a: "友人と会って話す"
    b: "一人でジムやカフェ"
    c: "家でゆっくり充電"
    d: "その時の気分次第"

Q1_alternative_2:
  text: "理想の金曜日の夜の過ごし方は？"
  options:
    a: "大勢でパーティー"
    b: "親しい友人と食事"
    c: "一人の時間を満喫"
    d: "特に決めない"
```

## 質問の品質管理

### 1. 妥当性検証
- 各質問が測定したい特性を正確に測定しているか
- 専門家によるレビュー
- 統計的な妥当性検証

### 2. 信頼性確保
- テスト-再テスト信頼性の確認
- 内的一貫性（クロンバックα係数）の測定
- 項目間相関の分析

### 3. バイアスの除去
- 社会的望ましさバイアスのチェック
- 文化的バイアスの確認
- ジェンダーバイアスの排除

### 4. 継続的改善
- ユーザーフィードバックの収集
- 回答パターンの分析
- 質問の定期的な見直しと更新