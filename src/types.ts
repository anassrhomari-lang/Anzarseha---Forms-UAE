export type Step = 
  | 'WELCOME'
  | 'START' 
  | 'PAIN' 
  | 'TIMING' 
  | 'USE_CASE' 
  | 'CONTACT_FORM'
  | 'FINAL';

export interface UserData {
  specialty?: string;
  pain?: string;
  timing?: string;
  demoChoice?: string;
  contactInfo?: string;
}
