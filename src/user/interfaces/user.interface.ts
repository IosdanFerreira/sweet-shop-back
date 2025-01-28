export class IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  birth_date?: string;
  address?: string;
  occupation?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  primary_physician?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  allergies?: string;
  current_medication?: string;
  family_medical_history?: string;
  past_medical_history?: string;
  identification_type?: string;
  identification_number?: string;
  identification_document?: string;
  privacy_consent?: boolean;
  created_at: Date;
  updated_at: Date;
}
