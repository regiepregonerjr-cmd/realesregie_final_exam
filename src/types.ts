export interface Student {
  id: any; // MySQL auto-increment ID or Firestore document ID
  studentId: string; // The "Student ID" field from the form
  fullName: string;
  course: string;
  yearLevel: string;
  gender: string;
  email: string;
  createdAt?: any;
  updatedAt?: any;
}
