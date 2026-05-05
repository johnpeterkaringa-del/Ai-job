export interface EarningPath {
  id: string;
  title: string;
  description: string;
  complianceRating: number; // 1-5
  ethicalFocus: string;
  regulationNote: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

export const EARNING_PATHS: EarningPath[] = [
  {
    id: 'content-creation',
    title: 'AI-Assisted Content Strategy',
    description: 'Leveraging large language models to augment creative workflows for blogging, scriptwriting, and copywriting while maintaining human-in-the-loop oversight.',
    complianceRating: 5,
    ethicalFocus: 'Disclosure of AI use and original voice preservation.',
    regulationNote: 'Ensure adherence to FTC disclosure guidelines for AI-generated brand content.',
    difficulty: 'Beginner',
    tags: ['Creative', 'Marketing', 'High-Trust']
  },
  {
    id: 'data-curation',
    title: 'Ethical Data Curation',
    description: 'Providing high-quality, human-verified training data for specialized AI models, focusing on bias reduction and accuracy.',
    complianceRating: 5,
    ethicalFocus: 'Consent-based data collection and fair compensation for contributors.',
    regulationNote: 'GDPR and CCPA compliance regarding data privacy and user rights.',
    difficulty: 'Intermediate',
    tags: ['Data', 'Technical', 'Compliance']
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Systems Design',
    description: 'Developed advanced prompt architectures for businesses to automate complex processes safely and predictably.',
    complianceRating: 4,
    ethicalFocus: 'Preventing prompt injection and harmful output generation.',
    regulationNote: 'Focus on safety guardrails required by industry-specific regulators (e.g., Finance, Health).',
    difficulty: 'Advanced',
    tags: ['Technical', 'Automation', 'Design']
  },
  {
    id: 'ai-auditing',
    title: 'AI Bias & Safety Auditing',
    description: 'Helping firms verify that their AI deployments are fair, transparent, and compliant with emerging AI regulations.',
    complianceRating: 5,
    ethicalFocus: 'Objectivity and identification of intersectional bias.',
    regulationNote: 'Alignment with the EU AI Act and NIST AI Risk Management Framework.',
    difficulty: 'Advanced',
    tags: ['Audit', 'Legal', 'Ethics']
  }
];
