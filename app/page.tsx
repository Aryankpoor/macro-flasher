/* eslint-disable */
"use client"

import type React from "react"
import { useState, useMemo, useEffect, useCallback } from "react"
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  PlusCircle,
  UploadCloud,
  X,
  Loader2,
  AlertTriangle,
  Users,
  Shield,
  DollarSign,
  LogOut,
  Building,
  FileScan,
  Table,
  Zap,
  BrainCircuit,
  ThumbsUp,
  ThumbsDown,
  Menu,
  ArrowLeft,
  Calendar,
  ExternalLink,
} from "lucide-react"

declare const CryptoJS: any

// --- BILINGUAL SUPPORT & TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    dashboard: "Dashboard",
    documents: "Documents",
    analytics: "Analytics",
    logout: "Logout",
    welcome: "Welcome",
    smartSearch: "Smart Search",
    askAQuestion: "Ask a question...",
    search: "Search",
    aiGeneratedAnswer: "AI Generated Answer",
    relatedDocs: "Related Documents",
    priorityInbox: "Priority Inbox",
    noPriorityDocs: "No high-priority documents.",
    totalDocs: "Total Documents",
    urgentItems: "Urgent Items",
    actionRequired: "Action Required",
    allDocuments: "All Documents",
    found: "Found",
    newUpload: "New Upload",
    uploadDocument: "Upload Document",
    processDocument: "Process Document",
    processing: "Processing...",
    cancel: "Cancel",
    viewDocument: "View Document",
    documentPreview: "Document Preview",
    aiAnalysis: "AI Analysis",
    keyFindings: "Key Findings",
    actionItems: "Action Items",
    feedback: "Human-in-the-Loop Feedback",
    summaryAccurate: "Was this summary accurate?",
    good: "Good",
    bad: "Bad",
    feedbackThanks: "Thank you for your feedback!",
    analyticsReports: "Analytics & Reports",
    docDistribution: "Document Distribution",
    loginTitle: "Select Your Role to Continue",
    loginButton: "Login",
    loadingSecurity: "Loading Security...",
    invalidCredentials: "Invalid credentials for",
    document: "document",
    documentsPlural: "documents",
    backToRoles: "Back to Role Selection",
    selectRole: "Select Role",
    loginAs: "Login as",
    filter: "Filter",
    sort: "Sort",
    sortByDate: "Sort by Date",
    sortByPriority: "Sort by Priority",
  },
  ml: {
    dashboard: "ഡാഷ്‌ബോർഡ്",
    documents: "പ്രമാണങ്ങൾ",
    analytics: "വിശകലനം",
    logout: "ലോഗ് ഔട്ട്",
    welcome: "സ്വാഗതം",
    smartSearch: "സ്മാർട്ട് തിരയൽ",
    askAQuestion: "ഒരു ചോദ്യം ചോദിക്കുക...",
    search: "തിരയുക",
    aiGeneratedAnswer: "AI ജനറേറ്റഡ് ഉത്തരം",
    relatedDocs: "ബന്ധപ്പെട്ട പ്രമാണങ്ങൾ",
    priorityInbox: "പ്രയോറിറ്റി ഇൻബോക്സ്",
    noPriorityDocs: "ഉയർന്ന പ്രാധാന്യമുള്ള പ്രമാണങ്ങളില്ല.",
    totalDocs: "ആകെ പ്രമാണങ്ങൾ",
    urgentItems: "അടിയന്തര ഇനങ്ങൾ",
    actionRequired: "നടപടി ആവശ്യമാണ്",
    allDocuments: "എല്ലാ പ്രമാണങ്ങളും",
    found: "കണ്ടെത്തി",
    newUpload: "പുതിയ അപ്‌ലോഡ്",
    uploadDocument: "പ്രമാണം അപ്‌ലോഡ് ചെയ്യുക",
    processDocument: "പ്രമാണം പ്രോസസ്സ് ചെയ്യുക",
    processing: "പ്രോസസ്സ് ചെയ്യുന്നു...",
    cancel: "റദ്ദാക്കുക",
    viewDocument: "പ്രമാണം കാണുക",
    documentPreview: "പ്രമാണത്തിന്റെ പ്രിവ്യൂ",
    aiAnalysis: "AI വിശകലനം",
    keyFindings: "പ്രധാന കണ്ടെത്തലുകൾ",
    actionItems: "ചെയ്യേണ്ട കാര്യങ്ങൾ",
    feedback: "ഫീഡ്‌ബാക്ക്",
    summaryAccurate: "ഈ സംഗ്രഹം സഹായകമായിരുന്നോ?",
    good: "നല്ലത്",
    bad: "മോശം",
    feedbackThanks: "നിങ്ങളുടെ പ്രതികരണത്തിന് നന്ദി!",
    analyticsReports: "വിശകലന റിപ്പോർട്ടുകൾ",
    docDistribution: "പ്രമാണ വിതരണം",
    loginTitle: "തുടരാൻ നിങ്ങളുടെ റോൾ തിരഞ്ഞെടുക്കുക",
    loginButton: "ലോഗിൻ ചെയ്യുക",
    loadingSecurity: "സുരക്ഷാ സംവിധാനം ലോഡ് ചെയ്യുന്നു...",
    invalidCredentials: "തെറ്റായ ഐഡി അല്ലെങ്കിൽ പാസ്‌വേഡ്",
    document: "പ്രമാണം",
    documentsPlural: "പ്രമാണങ്ങൾ",
    backToRoles: "റോൾ തിരഞ്ഞെടുപ്പിലേക്ക് മടങ്ങുക",
    selectRole: "റോൾ തിരഞ്ഞെടുക്കുക",
    loginAs: "ലോഗിൻ ചെയ്യുക",
    filter: "ഫിൽട്ടർ",
    sort: "ക്രമീകരിക്കുക",
    sortByDate: "തീയതി അനുസരിച്ച്",
    sortByPriority: "മുൻഗണന അനുസരിച്ച്",
  },
} as const

// --- MOCK DATA & CREDENTIALS ---
const USER_CREDENTIALS: Record<
  "executive" | "safety" | "finance",
  {
    id: string
    name: string
    icon: any
    color: string
    userId: string
    salt: string
    hashedPassword: string
  }
> = {
  executive: {
    id: "executive",
    name: "Executive Management",
    icon: Users,
    color: "text-purple-500",
    userId: "KMRL-EXEC",
    salt: "1a2b3c4d5e6f7g8h",
    hashedPassword: "",
  },
  safety: {
    id: "safety",
    name: "Safety Officer",
    icon: Shield,
    color: "text-yellow-500",
    userId: "KMRL-SAFETY",
    salt: "i9j0k1l2m3n4o5p6",
    hashedPassword: "",
  },
  finance: {
    id: "finance",
    name: "Finance Officer",
    icon: DollarSign,
    color: "text-green-500",
    userId: "KMRL-FIN",
    salt: "q7r8s9t0u1v2w3x4",
    hashedPassword: "",
  },
}

type Doc = {
  id: string
  title: string
  summary_en: string
  summary_ml: string
  language: string
  tags: string[]
  date: string
  actionRequired: boolean
  deadline: string | null
  format: string
  formatIcon: any
  relatedDocId: string | null
  pdfUrl?: string
}

// --- Seed documents ---
const BILINGUAL_DOCUMENTS: Doc[] = [
  {
    id: "doc-001",
    title: "CMRS_Urgent_Directive_PSD_Audit.pdf",
    summary_en: `<h4>Key Findings</h4><ul><li>Audit of TSS cooling systems is mandatory due to a critical incident.</li></ul><h4>Action Items</h4><ul><li>Conduct thermal imaging tests by 2025-09-30.</li><li>Submit compliance report by 2025-10-05.</li></ul>`,
    summary_ml: `<h4>പ്രധാന കണ്ടെത്തലുകൾ</h4><ul><li>ഒരു ഗുരുതരമായ സംഭവത്തെത്തുടർന്ന് ടിഎസ്എസ് കൂളിംഗ് സിസ്റ്റങ്ങളുടെ ഓഡിറ്റ് നിർബന്ധമാണ്.</li></ul><h4>ചെയ്യേണ്ട കാര്യങ്ങൾ</h4><ul><li>2025-09-30-നകം തെർമൽ ഇമേജിംഗ് ടെസ്റ്റുകൾ നടത്തുക.</li><li>2025-10-05-നകം കംപ്ലയിൻസ് റിപ്പോർട്ട് സമർപ്പിക്കുക.</li></ul>`,
    language: "english",
    tags: ["Safety", "Urgent", "CMRS"],
    date: "2025-09-20T11:00:00Z",
    actionRequired: true,
    deadline: "2025-09-30T23:59:59Z",
    format: "Digital PDF",
    formatIcon: Building,
    relatedDocId: null,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "doc-002",
    title: "Invoice_INV-9821_InfraSolutions.pdf",
    summary_en: `<h4>Key Findings</h4><ul><li>Invoice received from InfraSolutions for ₹3,92,940.00.</li><li>Linked to PO-4582.</li></ul><h4>Action Items</h4><ul><li>Process payment before 2025-10-19.</li></ul>`,
    summary_ml: `<h4>പ്രധാന കണ്ടെത്തലുകൾ</h4><ul><li>ഇൻഫ്രാസൊല്യൂഷൻസിൽ നിന്ന് ₹3,92,940.00-ന്റെ ഇൻവോയ്സ് ലഭിച്ചു.</li><li>PO-4582-മായി ബന്ധിപ്പിച്ചിരിക്കുന്നു.</li></ul><h4>ചെയ്യേണ്ട കാര്യങ്ങൾ</h4><ul><li>2025-10-19-നകം പണമടയ്ക്കുക.</li></ul>`,
    language: "english",
    tags: ["Finance", "Invoice", "Linked"],
    date: "2025-09-19T14:30:00Z",
    actionRequired: true,
    deadline: "2025-10-19T23:59:59Z",
    format: "Digital PDF",
    formatIcon: Table,
    relatedDocId: "doc-007",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "doc-007",
    title: "Purchase_Order_PO-4582.pdf",
    summary_en: `<h4>Key Findings</h4><ul><li>PO approved for InfraSolutions Pvt. Ltd.</li><li>Covers Annual Maintenance Contract for CCTV Systems.</li></ul><h4>Action Items</h4><ul><li>Track service completion.</li></ul>`,
    summary_ml: `<h4>പ്രധാന കണ്ടെത്തലുകൾ</h4><ul><li>ഇൻഫ്രാസൊല്യൂഷൻസ് പ്രൈവറ്റ് ലിമിറ്റഡിന് PO അംഗീകരിച്ചു.</li><li>സിസിടിവി സിസ്റ്റങ്ങളുടെ വാർഷിക മെയിന്റനൻസ് കരാർ ഉൾക്കൊള്ളുന്നു.</li></ul><h4>ചെയ്യേണ്ട കാര്യങ്ങൾ</h4><ul><li>സേവനം പൂർത്തിയാക്കുന്നത് ട്രാക്ക് ചെയ്യുക.</li></ul>`,
    language: "english",
    tags: ["Finance", "PO", "Vendor", "Linked"],
    date: "2025-09-15T11:30:00Z",
    actionRequired: false,
    deadline: null,
    format: "Digital PDF",
    formatIcon: FileText,
    relatedDocId: "doc-002",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "doc-005",
    title: "TechReport_Bogie_Vibration_Trainset_14.pdf",
    summary_en: `<h4>Key Findings</h4><ul><li>Anomalous vibrations reported from Bogie 2 of Trainset 14.</li></ul><h4>Action Items</h4><ul><li>Immediate replacement of axle box bearing required before 2025-09-23.</li></ul>`,
    summary_ml: `<h4>പ്രധാന കണ്ടെത്തലുകൾ</h4><ul><li>ട്രെയിൻസെറ്റ് 14-ന്റെ ബോഗി 2-ൽ നിന്ന് അസാധാരണമായ വൈബ്രേഷനുകൾ റിപ്പോർട്ട് ചെയ്തു.</li></ul><h4>ചെയ്യേണ്ട കാര്യങ്ങൾ</h4><ul><li>2025-09-23-ന് മുമ്പായി ആക്സിൽ ബോക്സ് ബെയറിംഗ് ഉടൻ മാറ്റിവയ്ക്കേണ്ടതുണ്ട്.</li></ul>`,
    language: "english",
    tags: ["Maintenance", "Report", "Urgent"],
    date: "2025-09-18T16:00:00Z",
    actionRequired: true,
    deadline: "2025-09-23T23:59:59Z",
    format: "Digital PDF",
    formatIcon: Building,
    relatedDocId: null,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "doc-008",
    title: "HR_Policy_Update_Leave_Encashment.pdf",
    summary_en: `<h4>Key Findings</h4><ul><li>Leave encashment policy updated.</li></ul><h4>Action Items</h4><ul><li>Circulate to all department heads.</li></ul>`,
    summary_ml: `<h4>പ്രധാന കണ്ടെത്തലുകൾ</h4><ul><li>ലീവ് എൻക്യാഷ്മെന്റ് നയം പുതുക്കി.</li></ul><h4>ചെയ്യേണ്ട കാര്യങ്ങൾ</h4><ul><li>എല്ലാ വകുപ്പ് മേധാവികൾക്കും സർക്കുലേറ്റ് ചെയ്യുക.</li></ul>`,
    language: "english",
    tags: ["HR", "Policy"],
    date: "2025-09-17T10:00:00Z",
    actionRequired: false,
    deadline: null,
    format: "Digital PDF",
    formatIcon: FileText,
    relatedDocId: null,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "doc-009",
    title: "Tender_Notice_Platform_Screen_Doors.pdf",
    summary_en: `<h4>Key Findings</h4><ul><li>New tender issued for Platform Screen Doors.</li></ul><h4>Action Items</h4><ul><li>Publish notice on website.</li><li>Prepare for pre-bid meeting.</li></ul>`,
    summary_ml: `<h4>പ്രധാന കണ്ടെത്തലുകൾ</h4><ul><li>പ്ലാറ്റ്ഫോം സ്ക്രീൻ ഡോറുകൾക്കായി പുതിയ ടെൻഡർ നൽകി.</li></ul><h4>ചെയ്യേണ്ട കാര്യങ്ങൾ</h4><ul><li>വെബ്സൈറ്റിൽ നോട്ടീസ് പ്രസിദ്ധീകരിക്കുക.</li><li>പ്രീ-ബിഡ് മീറ്റിംഗിനായി തയ്യാറെടുക്കുക.</li></ul>`,
    language: "english",
    tags: ["Tender", "Procurement"],
    date: "2025-09-22T09:00:00Z",
    actionRequired: true,
    deadline: "2025-11-01T17:00:00Z",
    format: "Scanned PDF",
    formatIcon: FileScan,
    relatedDocId: null,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "doc-010",
    title: "OpsCircular_Staff_Briefing_Schedule.pdf",
    summary_en: `<h4>Key Findings</h4><ul><li>New schedule for daily staff briefings implemented.</li></ul><h4>Action Items</h4><ul><li>All station controllers must acknowledge.</li></ul>`,
    summary_ml: `<h4>പ്രധാന കണ്ടെത്തലുകൾ</h4><ul><li>ദിവസേനയുള്ള സ്റ്റാഫ് ബ്രീഫിംഗിന് പുതിയ ഷെഡ്യൂൾ നടപ്പിലാക്കി.</li></ul><h4>ചെയ്യേണ്ട കാര്യങ്ങൾ</h4><ul><li>എല്ലാ സ്റ്റേഷൻ കൺട്രോളർമാരും അംഗീകരിക്കണം.</li></ul>`,
    language: "english",
    tags: ["Operations", "Internal"],
    date: "2025-09-22T14:00:00Z",
    actionRequired: true,
    deadline: null,
    format: "Digital PDF",
    formatIcon: FileText,
    relatedDocId: null,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "doc-011",
    title: "IT_Security_Alert_Phishing_Warning.pdf",
    summary_en: `<h4>Key Findings</h4><ul><li>Increase in phishing email attempts targeting employees.</li></ul><h4>Action Items</h4><ul><li>Report suspicious emails to IT.</li><li>Complete cybersecurity training by 2025-10-10.</li></ul>`,
    summary_ml: `<h4>പ്രധാന കണ്ടെത്തലുകൾ</h4><ul><li>ജീവനക്കാരെ ലക്ഷ്യമിട്ടുള്ള ഫിഷിംഗ് ഇമെയിൽ ശ്രമങ്ങളിൽ വർദ്ധനവ്.</li></ul><h4>ചെയ്യേണ്ട കാര്യങ്ങൾ</h4><ul><li>സംശയാസ്പദമായ ഇമെയിലുകൾ ഐടിക്ക് റിപ്പോർട്ട് ചെയ്യുക.</li><li>2025-10-10-നകം സൈബർ സുരക്ഷാ പരിശീലനം പൂർത്തിയാക്കുക.</li></ul>`,
    language: "english",
    tags: ["IT", "Security", "Urgent"],
    date: "2025-09-22T11:00:00Z",
    actionRequired: true,
    deadline: "2025-10-10T23:59:59Z",
    format: "Digital PDF",
    formatIcon: Building,
    relatedDocId: null,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "doc-012",
    title: "Financial_Report_Q2_2025.pdf",
    summary_en: `<h4>Key Findings</h4><ul><li>Revenue increased by 8% in Q2.</li></ul><h4>Action Items</h4><ul><li>Present findings at the next board meeting.</li></ul>`,
    summary_ml: `<h4>പ്രധാന കണ്ടെത്തലുകൾ</h4><ul><li>Q2-ൽ വരുമാനം 8% വർദ്ധിച്ചു.</li></ul><h4>ചെയ്യേണ്ട കാര്യങ്ങൾ</h4><ul><li>അടുത്ത ബോർഡ് മീറ്റിംഗിൽ കണ്ടെത്തലുകൾ അവതരിപ്പിക്കുക.</li></ul>`,
    language: "english",
    tags: ["Finance", "Report"],
    date: "2025-09-18T18:00:00Z",
    actionRequired: false,
    deadline: null,
    format: "Digital PDF",
    formatIcon: Table,
    relatedDocId: null,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "doc-013",
    title: "Maint_Manual_AFC_Gates_v3.2.pdf",
    summary_en: `<h4>Key Findings</h4><ul><li>Maintenance manual for AFC gates updated to v3.2.</li></ul><h4>Action Items</h4><ul><li>Technicians to be trained on new procedures.</li></ul>`,
    summary_ml: `<h4>പ്രധാന കണ്ടെത്തലുകൾ</h4><ul><li>എഎഫ്‌സി ഗേറ്റുകളുടെ മെയിന്റനൻസ് മാനുവൽ v3.2-ലേക്ക് അപ്‌ഡേറ്റ് ചെയ്തു.</li></ul><h4>ചെയ്യേണ്ട കാര്യങ്ങൾ</h4><ul><li>ടെക്നീഷ്യൻമാർക്ക് പുതിയ നടപടിക്രമങ്ങളിൽ പരിശീലനം നൽകണം.</li></ul>`,
    language: "english",
    tags: ["Maintenance", "Manual"],
    date: "2025-09-22T15:30:00Z",
    actionRequired: true,
    deadline: null,
    format: "Well-formatted Digital PDF",
    formatIcon: Building,
    relatedDocId: null,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
]

// --- AI Processor mock ---
const fakeAIProcessor = (file: File) => {
  return new Promise<Doc>((resolve) => {
    setTimeout(() => {
      const fname = file.name.toLowerCase()
      const newDoc: Doc = {
        id: `doc-${Date.now()}`,
        title: file.name,
        summary_en: ``,
        summary_ml: ``,
        tags: ["New Upload"],
        date: new Date().toISOString(),
        actionRequired: true,
        deadline: null,
        format: "Digital Upload",
        formatIcon: FileText,
        relatedDocId: null,
        language: "english",
        pdfUrl: undefined,
      }

      if (fname.includes("test document") || fname.includes("kmrl_demo")) {
        newDoc.summary_en = `<h4>Key Findings</h4><ul><li>An urgent maintenance issue has been identified in the primary braking system of <strong>Trainset 07</strong>.</li><li>A critical non-compliance regarding fire safety equipment was found at <strong>Aluva Station</strong>.</li></ul><h4>Action Items</h4><ul><li>Withdraw Trainset 07 from service for a full brake system overhaul (Deadline: <strong>24-September-2025</strong>).</li><li>Inspect and replace all expired fire extinguishers at Aluva Station (Deadline: <strong>23-September-2025</strong>).</li></ul>`
        newDoc.summary_ml = `<h4>പ്രധാന കണ്ടെത്തലുകൾ</h4><ul><li><strong>ട്രെയിൻസെറ്റ് 07</strong>-ന്റെ പ്രധാന ബ്രേക്കിംഗ് സിസ്റ്റത്തിൽ അടിയന്തര അറ്റകുറ്റപ്പണി ആവശ്യമായ പ്രശ്നം കണ്ടെത്തി.</li><li><strong>ആലുവ സ്റ്റേഷനിലെ</strong> അഗ്നിശമന ഉപകരണങ്ങളുമായി ബന്ധപ്പെട്ട് ഒരു ഗുരുതരമായ നിയമലംഘനം വെളിപ്പെട്ടു.</li></ul><h4>ചെയ്യേണ്ട കാര്യങ്ങൾ</h4><ul><li>ട്രെയിൻസെറ്റ് 07 സർവീസിൽ നിന്ന് പിൻവലിച്ച് ബ്രേക്ക് സിസ്റ്റം പൂർണ്ണമായി ഓവർഹോൾ ചെയ്യുക (അവസാന തീയതി: <strong>24-സെപ്റ്റംബർ-2025</strong>).</li><li>ആലുവ സ്റ്റേഷനിലെ കാലാവധി കഴിഞ്ഞ എല്ലാ അഗ്നിശമന ഉപകരണങ്ങളും പരിശോധിച്ച് മാറ്റിസ്ഥാപിക്കുക (അവസാന തീയതി: <strong>23-സെപ്റ്റംബർ-2025</strong>).</li></ul>`
        newDoc.tags = ["Safety", "Urgent", "Maintenance", "Operations", "New Upload"]
        newDoc.deadline = "2025-09-23T23:59:59Z"
      } else {
        newDoc.summary_en = `<h4>Key Findings</h4><ul><li>This document has been processed by the AI.</li></ul><h4>Action Items</h4><ul><li>Please review the extracted entities and summary.</li></ul>`
        newDoc.summary_ml = `<h4>പ്രധാന കണ്ടെത്തലുകൾ</h4><ul><li>ഈ പ്രമാണം AI പ്രോസസ്സ് ചെയ്തു.</li></ul><h4>ചെയ്യേണ്ട കാര്യങ്ങൾ</h4><ul><li>എക്സ്ട്രാക്റ്റുചെയ്ത വിവരങ്ങളും സംഗ്രഹവും ദയവായി അവലോകനം ചെയ്യുക.</li></ul>`
      }

      resolve(newDoc)
    }, 2500)
  })
}

// --- Utility functions ---
const getDeadlineStatus = (deadlineString: string | null) => {
  if (!deadlineString) return null
  const now = new Date("2025-09-22T20:55:00Z")
  const deadline = new Date(deadlineString)
  const diffTime = +deadline - +now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return { text: `Overdue`, color: "red", days: diffDays }
  if (diffDays <= 0) return { text: "Due Today", color: "red", days: 0 }
  if (diffDays <= 7) return { text: `Due in ${diffDays} days`, color: "orange", days: diffDays }
  return { text: `Due in ${diffDays} days`, color: "gray", days: diffDays }
}

const getPriorityScore = (doc: Doc) => {
  let score = 0
  if (doc.tags.includes("Urgent")) score += 1000
  const deadlineStatus = getDeadlineStatus(doc.deadline)
  if (deadlineStatus) {
    score += Math.max(0, 100 - deadlineStatus.days * 10)
  }
  return score
}

// --- UI COMPONENTS ---
const NationalEmblem = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 491.72 639.3" className="h-12 w-12 text-[#001c5a]">
    <g fill="currentColor">
      <path d="M245.86,639.3c58.33,0,105.58-47.25,105.58-105.58h-211.16c0,58.33,47.25,105.58,105.58,105.58Z" />
      <path d="M491.72,217.47v282.72c0,19.33-15.71,35.04-35.04,35.04H35.04c-19.33,0-35.04-15.71-35.04-35.04V217.47c0-13.68,11.13-24.81,24.81-24.81h442.1c13.68,0,24.81,11.13,24.81,24.81Z" />
      <path d="M421.46,198.81A175.59,175.59,0,0,0,245.86,23.22,175.59,175.59,0,0,0,70.26,198.81Z" />
      <path fill="#FFF" d="M245.86,34A158.42,158.42,0,0,0,87.44,192.42H404.28A158.42,158.42,0,0,0,245.86,34Z" />
      <path d="M245.86,49.19a142.27,142.27,0,0,0-142.27,142.27h284.54a142.27,142.27,0,0,0-142.27-142.27Z" />
      <path fill="#FFF" d="M119.74,191.46h252.38a126.19,126.19,0,1,0-252.38,0Z" />
      <path d="M245.86,81.48a110,110,0,1,0,110,110h-220a110,110,0,0,0,110-110Z" />
    </g>
  </svg>
)

const LoginScreen = ({ onLogin, cryptoReady, t }: { onLogin: (u: any) => void; cryptoReady: boolean; t: any }) => {
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [time, setTime] = useState(new Date())
  const [inputs, setInputs] = useState({ userId: "", password: "" })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLoginAttempt = () => {
    if (!cryptoReady) {
      setError("Security library not loaded.")
      return
    }
    const userProfile = USER_CREDENTIALS[selectedRole.id as keyof typeof USER_CREDENTIALS]
    const enteredPassword = inputs.password
    const salt = userProfile.salt
    const correctHash = userProfile.hashedPassword
    const enteredHash = CryptoJS.SHA256(enteredPassword + salt).toString()

    if (inputs.userId === userProfile.userId && enteredHash === correctHash) {
      onLogin(userProfile)
    } else {
      setError(`${t.invalidCredentials} ${userProfile.name}.`)
    }
  }

  const userProfiles = Object.values(USER_CREDENTIALS)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <NationalEmblem />
            <h1 className="text-4xl font-bold text-[#001c5a]">MetroMind KMRL</h1>
          </div>
          <p className="text-lg text-gray-600">Intelligent Document Hub for Kochi Metro Rail Limited</p>
          <p className="text-sm text-gray-500 mt-2 font-mono">
            {time.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} -{" "}
            {time.toLocaleTimeString("en-US")}
          </p>
        </div>

        <div className="w-full max-w-md mx-auto bg-white rounded-lg border shadow-sm p-8">
          {!selectedRole ? (
            <div>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">{t.selectRole}</h2>
              <div className="space-y-4">
                {userProfiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => setSelectedRole(profile)}
                    className="w-full flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <profile.icon className={`w-10 h-10 ${profile.color}`} />
                    <span className="font-semibold text-lg">{profile.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedRole(null)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#001c5a] mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.backToRoles}
              </button>

              <div className="text-center mb-6">
                <selectedRole.icon className={`w-16 h-16 mx-auto ${selectedRole.color}`} />
                <h2 className="text-xl font-bold text-gray-900 mt-4">
                  {t.loginAs} {selectedRole.name}
                </h2>
              </div>

              {error && (
                <div className="my-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="User ID"
                  value={inputs.userId}
                  onChange={(e) => {
                    setInputs((p) => ({ ...p, userId: e.target.value }))
                    setError(null)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#ff9933] focus:border-[#ff9933]"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={inputs.password}
                  onChange={(e) => {
                    setInputs((p) => ({ ...p, password: e.target.value }))
                    setError(null)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#ff9933] focus:border-[#ff9933]"
                />
                <button
                  onClick={handleLoginAttempt}
                  disabled={!cryptoReady}
                  className="w-full bg-[#138808] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#0f6b06] transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                  {cryptoReady ? t.loginButton : t.loadingSecurity}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Main App and subcomponents ---
const MainApplication = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const [uiLanguage, setUiLanguage] = useState<"en" | "ml">("en")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<"dashboard" | "documents" | "reports">("dashboard")
  const [documents, setDocuments] = useState<Doc[]>(BILINGUAL_DOCUMENTS)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null)

  const t = TRANSLATIONS[uiLanguage]

  const handleUpload = async () => {
    if (!selectedFile) return
    setIsProcessing(true)
    const newDocument = await fakeAIProcessor(selectedFile)
    try {
      // @ts-ignore - File is present
      newDocument.pdfUrl = URL.createObjectURL(selectedFile)
    } catch {}
    setDocuments((prevDocs) => [newDocument, ...prevDocs])
    setIsProcessing(false)
    setIsUploadDialogOpen(false)
    setSelectedFile(null)
    setCurrentPage("documents")
  }
  const handleDocSelect = (doc: Doc) => setSelectedDoc(doc)
  const handleCloseDocDetail = () => setSelectedDoc(null)
  const handleCloseDialog = () => !isProcessing && (setIsUploadDialogOpen(false), setSelectedFile(null))

  const Sidebar = ({
    isOpen,
    user,
    onLogout,
    setUiLanguage,
    uiLanguage,
    currentPage,
    setCurrentPage,
    t,
  }: {
    isOpen: boolean
    user: any
    onLogout: () => void
    setUiLanguage: (l: "en" | "ml") => void
    uiLanguage: "en" | "ml"
    currentPage: string
    setCurrentPage: (p: any) => void
    t: any
  }) => {
    const navItems = [
      { href: "dashboard", label: t.dashboard, icon: LayoutDashboard },
      { href: "documents", label: t.documents, icon: FileText },
      { href: "reports", label: t.analytics, icon: BarChart2 },
    ]
    return (
      <aside
        className={`absolute z-30 lg:relative w-64 h-full flex-shrink-0 bg-[#001c5a] text-white flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="h-20 flex items-center justify-center px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <NationalEmblem />
            <span className="text-xl font-bold tracking-wider">MetroMind</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => setCurrentPage(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-300 hover:bg-white/10 hover:text-white transition-colors ${
                currentPage === item.href ? "bg-white/20 text-white font-semibold" : ""
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-1 border p-1 rounded-lg bg-gray-900/50">
            <button
              onClick={() => setUiLanguage("en")}
              className={`flex-1 text-center py-1 text-xs font-semibold rounded-md ${
                uiLanguage === "en" ? "bg-white/90 text-[#001c5a]" : "text-white"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setUiLanguage("ml")}
              className={`flex-1 text-center py-1 text-xs font-semibold rounded-md ${
                uiLanguage === "ml" ? "bg-white/90 text-[#001c5a]" : "text-white"
              }`}
            >
              മലയാളം
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/10 ${user.color}`}>
              <user.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">{user.name}</p>
              <p className="text-xs text-gray-400">KMRL User</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-white/10 text-white font-semibold py-2 px-3 rounded-lg hover:bg-white/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>
    )
  }

  const Header = ({ onMenuClick, t, currentPage }: { onMenuClick: () => void; t: any; currentPage: any }) => (
    <header className="lg:hidden h-20 bg-white border-b flex items-center justify-between px-6">
      <button onClick={onMenuClick}>
        <Menu className="w-6 h-6 text-gray-700" />
      </button>
      <h1 className="text-lg font-bold text-[#001c5a]">{t[currentPage]}</h1>
      <div className="w-6"></div>
    </header>
  )

  const formatDocDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  const extractBullets = (html: string, max = 5): string[] => {
    const liMatches = Array.from(html.matchAll(/<li>(.*?)<\/li>/gis)).map((m) =>
      m[1]
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    return liMatches.slice(0, max)
  }

  const DocumentCard = ({ doc, onCardClick, t }: { doc: Doc; onCardClick: (d: Doc) => void; t: any }) => {
    const bullets = extractBullets(doc.summary_en || doc.summary_ml)
    const tagStyles = (tag: string) => (tag === "Urgent" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700")
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col">
        <h3 className="font-bold text-gray-900 text-lg leading-snug" onClick={() => onCardClick(doc)}>
          {doc.title.replace(/_/g, " ")}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-gray-600 text-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>{formatDocDate(doc.date)}</span>
        </div>

        {bullets.length > 0 && (
          <ul className="mt-4 space-y-1 text-gray-700 text-sm list-none">
            {bullets.map((b, i) => (
              <li key={i} className="leading-6">{`• ${b}`}</li>
            ))}
          </ul>
        )}

        {doc.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {doc.tags.map((tag, i) => (
              <span
                key={i}
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tagStyles(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 pt-4 border-t">
          <a
            href={doc.pdfUrl || "#"}
            target="_blank"
            rel="noreferrer"
            className={`w-full inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
              doc.pdfUrl ? "text-gray-800 hover:bg-gray-50" : "text-gray-400 cursor-not-allowed pointer-events-none"
            }`}
            aria-label="View Source"
            title="View Source"
          >
            <ExternalLink className="w-4 h-4" />
            View Source
          </a>
        </div>
      </div>
    )
  }

  const DocumentsPage = ({
    documents,
    onUploadClick,
    onCardClick,
    t,
  }: {
    documents: Doc[]
    onUploadClick: () => void
    onCardClick: (d: Doc) => void
    t: any
  }) => {
    const FILTERS: Array<"All" | "Safety" | "Maintenance" | "Finance" | "Urgent"> = [
      "All",
      "Safety",
      "Maintenance",
      "Finance",
      "Urgent",
    ]
    const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All")
    const filteredDocs = activeFilter === "All" ? documents : documents.filter((d) => d.tags.includes(activeFilter))

    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <header className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{t.allDocuments}</h1>
              <p className="mt-1 text-gray-600">
                {`Filtered for ${activeFilter}. ${t.found} ${filteredDocs.length} ${
                  filteredDocs.length === 1 ? t.document : t.documentsPlural
                }.`}
              </p>
            </div>
            <button
              onClick={onUploadClick}
              className="flex items-center gap-2 bg-[#ff9933] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#e78a2e] transition-colors w-full sm:w-auto"
            >
              <PlusCircle className="w-5 h-5" />
              {t.newUpload}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
                  activeFilter === f
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} onCardClick={onCardClick} t={t} />
          ))}
        </div>
      </div>
    )
  }

  const DashboardPage = ({
    documents,
    user,
    onDocSelect,
    t,
  }: { documents: Doc[]; user: any; onDocSelect: (d: Doc) => void; t: any }) => {
    const stats = useMemo(() => {
      return [
        { title: t.totalDocs, value: documents.length, color: "saffron" },
        { title: t.urgentItems, value: documents.filter((d) => d.tags.includes("Urgent")).length, color: "white" },
        { title: t.actionRequired, value: documents.filter((d) => d.actionRequired).length, color: "green" },
      ]
    }, [documents, t])

    const priorityDocs = useMemo(() => {
      return documents
        .map((doc) => ({ ...doc, priorityScore: getPriorityScore(doc) as number }))
        .filter((doc: any) => doc.priorityScore > 0)
        .sort((a: any, b: any) => b.priorityScore - a.priorityScore)
        .slice(0, 5)
    }, [documents])

    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">{t.dashboard}</h1>
          <p className="mt-1 text-gray-600">
            {t.welcome}, <span className="font-semibold">{user.name}</span>.
          </p>
        </header>

        <section>
          <SmartSearch documents={documents} onDocSelect={onDocSelect} t={t} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} color={stat.color as any} />
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t.priorityInbox}</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {priorityDocs.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {priorityDocs.map((doc: any) => {
                  const deadline = getDeadlineStatus(doc.deadline)
                  let reason = doc.tags.includes("Urgent") ? "Urgent Directive" : "Deadline Approaching"
                  if (deadline?.color === "red") reason = "Deadline Critical"
                  return (
                    <li
                      key={doc.id}
                      onClick={() => onDocSelect(doc)}
                      className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`p-2 rounded-full ${deadline?.color === "red" ? "bg-red-100" : "bg-orange-100"}`}
                        >
                          <Zap
                            className={`w-5 h-5 ${deadline?.color === "red" ? "text-red-600" : "text-orange-600"}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{doc.title}</p>
                          <p className="text-sm text-gray-600">{reason}</p>
                        </div>
                      </div>
                      {deadline && (
                        <div className="text-right text-sm flex-shrink-0 ml-4">
                          <p className={`font-bold ${deadline.color === "red" ? "text-red-600" : "text-orange-600"}`}>
                            {deadline.text}
                          </p>
                          <p className="text-gray-500">{new Date(doc.deadline).toLocaleDateString()}</p>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="p-8 text-center text-gray-500">{t.noPriorityDocs}</p>
            )}
          </div>
        </section>
      </div>
    )
  }

  const StatCard = ({
    title,
    value,
    color,
  }: { title: string; value: number; color: "saffron" | "white" | "green" }) => {
    const colors: Record<string, string> = {
      saffron: "border-t-[#ff9933]",
      white: "border-t-gray-300",
      green: "border-t-[#138808]",
    }
    return (
      <div className={`bg-white p-6 rounded-lg shadow-sm border ${colors[color]} border-t-4`}>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      </div>
    )
  }

  const ReportsPage = ({ documents, t }: { documents: Doc[]; t: any }) => {
    const categoryCounts = useMemo(() => {
      const counts: Record<string, number> = {}
      documents.forEach((doc) => {
        doc.tags.forEach((tag) => {
          if (
            ["Safety", "Finance", "Maintenance", "HR", "Tender", "Operations", "IT", "Security", "PR"].includes(tag)
          ) {
            counts[tag] = (counts[tag] || 0) + 1
          }
        })
      })
      return counts
    }, [documents])

    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">{t.analyticsReports}</h1>
          <p className="mt-1 text-gray-600">{t.docDistribution}.</p>
        </header>
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{t.docDistribution}</h2>
          <PieChart data={categoryCounts} />
        </div>
      </div>
    )
  }

  const PieChart = ({ data }: { data: Record<string, number> }) => {
    const colors: Record<string, string> = {
      Safety: "#FF9933",
      Finance: "#138808",
      Maintenance: "#001C5A",
      HR: "#F472B6",
      Tender: "#6D28D9",
      Operations: "#2563EB",
      IT: "#F59E0B",
      Security: "#EF4444",
      PR: "#10B981",
    }
    const total = Object.values(data).reduce((a, b) => a + b, 0)
    if (total === 0) return <div className="text-center py-10 text-gray-500">No data to display.</div>
    let cumulativePercent = 0
    const segments = Object.entries(data).map(([key, value]) => {
      const percent = (value / total) * 100
      const startAngle = (cumulativePercent / 100) * 360
      cumulativePercent += percent
      const endAngle = (cumulativePercent / 100) * 360
      return { key, value, percent, startAngle, endAngle, color: colors[key] || "#6B7280" }
    })
    return (
      <div className="flex flex-col md:flex-row items-center gap-8">
        <svg viewBox="0 0 100 100" className="w-48 h-48">
          {segments.map((seg) => {
            const x1 = 50 + 50 * Math.cos((Math.PI * seg.startAngle) / 180)
            const y1 = 50 + 50 * Math.sin((Math.PI * seg.startAngle) / 180)
            const x2 = 50 + 50 * Math.cos((Math.PI * seg.endAngle) / 180)
            const y2 = 50 + 50 * Math.sin((Math.PI * seg.endAngle) / 180)
            const largeArcFlag = seg.percent > 50 ? 1 : 0
            return (
              <path
                key={seg.key}
                d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={seg.color}
              />
            )
          })}
        </svg>
        <div className="flex-1 w-full space-y-2">
          {segments.map((seg) => (
            <div key={seg.key} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }}></span>
                <span className="font-semibold">{seg.key}</span>
              </div>
              <span>
                {seg.value} ({seg.percent.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const FileUpload = ({
    onFileSelect,
    onUpload,
    isProcessing,
    selectedFile,
    t,
  }: {
    onFileSelect: (f: File | null) => void
    onUpload: () => void
    isProcessing: boolean
    selectedFile: File | null
    t: any
  }) => {
    const [isDragging, setIsDragging] = useState(false)

    const handleDrag = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }, [])
    const handleDragIn = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      // @ts-ignore
      if ((e.dataTransfer.items && e.dataTransfer.items.length > 0) || (e as any).dataTransfer?.files?.length > 0)
        setIsDragging(true)
    }, [])
    const handleDragOut = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
    }, [])
    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        if ((e as any).dataTransfer.files && (e as any).dataTransfer.files.length > 0) {
          onFileSelect((e as any).dataTransfer.files[0])
          ;(e as any).dataTransfer.clearData()
        }
      },
      [onFileSelect],
    )

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) onFileSelect(e.target.files[0])
    }

    return (
      <div className="w-full">
        <label
          htmlFor="file-upload"
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging ? "border-[#ff9933] bg-orange-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-10 h-10 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF, JPG, PNG, or TXT</p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.txt"
          />
        </label>

        {selectedFile && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">{selectedFile.name}</span>
            </div>
            <button onClick={() => onFileSelect(null)} disabled={isProcessing}>
              <X className="w-5 h-5 text-gray-500 hover:text-red-600" />
            </button>
          </div>
        )}

        <button
          onClick={onUpload}
          disabled={!selectedFile || isProcessing}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-[#138808] text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0f6b06] transition-colors"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.processing}
            </>
          ) : (
            t.processDocument
          )}
        </button>
      </div>
    )
  }

  const Modal = ({ open, onClose, children, maxWidth = "max-w-2xl" }: any) => {
    if (!open) return null
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className={`bg-white rounded-lg shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    )
  }

  const DocumentViewerModal = ({
    doc,
    onClose,
    t,
    uiLanguage,
  }: { doc: Doc | null; onClose: () => void; t: any; uiLanguage: "en" | "ml" }) => {
    const [feedback, setFeedback] = useState<"good" | "bad" | null>(null)
    if (!doc) return null
    const summary = uiLanguage === "ml" ? doc.summary_ml || doc.summary_en : doc.summary_en || doc.summary_ml
    return (
      <Modal open={true} onClose={onClose} maxWidth="max-w-6xl">
        <div className="flex flex-col md:flex-row h-full min-h-0">
          <div className="w-full md:w-2/3 bg-gray-200 p-2 md:p-4 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            <iframe
              src={`https://docs.google.com/gview?url=${doc.pdfUrl}&embedded=true`}
              className="w-full h-full"
              title={doc.title}
            ></iframe>
          </div>
          <div className="w-full md:w-1/3 p-6 flex flex-col bg-white overflow-hidden relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
              <X />
            </button>
            <div className="flex-1 overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{doc.title}</h2>
              <div
                className="text-sm prose prose-sm max-w-none prose-h4:text-[#001c5a] prose-h4:border-b prose-h4:pb-1 prose-h4:mb-2 prose-ul:pl-4"
                dangerouslySetInnerHTML={{ __html: summary }}
              />
            </div>
            <div className="mt-auto pt-6 flex-shrink-0">
              <h4 className="text-sm font-bold text-gray-700 mb-2">{t.feedback}</h4>
              <p className="text-xs text-gray-500 mb-2">{t.summaryAccurate}</p>
              <div className="flex gap-2">
                {!feedback ? (
                  <>
                    <button
                      onClick={() => setFeedback("good")}
                      className="flex-1 flex items-center justify-center gap-2 p-2 border rounded-lg hover:bg-green-50 text-green-700"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {t.good}
                    </button>
                    <button
                      onClick={() => setFeedback("bad")}
                      className="flex-1 flex items-center justify-center gap-2 p-2 border rounded-lg hover:bg-red-50 text-red-700"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      {t.bad}
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-center text-gray-600 font-semibold p-2 bg-gray-100 rounded-lg">
                    {t.feedbackThanks}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  const SmartSearch = ({ documents, onDocSelect, t }: { documents: Doc[]; onDocSelect: (d: Doc) => void; t: any }) => {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<{ answer: string; docs: Doc[] } | null>(null)

    const handleSearch = () => {
      if (query.trim() === "") {
        setResults(null)
        return
      }
      const lowerQuery = query.toLowerCase()
      const foundDocs = documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(lowerQuery) ||
          (doc.summary_en || doc.summary_ml).toLowerCase().includes(lowerQuery) ||
          doc.tags.some((t) => t.toLowerCase().includes(lowerQuery)),
      )
      if (foundDocs.length > 0) {
        const answer = `${t.found} <strong>${foundDocs.length} ${
          foundDocs.length === 1 ? t.document : t.documentsPlural
        }</strong> ${t.relatedDocs} "<strong>${query}</strong>".`
        setResults({ answer, docs: foundDocs })
      } else {
        setResults({ answer: `No documents found matching your query for "<strong>${query}</strong>".`, docs: [] })
      }
    }

    const highlight = (text: string) =>
      text.replace(new RegExp(query, "gi"), (match) => `<strong class="bg-yellow-200">${match}</strong>`)

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BrainCircuit />
          {t.smartSearch}
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t.askAQuestion}
            className="w-full px-4 py-2 border rounded-md"
          />
          <button onClick={handleSearch} className="bg-[#001c5a] text-white font-semibold py-2 px-4 rounded-lg">
            {t.search}
          </button>
        </div>
        {results && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold mb-2">{t.aiGeneratedAnswer}:</p>
            <p className="text-sm text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: results.answer }} />
            {results.docs.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">{t.relatedDocs}:</p>
                {results.docs.slice(0, 3).map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => onDocSelect(doc)}
                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                    dangerouslySetInnerHTML={{ __html: highlight(doc.title) }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar
        isOpen={isSidebarOpen}
        user={user}
        onLogout={onLogout}
        setUiLanguage={setUiLanguage}
        uiLanguage={uiLanguage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage as any}
        t={t}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen((o) => !o)} t={t} currentPage={currentPage} />
        <main className="flex-1 overflow-y-auto">
          {currentPage === "dashboard" && (
            <DashboardPage documents={documents} user={user} onDocSelect={handleDocSelect} t={t} />
          )}
          {currentPage === "documents" && (
            <DocumentsPage
              documents={documents}
              onUploadClick={() => setIsUploadDialogOpen(true)}
              onCardClick={handleDocSelect}
              t={t}
            />
          )}
          {currentPage === "reports" && <ReportsPage documents={documents} t={t} />}
        </main>
      </div>

      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-20 lg:hidden"></div>
      )}

      <Modal open={isUploadDialogOpen} onClose={handleCloseDialog}>
        <div className="p-6">
          <h2 className="text-lg font-semibold">{t.uploadDocument}</h2>
        </div>
        <div className="px-6 pb-6">
          <FileUpload
            onFileSelect={setSelectedFile}
            onUpload={handleUpload}
            isProcessing={isProcessing}
            selectedFile={selectedFile}
            t={t}
          />
          <button onClick={handleCloseDialog} className="mt-4 w-full text-center">
            {t.cancel}
          </button>
        </div>
      </Modal>

      <DocumentViewerModal doc={selectedDoc} onClose={handleCloseDocDetail} t={t} uiLanguage={uiLanguage} />
    </div>
  )
}

// --- Root App ---
export default function App() {
  const [loggedInUser, setLoggedInUser] = useState<any>(null)
  const [cryptoReady, setCryptoReady] = useState(false)
  const [uiLanguage, setUiLanguage] = useState<"en" | "ml">("en")

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"
    script.async = true
    script.onload = () => {
      USER_CREDENTIALS.executive.hashedPassword = CryptoJS.SHA256(
        "Exec2025!@" + USER_CREDENTIALS.executive.salt,
      ).toString()
      USER_CREDENTIALS.safety.hashedPassword = CryptoJS.SHA256("Safety2025!@" + USER_CREDENTIALS.safety.salt).toString()
      USER_CREDENTIALS.finance.hashedPassword = CryptoJS.SHA256(
        "Finance2025!@" + USER_CREDENTIALS.finance.salt,
      ).toString()
      setCryptoReady(true)
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleLogin = (userProfile: any) => setLoggedInUser(userProfile)
  const handleLogout = () => setLoggedInUser(null)

  const t = TRANSLATIONS[uiLanguage]

  if (!loggedInUser) {
    return <LoginScreen onLogin={handleLogin} cryptoReady={cryptoReady} t={t} />
  }

  return <MainApplication user={loggedInUser} onLogout={handleLogout} />
}
