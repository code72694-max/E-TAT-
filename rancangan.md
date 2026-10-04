# Rancangan Sistem E-TAT: Flow, Data, Kontrak API, dan Dokumen Cetak

## Daftar isi

- [Panduan membaca dan prioritas kontrak](#section-001)
- [1. Keputusan arsitektur](#section-002)
- [2. Konvensi API yang berlaku untuk semua modul](#section-003)
- [3. Katalog model request dan response](#section-004)
- [4. Model data Medis dan Hukum](#section-005)
- [5. Model pembahasan, keluaran, rehab, laporan](#section-006)
- [6. Katalog endpoint kanonis](#section-007)
- [7. Status, gates, dan dampak ke UI](#section-008)
- [8. Response frontend: tepat data yang dibutuhkan](#section-009)
- [9. Rancangan cetak dan PDF](#section-010)
- [10. Contoh request dan response](#section-011)
- [11. Aturan validasi lintas modul](#section-012)
- [12. Persistence, audit, dan pekerjaan asynchronous](#section-013)
- [13. Kebijakan terbuka dan batas kelengkapan](#section-014)
- [14. Acceptance test kontrak](#section-015)
- [15. Referensi flow dan inventaris lengkap v1.0](#section-016)
- [Spesifikasi Teknis E-TAT SIAPPULIH: MVP Empat Role](#section-017)
- [Lampiran A. Inventaris lengkap formulir dan referensi](#section-018)
- [Lampiran B. Matriks penempatan enam dimensi](#section-019)
- [Lampiran C. Petunjuk penempatan dan detail dokumen keluaran](#section-020)
- [Lampiran D. Pencatatan, pelaporan, pembiayaan, dan monev](#section-021)


**Versi 1.1 | 3 Oktober 2026 | Rancangan, bukan aplikasi yang sudah dibuat.**

Empat role login: **ADMIN** (Sekretariat), **MEDIS**, **HUKUM**, **PENGAJU**. Ketua, orang tua/wali, saksi, penerjemah dan fasilitas rehabilitasi adalah pihak/organisasi yang dicatat; tidak ditambah sebagai role login.


---

<a id="section-001"></a>

## Panduan membaca dan prioritas kontrak

Dokumen ini terdiri dari **kontrak API v1.1** di bagian depan, lalu **spesifikasi flow dan seluruh inventaris formulir** yang sudah disusun. Tidak perlu membuka file Excel atau Word terpisah untuk mengetahui field sumber.

**Kontrak v1.1 adalah rancangan teknis kanonis untuk endpoint, payload dan response.** Bagian referensi v1.0 di belakang tetap dipertahankan untuk field, flow, bukti sumber dan formulir, tetapi endpoint/syntax lamanya adalah contoh awal. Jika path/status teknis berbeda, gunakan kontrak v1.1; jangan membangun dua versi endpoint.

**J** = ketentuan/label yang tertulis di juknis; **R** = rancangan aplikasi; **K** = kebijakan yang belum disahkan. Seluruh URL endpoint, field camelCase, HTTP status, pagination dan aturan transaksi pada kontrak adalah **R**, bukan API resmi BNN. Requiredness hukum harus mengikuti policy yang disahkan, bukan disimpulkan dari contoh JSON.

Sumber: [JUKNIS TAT 2025](https://t90182123892.p.clickup-attachments.com/t90182123892/fa5b234e-46f1-4182-8b83-131e7d1bc232/JUKNIS%20TAT%202025.pdf), [dokumen proyek](https://app.clickup.com/90182123892/docs/2kzmc0bm-1358). Nomor halaman merujuk PDF fisik; footer buku dicantumkan dalam inventaris. Snapshot repo sebelumnya tidak dianggap bukti kode terkini. Tidak ada kode aplikasi, endpoint hidup, deployment atau perubahan GitHub yang dilakukan.


---

<a id="section-002"></a>

## 1. Keputusan arsitektur

Gunakan React/Vite, backend NestJS modular monolith, PostgreSQL, object storage privat, serta worker untuk scan file, PDF dan notifikasi. Ini satu sistem dengan modul domain, bukan microservices.

Aliran data: browser â†’ session/API berotorisasi â†’ service domain dan transaksi DB â†’ object storage privat/worker â†’ artefak yang dapat diunduh melalui API berizin. Browser tidak memegang secret email, bucket, sertifikat Ketua, atau koneksi DB.

Model inti: **Client â†’ Case â†’ Application â†’ Assessment versions â†’ Conference outcome â†’ Official release â†’ Follow-up**. Orang yang sama dapat mempunyai beberapa perkara/pengajuan. Scope MVP satu pengajuan untuk satu terperiksa. Identitas tiap pengajuan disimpan sebagai snapshot, sehingga perubahan profil tidak menulis ulang arsip.

Pemohon mengisi identitas/perkara/berkas. Medis mengisi pemeriksaan medis. Hukum mengisi pemeriksaan hukum. Admin menangani administrasi dan pencatatan keputusan eksternal, bukan diagnosis atau keputusan Ketua.

### Empat status yang tidak boleh dicampur

`applicationStatus`: tahap proses TAT. `medicalStatus` dan `legalStatus`: kemajuan tiap asesmen. `deliveryStatus`: penyampaian hasil. `followupStatus`: pelaksanaan rekomendasi.

Hasil resmi sudah terbit dapat bersamaan dengan rehab belum dilaksanakan. Berkas ada dapat bersamaan dengan isi belum memenuhi syarat. Catatan pembahasan dapat tersedia sebelum keputusan dibuktikan BA bertanda tangan.


---

<a id="section-003"></a>

## 2. Konvensi API yang berlaku untuk semua modul

Base path rancangan: `/api/v1`. Gunakan JSON UTF-8, camelCase, UUID untuk ID production. Token seperti `app_demo_01` pada contoh adalah **alias data sintetis**, harus diganti UUID pada implementasi. Tidak ada NIK, rekening, kredensial atau data pasien nyata dalam contoh.

Tipe: `string`, `boolean`, `integer`, `decimal-string`, `date(YYYY-MM-DD)`, `datetime(RFC3339)`, `uuid`, `enum`, `object`, `array`. Jumlah barang bukti dan uang menggunakan decimal-string dengan unit/currency, bukan float. Nomor surat/identitas/HP/rekening adalah string.

Tanggal/jam punya presisi. `{"date":"2026-10-03","time":null,"timezone":"Asia/Jakarta","precision":"DATE_ONLY"}` tidak diubah diam-diam menjadi midnight. Timestamp server seperti recordedAt selalu datetime.

### Envelope

Sukses satu resource: `{"data":{...},"meta":{"requestId":"...","serverTime":"..."}}`.

Sukses list: `data` berupa array dan `meta.page={limit,nextCursor,hasMore}`. `total` hanya jika dihitung tepat dan pemanggil berizin. Tidak ada `success:true` yang bertentangan dengan HTTP error.

Error: `{"error":{"code":"...","message":"...","fields":[...],"retryable":false},"meta":{...}}`. Field error memakai JSON Pointer, misalnya `/identity/fullName`. Error tidak mengembalikan nilai identitas sensitif yang gagal validasi.

`201`: resource/event baru. `200`: baca/update/hasil command. `202`: job scan/render/ekspor diterima tetapi belum selesai. `204`: berhasil tanpa body, misalnya logout. `400`: syntax/query tidak valid. `401`: belum login. `403`: aksi tidak diizinkan pada resource yang boleh diketahui pengguna. `404`: tidak ada atau di luar scope yang tidak boleh diungkap. `409`: transisi/policy/idempotency konflik. `412`: revision stale. `413`: file terlalu besar. `415`: tipe tidak didukung. `422`: payload/gate data tidak valid. `428`: If-Match yang diwajibkan tidak diberikan. `429`: rate limit. `503`: dependency gagal sementara.

### Auth, versi, dan replay

Web memakai session cookie `Secure`, `HttpOnly`, `SameSite` sesuai deployment. State-changing request membutuhkan proteksi CSRF dan validasi origin. Session dirotasi sesudah login; logout mencabut session. Password diproses hanya auth service dan tidak pernah dikembalikan atau dicatat di log. SSO dapat menggantikan login password tanpa mengubah role domain.

Detail application mengirim ETag kuat berbasis revision, misalnya `"application:app_demo_01:7"`. Command yang mengubah aggregate application memakai `If-Match` itu; autosave assessment memakai ETag assessment, bukan aplikasi. Command mengikuti lock order konsisten dan mengunci dependency dalam transaksi, bukan sekadar mempercayai pengecekan UI.

`Idempotency-Key` diwajibkan pada seluruh command POST yang menghasilkan efek bisnis (submit, keputusan, finalisasi, render job, release, follow-up, grant). Key scoped actor+path; request hash disimpan. Key/payload sama memutar ulang hasil semula; key sama payload berbeda menghasilkan `IDEMPOTENCY_CONFLICT`. Usulan TTL replay 24 jam configurable; unique constraints tetap mencegah efek ganda setelah TTL.

Aturan header ini berlaku walau tidak diulang pada tiap baris katalog: semua mutation checklist/berkas link/verifikasi/koreksi/resubmit/disposisi/registrasi/assignment/schedule yang memengaruhi application menggunakan If-Match application dan mengembalikan `applicationRevision` serta ETag baru. Mutation assessment memakai If-Match assessment; mutation conference memakai ETag conference dan server mengunci dependency application; followup memakai ETag followup. Resource baru tanpa parent mutable tidak membutuhkan ETag parent yang tidak ada. Replay idempotency dicek setelah autentikasi/scope: replay yang sama mengembalikan hasil tersimpan tanpa mengeksekusi transisi atau menolak hanya karena ETag asal kini stale. Jika izin sudah dicabut, hasil replay tidak diungkap.

GET response tetap dicek izin setiap kali; `Cache-Control: no-store` untuk data kasus/medis/berkas. UI tidak menyimpan data sensitif di localStorage secara default. `allowedActions` membantu tampilan, bukan batas keamanan.

### JSON PATCH bukan akses bebas

PATCH memakai field allowlist per endpoint. Field yang dihilangkan berarti tidak berubah; `null` berarti kosongkan hanya jika nullable. Array dinyatakan replace-whole kecuali endpoint khusus. Unknown properties ditolak 422 untuk mencegah mass assignment. Tidak ada `PATCH {status: ...}` atau `PATCH {role:"ADMIN"}` oleh Pengaju.


---

<a id="section-004"></a>

## 3. Katalog model request dan response

Pada tabel berikut, tanda `!` berarti wajib untuk command/model tersebut secara desain. `?` berarti nullable/opsional. **Minimum draf berbeda dari minimum submit dan finalisasi.** Role dan actor selalu berasal dari session; field createdBy/recordedBy/reviewer dalam response tidak diterima bebas sebagai actor request.

### 3.1 Model identitas, pemohon, dan perkara

`AccountRequestInput`: name!, email!, organizationId!, position?, serviceNumber?, contactChannel!, contactVerificationId?, authorityDocumentVersionIds[] (boleh kosong saat awal). `AccountRequestView`: id, status:CONTACT_PENDING/UPLOAD_PENDING/PENDING_REVIEW/APPROVED/REJECTED/EXPIRED, name/email sesuai scope (masked untuk kanal terbatas), organizationId, authorityDocumentVersionIds[], reviewer?, reviewedAt?, provisioningStatus:NOT_STARTED/PENDING/SENT/COMPLETED/FAILED, createdAt, revision. Data akun tidak sama dengan identitas klien.

| Model | Field dan aturan |
|---|---|
| IdentitySnapshot | fullName:string!, identityType:enum?, identityNumber:string?, birthPlace:string?, birthDate:date?, ageValue:integer?, ageBasis:EXACT/ESTIMATED/UNKNOWN!, sex:{code?,answerState}!, nationality:{code?,answerState}!, address:{text?,provinceCode?,districtCode?}, phone:{value?,answerState}, account:{number?,answerState,holderRelationship?}, maritalStatus:{code?,templateVersionId?}, education:{code?,description?}, occupation:{code?,description?}, religion:{value?,answerState}, childStatus:YES/NO/UNDETERMINED!, interpreterNeed:YES/NO/NOT_ASSESSED!, preferredLanguage?, provenance[] |
| ApplicantSnapshot | organizationId!, submittedByPersonId!, position?, rank?, serviceNumber?, contactPhone?, contactEmail?, authorityDocumentVersionIds[], delegationId?, sourceApplicationDate:date?; userId dan organisasi session diverifikasi server |
| CaseData | caseId?, referenceType?, referenceNumber?, requestLetter:{number?,date?,documentVersionId?}, allegedArticles:string[], chronology?, arrestOrderIssuedAt:SourceTime?, arrestedAt:SourceTime?, detention:{startedAt?,location?,basisDocumentVersionId?}, p19:{reference?,documentVersionId?}, prosecution:{reference?,documentVersionId?}, courtOrder:{number?,date?,documentVersionId?} |
| SourceTime | date:date!, time:HH:mm:ss?, timezone:IANA!, precision:DATE_ONLY/MINUTE/SECOND!, sourceDocumentVersionId?; DATE_ONLY tidak punya time |
| EvidenceItem | id?, substanceCode?, substanceDescription!, amount:decimal-string!, unit!, weightBasis:NET/GROSS/UNSPECIFIED!, labResultId?, seizureDocumentVersionIds[], semaReview:{category,referenceVersionId?,reason?,reviewedBy?,reviewedAt?}; semaReview hanya Hukum yang berwenang |
| LabResult | id?, specimen:URINE/HAIR/BLOOD/EVIDENCE/OTHER!, specimenDescription?, issuingFacility!, sampleCollectedAt:SourceTime?, examinedAt:SourceTime?, reportDate:date?, reportNumber?, analytes:[{code?,name!,result:POSITIVE/NEGATIVE/INCONCLUSIVE/NOT_TESTED!,reportedValue?,unit?}], reportDocumentVersionId!, sourceStatus:REPORTED/VERIFIED; Pengaju melaporkan, tim memverifikasi |
| DraftApplicationInput | route!, targetTatUnitId!, intakePolicyVersionId!, identity:IdentitySnapshot!, applicant:ApplicantSnapshot!, case:CaseData!, evidenceItems[], labResults[]; kelengkapan source field boleh belum selesai dalam draf |
| DraftPatch | Subset identity/applicant/case/evidenceItems/labResults yang diizinkan; route/target hanya saat DRAFT atau lewat prosedur perubahan terpisah |
| ApplicationSummary | id,trackingNumber,registrationNumber?,route,applicationStatus,medicalStatus,legalStatus,deliveryStatus,followupStatus,displayIdentity (masked/alias),targetTatUnit,submittedAt?,revision,nextAction,deadlineSummary |
| ApplicationDetail | ApplicationSummary + applicant/identity/case view berizin,policyVersions,snapshotVersionId?,blockers[],allowedActions[],visibility,createdAt,updatedAt; bukan seluruh jawaban Medis/Hukum |
| SubmissionCommand | confirmation:true!, checklistRevision!, sourceApplicationDate:date!; tidak menerima submittedAt atau registrationNumber |
| SubmissionResult | applicationId,status,snapshotVersionId,submittedAt,revision,trackingNumber,completeness:NOT_YET_VERIFIED |

`answerState` identitas: `PROVIDED`, `UNKNOWN`, `NOT_STATED`, `DECLINED`, `NOT_APPLICABLE`. Ketersediaan pilihan mengikuti field/policy. Jangan memaksa rekening terisi jika requiredness belum disahkan. `childStatus=UNDETERMINED` memicu safeguard review, bukan dianggap dewasa. Nilai supplied user untuk usia/status anak ditelaah/dihitung dari bukti, tidak dipercaya otomatis.

### 3.2 Katalog policy dan template

| Model | Field dan aturan |
|---|---|
| RouteDefinition | code,label,sourceReferences[],permittedApplicantTypes[],requirementsTemplateId,intakePolicyVersionId,eligibilityPolicyVersionId?,eligibilityPolicyStatus |
| PolicyVersion | id,version,status:DRAFT/APPROVED/RETIRED,effectiveFrom?,effectiveTo?,scope,sourceReferences[],externalApprover:{personId,mandateId}?,approvalDocumentVersionId?,unresolvedConflicts[] |
| Template | id,version,name,kind,sourceReferences[],status:REVIEW_REQUIRED/APPROVED/RETIRED,items[],selectionPolicyId? |
| TemplateItem | id!,sourceCode?,sourcePage!,sourceLabel!,contentKind:INPUT/REFERENCE/INSTRUCTION/LABEL/SCALE_HEADER/SIGNATURE_BLOCK/OUTPUT_FIELD!,widget?,valueSchema?,options:[{code,label}],periods[],matrixColumns[],repeatRule?,applicabilityRuleId?,validationRuleIds[],sourceNotes[],implementationNotes[] |
| RequirementDefinition | id,sourceNumber,sourceLabel,sourcePage,requirementBasis:JUKNIS_CHAPTER/JUKNIS_FORM/APPROVED_POLICY/UNRESOLVED_CONFLICT,applicabilityRuleId?,conditionRuleId?,gateEffect:INFORMATIONAL/REQUIRED_FOR_REVIEW/REQUIRED_FOR_DISPOSITION,policyVersionId |
| ChecklistResponse | requirementId,applicability:NOT_ASSESSED/APPLICABLE/NOT_APPLICABLE,applicabilityReason?,availability:PRESENT/ABSENT/UNKNOWN,documentLinks:[{documentVersionId,pageStart?,pageEnd?}],conditionAssessment:NOT_ASSESSED/SATISFIED/NOT_SATISFIED/NOT_APPLICABLE/UNKNOWN,verificationState,notes?,revision |
| ChecklistPatch | responses:[{requirementId!,availability!,documentLinks[],notes?}]; Pengaju tidak boleh mengisi conditionAssessment atau verificationState; applicability final ditetapkan pemeriksa/policy |
| AssessmentTemplateView | Template yang dipilih + server-calculated visibility/applicability per item,missingItems[],policyVersionId |

Tidak ada interpretasi bebas label untuk membuat seluruh 613 item menjadi input. Pemetaan contentKind/widget/valueSchema perlu review item-by-item. Inventaris di belakang adalah sumber label, bukan schema JSON siap produksi.

### 3.3 Dokumen, verifikasi, dan keputusan eksternal

| Model | Field dan aturan |
|---|---|
| UploadIntentInput | owner:{type:APPLICATION/ACCOUNT_REQUEST/MANDATE,id}!,category!,filename!,declaredMimeType!,declaredSize:integer!,replacesVersionId?,revisionReason?; category harus cocok scope aktor |
| UploadIntent | uploadId,documentId,documentVersionId,transport:API_MULTIPART,uploadPath,expiresAt,maxSize,allowedTypes,scanStatus:AWAITING_BYTES |
| CompleteUploadCommand | transportReceiptId!; checksum/size otoritatif dihitung server, bukan dipercaya dari browser |
| DocumentVersion | id,documentId,version,category,originalFilename,detectedMimeType,byteSize,sha256?,scanStatus:AWAITING_BYTES/QUARANTINED/READY/REJECTED,scanJobId?,readyAt?,rejectedAt?,rejectionCode?,documentNumber?,documentDate?,issuer?,confidentiality,uploadedBy,uploadedAt,supersedesVersionId?,signatureReviewStatus:NOT_APPLICABLE/PENDING/ACCEPTED/REJECTED,revision |
| VerificationInput | requirementId!,documentVersionIds[],outcome:VALID/CORRECTION_REQUIRED/INVALID!,conditionAssessment!,reasonCode?,reasonText?,sourceReferences[]; wajib reason bila tidak valid |
| VerificationRecord | VerificationInput + id,applicationId,snapshotVersionId,reviewedBy,reviewedAt,invalidatedByVersionId?,revision |
| CorrectionRequestInput | targets:[{kind:FIELD/REQUIREMENT,pathOrRequirementId,reasonCode,reasonText}]!,sourceSnapshotVersionId!,responseDeadline?:SourceTime; deadline administrasi bukan reset SLA hukum |
| CorrectionResponseInput | correctionRequestId!,responses:[{targetId,explanation,replacementDocumentVersionIds[],updatedFieldPaths[]}],draftRevision! |
| ExternalAuthority | personId!,nameSnapshot!,positionSnapshot!,tatLevel:NATIONAL/PROVINCIAL/DISTRICT!,mandateId! |
| DispositionInput | outcome:APPROVED/REJECTED!,externalDecider:ExternalAuthority!,decidedAt:SourceTime!,signedEvidenceDocumentVersionId!,evidenceProcedureVersionId!,evidenceChecks:{identityConsistent!,mandateValid!,contentConsistent!,datesConsistent!},reason!,rejectionLetterVersionId?; penolakan wajib surat penolakan READY |
| DispositionRecord | DispositionInput + id,recordedBy,recordedAt,evidenceReview:{status,reviewedBy,reviewedAt,procedureVersionId},applicationRevision |
| OutOfScopeReferralInput | destinationOrganizationId!,reason!,basis!,referenceDocumentVersionIds[],notifiedRecipients[] |
| RevisionResult | id,status,revision,updatedAt; status milik resource yang diupdate, bukan selalu status aplikasi |

Tidak ada base64 file, storage credential, bucket key atau URL publik permanen pada JSON yang dikirim frontend. Mengunduh memakai stream API setelah cek izin; byte response tidak dibungkus envelope JSON.

Kategori berkas mengikuti katalog dokumen per tahap pada referensi, ditambah `ACCOUNT_AUTHORITY` dan kategori hasil cetak yang disahkan. `DISPOSITION_EVIDENCE` untuk bukti persetujuan; `REJECTION_LETTER` dapat sekaligus menjadi bukti keputusan penolakan, tidak wajib menggandakan surat. Server memeriksa category, READY, checksum/version, scope kasus, mandat dan approved evidenceProcedureVersionId dalam transaksi; evidenceChecks adalah attestasi petugas berwenang, bukan bukti kriptografis. `evidenceReview` response berisi hasil gate dan actor/waktu server. Unknown procedure atau pemeriksa tanpa izin ditolak.

`ScanJob`: id, kind:FILE_SCAN, documentVersionId, status:QUEUED/PROCESSING/SUCCEEDED/FAILED, detectedMimeType?, detectedSize?, sha256?, completedAt?, failureCode?, failureReason?. Hanya worker dapat menetapkan READY/REJECTED. Scan failure teknis mempertahankan karantina untuk retry, tidak dianggap file aman. Verifikasi, link bukti, disposisi, finalisasi, signedOutput, print, release dan disclosure hanya menerima versi READY. Verification menyimpan versionId+checksum; file yang kemudian ditarik karena malware membuat verification INVALIDATED dan memblokir penggunaan/unduh, dengan event audit. Kegagalan scan awal tidak pernah menghasilkan verification valid.

### 3.4 Penugasan, jadwal dan prasyarat

| Model | Field dan aturan |
|---|---|
| AssignmentInput | stream:MEDICAL/LEGAL!,members:[{personId,userId?,institutionId,profession,teamRole,mandateId,validFrom,validTo?,conflictOfInterestNote?}]!,assignmentBasisDocumentVersionId? |
| AssignmentView | id,stream,members dengan name/qualification snapshot,compositionCheck:{status,policyVersionId,issues[]},assignedBy,assignedAt,revision |
| ScheduleInput | sessionType:MEDICAL/LEGAL/COMBINED/CONFERENCE!,startsAt:datetime!,endsAt:datetime!,timezone!,mode:IN_PERSON/ONLINE/HYBRID!,location?,privateMeetingLink?,participantPersonIds[],reasonForAlternativeMode?,supportingDocumentVersionIds[] |
| ScheduleView | id,ScheduleInput,status:SCHEDULED/RESCHEDULED/CANCELLED/HELD,invitationDocumentVersionIds[],deliverySummary[],supersedesScheduleId?,revision |
| RescheduleInput | replacement:ScheduleInput!,reason!; tidak menghapus sesi lama |
| AttendanceInput | entries:[{personId,status:PRESENT/ABSENT/REMOTE_PRESENT,arrivedAt?,reason?,evidenceDocumentVersionId?}]! |
| SafeguardInput | noFeeStatementDocumentVersionId?,childAssent:{state:PENDING/AGREED/DECLINED/NOT_APPLICABLE,readByPersonId?,readAt?,childIdentitySnapshotId?,guardianPersonId?,relationship?,witnessPersonId?,signedDocumentVersionId?},companions:[{personId,role,organizationId?,basisDocumentVersionId?,sessionIds[]}],interpreter:{need:YES/NO/NOT_ASSESSED,personId?,languages[],assignmentDocumentVersionId?,sessionIds[]},notes? |
| SafeguardView | SafeguardInput + checks[],recordedBy,recordedAt,revision; DECLINED tidak dianggap terpenuhi |
| SessionStartInput | scheduleId!,attendanceRevision!,safeguardRevision! |
| SessionView | id,scheduleId,stream,startedAt,endedAt?,actualParticipants[],status,revision |
| SessionCompleteInput | endedAt:datetime!,participationEvidenceDocumentVersionIds[],note?; selesai sesi tidak otomatis final asesmen |
| EmergencyReferralInput | occurredAt:SourceTime!,recordedObservation!,authorizedResponderPersonId!,actionTaken!,destination?,evidenceDocumentVersionIds[]; dokumentasi tindakan profesional, bukan rekomendasi algoritme |


---

<a id="section-005"></a>

## 4. Model data Medis dan Hukum

### 4.1 Sesi, jawaban dan versi

| Model | Field dan aturan |
|---|---|
| AssessmentCreateInput | stream:MEDICAL/LEGAL!,templateVersionId!,selectionPolicyVersionId!,sessionId!,examinerAssignmentIds[]! |
| AssessmentView | id,applicationId,stream,templateVersionId,status:NOT_STARTED/DRAFT/PENDING_REVIEW/FINAL/AMENDMENT_REQUIRED/SUPERSEDED,currentVersionId,revision,examiners[],sessionIds[],completion:{answered,applicable,unresolved},reviewEvidence[],allowedActions[] |
| Answer | itemId!,sourceCode?,period?,matrixColumn?,repeatIndex:integer!,answerState:ANSWERED/UNANSWERED/DECLINED/NOT_APPLICABLE/UNKNOWN!,value:any?,sourceSpecialCode?,note?; value divalidasi per item, bukan any bebas |
| AnswerPatchInput | operations:[{op:UPSERT/REMOVE,itemId,period?,matrixColumn?,repeatIndex,value?,answerState?,sourceSpecialCode?,note?}]!; hanya draf, unique tuple per item/period/column/repeat |
| AnswerSaveResult | assessmentId,revision,savedAt,savedKeys[],validationIssues[],completion; savedAt hanya setelah commit |
| ClinicalConclusionInput | diagnoses:[{system:ICD10/PPDGJIII/DSM5,referenceVersionId,code,label,isPrimary,clinicalRationale}]!,usagePattern?,medicalFacts!,problemSummary!,proposedTherapies[],proposedServiceType?,proposedDuration:{value:decimal-string,unit:DAYS/WEEKS/MONTHS/SESSIONS}?,rationale!,labResultRefs[],sourceDocumentVersionIds[] |
| PlacementInput | templateVersionId!,dimensions:[{dimensionId!,selectedIndicatorIds[],assessedSeverity:0..4!,evidenceNotes!,examinerAssignmentId!}],professionalProposal:{serviceLevel:0..4,rationale,discordanceReview,consultationPersonIds[],explainedToClientAt?,clientResponse?}; proposal dipilih manusia |
| AssessmentReviewInput | assessmentVersionId!,reviewType:CONTENT_REVIEW/SIGNATURE_EVIDENCE!,result:CONFIRMED/CHANGES_REQUESTED!,note?,evidenceDocumentVersionIds[]; reviewer dari session berpenugasan |
| FinalizeInput | confirm:true!,expectedAssessmentVersionId!,reviewRecordIds[],signedFormDocumentVersionIds[],completionPolicyVersionId!; referensi harus aktif, sesuai tim, dan sesuai requirement template |
| FinalizeResult | assessmentId,status:FINAL,finalVersionId,revision,finalizedBy,finalizedAt,applicationReadiness:{medicalFinal,legalFinal,conferenceReady,blockers[]} |
| AmendmentInput | baseFinalVersionId!,reason!,scopeOfCorrection!,supportingDocumentVersionIds[] |
| AmendmentResult | assessmentId,newDraftVersionId,baseFinalVersionId,status:DRAFT,revision,downstreamImpacts[]; versi final lama tetap arsip, dependency baru bisa menjadi stale |

Conclusion dan placement juga memuat `provenance:{authoringMode:HUMAN_AUTHORED!,authorAssignmentId!,sourceAnswerVersionIds[],sourceDocumentVersionIds[]}`. Server memastikan assignment terhubung ke session petugas Medis; recordedBy/timestamp tidak diterima dari client. Policy/worker hanya memeriksa schema, visibility, applicability, rentang, dan kelengkapan, tidak menulis diagnosis/severity final/terapi/penempatan/durasi. Payload automation yang tidak disetujui ditolak `CLINICAL_AUTOMATION_NOT_ALLOWED`; menyebut HUMAN_AUTHORED tidak menggantikan pengecekan actor.

`value` yang diizinkan: string, integer, decimal-string, boolean, option code, option code array, atau object yang schema-nya didefinisikan template. Satu tipe per item. Perubahan template bukan sekadar menambah field pada record final.

Untuk ASI gunakan pilihan/kode sumber per item; X/N/NN/00 tidak mempunyai makna global yang sama. Instruksi, header skala, tanda tangan dan referensi diagnosis tidak menghasilkan `Answer`. `0` bukan kosong, `NOT_TESTED` bukan hasil lab negatif.

### 4.2 Rincian medis yang harus muncul pada UI

Identitas/sesi, ASI versi yang dipilih, status medis, pekerjaan/dukungan, zat/alkohol (periode 30 hari dan sepanjang hidup), riwayat legal dalam instrumen medis, keluarga/sosial, psikiatris, pemeriksaan fisik, urinalisis, diagnosis, ringkasan, rencana terapi dan instrumen penempatan. Seluruh label/opsi sumber tersedia pada inventaris Lampiran 7.1/7.2/9/10 di bagian belakang.

Skala klien 0 sampai 4 tidak digabung dengan ringkasan severity 0 sampai 9. Matriks enam dimensi bukan mesin diagnosis atau mesin pemilihan hospitalisasi. Backend boleh memeriksa rentang/kelengkapan, bukan memutuskan rawat inap/UGD/durasi.

Tidak ada default â€œdiagnosis F15.2â€, â€œrawat inap enam bulanâ€, atau hasil psikiatris normal. Evidence profesional dan peninjauan wajib sesuai policy sebelum finalisasi.

### 4.3 Model hukum

| Model | Field dan aturan |
|---|---|
| LegalInterviewInput | intervieweePersonId!,intervieweeType:OFFICER/INVESTIGATOR/PROSECUTOR/CLIENT/OTHER!,conductedAt:SourceTime!,sequence:integer!,narrative!,documentVersionRefs[],deviationReason? |
| LegalCheckInput | checkType:SIPP/INTELLIGENCE/PRIOR_TAT/ELECTRONIC_EVIDENCE/OTHER!,state:NOT_PERFORMED/PERFORMED/INCONCLUSIVE!,sourceReference?,checkedAt:SourceTime?,findings?,limitations!,authorityReference?,evidenceDocumentVersionIds[]; tidak dilakukan tidak menjadi hasil negatif |
| LegalConclusionInput | factualFindings!,allegedArticlesReviewed[],roleAnalysis:{conclusion,basis},networkAnalysis:{conclusion:INDICATION_FOUND/NO_INDICATION_FOUND/INCONCLUSIVE,basis,sourceCheckIds[]},evidenceAssessment:{items[],referenceVersionId?,limitations},legalHistorySummary?,legalContinuationProposal!,placementConsiderations?,rationale!,sourceDocumentVersionIds[] |
| LegalRecordView | id,assessmentId,type,payload,createdBy,createdAt,updatedAt,revision |

Form identitas hukum, riwayat tindak pidana/penahanan/persidangan, tujuan penguasaan zat, cara pembelian/pembayaran, harga/frekuensi dan kesimpulan tetap mengikuti Lampiran 8. Sebagian field masuk jawaban instrumen; struktur analisis tambahan di atas untuk provenance dan pelaporan, tidak mengganti label source.

Wawancara petugas/penyidik/JPU mendahului terperiksa sesuai sumber; server menandai deviasi dari waktu, bukan merekayasa timestamp. Medis tidak menulis kesimpulan Hukum dan sebaliknya.


---

<a id="section-006"></a>

## 5. Model pembahasan, keluaran, rehab, laporan

| Model | Field dan aturan |
|---|---|
| ConferenceHeldInput | scheduleId!,heldAt:SourceTime!,chair:ExternalAuthority!,attendeePersonIds[],attendanceEvidenceDocumentVersionIds[],medicalFinalVersionId!,legalFinalVersionId!,discussionNotes!,divergentOpinions[] |
| ConferenceView | id,applicationId,status:HELD/CLARIFICATION_REQUIRED/OUTCOME_RECORDED_FOR_DRAFT,heldAt,chair,assessmentVersionRefs,revision,clarifications[],stale |
| ClarificationInput | targetStream:MEDICAL/LEGAL!,question!,relatedAssessmentVersionId!,requestedEvidence? |
| ClarificationCloseInput | clarificationId!,answerReference!,reviewedAssessmentVersionId!,additionalConferenceEvidenceDocumentVersionIds[],reason! |
| OutcomeForDraftInput | conferenceRevision!,medicalFinalVersionId!,legalFinalVersionId!,externalDecider:ExternalAuthority!,decidedAt:SourceTime!,confirmationEvidenceDocumentVersionIds[],recordingProcedureVersionId!,conclusion:{clientCategory?,medicalSummary,legalSummary,diagnosisRefs[],networkConclusion},recommendation:RecommendationDecision!,divergenceReason? |
| DecisionSnapshot | id,version,state:FOR_DRAFT/SIGNED_EVIDENCE_CONFIRMED/SUPERSEDED,assessmentVersionRefs,conferenceId,payload:OutcomeForDraftInput,recordedBy,recordedAt,finalDecisionEvidenceDocumentVersionId?,stale |
| ResultDraftInput | decisionSnapshotId!,templateVersionIds:{minutes!,responseLetter!},recipientSnapshot!,approvedReferenceSetId!,authorizedCopyRecipients[] |
| ResultDraftJob | id,status:QUEUED/PROCESSING/SUCCEEDED/FAILED,sourceSnapshotIds,outputDocumentVersionIds[],error?; watermark DRAF |
| SignedOutputInput | decisionSnapshotId!,documentKind:TAT_MINUTES/RESPONSE_LETTER!,uploadedDocumentVersionId!,outputOrigin:GENERATED_DRAFT/EXTERNAL_AUTHORED!,correspondingDraftVersionId?,externalAuthorshipBasis?,signatories:[{personId,mandateId,positionSnapshot,tatLevel,signedAt?,method}],declaredDocumentNumber!,declaredDocumentDate! |
| SignatureReviewInput | signedOutputId!,procedureVersionId!,result:ACCEPTED/REJECTED!,checks:{identityConsistent,mandateValid,contentConsistent,datesConsistent,requiredSignatoriesPresent},note!,evidenceDocumentVersionIds[]; accepted adalah pemeriksaan sesuai SOP, bukan otomatis TTE valid |
| ReleaseInput | decisionSnapshotId!,minutesSignedOutputId!,responseSignedOutputId!,expectedMedicalFinalVersionId!,expectedLegalFinalVersionId!,signatureReviewIds[],recipients[]! |
| ReleaseView | id,applicationId,decisionSnapshotId,assessmentVersionRefs,minutesDocumentVersionId,responseLetterDocumentVersionId,status:ISSUED/SUPERSEDED,issuedBy,issuedAt,revision,supersedesReleaseId?,staleReviewFlag |
| DeliveryInput | releaseId!,recipient:{organizationId,personId?,userId?},channel:IN_APP/HANDOVER/OFFICIAL_EMAIL/OTHER!,sentAt?:SourceTime,evidenceDocumentVersionId? |
| AcknowledgementInput | deliveryId!,acknowledgedAt?:SourceTime,evidenceDocumentVersionId?,note?; bila Admin mencatat offline, bukti sesuai SOP |
| FollowupInput | releaseId!,executionClaim:NOT_YET_REPORTED/REPORTED_IMPLEMENTED/REPORTED_NOT_IMPLEMENTED!,facilitySnapshot?,coordinationAt?:SourceTime,handoverAt?:SourceTime,admissionAt?:SourceTime,actualServiceType?,actualStart?:date,actualEnd?:date,handoverDocumentVersionId?,progressNote?,obstacle:{code,description,proposedAction}?,evidenceDocumentVersionIds[],eventOccurredAt:SourceTime!,informationSource! |
| FollowupView | id,applicationId,releaseId,reportedPayload,reportedBy,recordedAt,verificationStatus:PENDING/VERIFIED_IMPLEMENTED/VERIFIED_NOT_IMPLEMENTED/CLARIFICATION_REQUIRED,verifiedBy?,verifiedAt?,revision |
| FollowupVerificationInput | outcome:VERIFIED_IMPLEMENTED/VERIFIED_NOT_IMPLEMENTED/CLARIFICATION_REQUIRED!,reason!,evidenceDocumentVersionIds[] |
| ExternalReferralInput | releaseId?,destinationOrganizationId!,purpose:REHAB/IMMIGRATION/COURT/OTHER!,basis!,sentAt:SourceTime!,evidenceDocumentVersionIds[],acknowledgementDocumentVersionId? |
| ReportRequest | type:MONTHLY/QUARTERLY/ANNUAL!,periodStart:date!,periodEnd:date!,tatUnitId!,datasetPolicyVersionId!,recipientPolicyVersionId?,format:PDF/CSV/XLSX! |
| ReportJob | id,status,period,scope,snapshotAt,datasetVersionId?,recordCount?,artifactDocumentVersionId?,redactionProfile,error? |
| RecordAccessRequestInput | purpose!,legalOrInstitutionalBasis!,requestedRecordScope!,applicationIds[],writtenRequestDocumentVersionId!,requestingOrganizationId! |
| RecordAccessGrantInput | requestId!,externalAuthority:ExternalAuthority!,decisionEvidenceDocumentVersionId!,approvedScope!,expiresAt:datetime!,conditions! |
| DisclosureView | id,requestId,grantId,approvedFieldsAndDocuments,recipient,deliveredAt?,expiresAt,auditReference |

BA yang sudah ditandatangani dapat menjadi bukti keputusan final. Jangan membuat circular dependency â€œBA hanya bisa dibuat setelah ada BA bertanda tanganâ€. Outcome untuk draf â†’ draf BA â†’ tanda tangan eksternal â†’ review â†’ release adalah alur yang benar. Catatan Ketua untuk draf mengikuti SOP; **tidak diwajibkan surat keputusan tambahan yang tidak ada di buku**.

`RecommendationDecision`: disposition:RECOMMENDED/NOT_RECOMMENDED/CONDITIONAL/NOT_APPLICABLE!, serviceType:OUTPATIENT/INTENSIVE_OUTPATIENT/RESIDENTIAL/INPATIENT/OTHER/NOT_APPLICABLE?, placementContext:REHABILITATION_FACILITY/LAPAS_RUTAN/OTHER/NOT_APPLICABLE?, duration:{value:decimal-string,unit:DAYS/WEEKS/MONTHS/SESSIONS}?, facilitySnapshot?, legalContinuation:{outcome:CONTINUE/OTHER_AUTHORIZED_ACTION/NOT_APPLICABLE,basis}!, reportingObligation?, conditions[], rationale!, basis:{evidenceCategory:NO_EVIDENCE/BELOW_SEMA/EQUAL_SEMA/ABOVE_SEMA/NOT_REGULATED/UNRESOLVED,labResultRefs[],networkConclusion,route,nationalityBranch:DOMESTIC/WNA/UNRESOLVED}!, sourceDocumentVersionIds[],policyVersionId!.

Durasi/fasilitas wajib bila ditetapkan pada hasil dan diperlukan template; null tidak berarti â€œbebas pilih nantiâ€. Conditional harus menyebut kondisi dan otoritas tindak lanjut. Perbedaan tepat sama ambang atau nationality belum jelas memerlukan telaah. Lapas/Rutan adalah konteks penempatan, bukan disamakan dengan intensitas layanan medis. Model mendokumentasikan keputusan manusia, tidak menghitung cabang hasil dari boolean.

Jika generated draft dipakai, correspondingDraftVersionId wajib dan cocok source snapshot/category. Jika external authored, externalAuthorshipBasis wajib dan reviewer merekonsiliasi isi dengan decision snapshot. Saat release sukses, transaksi menetapkan `DecisionSnapshot.state=SIGNED_EVIDENCE_CONFIRMED` serta finalDecisionEvidenceDocumentVersionId ke BA bertanda tangan yang diterima.


---

<a id="section-007"></a>

## 6. Katalog endpoint kanonis

Semua path di bawah diawali `/api/v1`. Referensi model menggunakan tabel di atas; seluruh JSON response sukses dibungkus envelope kecuali 204/byte stream. `List<T>` berarti `data:T[]` dengan pagination standar. `CommandResult<T>` berarti resource/event yang disebut plus applicationRevision jika mengubah gate aplikasi.

Kode error spesifik pada tabel melengkapi error umum autentikasi, otorisasi, request validation, revision, rate limiting dan idempotency. Endpoint draf boleh menyimpan data parsial; endpoint command memeriksa gate.

### 6.1 Akun, session, master dan policy

| Method/path | Role/scope | Request | Sukses | Error khusus |
|---|---|---|---|---|
| POST /auth/login | Akun terverifikasi | {email:string!,password:string!} | 200 {user:{id,name,role,organization},sessionExpiresAt}; cookie, tanpa password/token di body | AUTHENTICATION_FAILED (pesan generik), ACCOUNT_INACTIVE |
| GET /auth/me | Session aktif | Tidak ada | 200 {id,name,role,organization,permissions[],sessionExpiresAt} | SESSION_EXPIRED |
| POST /auth/logout | Session aktif | {} | 204, cookie dicabut | Error CSRF |
| POST /account-requests | Registrasi Pengaju, rate limited | AccountRequestInput | 201 {id,status:CONTACT_PENDING,challengeToken,challengeExpiresAt}; challengeToken adalah handle, kode verifikasi dikirim ke kanal dan tidak ada di response | ORGANIZATION_NOT_ELIGIBLE |
| POST /account-requests/{id}/contact-verifications | Token scoped proses pendaftaran | {challengeToken!,verificationCode!} | 200 {contactVerificationId,status:VERIFIED}; grant upload pendek via cookie scoped, bukan akses kasus | CONTACT_VERIFICATION_FAILED, rate limit |
| POST /account-requests/{id}/upload-intents | Kanal terverifikasi dengan grant scoped | {category:ACCOUNT_AUTHORITY!,filename!,declaredMimeType!,declaredSize!} | 201 UploadIntent owner ACCOUNT_REQUEST | CONTACT_NOT_VERIFIED |
| POST /account-requests/{id}/submit-for-review | Kanal terverifikasi/grant scoped | {authorityDocumentVersionIds[]!,contactVerificationId!} | 200 AccountRequestView PENDING_REVIEW; hanya versi READY | AUTHORITY_EVIDENCE_REQUIRED |
| GET /account-requests | Admin scope | Query status,cursor,limit | 200 List<AccountRequestView> (field input non-secret + reviewer/status) | FORBIDDEN |
| POST /account-requests/{id}/reviews | Admin berizin | {outcome:APPROVED/REJECTED!,reason!,scopeOrganizationId!,evidenceDocumentVersionIds[]} | 200 {id,status,reviewedAt,provisioningStatus,provisioning:{role:PENGAJU,personId,userId?,enrollmentStatus}}; approved mengirim enrollment sekali pakai | AUTHORITY_EVIDENCE_REQUIRED |
| POST /users/invitations | Admin berizin provisioning | {personId!,email!,role:MEDIS/HUKUM/ADMIN!,organizationId!,mandateId!,reason!} | 201 {invitationId,status:SENT_OR_QUEUED,expiresAt}; tidak mengembalikan secret invite token | ROLE_GRANT_NOT_ALLOWED |
| POST /auth/enrollments/complete | Token sekali pakai | {token!,password!} melalui TLS; dilarang log | 204, akun aktif; login tetap endpoint terpisah | TOKEN_EXPIRED_OR_USED |
| GET /tat-units | Session/scope | Query level,search,cursor,limit | 200 List<{id,name,level,provinceCode,districtCode,active}> | INVALID_FILTER |
| GET /organizations | Session/scope | Query type,search,cursor,limit | 200 List<{id,name,type,active}> | INVALID_FILTER |
| GET /persons | Admin atau tim sesuai penugasan | Query organizationId,mandateType,cursor,limit | 200 List<{id,name,position,organizationId,mandateSummary}> | FORBIDDEN |
| POST /persons | Admin scope | {name!,organizationId!,position!,personType!,contact?} | 201 person record (tanpa akun/credential) | INVALID_PERSON_TYPE |
| POST /persons/{id}/mandates | Admin scope | {tatUnitId!,position!,validFrom!,validTo?,documentVersionId!} | 201 {id,personId,status,scope,validFrom,validTo,documentVersionId} | MANDATE_EVIDENCE_REQUIRED |
| GET /routes | Session | Query targetTatUnitId | 200 List<RouteDefinition> | TARGET_SCOPE_INVALID |
| GET /policies/{id} | Admin/detail berizin | Tidak ada | 200 PolicyVersion | POLICY_NOT_VISIBLE |
| POST /policies | Admin konfigurasi | {scope!,sourceReferences[],rules!,unresolvedConflicts[]} | 201 PolicyVersion DRAFT | RULE_SCHEMA_INVALID |
| POST /policies/{id}/approval-evidence | Admin konfigurasi | {externalApprover!,approvalDocumentVersionId!,effectiveFrom!,resolvedConflictReferences[]} | 200 PolicyVersion APPROVED setelah review | UNRESOLVED_POLICY_CONFLICT |
| GET /templates/{id} | Role sesuai kategori | Tidak ada | 200 Template | TEMPLATE_NOT_VISIBLE |
| GET /references/{kind} | Role berizin | kind:regions/diagnosis/substances/units/facilities; query version,cursor | 200 List<{code,label,sourceVersion,referenceOnly,active}> | REFERENCE_VERSION_REQUIRED |

Registrasi publik tidak mengunggah dokumen pribadi secara bebas: awalnya identitas kontak minimum, server mengirim challenge sekali pakai ke kanal terverifikasi (challenge handle bukan secret bukti verifikasi); lalu upload bukti ke resource ACCOUNT_REQUEST melalui grant scoped pendek. Lookup, bytes dan complete upload hanya berlaku untuk owner tersebut. Tidak ada akses kasus dari grant ini. Approval baru mengirim enrollment Pengaju; akun internal diundang Admin berwenang. Provisioning bukan sumber kewenangan profesional.

### 6.2 Pengajuan dan dokumen

| Method/path | Role/scope | Request | Sukses | Error khusus |
|---|---|---|---|---|
| GET /applications | Empat role, scope berbeda | status,route,assignedToMe,cursor,limit 1..100,sort=updatedAt:desc | 200 List<ApplicationSummary> | FILTER_NOT_ALLOWED |
| POST /applications | Pengaju; Admin input atas nama dengan bukti | DraftApplicationInput | 201 ApplicationDetail DRAFT | ROUTE_AUTHORITY_MISMATCH |
| GET /applications/{id} | Pemilik/penugasan | Tidak ada | 200 ApplicationDetail + ETag | 404 di luar scope |
| PATCH /applications/{id}/draft | Pemilik DRAFT/ruang koreksi | DraftPatch + If-Match | 200 ApplicationDetail | EDIT_SCOPE_LOCKED |
| GET /applications/{id}/checklist | Pemilik/Admin/tim sesuai izin | Tidak ada | 200 {templateVersionId,revision,items:ChecklistResponse[],definitions:RequirementDefinition[]} | POLICY_REVIEW_REQUIRED ditampilkan sebagai blocker, bukan selalu HTTP error |
| PATCH /applications/{id}/checklist | Pengaju bagian pelaporan, Admin bagian yang sah | ChecklistPatch | 200 {revision,items,blockers} | CONDITION_FIELD_NOT_WRITABLE |
| POST /applications/{id}/preflight | Pengaju/Admin | {action:SUBMIT/RESUBMIT} | 200 {allowed,blockers[],warnings[],policyVersions}; tanpa mutasi/nomor register | ACTION_NOT_SUPPORTED |
| POST /applications/{id}/submit | Pengaju/pencatat atas nama berwenang | SubmissionCommand + If-Match | 200 SubmissionResult | SUBMISSION_MINIMUM_NOT_MET, INTAKE_POLICY_NOT_APPROVED |
| GET /applications/{id}/timeline | Scope kasus | cursor,limit | 200 List<{eventId,type,occurredAt,recordedAt,actorDisplay,summary,relatedResourceRefs}> | Sensitive events direduksi sesuai izin |
| POST /documents/uploads | Scope owner/category | UploadIntentInput | 201 UploadIntent | CATEGORY_SCOPE_DENIED, SIZE_LIMIT_EXCEEDED |
| POST /uploads/{uploadId}/bytes | Token/session scoped upload | multipart binary + bounded size | 200 {transportReceiptId,receivedSize}; bytes masih quarantined | MIME_MISMATCH, UPLOAD_EXPIRED |
| POST /uploads/{uploadId}/complete | Pemilik upload | CompleteUploadCommand | 202 {documentVersionId,scanStatus:QUARANTINED,scanJobId} | INCOMPLETE_UPLOAD |
| GET /document-versions/{id} | Izin kategori/kasus | Tidak ada | 200 DocumentVersion | 404 di luar scope |
| GET /document-versions/{id}/content | Izin kategori/kasus dicek ulang | Tidak ada | 200 byte stream, MIME dan Content-Disposition; no-store | FILE_NOT_READY, FILE_QUARANTINED |
| PATCH /document-versions/{id}/metadata | Pengunggah/Admin berizin, metadata belum locked | {documentNumber?,documentDate?,issuer?,sourceSignatories?} + If-Match | 200 DocumentVersion | SIGNED_OR_RELEASED_VERSION_IMMUTABLE |
| POST /applications/{id}/document-links | Pengaju/Admin scope | {requirementId!,documentVersionId!,pageStart?,pageEnd?} | 201 {id,requirementId,documentVersionId,pageRange} | DOCUMENT_NOT_READY, CROSS_CASE_LINK_DENIED |

### 6.3 Verifikasi, disposisi, jadwal

| Method/path | Role/scope | Request | Sukses | Error khusus |
|---|---|---|---|---|
| POST /applications/{id}/review/start | Admin scope | {} + If-Match | 200 RevisionResult ADMIN_REVIEW | INVALID_TRANSITION |
| POST /applications/{id}/verifications | Admin scope | VerificationInput | 201 VerificationRecord | DOCUMENT_VERSION_STALE |
| POST /applications/{id}/correction-requests | Admin scope | CorrectionRequestInput | 201 {id,status:OPEN,targets,createdAt,applicationRevision} | TARGET_OUTSIDE_SNAPSHOT |
| POST /applications/{id}/resubmit | Pengaju | CorrectionResponseInput | 200 SubmissionResult status ADMIN_REVIEW | CORRECTION_TARGET_UNRESOLVED |
| POST /applications/{id}/review/complete | Admin scope | {recommendation:APPROVE/REJECT!,summary!,eligibilityPolicyVersionId!} | 200 RevisionResult AWAITING_DISPOSITION | POLICY_REVIEW_REQUIRED, CHECKLIST_UNASSESSED |
| POST /applications/{id}/dispositions | Admin mencatat eksternal | DispositionInput | 201 {disposition:DispositionRecord,applicationStatus,applicationRevision} | CHAIR_EVIDENCE_REQUIRED, MANDATE_INVALID |
| POST /applications/{id}/refer-out-of-scope | Admin | OutOfScopeReferralInput | 201 {referralId,status:OUT_OF_SCOPE_REFERRED,applicationRevision} | INVALID_TRANSITION |
| POST /applications/{id}/registrations | Admin scope setelah APPROVED | {registrationPolicyVersionId!,serviceYear!,regionReferenceVersionId!} | 201 {registrationNumber,allocatedAt,policyVersionId}; server sequence | REGISTER_POLICY_UNRESOLVED, ALREADY_REGISTERED |
| GET /applications/{id}/assignments | Admin dan anggota berizin | Tidak ada | 200 List<AssignmentView> | Scope error |
| POST /applications/{id}/assignments | Admin | AssignmentInput | 201 AssignmentView | TEAM_COMPOSITION_INVALID |
| POST /assignments/{id}/replace | Admin | {replacement:AssignmentInput!,reason!} + If-Match | 201 AssignmentView + supersedesId | ACTIVE_WORK_REASSIGNMENT_POLICY_REQUIRED |
| POST /applications/{id}/schedules | Admin | ScheduleInput | 201 ScheduleView | COMPOSITION_NOT_CONFIRMED, TIME_RANGE_INVALID |
| GET /applications/{id}/schedules | Scope kasus | Query sessionType | 200 List<ScheduleView> | Private link stripped if no permission |
| POST /schedules/{id}/reschedule | Admin | RescheduleInput | 201 ScheduleView | INVALID_TRANSITION |
| POST /schedules/{id}/attendance | Admin/tim diberi izin sesi | AttendanceInput | 200 {scheduleId,entries,revision} | PERSON_NOT_ASSIGNED |
| GET /applications/{id}/safeguards | Admin/tim scope | Tidak ada | 200 SafeguardView | Restricted document refs filtered |
| PATCH /applications/{id}/safeguards | Admin/petugas diberi izin | SafeguardInput + If-Match | 200 SafeguardView | CONSENT_EVIDENCE_MISMATCH |
| POST /applications/{id}/sessions/start | Tim terkait | SessionStartInput | 201 SessionView | SAFEGUARDS_UNRESOLVED, ATTENDANCE_INCOMPLETE |
| POST /sessions/{id}/complete | Tim terkait | SessionCompleteInput | 200 SessionView | SESSION_NOT_STARTED |
| POST /applications/{id}/emergency-referrals | Petugas berwenang, bukan mesin klinis | EmergencyReferralInput | 201 {id,recordedBy,recordedAt,applicationStatusUnchanged:true} | AUTHORIZED_RESPONDER_REQUIRED |

Review `recommendation:REJECT` tetap boleh sampai Ketua ketika hasil pemeriksaan lengkap tetapi syarat tidak terpenuhi. Jangan mewajibkan semua item VALID sehingga penolakan resmi tidak punya jalur.

### 6.4 Asesmen

| Method/path | Role/scope | Request | Sukses | Error khusus |
|---|---|---|---|---|
| POST /applications/{id}/assessments | Medis/Hukum sesuai stream | AssessmentCreateInput | 201 AssessmentView | WRONG_STREAM_ROLE, TEMPLATE_POLICY_UNRESOLVED |
| GET /applications/{id}/assessments | Tim/metadata Admin sesuai izin | Tidak ada | 200 List<AssessmentView> | Payload content dibatasi |
| GET /assessments/{id}/form | Tim stream | Tidak ada | 200 {assessment:AssessmentView,template:AssessmentTemplateView,answers:Answer[]} | CLINICAL_DETAIL_FORBIDDEN |
| PATCH /assessments/{id}/answers | Tim stream, DRAFT | AnswerPatchInput + If-Match assessment | 200 AnswerSaveResult | NON_INPUT_ITEM, INVALID_SPECIAL_CODE, FINAL_VERSION_LOCKED |
| PUT /assessments/{id}/medical-conclusion | Medis | ClinicalConclusionInput + If-Match | 200 {assessmentId,conclusion,revision} | WILDCARD_DIAGNOSIS, WRONG_STREAM_ROLE |
| PUT /assessments/{id}/placement | Medis | PlacementInput + If-Match | 200 {assessmentId,placement,revision}; tidak menghitung rekomendasi | INVALID_INDICATOR_FOR_TEMPLATE |
| POST /assessments/{id}/legal-interviews | Hukum | LegalInterviewInput | 201 LegalRecordView | INTERVIEW_ORDER_REVIEW_REQUIRED sebagai warning/blocker policy |
| POST /assessments/{id}/legal-checks | Hukum | LegalCheckInput | 201 LegalRecordView | PERFORMED_CHECK_REQUIRES_SOURCE |
| PUT /assessments/{id}/legal-conclusion | Hukum | LegalConclusionInput + If-Match | 200 {assessmentId,conclusion,revision} | SOURCE_CHECK_REFERENCE_INVALID |
| POST /assessments/{id}/reviews | Anggota tim yang berwenang | AssessmentReviewInput | 201 {id,reviewer,reviewedAt,result,assessmentVersionId} | REVIEWER_NOT_ELIGIBLE, STALE_VERSION |
| POST /assessments/{id}/finalize | Tim stream | FinalizeInput + If-Match | 200 FinalizeResult | INCOMPLETE_ASSESSMENT, REQUIRED_REVIEW_MISSING |
| POST /assessments/{id}/amendments | Tim stream, FINAL | AmendmentInput + If-Match | 201 AmendmentResult | AMENDMENT_AUTHORITY_REQUIRED |
| GET /assessments/{id}/authorized-summary | Tim lain/Admin hanya izin ringkasan | Tidak ada | 200 {assessmentId,finalVersionId,stream,approvedSummary,redactionProfile} | SUMMARY_ACCESS_NOT_GRANTED |

### 6.5 Pembahasan sampai release

| Method/path | Role/scope | Request | Sukses | Error khusus |
|---|---|---|---|---|
| POST /applications/{id}/conferences | Admin | ConferenceHeldInput | 201 ConferenceView HELD | ASSESSMENTS_NOT_FINAL, CHAIR_MANDATE_INVALID |
| POST /conferences/{id}/clarifications | Admin | ClarificationInput | 201 {id,status:OPEN,conferenceRevision,targetStream} | INVALID_REFERENCE |
| POST /conferences/{id}/clarifications/{clarificationId}/close | Admin berdasarkan jawaban tim | ClarificationCloseInput | 200 {id,status:CLOSED,conferenceRevision} | ANSWER_EVIDENCE_REQUIRED |
| POST /conferences/{id}/outcomes | Admin mencatat eksternal | OutcomeForDraftInput + If-Match | 201 DecisionSnapshot FOR_DRAFT | OPEN_CLARIFICATION, OUTCOME_EVIDENCE_REQUIRED |
| POST /applications/{id}/result-drafts | Admin | ResultDraftInput | 202 ResultDraftJob | TEMPLATE_NOT_APPROVED, DECISION_STALE |
| POST /applications/{id}/signed-outputs | Admin | SignedOutputInput | 201 {id,status:PENDING_REVIEW,documentVersionId,decisionSnapshotId,revision} | FILE_NOT_READY, WRONG_DOCUMENT_KIND |
| POST /signed-outputs/{id}/reviews | Admin authorized SOP reviewer | SignatureReviewInput | 201 {id,result,reviewedBy,reviewedAt,procedureVersionId} | SIGNATURE_REVIEW_POLICY_NOT_APPROVED |
| POST /applications/{id}/releases | Admin | ReleaseInput + If-Match | 201 ReleaseView | SIGNED_OUTPUTS_INCOMPLETE, CONTENT_MISMATCH, DECISION_STALE |
| GET /applications/{id}/releases | Scope penerima/penugasan | Tidak ada | 200 List<ReleaseView> | Dokumen refs sesuai paket yang diizinkan |
| POST /releases/{id}/deliveries | Admin | DeliveryInput | 201 {id,status:PENDING/SENT,recipient,sentAt?,revision} | RECIPIENT_NOT_AUTHORIZED |
| POST /deliveries/{id}/acknowledgements | Penerima/Admin offline evidence | AcknowledgementInput | 201 {id,deliveryId,acknowledgedAt,recordedBy,evidenceDocumentVersionId?} | DELIVERY_RECIPIENT_MISMATCH |

Tidak ada draft dan signedOutput yang dianggap sama hanya karena filename sama. `correspondingDraftVersionId` membantu pemeriksaan isi. Jika seluruh dokumen ditulis di luar aplikasi, authorized reviewer tetap merekonsiliasi dokumen dengan snapshot hasil, menyimpan hasil pemeriksaan, dan bukan mengaku hash PDF identik.

### 6.6 Tindak lanjut, laporan, permintaan akses

| Method/path | Role/scope | Request | Sukses | Error khusus |
|---|---|---|---|---|
| POST /applications/{id}/followups | Pengaju/Admin input dengan sumber | FollowupInput | 201 FollowupView | RELEASE_REQUIRED, UNSOURCED_IMPLEMENTATION_CLAIM |
| GET /applications/{id}/followups | Scope berizin | cursor,limit | 200 List<FollowupView> | Scope error |
| POST /followups/{id}/verifications | Admin | FollowupVerificationInput + If-Match | 200 FollowupView | EVIDENCE_INSUFFICIENT |
| POST /applications/{id}/external-referrals | Admin/Pengaju sesuai mandat | ExternalReferralInput | 201 {id,purpose,destination,recordedBy,recordedAt} | REFERRAL_AUTHORITY_REQUIRED |
| POST /reports | Admin report scope | ReportRequest | 202 ReportJob | REPORT_SCOPE_DENIED, RECIPIENT_POLICY_UNRESOLVED |
| GET /reports/{id} | Requester/izin laporan | Tidak ada | 200 ReportJob | Scope error |
| GET /reports/{id}/content | Izin scope dicek ulang | Tidak ada | 200 byte stream | REPORT_NOT_READY |
| POST /record-access-requests | Pengguna yang boleh mengajukan permintaan | RecordAccessRequestInput | 201 {id,status:PENDING_EXTERNAL_AUTHORIZATION,requestedScope,createdAt} | WRITTEN_REQUEST_REQUIRED |
| POST /record-access-requests/{id}/grants | Admin merekam otorisasi | RecordAccessGrantInput | 201 {id,status:ACTIVE,scope,expiresAt}; tetap bukan share publik | AUTHORIZATION_EVIDENCE_REQUIRED |
| POST /record-access-requests/{id}/disclosures | Admin disclosure scope | {grantId!,recipient!,documentVersionIds[],fieldSelection!,reason!} | 202 {jobId,status:QUEUED,grantId} | GRANT_EXPIRED, EXCEEDS_APPROVED_SCOPE |
| GET /disclosures/{id} | Penerima/pengawas izin | Tidak ada | 200 DisclosureView | GRANT_EXPIRED |
| GET /applications/{id}/audit | Admin audit scope/tim atas kejadian yang diizinkan | cursor,limit | 200 List<{id,type,actor,occurredAt,recordedAt,resourceRefs,reason}> | Tidak mengembalikan dump raw medis |
| GET /jobs/{id} | Pemilik job/izin scope | Tidak ada | 200 {id,kind,status,progress?,outputRefs[],error?} | Output hanya dapat diakses jika izin masih aktif |

Katalog ini mencakup alur MVP. Modul honorarium, reimbursement dan scoring monev otomatis belum mempunyai endpoint produksi pada MVP, meskipun field sumbernya ada di lampiran. Integrasi BOSS/SIN/intelijen belum memiliki kontrak eksternal yang diverifikasi.


---

<a id="section-008"></a>

## 7. Status, gates, dan dampak ke UI

| Status aplikasi | Tombol utama berizin | Next status / hasil |
|---|---|---|
| DRAFT | Pengaju: simpan, periksa, kirim | SUBMITTED |
| SUBMITTED | Admin: mulai verifikasi | ADMIN_REVIEW |
| ADMIN_REVIEW | Admin: minta koreksi / selesai telaah / rujuk non-TAT | NEEDS_CORRECTION / AWAITING_DISPOSITION / OUT_OF_SCOPE_REFERRED |
| NEEDS_CORRECTION | Pengaju: tanggapi dan kirim ulang | ADMIN_REVIEW |
| AWAITING_DISPOSITION | Admin: catat keputusan Ketua dengan bukti | APPROVED / REJECTED |
| APPROVED | Admin: registrasi, penugasan, jadwal | SCHEDULED setelah kelengkapan |
| SCHEDULED | Tim: mulai sesi sesuai prasyarat | ASSESSMENT_ACTIVE |
| ASSESSMENT_ACTIVE | Tim: simpan/finalisasi | READY_FOR_CONFERENCE dihitung server bila gate terpenuhi |
| READY_FOR_CONFERENCE | Admin: catat pembahasan dilaksanakan | CONFERENCE_HELD |
| CONFERENCE_HELD | Admin: klarifikasi / catat hasil untuk draf | CONFERENCE_CLARIFICATION_REQUIRED / OUTCOME_RECORDED_FOR_DRAFT |
| CONFERENCE_CLARIFICATION_REQUIRED | Tim: jawaban/amendemen; Admin: tutup klarifikasi setelah telaah | CONFERENCE_HELD |
| OUTCOME_RECORDED_FOR_DRAFT | Admin: buat draf keluaran | AWAITING_SIGNED_OUTPUTS |
| AWAITING_SIGNED_OUTPUTS | Admin: unggah, periksa, terbitkan | RESULTS_ISSUED |
| RESULTS_ISSUED | Admin/Pengaju: penyerahan dan tindak lanjut | Status aplikasi tetap; substatus berubah |
| REJECTED / OUT_OF_SCOPE_REFERRED | Baca arsip/lihat bukti; pengajuan terkait baru bila diperlukan | Tidak bisa lanjut asesmen secara paksa |

`POLICY_REVIEW_REQUIRED` adalah blocker terstruktur, bukan aksi force atau status pengganti seluruh model. Bila kelayakan belum disahkan, data masuk boleh dicatat sesuai intake policy tetapi disposisi/penjadwalan tidak dilompati.

Enum status utama adalah seluruh status pada tabel di atas (dengan REJECTED dan OUT_OF_SCOPE_REFERRED terpisah). MedicalStatus/LegalStatus mengikuti status AssessmentView; jika belum ada assessment nilainya NOT_STARTED. `SUPERSEDED` hanya versi sejarah, status stream aktif mengikuti versi terkini dan final readiness.

`DeliveryStatus`: NOT_APPLICABLE (terminal non-release), NOT_ISSUED (proses berjalan), ISSUED_NOT_DELIVERED (release ada), PARTIALLY_DELIVERED (sebagian penerima wajib), DELIVERED (semua kiriman wajib tercatat), ACKNOWLEDGED (semua penerima wajib mengakui sesuai policy). Gagal kirim disimpan pada Delivery, tidak dianggap diterima.

`FollowupStatus`: NOT_APPLICABLE_YET (sebelum release), NOT_APPLICABLE (keputusan/policy menyatakan tidak ada tindak lanjut relevan), NOT_YET_REPORTED, REPORTED_PENDING_VERIFICATION, VERIFIED_IMPLEMENTED, VERIFIED_NOT_IMPLEMENTED, CLARIFICATION_REQUIRED. Tidak rehab tidak otomatis NOT_APPLICABLE karena tindak lanjut hukum masih mungkin. Aggregate dihitung dari release aktif dan laporan relevan, tidak diambil dari satu baris acak.

Generate draf bersifat asinkron: OUTCOME_RECORDED_FOR_DRAFT tetap selama QUEUED/PROCESSING/FAILED, job failure menjadi blocker `DRAFT_GENERATION_FAILED` yang bisa dicoba ulang dengan idempotency baru. Transisi AWAITING_SIGNED_OUTPUTS setelah kedua draf sukses. Untuk external-authored outputs yang diperbolehkan SOP, penerimaan pasangan file READY yang terkait snapshot dapat menyiapkan tahap ini tanpa memaksa dua draf generator; signature reviews dan release gates tetap wajib.

Penetapan status `READY_FOR_CONFERENCE` memeriksa policy finalisasi, versi final kedua stream, tim dan bukti pengesahan yang diwajibkan template. Memulai sesi bukan memfinalisasi asesmen. Emergency event tidak membuat gate otomatis lulus.

Sumber waktu penting: SP terbit, penangkapan, submit, pelaksanaan asesmen terpadu, keputusan diterbitkan. Kebijakan anchor/cut-off untuk â€œhari keenamâ€ dan â€œ3 hari setelah asesmenâ€ masih K. Perbaikan/reschedule tidak reset waktu. `deadline.status=UNRESOLVED_POLICY` lebih jujur daripada tanggal palsu.

### Konkurensi dan perubahan data

Setiap finalisasi mengunci jawaban dan conclusion versi itu. Amendemen membuat draf baru, bukan edit final. Jika tahap sudah melewati assessment, catat `STALE_DEPENDENCY` pada conference/decision; draf/release baru diblokir sampai ditelaah. Hasil yang sudah terbit tetap artefak sejarah, diberi `staleReviewFlag` dan ditindaklanjuti sesuai kebijakan, tidak dihapus.

Untuk hasil pengganti, gunakan policy amendment yang disahkan: rangkaian amendemen â†’ telaah pembahasan baru â†’ snapshot keputusan baru â†’ keluaran signed baru â†’ release dengan `supersedesReleaseId` yang diverifikasi server. Jalur ini tidak menimpa signedOutput lama dan tidak menyatakan hasil lama batal secara hukum tanpa bukti berwenang. Detail perintah approval amendemen merupakan K; MVP dapat menolak dengan `AMENDMENT_POLICY_REQUIRED` sampai policy aktif.


---

<a id="section-009"></a>

## 8. Response frontend: tepat data yang dibutuhkan

| Layar | Data dari response | Yang sengaja tidak dikembalikan |
|---|---|---|
| Daftar Pengaju | Tracking/register, alias/nama sesuai izin, route, status, nextAction, tenggat yang valid | Jawaban medis, catatan internal, data pengaju lain |
| Wizard pengajuan | Draft snapshot, RouteDefinition, ChecklistResponse, upload statuses | Keputusan/diagnosis yang bisa diedit pemohon |
| Verifikasi Admin | Berkas administratif, item requirement, hasil condition assessment, versi | Raw medis lengkap secara default |
| Dashboard Medis | Kasus yang ditugaskan, sesi, template, kemajuan draf | Seluruh perkara wilayah tanpa penugasan |
| Form Medis | Template dan jawaban stream, conclusion, placement, review | Wewenang mengubah Hukum |
| Form Hukum | Template hukum, perkara, wawancara/penelusuran | Raw psikiatris/ASI yang tidak diizinkan |
| Pembahasan | Ringkasan final yang diizinkan, versi, Chair mandate, klarifikasi | Edit bebas hasil klinis/hukum |
| Penerbitan | Snapshot keputusan, dokumen draft/signed, signatureReview, readiness | Tombol mengesahkan sebagai Ketua |
| Rehab/tindak lanjut | Klaim Pengaju, sumber fasilitas, bukti, verifikasi | Asumsi fasilitas sudah menerima hanya karena rujukan dicetak |

Endpoint detail biasa tidak mengirim `answers:[]` untuk tim lain karena kosong dapat dibaca sebagai tidak ada data. Gunakan `visibility:{medicalDetail:"NOT_GRANTED"}` dan hilangkan payload terlindungi. Response list dan error tidak membocorkan jumlah kasus di luar scope.

Role switching hanya ada pada fixture pengujian, bukan session produksi. Scope lintas wilayah dapat diberikan lewat mandat eksplisit; wilayah bukan satu-satunya dasar izin.


---

<a id="section-010"></a>

## 9. Rancangan cetak dan PDF

**Cetak tidak identik dengan dokumen resmi.** Aplikasi mempunyai tiga mode:

1. `PREVIEW`: HTML/PDF review berwatermark â€œPRATINJAUâ€.
2. `DRAFT`: dokumen untuk diperiksa/ditandatangani, berwatermark â€œDRAFâ€ sesuai konfigurasi yang disahkan.
3. `ARCHIVED_COPY`: unduh/cetak salinan file final yang sudah diperiksa dan diarsipkan. Tidak menghapus watermark dari draf lalu menganggapnya sah.

Data sintetis selalu diberi â€œSIMULASI / BUKAN DOKUMEN RESMIâ€. Draft sumber yang belum disahkan tidak dipromosikan hanya oleh tombol print.

### API cetak

| Endpoint | Request | Response/gate |
|---|---|---|
| GET /applications/{id}/printable-documents | Tidak ada | 200 List<{documentType,label,sourceReferences,templateStatus,availableModes,requiredData,missingData,authorizedRole,latestArtifactId?}> |
| POST /applications/{id}/print-jobs | {documentType!,templateVersionId!,mode:PREVIEW/DRAFT!,sourceSnapshotIds!,locale:"id-ID",paper:"A4",copies:integer?} | 202 {jobId,status:QUEUED,sourceSnapshotIds,watermark,requestedBy}; actor/required snapshots diverifikasi |
| GET /print-jobs/{id} | Tidak ada | 200 {id,status,artifactDocumentVersionId?,sourceChecksum?,renderedAt?,warnings[],error?} |
| GET /print-jobs/{id}/content | Tidak ada | 200 PDF byte stream jika READY dan izin masih ada |
| GET /document-versions/{id}/content | Signed/archive file final | 200 byte stream file asli setelah cek izin; tidak regenerate final dari data terbaru |

Command print menggagalkan permintaan dengan `PRINT_DATA_INCOMPLETE`, `PRINT_PERMISSION_DENIED`, `TEMPLATE_NOT_APPROVED`, `SOURCE_SNAPSHOT_STALE`, atau `UNSUPPORTED_PRINT_MODE`. PREVIEW dengan label belum disahkan boleh dipakai data uji sesuai policy, tidak dijadikan output resmi.

### Matriks dokumen yang dapat dicetak

| Jenis | Input / sumber data | Siapa menyiapkan | Tanda tangan/otoritas | Dasar dan kondisi |
|---|---|---|---|---|
| Surat permohonan | Pemohon, instansi, subjek, dasar perkara, tujuan, daftar lampiran | Pengaju | Pemohon berwenang, bukan Admin sebagai penyidik | Lampiran 3, PDF 147; generator draf, surat kedinasan asli dapat diunggah |
| Registrasi tanpa BB | Enam field registrasi + 7 baris checklist dan serah/terima | Pengaju/Admin | Yang menyerahkan dan penerima Sekretariat | Lampiran 4.1(i), PDF 148 |
| Registrasi dengan BB | Identitas + 16 baris termasuk kondisi urine | Pengaju/Admin | Serah/terima sesuai form | Lampiran 4.1(ii), PDF 149; kondisi bukan 16 upload wajib |
| Registrasi P19 | Identitas + 14 baris | Pengaju/Admin | Serah/terima | Lampiran 4.2, PDF 150 |
| Registrasi penuntutan | Identitas + 6 baris | Pengaju/Admin | Serah/terima | Lampiran 4.3, PDF 151 |
| Registrasi sidang | Identitas + 6 baris, nomor sumber berulang dipertahankan | Pengaju/Admin | Serah/terima | Lampiran 4.4, PDF 152 |
| Surat penolakan | Keputusan Ketua, permohonan, alasan, nomor/tanggal/penerima | Admin | Ketua sesuai tingkat/mandat | Lampiran 5, PDF 153; hanya setelah bukti keputusan sesuai prosedur |
| Undangan asesmen / pembahasan | Tim, mandat, waktu, lokasi, metode, penerima | Admin | Sesuai SOP/mandat institusi | Bab III, format operasional perlu disahkan; bukan lampiran template yang diinventasikan |
| Form ASSENT anak | Identitas anak, wali, pilihan persetujuan, saksi, tanggal, blok tanda tangan | Admin/petugas ditugaskan | Pihak sesuai format dan prosedur | Lampiran 6, PDF 154; jangan mencetak â€œsetujuâ€ tanpa pilihan nyata |
| ASI Full | Jawaban per item G/M/E/D/L/F/P dan instruksi, catatan, periode | Medis | Pengesahan mengikuti template/prosedur yang dipilih | Lampiran 7.1, PDF 155..165; bukan satu skor ringkas |
| ASI Wajib Lapor/Rehab Medis | Identitas, enam domain, fisik/urin, severity/rencana | Medis | Petugas asesmen, mengetahui dokter, menyetujui pasien sesuai form | Lampiran 7.2, PDF 166..170 |
| Form asesmen hukum | Identitas, kronologi, riwayat/status hukum, jaringan/transaksi, fakta/kesimpulan | Hukum | Anggota sesuai komposisi sah dan blok sumber | Lampiran 8, PDF 171..173 |
| Referensi diagnosis | Daftar klasifikasi berversi, tanpa data pasien | Medis/referensi internal | Tidak memerlukan pengesahan pasien | Lampiran 9, PDF 174; cetak referensi, bukan hasil asesmen |
| Instrumen penempatan | Enam dimensi, indikator, penilaian dan alasan profesional | Medis | Petugas berwenang sesuai prosedur | Lampiran 10, PDF 175..183; tidak auto-resep |
| BA Pelaksanaan Asesmen Terpadu | Identitas, Ketua/tim, dasar, fakta medis/hukum, alat bukti, kesimpulan/rekomendasi | Admin menyiapkan dari snapshot | Ketua, Tim Hukum, Tim Medis | Lampiran 11, PDF 184..188; narasi CONTOH bukan default |
| Surat Jawaban Permohonan | Metadata RAHASIA, penerima, identitas, hasil/rekomendasi dari BA, tembusan | Admin | Ketua berwenang | Lampiran 12, PDF 189..190; tidak hard-code Ketua Nasional |
| Pernyataan bebas biaya | Nama, lahir, agama, alamat, telp, teks pernyataan, tanggal, saksi | Admin/petugas | Pembuat pernyataan dan saksi sesuai form | Lampiran 13, PDF 191; sebelum pemeriksaan, bukan kuitansi |
| Bukti serah/terima hasil | Release, penerima, waktu dan kanal, acknowledgment | Admin/Pengaju | Pihak penyerahan/penerima sesuai SOP | Rancangan operasional, bukan tambahan lampiran resmi |
| BA Serah Terima rehab | Subjek, rekomendasi, pengantar, penerima fasilitas, waktu/tempat | Pengaju/Admin bila format disahkan | Pihak yang benar-benar menyerahkan/menerima | Kebutuhan Bab III; MVP utamakan unggah salinan format instansi, template cetak menunggu SOP |
| Rekap tindak lanjut | Pelaksanaan/kendala, bukti sumber, status verifikasi | Admin; Pengaju scope sendiri | Pengesahan sesuai tujuan/SOP | Rancangan operasional, bukan bukti terapi baru |
| Laporan bulanan/triwulan/tahunan | Dataset identitas/perkara/hasil/pelaksanaan snapshot periode | Admin scope | Otoritas laporan sesuai tingkat | Bab V PDF 102..108; tembusan tahunan perlu resolusi discrepancy |
| Instrumen monev | Data supervisi, layanan, kelembagaan/prosedur/SDM/sarana/rekam data | Admin dalam fase berikutnya | Petugas supervisi sesuai format | Lampiran 15 PDF 203..212; tanpa auto-grade SDM yang ambigu |

SK TAT/perubahan (Lampiran 1/2) disimpan sebagai bukti kewenangan; MVP tidak menghasilkan SK pengangkatan seolah-olah dari Admin. Kode wilayah Lampiran 14 adalah referensi berversi, bukan formulir pasien.

File cetak menggunakan snapshot, bukan join live yang berubah setelah signature. Simpan templateVersionId, sourceSnapshotIds, renderedAt, renderedBy dan checksum. Template diuji jumlah kolom, baris checklist, page break, kop/jabatan, tanggal, garis tanda tangan dan teks pilihan. Redaksi yang rusak/berulang pada sumber ditandai, tidak diam-diam dikoreksi sebagai kebijakan baru.


---

<a id="section-011"></a>

## 10. Contoh request dan response

Semua contoh berikut **sintetis, ringkas per skenario, bukan data nyata**. Field source lengkap tetap pada model/inventaris. Bentuk label role API menggunakan ADMIN, MEDIS, HUKUM, PENGAJU, sedangkan stream menggunakan MEDICAL/LEGAL.

### Contoh 01. Session pengguna: frontend mengetahui izin, bukan memilih role

**Request:** `GET /api/v1/auth/me`

Tanpa request body.

**Response: HTTP 200.**

```json
{
  "data": {
    "id": "user_demo_admin",
    "name": "Petugas Administrasi Contoh",
    "role": "ADMIN",
    "organization": {
      "id": "org_demo_01",
      "name": "Unit TAT Contoh"
    },
    "permissions": [
      "applications.review",
      "dispositions.record",
      "results.release"
    ],
    "sessionExpiresAt": "2026-10-03T10:30:00Z"
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Password/token session tidak ada pada response. Session aktual berada di cookie HttpOnly.

### Contoh 02. Daftar pengajuan dengan cursor, tanpa isi asesmen

**Request:** `GET /api/v1/applications?limit=20&sort=updatedAt:desc`

Tanpa request body.

**Response: HTTP 200.**

```json
{
  "data": [
    {
      "id": "app_demo_01",
      "trackingNumber": "SIM-2026-001",
      "registrationNumber": null,
      "route": "ARREST_WITHOUT_EVIDENCE",
      "applicationStatus": "ADMIN_REVIEW",
      "medicalStatus": "NOT_STARTED",
      "legalStatus": "NOT_STARTED",
      "deliveryStatus": "NOT_ISSUED",
      "followupStatus": "NOT_APPLICABLE_YET",
      "displayIdentity": {
        "label": "Klien Simulasi A",
        "masked": true
      },
      "targetTatUnit": {
        "id": "tat_demo_01",
        "name": "Unit TAT Contoh"
      },
      "submittedAt": "2026-10-03T08:30:00Z",
      "revision": 7,
      "nextAction": "COMPLETE_DOCUMENT_REVIEW",
      "deadlineSummary": {
        "status": "UNRESOLVED_POLICY",
        "dueAt": null,
        "reason": "Anchor waktu belum tervalidasi"
      }
    }
  ],
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z",
    "page": {
      "limit": 20,
      "nextCursor": null,
      "hasMore": false
    }
  }
}
```

Total tidak dikarang dari jumlah baris halaman. Nama di sini adalah alias sintetis, bukan klien nyata.

### Contoh 03. Membuat draf minimal, bukan pengajuan lengkap

**Request:** `POST /api/v1/applications`

```http
Idempotency-Key: idem-create-draft-demo
```

```json
{
  "route": "ARREST_WITHOUT_EVIDENCE",
  "targetTatUnitId": "tat_demo_01",
  "intakePolicyVersionId": "policy_intake_demo_v1",
  "identity": {
    "fullName": "Klien Simulasi A",
    "identityType": null,
    "identityNumber": null,
    "birthPlace": null,
    "birthDate": null,
    "ageValue": null,
    "ageBasis": "UNKNOWN",
    "sex": {
      "code": null,
      "answerState": "UNKNOWN"
    },
    "nationality": {
      "code": null,
      "answerState": "UNKNOWN"
    },
    "address": {
      "text": null,
      "provinceCode": null,
      "districtCode": null
    },
    "phone": {
      "value": null,
      "answerState": "UNKNOWN"
    },
    "account": {
      "number": null,
      "answerState": "UNKNOWN",
      "holderRelationship": null
    },
    "childStatus": "UNDETERMINED",
    "interpreterNeed": "NOT_ASSESSED",
    "provenance": []
  },
  "applicant": {
    "organizationId": "org_applicant_demo",
    "submittedByPersonId": "person_applicant_demo",
    "position": "Penyidik Contoh",
    "authorityDocumentVersionIds": [
      "dv_authority_demo"
    ],
    "sourceApplicationDate": "2026-10-03"
  },
  "case": {
    "allegedArticles": []
  },
  "evidenceItems": [],
  "labResults": []
}
```

**Response: HTTP 201.**

```http
ETag: "application:app_demo_01:1"
```

```json
{
  "data": {
    "id": "app_demo_01",
    "trackingNumber": null,
    "registrationNumber": null,
    "route": "ARREST_WITHOUT_EVIDENCE",
    "applicationStatus": "DRAFT",
    "revision": 1,
    "identity": {
      "fullName": "Klien Simulasi A",
      "identityType": null,
      "identityNumber": null,
      "birthPlace": null,
      "birthDate": null,
      "ageValue": null,
      "ageBasis": "UNKNOWN",
      "sex": {
        "code": null,
        "answerState": "UNKNOWN"
      },
      "nationality": {
        "code": null,
        "answerState": "UNKNOWN"
      },
      "address": {
        "text": null,
        "provinceCode": null,
        "districtCode": null
      },
      "phone": {
        "value": null,
        "answerState": "UNKNOWN"
      },
      "account": {
        "number": null,
        "answerState": "UNKNOWN",
        "holderRelationship": null
      },
      "childStatus": "UNDETERMINED",
      "interpreterNeed": "NOT_ASSESSED",
      "provenance": []
    },
    "blockers": [
      {
        "code": "IDENTITY_NEEDS_COMPLETION",
        "severity": "WARNING"
      }
    ],
    "allowedActions": [
      "EDIT_DRAFT",
      "CHECK_PREFLIGHT"
    ],
    "visibility": {
      "medicalDetail": "NOT_GRANTED",
      "legalDetail": "NOT_GRANTED"
    },
    "createdAt": "2026-10-03T08:30:00Z",
    "updatedAt": "2026-10-03T08:30:00Z"
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Draf boleh menyimpan UNKNOWN. Ini tidak menyatakan semua isian sudah memenuhi submit/pemeriksaan. Response menunjukkan bagian ApplicationDetail relevan; proyeksi lain mengikuti izin.

### Contoh 04. Preflight mengembalikan blocker terstruktur

**Request:** `POST /api/v1/applications/app_demo_01/preflight`

```json
{
  "action": "SUBMIT"
}
```

**Response: HTTP 200.**

```json
{
  "data": {
    "allowed": false,
    "blockers": [
      {
        "code": "FIELD_REQUIRED_BY_POLICY",
        "path": "/case/requestLetter/number",
        "ruleId": "rule_demo_letter_no",
        "message": "Nomor surat permohonan belum tersedia."
      }
    ],
    "warnings": [
      {
        "code": "CHILD_STATUS_UNDETERMINED",
        "path": "/identity/childStatus",
        "message": "Status anak perlu verifikasi, jangan dianggap dewasa."
      }
    ],
    "policyVersions": {
      "intake": "policy_intake_demo_v1",
      "eligibility": null
    }
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

HTTP 200 karena pemeriksaan berhasil dilakukan, walau allowed=false. Tidak ada mutasi status.

### Contoh 05. Menerima pengajuan setelah minimum intake terpenuhi

**Request:** `POST /api/v1/applications/app_demo_01/submit`

```http
If-Match: "application:app_demo_01:7"
Idempotency-Key: idem-demo-unique-per-command
```

```json
{
  "confirmation": true,
  "checklistRevision": 4,
  "sourceApplicationDate": "2026-10-03"
}
```

**Response: HTTP 200.**

```http
ETag: "application:app_demo_01:8"
```

```json
{
  "data": {
    "applicationId": "app_demo_01",
    "status": "SUBMITTED",
    "snapshotVersionId": "snap_demo_01",
    "submittedAt": "2026-10-03T08:30:00Z",
    "revision": 8,
    "trackingNumber": "SIM-2026-001",
    "completeness": "NOT_YET_VERIFIED"
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Contoh ini memakai draf yang telah dilengkapi; bukan langsung dari draf minimal sebelumnya. ID contoh sama untuk mempermudah pembacaan, revision harus dibaca ulang pada request nyata.

### Contoh 06. Upload intent untuk dokumen privat

**Request:** `POST /api/v1/documents/uploads`

```json
{
  "owner": {
    "type": "APPLICATION",
    "id": "app_demo_01"
  },
  "category": "REQUEST_LETTER",
  "filename": "surat-permohonan-simulasi.pdf",
  "declaredMimeType": "application/pdf",
  "declaredSize": 120000
}
```

**Response: HTTP 201.**

```json
{
  "data": {
    "uploadId": "upl_demo_01",
    "documentId": "doc_demo_01",
    "documentVersionId": "dv_demo_01",
    "transport": "API_MULTIPART",
    "uploadPath": "/api/v1/uploads/upl_demo_01/bytes",
    "expiresAt": "2026-10-03T08:45:00Z",
    "maxSize": 20971520,
    "allowedTypes": [
      "application/pdf",
      "image/jpeg",
      "image/png"
    ],
    "scanStatus": "AWAITING_BYTES"
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

20 MB adalah contoh konfigurasi aplikasi, bukan ketentuan juknis. Bytes dikirim pada endpoint multipart, tidak ditaruh di JSON.

### Contoh 07. Upload selesai belum berarti file lolos scan

**Request:** `POST /api/v1/uploads/upl_demo_01/complete`

```json
{
  "transportReceiptId": "receipt_demo_01"
}
```

**Response: HTTP 202.**

```json
{
  "data": {
    "documentVersionId": "dv_demo_01",
    "scanStatus": "QUARANTINED",
    "scanJobId": "job_scan_demo_01"
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Frontend menunggu GET document version menjadi READY sebelum menautkan file sebagai bukti.

### Contoh 08. Checklist: dokumen ada, kondisinya belum dinilai

**Request:** `GET /api/v1/applications/app_demo_01/checklist`

Tanpa request body.

**Response: HTTP 200.**

```json
{
  "data": {
    "templateVersionId": "registration_without_bb_v1",
    "revision": 4,
    "items": [
      {
        "requirementId": "req_urine_demo",
        "applicability": "APPLICABLE",
        "applicabilityReason": "Sesuai jalur formulir.",
        "availability": "PRESENT",
        "documentLinks": [
          {
            "documentVersionId": "dv_lab_demo",
            "pageStart": 1,
            "pageEnd": 1
          }
        ],
        "conditionAssessment": "NOT_ASSESSED",
        "verificationState": "PENDING",
        "notes": null,
        "revision": 1
      }
    ],
    "definitions": [
      {
        "id": "req_urine_demo",
        "sourceNumber": "6",
        "sourceLabel": "Surat Keterangan Hasil Pemeriksaan Urine",
        "sourcePage": 148,
        "requirementBasis": "JUKNIS_FORM",
        "applicabilityRuleId": "rule_route_demo",
        "conditionRuleId": "rule_urine_demo",
        "gateEffect": "REQUIRED_FOR_DISPOSITION",
        "policyVersionId": "policy_eligibility_demo_v1"
      }
    ]
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Label disingkat khusus response contoh; definisi template produksi memakai label lengkap inventaris PDF148. Tidak menjadikan adanya file bukti hasil positif.

### Contoh 09. Verifikasi dapat menyatakan ada file tetapi isi tidak sesuai

**Request:** `POST /api/v1/applications/app_demo_01/verifications`

```json
{
  "requirementId": "req_urine_demo",
  "documentVersionIds": [
    "dv_lab_demo"
  ],
  "outcome": "CORRECTION_REQUIRED",
  "conditionAssessment": "UNKNOWN",
  "reasonCode": "IDENTITY_MISMATCH",
  "reasonText": "Identitas pada surat perlu dicocokkan.",
  "sourceReferences": [
    "PDF 148 / cetak 133"
  ]
}
```

**Response: HTTP 201.**

```json
{
  "data": {
    "id": "ver_demo_01",
    "applicationId": "app_demo_01",
    "snapshotVersionId": "snap_demo_01",
    "requirementId": "req_urine_demo",
    "documentVersionIds": [
      "dv_lab_demo"
    ],
    "outcome": "CORRECTION_REQUIRED",
    "conditionAssessment": "UNKNOWN",
    "reasonCode": "IDENTITY_MISMATCH",
    "reasonText": "Identitas pada surat perlu dicocokkan.",
    "sourceReferences": [
      "PDF 148 / cetak 133"
    ],
    "reviewedBy": "user_demo_admin",
    "reviewedAt": "2026-10-03T08:30:00Z",
    "invalidatedByVersionId": null,
    "revision": 1
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

### Contoh 10. Catat persetujuan Ketua, Admin hanya pencatat

**Request:** `POST /api/v1/applications/app_demo_01/dispositions`

```http
If-Match: "application:app_demo_01:7"
Idempotency-Key: idem-demo-unique-per-command
```

```json
{
  "outcome": "APPROVED",
  "externalDecider": {
    "personId": "person_chair_demo",
    "nameSnapshot": "Pejabat Contoh",
    "positionSnapshot": "Ketua TAT Unit Contoh",
    "tatLevel": "PROVINCIAL",
    "mandateId": "mandate_demo_01"
  },
  "decidedAt": {
    "date": "2026-10-03",
    "time": "15:00:00",
    "timezone": "Asia/Jakarta",
    "precision": "MINUTE",
    "sourceDocumentVersionId": "dv_demo_basis"
  },
  "signedEvidenceDocumentVersionId": "dv_disposition_demo",
  "evidenceProcedureVersionId": "sop_external_evidence_demo_v1",
  "evidenceChecks": {
    "identityConsistent": true,
    "mandateValid": true,
    "contentConsistent": true,
    "datesConsistent": true
  },
  "reason": "Persetujuan sesuai bukti yang diperiksa."
}
```

**Response: HTTP 201.**

```json
{
  "data": {
    "disposition": {
      "id": "disp_demo_01",
      "outcome": "APPROVED",
      "externalDecider": {
        "personId": "person_chair_demo",
        "nameSnapshot": "Pejabat Contoh",
        "positionSnapshot": "Ketua TAT Unit Contoh",
        "tatLevel": "PROVINCIAL",
        "mandateId": "mandate_demo_01"
      },
      "decidedAt": {
        "date": "2026-10-03",
        "time": "15:00:00",
        "timezone": "Asia/Jakarta",
        "precision": "MINUTE",
        "sourceDocumentVersionId": "dv_demo_basis"
      },
      "signedEvidenceDocumentVersionId": "dv_disposition_demo",
      "reason": "Persetujuan sesuai bukti yang diperiksa.",
      "evidenceProcedureVersionId": "sop_external_evidence_demo_v1",
      "evidenceChecks": {
        "identityConsistent": true,
        "mandateValid": true,
        "contentConsistent": true,
        "datesConsistent": true
      },
      "recordedBy": "user_demo_admin",
      "recordedAt": "2026-10-03T08:30:00Z",
      "evidenceReview": {
        "status": "ACCEPTED",
        "reviewedBy": "user_demo_admin",
        "reviewedAt": "2026-10-03T08:30:00Z",
        "procedureVersionId": "sop_external_evidence_demo_v1"
      },
      "applicationRevision": 12
    },
    "applicationStatus": "APPROVED",
    "applicationRevision": 12
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Contoh berbasis SOP bukti yang telah disahkan. Tidak menerima body recordedBy untuk memalsukan aktor.

### Contoh 11. Permintaan asesmen ditolak karena safeguard belum selesai

**Request:** `POST /api/v1/applications/app_demo_01/sessions/start`

```json
{
  "scheduleId": "schedule_demo_med",
  "attendanceRevision": 2,
  "safeguardRevision": 2
}
```

**Response: HTTP 422.**

```json
{
  "error": {
    "code": "SAFEGUARDS_UNRESOLVED",
    "message": "Sesi rutin belum dapat dimulai.",
    "fields": [
      {
        "path": "/childAssent/state",
        "code": "PENDING_REVIEW",
        "message": "Status pendampingan/persetujuan perlu ditelaah."
      }
    ],
    "retryable": false
  },
  "meta": {
    "requestId": "req_demo_error",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Tidak menghalangi pencatatan penanganan medis darurat oleh tenaga berwenang. Emergency bukan bypass finalisasi TAT.

### Contoh 12. Menyimpan satu sel instrumen ASI

**Request:** `PATCH /api/v1/assessments/asm_demo_med/answers`

```http
If-Match: "assessment:asm_demo_med:3"
Idempotency-Key: idem-demo-unique-per-command
```

```json
{
  "operations": [
    {
      "op": "UPSERT",
      "itemId": "item_asi_d1_last30_demo",
      "period": "LAST_30_DAYS",
      "matrixColumn": "DAYS_USED",
      "repeatIndex": 0,
      "answerState": "ANSWERED",
      "value": 4,
      "sourceSpecialCode": null,
      "note": "Contoh jawaban sintetis."
    }
  ]
}
```

**Response: HTTP 200.**

```http
ETag: "assessment:asm_demo_med:4"
```

```json
{
  "data": {
    "assessmentId": "asm_demo_med",
    "revision": 4,
    "savedAt": "2026-10-03T08:30:00Z",
    "savedKeys": [
      {
        "itemId": "item_asi_d1_last30_demo",
        "period": "LAST_30_DAYS",
        "matrixColumn": "DAYS_USED",
        "repeatIndex": 0
      }
    ],
    "validationIssues": [],
    "completion": {
      "answered": 1,
      "applicable": null,
      "unresolved": true
    }
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Tidak menggunakan angka total field inventaris sebagai denominator kelengkapan. applicability dihitung dari template/policy nyata.

### Contoh 13. Konflik autosave: versi stale tidak menimpa jawaban

**Request:** `PATCH /api/v1/assessments/asm_demo_med/answers`

```http
If-Match: "assessment:asm_demo_med:3"
Idempotency-Key: idem-demo-unique-per-command
```

```json
{
  "operations": [
    {
      "op": "UPSERT",
      "itemId": "item_asi_d1_last30_demo",
      "period": "LAST_30_DAYS",
      "matrixColumn": "DAYS_USED",
      "repeatIndex": 0,
      "answerState": "ANSWERED",
      "value": 3
    }
  ]
}
```

**Response: HTTP 412.**

```json
{
  "error": {
    "code": "REVISION_CONFLICT",
    "message": "Data telah berubah. Muat versi terbaru sebelum menyimpan.",
    "fields": [
      {
        "path": "/revision",
        "code": "STALE_ETAG",
        "message": "Versi saat ini 4."
      }
    ],
    "retryable": false
  },
  "meta": {
    "requestId": "req_demo_error",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Frontend mempertahankan edit belum tersimpan di memori sementara dan menawarkan telaah perubahan, bukan silent retry overwrite.

### Contoh 14. Finalisasi medis dengan referensi bukti, tanpa diagnosis otomatis

**Request:** `POST /api/v1/assessments/asm_demo_med/finalize`

```http
If-Match: "assessment:asm_demo_med:3"
Idempotency-Key: idem-demo-unique-per-command
```

```json
{
  "confirm": true,
  "expectedAssessmentVersionId": "asmv_demo_med_01",
  "reviewRecordIds": [
    "review_demo_med_01",
    "review_demo_med_02"
  ],
  "signedFormDocumentVersionIds": [
    "dv_med_form_demo"
  ],
  "completionPolicyVersionId": "policy_med_completion_demo_v1"
}
```

**Response: HTTP 200.**

```json
{
  "data": {
    "assessmentId": "asm_demo_med",
    "status": "FINAL",
    "finalVersionId": "asmv_demo_med_01",
    "revision": 15,
    "finalizedBy": "user_demo_med",
    "finalizedAt": "2026-10-03T08:30:00Z",
    "applicationReadiness": {
      "medicalFinal": true,
      "legalFinal": false,
      "conferenceReady": false,
      "blockers": [
        {
          "code": "LEGAL_ASSESSMENT_NOT_FINAL",
          "message": "Asesmen hukum belum final."
        }
      ]
    }
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Review dan tanda tangan mengikuti pilihan template/prosedur; contoh tidak menyatakan semua instrumen selalu membutuhkan dua record review persis.

### Contoh 15. Penelusuran hukum belum dilakukan, bukan hasil negatif

**Request:** `POST /api/v1/assessments/asm_demo_legal/legal-checks`

```json
{
  "checkType": "INTELLIGENCE",
  "state": "NOT_PERFORMED",
  "sourceReference": null,
  "checkedAt": null,
  "findings": null,
  "limitations": "Permohonan resmi belum mendapat jawaban.",
  "authorityReference": "surat_permohonan_intel_demo",
  "evidenceDocumentVersionIds": [
    "dv_intel_request_demo"
  ]
}
```

**Response: HTTP 201.**

```json
{
  "data": {
    "id": "lcheck_demo_01",
    "assessmentId": "asm_demo_legal",
    "type": "LEGAL_CHECK",
    "payload": {
      "checkType": "INTELLIGENCE",
      "state": "NOT_PERFORMED",
      "sourceReference": null,
      "checkedAt": null,
      "findings": null,
      "limitations": "Permohonan resmi belum mendapat jawaban.",
      "authorityReference": "surat_permohonan_intel_demo",
      "evidenceDocumentVersionIds": [
        "dv_intel_request_demo"
      ]
    },
    "createdBy": "user_demo_legal",
    "createdAt": "2026-10-03T08:30:00Z",
    "updatedAt": "2026-10-03T08:30:00Z",
    "revision": 1
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

### Contoh 16. Form lengkap: stream lain tidak mendapat raw jawaban

**Request:** `GET /api/v1/applications/app_demo_01`

Tanpa request body.

**Response: HTTP 200.**

```json
{
  "data": {
    "id": "app_demo_01",
    "trackingNumber": "SIM-2026-001",
    "applicationStatus": "ASSESSMENT_ACTIVE",
    "medicalStatus": "FINAL",
    "legalStatus": "DRAFT",
    "revision": 22,
    "visibility": {
      "medicalDetail": "NOT_GRANTED",
      "medicalAuthorizedSummary": "GRANTED",
      "legalDetail": "GRANTED"
    },
    "allowedActions": [
      "EDIT_LEGAL_ASSESSMENT",
      "READ_AUTHORIZED_MEDICAL_SUMMARY"
    ],
    "nextAction": "FINALIZE_LEGAL_ASSESSMENT"
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Contoh proyeksi untuk Hukum. Tidak ada medicalAnswers:null atau medicalAnswers:[] yang dapat disalahartikan.

### Contoh 17. Pembuatan draf BA dan surat jawaban adalah job

**Request:** `POST /api/v1/applications/app_demo_01/result-drafts`

```json
{
  "decisionSnapshotId": "decision_demo_v1",
  "templateVersionIds": {
    "minutes": "tpl_minutes_demo_v1",
    "responseLetter": "tpl_response_demo_v1"
  },
  "recipientSnapshot": {
    "organizationId": "org_applicant_demo",
    "name": "Instansi Pemohon Contoh"
  },
  "approvedReferenceSetId": "reference_set_demo_v1",
  "authorizedCopyRecipients": []
}
```

**Response: HTTP 202.**

```json
{
  "data": {
    "id": "job_results_demo",
    "status": "QUEUED",
    "sourceSnapshotIds": [
      "decision_demo_v1",
      "asmv_demo_med_01",
      "asmv_demo_legal_01"
    ],
    "outputDocumentVersionIds": [],
    "error": null
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Job belum menghasilkan surat resmi. Status tetap OUTCOME_RECORDED_FOR_DRAFT sampai kedua draf sukses, baru menuju AWAITING_SIGNED_OUTPUTS. Hasil PDF tetap DRAF.

### Contoh 18. Cetak formulir registrasi dari snapshot, bukan data live

**Request:** `POST /api/v1/applications/app_demo_01/print-jobs`

```json
{
  "documentType": "REGISTRATION_WITHOUT_EVIDENCE",
  "templateVersionId": "tpl_reg_without_bb_demo_v1",
  "mode": "PREVIEW",
  "sourceSnapshotIds": [
    "snap_demo_01",
    "checklist_snapshot_demo_01"
  ],
  "locale": "id-ID",
  "paper": "A4",
  "copies": 1
}
```

**Response: HTTP 202.**

```json
{
  "data": {
    "jobId": "print_demo_01",
    "status": "QUEUED",
    "sourceSnapshotIds": [
      "snap_demo_01",
      "checklist_snapshot_demo_01"
    ],
    "watermark": "SIMULASI / BUKAN DOKUMEN RESMI",
    "requestedBy": "user_demo_admin"
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

### Contoh 19. Polling job cetak yang selesai

**Request:** `GET /api/v1/print-jobs/print_demo_01`

Tanpa request body.

**Response: HTTP 200.**

```json
{
  "data": {
    "id": "print_demo_01",
    "status": "SUCCEEDED",
    "artifactDocumentVersionId": "dv_print_demo_01",
    "sourceChecksum": "checksum-dihitung-server-pada-implementasi",
    "renderedAt": "2026-10-03T08:30:00Z",
    "warnings": [
      "Data sintetis. Bukan dokumen resmi."
    ],
    "error": null
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

sourceChecksum adalah placeholder penjelas pada contoh, bukan nilai hash valid. File PDF diambil melalui GET /print-jobs/print_demo_01/content setelah izin dicek ulang.

### Contoh 20. Release gagal karena surat jawaban sah belum tersedia

**Request:** `POST /api/v1/applications/app_demo_01/releases`

```http
If-Match: "application:app_demo_01:7"
Idempotency-Key: idem-demo-unique-per-command
```

```json
{
  "decisionSnapshotId": "decision_demo_v1",
  "minutesSignedOutputId": "signed_minutes_demo",
  "responseSignedOutputId": "signed_response_demo",
  "expectedMedicalFinalVersionId": "asmv_demo_med_01",
  "expectedLegalFinalVersionId": "asmv_demo_legal_01",
  "signatureReviewIds": [
    "sigreview_minutes_demo"
  ],
  "recipients": [
    {
      "organizationId": "org_applicant_demo"
    }
  ]
}
```

**Response: HTTP 422.**

```json
{
  "error": {
    "code": "SIGNED_OUTPUTS_INCOMPLETE",
    "message": "Paket hasil belum dapat diterbitkan.",
    "fields": [
      {
        "path": "/signatureReviewIds",
        "code": "RESPONSE_SIGNATURE_REVIEW_REQUIRED",
        "message": "Pemeriksaan surat jawaban belum selesai."
      }
    ],
    "retryable": false
  },
  "meta": {
    "requestId": "req_demo_error",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

### Contoh 21. Release berhasil setelah semua gate selesai

**Request:** `POST /api/v1/applications/app_demo_01/releases`

```http
If-Match: "application:app_demo_01:7"
Idempotency-Key: idem-demo-unique-per-command
```

```json
{
  "decisionSnapshotId": "decision_demo_v1",
  "minutesSignedOutputId": "signed_minutes_demo",
  "responseSignedOutputId": "signed_response_demo",
  "expectedMedicalFinalVersionId": "asmv_demo_med_01",
  "expectedLegalFinalVersionId": "asmv_demo_legal_01",
  "signatureReviewIds": [
    "sigreview_minutes_demo",
    "sigreview_response_demo"
  ],
  "recipients": [
    {
      "organizationId": "org_applicant_demo"
    }
  ]
}
```

**Response: HTTP 201.**

```json
{
  "data": {
    "id": "release_demo_01",
    "applicationId": "app_demo_01",
    "decisionSnapshotId": "decision_demo_v1",
    "assessmentVersionRefs": {
      "medical": "asmv_demo_med_01",
      "legal": "asmv_demo_legal_01"
    },
    "minutesDocumentVersionId": "dv_minutes_signed_demo",
    "responseLetterDocumentVersionId": "dv_response_signed_demo",
    "status": "ISSUED",
    "issuedBy": "user_demo_admin",
    "issuedAt": "2026-10-03T08:30:00Z",
    "revision": 1,
    "supersedesReleaseId": null,
    "staleReviewFlag": false
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Success menyatakan file sah menurut prosedur yang sudah disahkan/diselesaikan, bukan verifikasi TTE tersertifikasi yang belum dibangun.

### Contoh 22. Pelaksanaan rehab dilaporkan tetapi belum diverifikasi

**Request:** `POST /api/v1/applications/app_demo_01/followups`

```json
{
  "releaseId": "release_demo_01",
  "executionClaim": "REPORTED_IMPLEMENTED",
  "facilitySnapshot": {
    "id": "facility_demo_01",
    "name": "Fasilitas Contoh"
  },
  "handoverAt": {
    "date": "2026-10-03",
    "time": "15:00:00",
    "timezone": "Asia/Jakarta",
    "precision": "MINUTE",
    "sourceDocumentVersionId": "dv_demo_basis"
  },
  "admissionAt": {
    "date": "2026-10-03",
    "time": "15:00:00",
    "timezone": "Asia/Jakarta",
    "precision": "MINUTE",
    "sourceDocumentVersionId": "dv_demo_basis"
  },
  "handoverDocumentVersionId": "dv_handover_demo",
  "progressNote": "Pengaju melaporkan penerimaan berdasarkan berkas fasilitas.",
  "evidenceDocumentVersionIds": [
    "dv_handover_demo"
  ],
  "eventOccurredAt": {
    "date": "2026-10-03",
    "time": "15:00:00",
    "timezone": "Asia/Jakarta",
    "precision": "MINUTE",
    "sourceDocumentVersionId": "dv_demo_basis"
  },
  "informationSource": "BA serah terima dan konfirmasi fasilitas contoh."
}
```

**Response: HTTP 201.**

```json
{
  "data": {
    "id": "followup_demo_01",
    "applicationId": "app_demo_01",
    "releaseId": "release_demo_01",
    "reportedPayload": {
      "executionClaim": "REPORTED_IMPLEMENTED",
      "facilitySnapshot": {
        "id": "facility_demo_01",
        "name": "Fasilitas Contoh"
      },
      "handoverDocumentVersionId": "dv_handover_demo"
    },
    "reportedBy": "user_demo_applicant",
    "recordedAt": "2026-10-03T08:30:00Z",
    "verificationStatus": "PENDING",
    "verifiedBy": null,
    "verifiedAt": null,
    "revision": 1
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

reportedPayload ditampilkan ringkas pada contoh. Record sebenarnya mempertahankan seluruh input, tanpa menganggap laporan sebagai verified.

### Contoh 23. Membuat laporan periodik berizin

**Request:** `POST /api/v1/reports`

```json
{
  "type": "MONTHLY",
  "periodStart": "2026-09-01",
  "periodEnd": "2026-09-30",
  "tatUnitId": "tat_demo_01",
  "datasetPolicyVersionId": "report_dataset_demo_v1",
  "recipientPolicyVersionId": "report_recipients_demo_v1",
  "format": "PDF"
}
```

**Response: HTTP 202.**

```json
{
  "data": {
    "id": "report_demo_01",
    "status": "QUEUED",
    "period": {
      "start": "2026-09-01",
      "end": "2026-09-30"
    },
    "scope": {
      "tatUnitId": "tat_demo_01"
    },
    "snapshotAt": "2026-10-03T08:30:00Z",
    "datasetVersionId": null,
    "recordCount": null,
    "artifactDocumentVersionId": null,
    "redactionProfile": "AUTHORIZED_REPORT_SCOPE",
    "error": null
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Cadence bulanan tidak menetapkan tanggal jatuh tempo atau penerima yang belum disahkan. recordCount belum dihitung, tidak dikarang.

### Contoh 24. Penugasan dua pelaksana medis dalam role yang sama

**Request:** `POST /api/v1/applications/app_demo_01/assignments`

```http
If-Match: "application:app_demo_01:7"
Idempotency-Key: idem-demo-unique-per-command
```

```json
{
  "stream": "MEDICAL",
  "members": [
    {
      "personId": "person_med_demo_01",
      "userId": "user_med_demo_01",
      "institutionId": "org_tat_demo",
      "profession": "DOCTOR",
      "teamRole": "EXAMINER",
      "mandateId": "mandate_med_demo_01",
      "validFrom": "2026-10-01",
      "validTo": null,
      "conflictOfInterestNote": null
    },
    {
      "personId": "person_med_demo_02",
      "userId": "user_med_demo_02",
      "institutionId": "org_tat_demo",
      "profession": "CLINICAL_PSYCHOLOGIST",
      "teamRole": "EXAMINER",
      "mandateId": "mandate_med_demo_02",
      "validFrom": "2026-10-01",
      "validTo": null,
      "conflictOfInterestNote": null
    }
  ],
  "assignmentBasisDocumentVersionId": "dv_assignment_demo"
}
```

**Response: HTTP 201.**

```json
{
  "data": {
    "id": "assignment_demo_med",
    "stream": "MEDICAL",
    "members": [
      {
        "personId": "person_med_demo_01",
        "userId": "user_med_demo_01",
        "institutionId": "org_tat_demo",
        "profession": "DOCTOR",
        "teamRole": "EXAMINER",
        "mandateId": "mandate_med_demo_01",
        "validFrom": "2026-10-01",
        "validTo": null,
        "conflictOfInterestNote": null
      },
      {
        "personId": "person_med_demo_02",
        "userId": "user_med_demo_02",
        "institutionId": "org_tat_demo",
        "profession": "CLINICAL_PSYCHOLOGIST",
        "teamRole": "EXAMINER",
        "mandateId": "mandate_med_demo_02",
        "validFrom": "2026-10-01",
        "validTo": null,
        "conflictOfInterestNote": null
      }
    ],
    "compositionCheck": {
      "status": "VALID_UNDER_APPROVED_POLICY",
      "policyVersionId": "team_policy_demo_v1",
      "issues": []
    },
    "assignedBy": "user_demo_admin",
    "assignedAt": "2026-10-03T08:30:00Z",
    "revision": 1,
    "applicationRevision": 13
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Role MEDIS dapat dimiliki beberapa orang dengan profesi berbeda. Sertifikasi/mandat harus diverifikasi dari data sah; contoh ini tidak membuktikan kualifikasi individu.

### Contoh 25. Jadwal mempunyai zona waktu dan peserta eksplisit

**Request:** `POST /api/v1/applications/app_demo_01/schedules`

```http
If-Match: "application:app_demo_01:7"
Idempotency-Key: idem-demo-unique-per-command
```

```json
{
  "sessionType": "COMBINED",
  "startsAt": "2026-10-04T09:00:00+07:00",
  "endsAt": "2026-10-04T12:00:00+07:00",
  "timezone": "Asia/Jakarta",
  "mode": "IN_PERSON",
  "location": "Ruang Pemeriksaan Contoh",
  "privateMeetingLink": null,
  "participantPersonIds": [
    "person_med_demo_01",
    "person_med_demo_02",
    "person_legal_demo_01"
  ],
  "reasonForAlternativeMode": null,
  "supportingDocumentVersionIds": []
}
```

**Response: HTTP 201.**

```json
{
  "data": {
    "id": "schedule_demo_01",
    "sessionType": "COMBINED",
    "startsAt": "2026-10-04T09:00:00+07:00",
    "endsAt": "2026-10-04T12:00:00+07:00",
    "timezone": "Asia/Jakarta",
    "mode": "IN_PERSON",
    "location": "Ruang Pemeriksaan Contoh",
    "privateMeetingLink": null,
    "participantPersonIds": [
      "person_med_demo_01",
      "person_med_demo_02",
      "person_legal_demo_01"
    ],
    "reasonForAlternativeMode": null,
    "supportingDocumentVersionIds": [],
    "status": "SCHEDULED",
    "invitationDocumentVersionIds": [],
    "deliverySummary": [],
    "supersedesScheduleId": null,
    "revision": 1,
    "applicationRevision": 14
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Daftar peserta disingkat untuk contoh. Gate komposisi memeriksa daftar lengkap di assignment, bukan menganggap satu anggota Hukum mencukupi.

### Contoh 26. Hasil belum lengkap tidak dipaksa menjadi boolean rehab

**Request:** `POST /api/v1/conferences/conf_demo_01/outcomes`

```http
If-Match: "conference:conf_demo_01:2"
Idempotency-Key: idem-outcome-demo
```

```json
{
  "conferenceRevision": 2,
  "medicalFinalVersionId": "asmv_demo_med_01",
  "legalFinalVersionId": "asmv_demo_legal_01",
  "externalDecider": {
    "personId": "person_chair_demo",
    "nameSnapshot": "Pejabat Contoh",
    "positionSnapshot": "Ketua TAT Unit Contoh",
    "tatLevel": "PROVINCIAL",
    "mandateId": "mandate_demo_01"
  },
  "decidedAt": {
    "date": "2026-10-03",
    "time": "15:00:00",
    "timezone": "Asia/Jakarta",
    "precision": "MINUTE",
    "sourceDocumentVersionId": "dv_demo_basis"
  },
  "confirmationEvidenceDocumentVersionIds": [
    "dv_conference_confirmation_demo"
  ],
  "recordingProcedureVersionId": "sop_conference_record_demo_v1",
  "conclusion": {
    "clientCategory": null,
    "medicalSummary": "Ringkasan sintetis yang telah ditelaah Tim Medis.",
    "legalSummary": "Ringkasan sintetis yang telah ditelaah Tim Hukum.",
    "diagnosisRefs": [],
    "networkConclusion": "INCONCLUSIVE"
  },
  "recommendation": {
    "disposition": "CONDITIONAL",
    "serviceType": null,
    "placementContext": null,
    "duration": null,
    "facilitySnapshot": null,
    "legalContinuation": {
      "outcome": "OTHER_AUTHORIZED_ACTION",
      "basis": "Menunggu telaah sesuai bukti keputusan contoh."
    },
    "reportingObligation": null,
    "conditions": [
      "Klarifikasi dasar penempatan sesuai policy yang disahkan."
    ],
    "rationale": "Contoh bentuk data bersyarat, bukan keputusan untuk klien nyata.",
    "basis": {
      "evidenceCategory": "UNRESOLVED",
      "labResultRefs": [],
      "networkConclusion": "INCONCLUSIVE",
      "route": "ARREST_WITHOUT_EVIDENCE",
      "nationalityBranch": "UNRESOLVED"
    },
    "sourceDocumentVersionIds": [
      "dv_conference_confirmation_demo"
    ],
    "policyVersionId": "outcome_demo_v1"
  },
  "divergenceReason": null
}
```

**Response: HTTP 422.**

```json
{
  "error": {
    "code": "OUTCOME_REQUIRES_CLARIFICATION",
    "message": "Hasil belum memenuhi policy untuk disiapkan menjadi keluaran.",
    "fields": [
      {
        "path": "/recommendation/basis",
        "code": "UNRESOLVED_DECISION_BASIS",
        "message": "Selesaikan telaah dasar keputusan yang diperlukan."
      }
    ],
    "retryable": false
  },
  "meta": {
    "requestId": "req_demo_error",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Model mampu merekam kondisi/ketidakpastian, tetapi contoh ini tidak lolos gate hasil untuk draf. Tidak menghasilkan hasil resmi bersyarat hanya karena JSON valid.

### Contoh 27. Unggah BA signed untuk diperiksa, bukan otomatis terbit

**Request:** `POST /api/v1/applications/app_demo_01/signed-outputs`

```json
{
  "decisionSnapshotId": "decision_demo_v1",
  "documentKind": "TAT_MINUTES",
  "uploadedDocumentVersionId": "dv_minutes_signed_demo",
  "outputOrigin": "GENERATED_DRAFT",
  "correspondingDraftVersionId": "dv_minutes_draft_demo",
  "signatories": [
    {
      "personId": "person_chair_demo",
      "mandateId": "mandate_demo_01",
      "positionSnapshot": "Ketua TAT Unit Contoh",
      "tatLevel": "PROVINCIAL",
      "signedAt": "2026-10-03T15:00:00+07:00",
      "method": "WET_SIGNATURE_SCAN"
    }
  ],
  "declaredDocumentNumber": "BA/SIMULASI/001",
  "declaredDocumentDate": "2026-10-03"
}
```

**Response: HTTP 201.**

```json
{
  "data": {
    "id": "signed_minutes_demo",
    "status": "PENDING_REVIEW",
    "documentVersionId": "dv_minutes_signed_demo",
    "decisionSnapshotId": "decision_demo_v1",
    "revision": 1
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Signatories contoh hanya menunjukkan struktur satu anggota. Paket final BA membutuhkan seluruh pihak yang diwajibkan template/prosedur, sehingga review/release menolak jika daftar aktual tidak lengkap.

### Contoh 28. Review dokumen eksternal mencatat pemeriksa nyata

**Request:** `POST /api/v1/signed-outputs/signed_minutes_demo/reviews`

```json
{
  "signedOutputId": "signed_minutes_demo",
  "procedureVersionId": "signature_sop_demo_v1",
  "result": "REJECTED",
  "checks": {
    "identityConsistent": true,
    "mandateValid": true,
    "contentConsistent": true,
    "datesConsistent": true,
    "requiredSignatoriesPresent": false
  },
  "note": "Pengesah yang dipersyaratkan belum lengkap.",
  "evidenceDocumentVersionIds": [
    "dv_minutes_signed_demo"
  ]
}
```

**Response: HTTP 201.**

```json
{
  "data": {
    "id": "sigreview_minutes_demo",
    "result": "REJECTED",
    "reviewedBy": "user_demo_admin",
    "reviewedAt": "2026-10-03T08:30:00Z",
    "procedureVersionId": "signature_sop_demo_v1"
  },
  "meta": {
    "requestId": "req_demo_01",
    "serverTime": "2026-10-03T08:30:00Z"
  }
}
```

Keberhasilan HTTP berarti catatan review tersimpan, bukan dokumen diterima. Outcome tetap REJECTED.


---

<a id="section-012"></a>

## 11. Aturan validasi lintas modul

| Aturan | Saat diperiksa | Error atau tindak lanjut |
|---|---|---|
| Identitas/instansi/mandat pemohon cocok jalur | Buat/submit | ROUTE_AUTHORITY_MISMATCH |
| Policy intake aktif dan rule eligibility disahkan untuk disposisi | Submit / complete-review | INTAKE_POLICY_NOT_APPROVED / POLICY_REVIEW_REQUIRED |
| Field sumber hanya diberi requiredness sesuai policy | Preflight/finalize | FIELD_REQUIRED_BY_POLICY dengan ruleId |
| Availability berkas terpisah dari pemenuhan kondisi | Verifikasi | CONDITION_NOT_SATISFIED; bukan FILE_MISSING jika file ada |
| Dokumen masih quarantined/tidak terbaca | Link/finalize/print | FILE_NOT_READY / DOC_REVIEW_REQUIRED |
| Tim memenuhi komposisi dan profesi/mandat masih berlaku | Jadwal/pemeriksaan | TEAM_COMPOSITION_INVALID |
| Status anak/penerjemah belum jelas | Mulai sesi rutin | SAFEGUARD_REVIEW_REQUIRED; emergency terpisah |
| Diagnosis memakai wildcard / contoh template | Finalisasi | WILDCARD_DIAGNOSIS / SAMPLE_VALUE_NOT_ALLOWED jika jelas token placeholder; jangan mendeteksi klinis dari regex spekulatif |
| Jawaban tipe/rentang/opsi tidak sesuai item | Autosave/finalize | ANSWER_SCHEMA_MISMATCH |
| Input pada label/instruksi/reference | Autosave | NON_INPUT_ITEM |
| Hasil Hukum tanpa sumber penelusuran yang diklaim selesai | Finalisasi | SOURCE_REQUIRED |
| Ketua/mandat tidak sesuai tingkat | Disposisi/outcome/release | MANDATE_INVALID |
| Hasil medis/hukum berubah setelah pembahasan | Generate/release | DECISION_STALE |
| Bukti final dua dokumen belum lengkap | Release | SIGNED_OUTPUTS_INCOMPLETE |
| Perubahan jenis/lembaga rehab bertentangan keputusan | Follow-up | Catat deviasi dan eskalasi, bukan silently update rekomendasi |
| Permintaan disclosure melampaui scope/masa otorisasi | Job/download | EXCEEDS_APPROVED_SCOPE / GRANT_EXPIRED |

Kelengkapan ASI tidak boleh berarti memaksa menjawab pertanyaan yang sumbernya mengizinkan tidak dijawab. Gate memeriksa state jawaban dan instruksi yang sah, bukan semua `value != null`.

### Traceability field ke sumber

Setiap form item memuat sourceDocumentVersion, pdfPage, printedPage, appendix, sourceCode, sourceLabel, sourceOptions. Setiap rule memuat basis sumber atau approval policy. Perubahan rule/template tidak menulis ulang pengajuan lama; lakukan migrasi eksplisit jika disetujui.

Contoh trace: row registrasi Lampiran 4.1(ii) hasil urine PDF149 â†’ requirement definition berversi â†’ documentLink ke hasil lab â†’ verification condition â†’ register snapshot â†’ print template dengan label asli. Ini lebih kuat daripada menyimpan `dokumenLengkap:true`.


---

<a id="section-013"></a>

## 12. Persistence, audit, dan pekerjaan asynchronous

DB menyimpan organisasi/unit, persons/mandates, users/sessions/memberships, clients/cases/applications/snapshots, policy/template/item versions, requirements/responses/verifications/corrections, documents/versions/links, assignments/schedules/sessions/consents, assessments/answers/reviews, conferences/decisions, signedOutputs/releases/deliveries, followups/referrals, recordAccessGrants/disclosures, reports/audit/outbox.

Foreign key lintas kasus harus dicek scope, bukan hanya eksistensi. Unique constraint register sesuai scope yang disahkan, version number per resource, assessment item composite key, satu release aktif per snapshot jika policy menetapkan. Hash file tidak dijadikan identitas universal klien.

Mutasi bisnis dan outbox ditulis dalam transaksi sama. Worker scan/print/notifikasi hanya mendapat data minimum. Retry memakai deduplication key; job sudah sukses tidak menghasilkan dokumen/nomor baru tanpa versi baru. Status job QUEUED/PROCESSING/SUCCEEDED/FAILED; timeout menghasilkan error yang jujur, bukan toast â€œsuksesâ€.

Audit mencatat actor, role saat aksi, mandat bila relevan, resource/version, occurredAt/recordedAt, reason, requestId, outcome. Log operasional tidak berisi raw ASI, nomor rekening, kredensial, cookie atau file. Export/download/disclosure dicatat sebagai event akses.

Retensi dan backup mengikuti kebijakan organisasi; buku tidak memberi angka universal. Uji restore harus mencakup relasi DB ke object version, bukan DB saja.


---

<a id="section-014"></a>

## 13. Kebijakan terbuka dan batas kelengkapan

Rancangan ini mencakup semua tahap MVP dan kelompok data/dokumen dari spesifikasi yang disepakati. **â€œLengkapâ€ tidak berarti semua konflik buku telah diselesaikan atau setiap endpoint sudah diimplementasikan.** Ini kontrak desain untuk ditelaah sebelum coding.

Masih membutuhkan keputusan berwenang: perbedaan persyaratan bab/lampiran; rekening; instrumen ASI yang dipakai; cut-off/anchor SLA; SOP disposisi dan pemeriksaan signature; penomoran register; granularitas akses dan disclosure; penarikan/transfer/amendemen; retensi/hosting; format surat operasional dan recipients laporan; scoring monev; integrasi resmi.

Biaya layanan TAT tidak dibebankan ke klien menurut buku; jangan mengubah nomor rekening menjadi fitur pembayaran. Tidak ada API billing pasien dalam MVP.


---

<a id="section-015"></a>

## 14. Acceptance test kontrak

1. Semua endpoint business mencocokkan role, scope kasus, penugasan, status dan policy; UI bukan enforcement.
2. Request yang menyisipkan actor/status/role terlarang ditolak, bukan diterima mass assignment.
3. Pengaju tidak mendapatkan raw medis/hukum pada response list/detail/error.
4. Field hidden berbeda dari field bernilai null; data tidak bocor melalui count/permission detail.
5. Idempotency replay tidak membuat pengajuan/release/job ganda.
6. If-Match stale menghasilkan 412, tidak lost update.
7. Upload bytes gagal atau scan pending tidak dihitung sebagai dokumen READY.
8. Semua conditional checklist (termasuk urine) diuji per jalur, bukan semua field diwajibkan.
9. Input/noninput ASI, kode khusus, periode dan matrix terpetakan benar ke source.
10. Tidak ada default diagnosis, hasil pemeriksaan atau durasi.
11. Tim lain/Admin tidak dapat mengubah substansi assessment yang bukan haknya.
12. Keputusan Ketua menyimpan external person/mandate dan Admin recordedBy terpisah.
13. Penolakan dapat dicatat dari review yang lengkap tetapi hasil tidak memenuhi; tidak terblokir oleh â€œsemua harus validâ€.
14. Generate PDF sukses tidak mengubah status menjadi official release.
15. Official copy adalah byte dokumen arsip, bukan regenerate dari nilai live terbaru.
16. Release mengecek dua keluaran dan dependency final yang sama dalam transaksi.
17. Follow-up yang dilaporkan belum menjadi verified; kebutuhan serah terima bersyarat keputusan rehab.
18. WNA/non-TAT tidak dipaksa masuk jalur rehab sama.
19. Report/disclosure job yang sudah selesai tetap menolak download jika izin dicabut.
20. 202 punya job status polling dan failure yang dapat ditampilkan, bukan respons akhir palsu.
21. Kontrak JSON contoh valid; placeholder ID jelas sintetis, bukan UUID production.
22. Golden print tests membandingkan template dengan formulir sumber dan policy yang disahkan.


---

<a id="section-016"></a>

## 15. Referensi flow dan inventaris lengkap v1.0

Bagian berikut mempertahankan spesifikasi terdahulu dan seluruh transkripsi agar dokumen tunggal ini mandiri. **Endpoint/model API kanonis adalah bagian 1 sampai 14 v1.1 di atas.** Field source dan opsi instrumen di inventaris tetap menjadi acuan; keputusan terbuka tidak dianggap selesai.


---

<a id="section-017"></a>

## Spesifikasi Teknis E-TAT SIAPPULIH: MVP Empat Role

Versi rancangan: **1.0, 2 Oktober 2026**. Scope disepakati: **Sekretariat/Admin, Medis, Hukum, Pengaju**. Ketua TAT, pendamping, penerjemah, dan petugas fasilitas rehabilitasi dicatat sebagai pihak dalam proses, bukan role login tambahan.

### 0. Keputusan desain dan cara memakai dokumen

**Satu pengajuan adalah satu proses yang dapat ditelusuri dari berkas masuk sampai hasil dan tindak lanjut.** Data tidak disalin manual antarhalaman; setiap tahap memakai pengajuan yang sama, tetapi memiliki kewenangan, versi, dan formulirnya sendiri.

Rancangan ini memakai JUKNIS TAT BNN Edisi Revisi 2025 sebagai acuan isi dan formulir. Ia bukan pengesahan SOP baru. Label **J** menunjukkan isi/ketentuan sumber; **R** menunjukkan rekomendasi aplikasi; **K** menunjukkan keputusan kebijakan yang masih harus dikonfirmasi pemilik layanan.

Tipe data, nama field teknis, status internal, API, akses minimum, aturan transaksi, dan acceptance test adalah **R**. Label formulir dan opsi dicatat terpisah sebagai **J**. Kolom kosong pada buku tidak otomatis berarti wajib secara hukum.

Jika sebuah paragraf teknis tidak diberi label tersendiri, ia mengikuti kategori **R**, bukan kewajiban JUKNIS. Ketentuan sumber ditandai rujukan halaman atau lampiran; konflik dan kebijakan yang belum disahkan masuk **K**. Spesifikasi ini dapat dipakai membangun dan menguji aplikasi dengan data sintetis, tetapi bukan izin penggunaan produksi.

Gunakan dokumen ini berurutan: flow dan akses â†’ field inti â†’ katalog dokumen â†’ instrumen medis/hukum â†’ state machine dan API â†’ pengujian. Lampiran transkripsi dan workbook adalah bagian spesifikasi, bukan sekadar bacaan tambahan.

**Yang dibangun sekarang:** lima jalur pengajuan; verifikasi; pencatatan keputusan Ketua; penugasan/jadwal; asesmen medis/hukum; pembahasan kasus; berkas hasil sah; penyerahan; pencatatan tindak lanjut rehab; arsip, register, dan laporan.

**Yang tidak dibangun sebagai akun/modul penuh sekarang:** akun Ketua, akun fasilitas rehab, akun klien, rekam medis lengkap fasilitas, tanda tangan elektronik tersertifikasi, akses otomatis BOSS/SIN/intelijen, AI pengambil keputusan, dan otomatisasi pembayaran/honorarium. Bukti dari pihak tersebut tetap dapat dicatat.

#### Sumber dan batas kepastian

- [JUKNIS TAT 2025](https://t90182123892.p.clickup-attachments.com/t90182123892/fa5b234e-46f1-4182-8b83-131e7d1bc232/JUKNIS%20TAT%202025.pdf), 214 halaman PDF. Nomor `PDF 149 / cetak 134` merujuk halaman penampil dan footer buku.
- [Snapshot repo yang diaudit](https://github.com/code72694-max/E-TAT-/tree/cdaca9abddb23478ebd689a1fa65b3e39fe701a6). Pemeriksaan kode sebelumnya statis dan beberapa file besar terpotong; rancangan ini bukan klaim implementasi sudah selesai.
- Label/opsi lengkap Lampiran 3 sampai 9, tabel penempatan, dan inventaris operasional terdapat pada lampiran dokumen dan workbook. PDF asli tetap otoritatif untuk tata letak dan redaksi.
- Belum dilakukan validasi hukum terkini di luar edisi buku, uji build, maupun UAT operasional. Perbedaan bab/lampiran dan kebijakan terbuka tidak disembunyikan.

### 1. Aktor, kewenangan, dan batas data

| Aktivitas | Pengaju | Sekretariat/Admin | Medis | Hukum |
|---|---|---|---|---|
| Membuat pengajuan | Miliknya/instansi dengan delegasi sah | Input atas nama jika ada dasar; identitas pengaju asli tetap dicatat | Tidak | Tidak |
| Mengubah identitas/berkas pengajuan | Draf atau bagian yang diminta koreksi | Koreksi administratif dengan alasan dan jejak perubahan | Ajukan koreksi, tidak diam-diam mengubah | Ajukan koreksi, tidak diam-diam mengubah |
| Memverifikasi berkas | Melihat catatan untuk pengajuannya | Ya, sesuai penugasan administratif | Melihat hasil relevan | Melihat hasil relevan |
| Memberi disposisi Ketua | Tidak | Hanya mencatat bukti keputusan Ketua | Tidak | Tidak |
| Menugaskan dan menjadwalkan | Melihat undangan | Ya, berdasarkan mandat | Konfirmasi ketersediaan/kehadiran | Konfirmasi ketersediaan/kehadiran |
| Mengisi asesmen medis | Tidak | Status kelengkapan, bukan mengedit substansi | Kasus yang ditugaskan | Ringkasan final yang diperlukan untuk pembahasan |
| Mengisi asesmen hukum | Tidak | Status kelengkapan, bukan mengedit substansi | Ringkasan final yang diperlukan untuk pembahasan | Kasus yang ditugaskan |
| Mencatat pembahasan dan hasil | Tidak memutuskan | Mencatat sesuai berita acara/keputusan | Menyampaikan dan memeriksa hasil medis | Menyampaikan dan memeriksa hasil hukum |
| Mengunggah hasil bertanda tangan | Tidak menerbitkan | Mengarsipkan dan menerbitkan setelah gate lolos | Unggah/konfirmasi formulir medisnya | Unggah/konfirmasi formulir hukumnya |
| Menerima hasil | Hasil yang memang ditujukan kepadanya | Catat penyerahan | Akses kasus sesuai kewenangan | Akses kasus sesuai kewenangan |
| Melaporkan pelaksanaan rehab | Ya, dengan bukti | Verifikasi dan tindak lanjut | Pendapat medis bila ditugaskan | Pendapat hukum bila ditugaskan |
| Export data | Paket pengajuan/hasil yang diizinkan | Export berdasarkan scope izin | Tidak massal secara default | Tidak massal secara default |

**Empat role tidak berarti empat orang.** Medis dapat mempunyai beberapa akun dokter/psikolog; Hukum beberapa akun unsur BNN/Polri/Kejaksaan. Simpan role aplikasi terpisah dari profesi, instansi, jabatan, SK, dan penugasan.

Admin aplikasi bukan otomatis pemegang kewenangan Ketua atau dokter. Semua endpoint mengecek organisasi, penugasan, status record, dan jenis data; jangan hanya menyembunyikan tombol.

Medis/Hukum hanya dapat melihat ringkasan lintas tim yang diizinkan, mengakui penerimaan, atau meminta klarifikasi. Keduanya tidak boleh mengisi, mengedit, memfinalisasi, mengamendemen, atau menandatangani hasil tim lain. Record Ketua/pihak eksternal tidak memiliki credential login atau identitas actor API.

Rekam data bersifat rahasia. Akses dokumen medis rinci oleh sekretariat atau pihak lain memerlukan kebijakan yang disahkan; default rancangan adalah **akses minimum**, dengan ringkasan operasional dan status kelengkapan. Permintaan pembukaan rekam data mengikuti proses tertulis kepada Ketua (PDF 103 / cetak 88).

### 2. Flow lengkap dan keluaran tiap tahap

| Tahap | Penanggung jawab dalam aplikasi | Input utama | Hasil/gate untuk lanjut |
|---|---|---|---|
| 0. Verifikasi akun | Admin | Identitas kedinasan, instansi, dasar kewenangan | Akun aktif dengan role yang ditetapkan, bukan dipilih bebas |
| 1. Draf pengajuan | Pengaju | Jalur, identitas, perkara, bukti dan surat | Draf tersimpan; belum menjadi pengajuan resmi |
| 2. Kirim pengajuan | Pengaju | Snapshot draf dan dokumen siap | Waktu kirim server, nomor pelacakan, versi terkunci |
| 3. Verifikasi berkas | Admin | Checklist jalur dan isi setiap versi file | Catatan koreksi atau ringkasan verifikasi |
| 4. Disposisi | Admin mencatat keputusan Ketua | Bukti persetujuan/penolakan dan otoritas | Persetujuan sah atau surat penolakan beserta alasan |
| 5. Penugasan/jadwal | Admin | Tim, mandat, waktu, lokasi, undangan | Komposisi benar, jadwal aktif, pemberitahuan tercatat |
| 6. Prasyarat pemeriksaan | Admin bersama petugas | Bebas biaya, ASSENT jika anak, pendamping, penerjemah | Status prasyarat jelas; kendala ditangani manusia |
| 7A. Medis | Medis | Instrumen, wawancara, fisik, lab, penempatan | Hasil medis final dan pengesahan yang diperlukan |
| 7B. Hukum | Hukum | Dokumen, wawancara, peran/jaringan, fakta | Hasil hukum final dan pengesahan yang diperlukan |
| 8. Pembahasan Kasus TAT | Admin mencatat; Medis/Hukum memeriksa substansinya | Hasil final kedua tim, kehadiran, keputusan Ketua | Kesimpulan dan rekomendasi dengan dasar/bukti |
| 9. Hasil resmi | Admin | BA dan surat jawaban ditandatangani | Dua dokumen cocok dengan keputusan versi final |
| 10. Penyerahan hasil | Admin/Pengaju | Paket hasil, bukti kirim/terima | Hasil tersampaikan, bukan otomatis rehab selesai |
| 11. Tindak lanjut | Pengaju melapor, Admin memverifikasi | Serah terima, penerimaan fasilitas, pelaksanaan | Dilaksanakan/tidak, hambatan dan bukti |
| 12. Pelaporan/arsip | Admin | Data kasus dan tindak lanjut terverifikasi | Register, laporan periodik, arsip terjaga |

Medis dan Hukum adalah dua jalur kerja terpisah yang dapat berjalan sesuai jadwal, bukan wajib berurutan. Dalam wawancara Hukum, urutan petugas/penyidik/JPU lebih dahulu, kemudian terperiksa, mengikuti sumber (PDF 77).

â€œPembahasan Kasus TATâ€ atau â€œCase Conferenceâ€ harus dibedakan dari sidang pengadilan. Jalur pemeriksaan di pengadilan adalah jenis pengajuan, bukan nama pertemuan internal TAT.

### 3. Model identitas dan penomoran

Hubungan yang disarankan: **Client â†’ Case â†’ Application**. Satu orang dapat memiliki lebih dari satu perkara/pengajuan. Scope MVP: satu pengajuan untuk satu terperiksa; jika surat pemohon berisi beberapa orang, buat pengajuan terpisah yang merujuk surat/perkara yang sama. Ini keputusan desain, bukan klaim buku menetapkan cardinality tersebut.

Nomor pelacakan aplikasi dibuat saat submit dan berbeda dari kode registrasi TAT. Format register sumber: `Tahun - Kode Provinsi - Kode Kabupaten/Kota - xxx (no. urut klien) - TAT` (PDF 103). Waktu pemberian register dan scope sequence nasional/provinsi/kabupaten harus disahkan; untuk rancangan awal, Admin mengesahkan registrasi setelah disposisi diterima. Jangan menampilkan nomor pelacakan sebagai register resmi.

Gunakan UUID internal; nomor yang dibaca manusia disimpan terpisah. Urutan register dihasilkan melalui transaksi/unique constraint, bukan jumlah baris + 1. Ketentuan penomoran untuk pusat, pengajuan ulang, dan nomor batal harus masuk konfigurasi yang disetujui.

### 4. Kamus data inti pengajuan

**Arti kebutuhan:** `W` wajib secara aplikasi pada aksi yang disebut; `B` bersyarat; `O` opsional. Semua W/B/O di bawah adalah rancangan validasi, bukan kesimpulan bahwa setiap field diwajibkan secara eksplisit oleh buku. Draf boleh parsial. Status tidak diketahui/tidak dimiliki harus disertai konteks dan tidak mengisi nilai palsu.

#### 4.1 Konteks pengajuan dan pemohon

| Key teknis | Label/isi | Tipe | Kebutuhan dan aturan | Pengisi |
|---|---|---|---|---|
| application.route | Lima jalur pengajuan | enum | W saat submit; tidak diganti diam-diam setelah submit | Pengaju |
| application.target_tat_unit_id | TAT tujuan | FK | W; tingkat nasional/provinsi/kabupaten-kota | Pengaju |
| application.source_channel | Web/manual/BOSS/komunikasi resmi | enum | W; asal berkas, bukan klaim integrasi | Sistem/Admin |
| applicant.organization_id | Asal Instansi | FK + snapshot nama | W; diambil dari akun yang terverifikasi | Sistem |
| applicant.submitted_by_name | Yang Mengajukan Berkas | string | W; nama pemohon sebenarnya | Pengaju |
| applicant.rank, applicant.position | Pangkat/golongan dan jabatan | string | B sesuai kedinasan | Pengaju |
| applicant.service_number | NIP/NRP/identitas kedinasan | string | B sesuai institusi; jangan angka numerik | Pengaju |
| applicant.phone, applicant.email | Kontak pemohon | string | W minimal kanal kontak yang disetujui | Pengaju |
| applicant.authority_document_id | Surat kewenangan/penunjukan | FK file version | B; akses tidak diperoleh dari role yang dipilih publik | Admin |
| application.submitted_at | Waktu kirim aplikasi | timestamptz | W, server; tidak bisa diedit pemohon | Sistem |
| application.source_application_date | Tanggal Pengajuan pada dokumen | date | W saat registrasi; terpisah dari waktu entri | Pengaju/Admin |
| application.recorded_by_user_id | Petugas input | FK | W; termasuk input atas nama pemohon | Sistem |
| application.policy_version_id | Versi aturan persyaratan | FK | W saat submit | Sistem |
| application.related_application_id | Pengajuan terdahulu | FK | B untuk pengajuan ulang/lanjutan | Pengaju/Admin |

Pemohon penangkapan/P19 adalah Penyidik sesuai bab; penuntutan oleh JPU; pemeriksaan sidang oleh JPU yang mendapat penetapan Hakim. Role `PENGAJU` diberi atribut jenis instansi/kewenangan, bukan semua jalur terbuka untuk semua akun.

| Jalur | Kewenangan pemohon yang dicek server | Dasar terkait |
|---|---|---|
| Tanpa BB/dengan BB | Penyidik Polri/BNN | Identitas/mandat dan surat perkara |
| P19 | Penyidik setelah petunjuk/koordinasi JPU | P19 atau BA koordinasi |
| Penuntutan | JPU | Kewenangan penuntutan dan dokumen perkara |
| Pemeriksaan sidang | JPU yang mendapat penetapan Hakim | Kewenangan JPU serta penetapan |

Pihak yang namanya tercantum pada surat tidak otomatis menjadi pengguna aplikasi; label contoh surat tidak menggantikan tata cara bab.

#### 4.2 Identitas klien: sumber tunggal dengan snapshot per pengajuan

| Key teknis | Label/isi | Tipe | Kebutuhan dan aturan |
|---|---|---|---|
| client_snapshot.full_name | Nama Tersangka atau Terdakwa | string | W saat submit; sesuai dokumen |
| client_snapshot.identity_type | KTP/Kartu Pelajar/Kartu Mahasiswa/KK/Paspor/lain yang diizinkan | enum | W; pilihan disesuaikan jalur/source |
| client_snapshot.identity_number | NIK/Nomor KTP/Nomor paspor | string | B menurut jenis identitas; NIK 16 digit untuk input NIK, bukan semua identitas |
| client_snapshot.birth_place | Tempat lahir | string | B bila sumber tersedia; wajib terselesaikan sebelum output yang memuatnya |
| client_snapshot.birth_date | Tanggal lahir | date | B; tidak mengarang tanggal untuk usia perkiraan |
| client_snapshot.age_at_assessment | Usia pada tanggal asesmen | integer | Hitung bila tanggal lahir pasti; jika perkiraan simpan sumber dan flag |
| client_snapshot.sex | Jenis Kelamin | code + answer_state | Sesuai pilihan template; belum diketahui/tidak diisi tidak menjadi default jenis kelamin |
| client_snapshot.nationality | Kewarganegaraan | string/FK + answer_state | Diselesaikan untuk routing/keluaran; nilai tidak diketahui tetap tercatat, bukan diasumsikan WNI |
| client_snapshot.address | Alamat | text + wilayah | W pada pemeriksaan administratif sesuai ketersediaan sumber |
| client_snapshot.phone | Nomor Handphone | string | Status nilai harus tercatat; bukan HP penyidik |
| client_snapshot.account_number | Nomor Rekening | string terlindungi | Ada pada formulir; fungsi/pemilik/requiredness belum dijelaskan buku, K |
| client_snapshot.marital_status | Status perkawinan | code + template | B pada asesmen; jangan menyamakan kode ASI Full dengan versi ringkas |
| client_snapshot.education | Pendidikan/riwayat pendidikan | code/text | Diselesaikan untuk asesmen/laporan |
| client_snapshot.occupation | Pekerjaan/riwayat pekerjaan | text/code | Diselesaikan untuk asesmen/laporan |
| client_snapshot.religion | Agama | string | Form bebas biaya memuatnya; bukan alasan otomatis menolak pengajuan |
| client_snapshot.child_status | Status anak untuk safeguard | YES/NO/UNDETERMINED + basis | Berdasar tanggal lahir dan kebijakan usia yang disahkan; belum pasti tidak dianggap dewasa |
| client_snapshot.interpreter_need | Kebutuhan penerjemah | YES/NO/NOT_ASSESSED + bahasa | B; belum dinilai tidak dianggap tidak perlu |
| client_snapshot.data_provenance | Asal data, dokumen, status kepastian | JSON terstruktur | W untuk koreksi/perbedaan identitas |

Perbedaan identitas pada surat dan dokumen memunculkan pekerjaan koreksi. Medis/Hukum tidak mengubah snapshot pengajuan tanpa alur koreksi administratif. Form pemeriksaan menyimpan snapshot yang dipakai pada tanggal pemeriksaan.

#### 4.3 Perkara, penangkapan, barang bukti, laboratorium

| Key teknis | Data | Tipe/keterangan | Kebutuhan |
|---|---|---|---|
| case.reference_number | Nomor perkara/LP/LKN/informasi sesuai jalur | string | W sesuai dokumen rujukan |
| case.request_letter_number, case.request_letter_date | Nomor/tanggal surat permohonan | string + date | W |
| case.alleged_articles[] | Pasal yang disangkakan | daftar teks terstruktur | W bila sudah ada; jangan satu pasal hard-coded |
| case.chronology | Kronologis kejadian | text | W untuk pemeriksaan, dapat dilengkapi dari berkas |
| case.arrest_order_issued_at | Penerbitan SP Penangkapan | timestamptz + precision | B pada masa penangkapan; sumber clock 3 x 24 jam |
| case.arrested_at | Waktu penangkapan | timestamptz + precision | B; terpisah dari penerbitan SP |
| case.detention_started_at, case.detention_location | Penahanan | date/time + text | B, tidak disamakan dengan penangkapan |
| case.p19_reference | Nomor/tanggal petunjuk P19/BA koordinasi | object + file | B jalur P19 |
| case.prosecution_reference | Dasar permohonan penuntutan | object + file | B penuntutan |
| case.court_order_reference | Penetapan Hakim/persidangan | object + file | B jalur sidang |
| evidence_items[] | Barang bukti berulang | ID, jenis zat, uraian, jumlah, satuan, bruto/netto bila ada, sumber lab | B jika ada BB |
| evidence_items[].sema_category | Tidak ada/di bawah/sama dengan/di atas/belum diatur/belum ditelaah | enum usulan | Penilaian Hukum; â€œsama denganâ€ tidak diputuskan dari ambiguitas sumber |
| lab_results[] | Hasil pemeriksaan | Spesimen urine/rambut/darah/BB, pemeriksa, nomor surat, tanggal ambil/periksa/terbit | B sesuai jalur |
| lab_results[].analytes[] | Zat yang diuji dan hasil | kode/nama, positif/negatif/status lain sesuai laporan asli | Jangan tidak diperiksa menjadi negatif |
| lab_results[].report_document_version_id | Bukti hasil laboratorium | FK | W jika hasil dijadikan dasar |

Jumlah BB memakai decimal, bukan floating-point bebas; satuan eksplisit. Jika surat hanya memuat tanggal tanpa jam, simpan precision `DATE_ONLY`, jangan membuat jam 00:00 sebagai fakta. SLA yang tidak dapat dihitung pasti diberi flag perlu verifikasi.

### 5. Checklist dokumen pengajuan: lima konfigurasi

Sumber: Lampiran 4.1(i), 4.1(ii), 4.2, 4.3, 4.4 pada PDF 148 sampai 152. Daftar berikut ringkasan pemetaan; **label lengkap verbatim ada pada Lampiran A dan workbook**.

#### 5.1 Tanpa barang bukti

1. Surat permohonan dari penyidik.
2. Fotokopi identitas yang diterima formulir.
3. Laporan Informasi atau LP atau LKN.
4. BA Interogasi atau BA Pemeriksaan.
5. SP Penangkapan atau SP Tugas.
6. Surat hasil urine fasilitas pemerintah, dengan kondisi waktu dan hasil positif yang dicetak.
7. Bukti elektronik bila ada.

#### 5.2 Dengan barang bukti

1. Surat permohonan dari penyidik.
2. Fotokopi identitas.
3. LP atau LKN.
4. BA Interogasi atau BAP tersangka.
5. SP Penyidikan.
6. SP Penangkapan.
7. SP Penggeledahan.
8. SP Penyitaan BB.
9. BA Penggeledahan.
10. BA Penyitaan BB.
11. Hasil Pemeriksaan Laboratorium Sementara.
12. Surat hasil urine dari fasilitas pemerintah dalam jangka waktu yang dicetak.
13. Kondisi urine positif/negatif untuk BB kurang dari ketentuan SEMA.
14. Kondisi urine positif untuk BB lebih dari ketentuan SEMA.
15. Kondisi urine positif/negatif untuk BB belum diatur.
16. Bukti elektronik bila ada.

**Baris 13 sampai 15 bukan tiga file wajib bersamaan.** Itu kondisi pemeriksaan yang dapat merujuk dokumen lab yang sama. Jangan menghitung â€œ16 barisâ€ sebagai â€œwajib upload 16 PDFâ€.

#### 5.3 P19

1. Surat permohonan dari penyidik.
2. Fotokopi identitas.
3. SPDP dengan label sebagaimana tercetak pada sumber.
4. LP atau LKN.
5. SP Penahanan.
6. BAP tersangka.
7. SP Penyidikan.
8. BA Penyitaan BB.
9. Penetapan Status BB dari Kejaksaan.
10. Surat Keterangan Uji Lab BB.
11. BA Penetapan Sita BB dari PN apabila ditemukan BB.
12. Hasil urine atau rambut positif dari fasilitas pemerintah.
13. Bukti elektronik/forensik komunikasi bila ada.
14. Petunjuk P19 atau BA Koordinasi untuk asesmen terpadu.

#### 5.4 Penuntutan

1. Surat permohonan JPU.
2. Resume berkas perkara.
3. Surat hasil uji lab alat bukti.
4. Surat penetapan penyitaan BB dari Pengadilan.
5. Surat hasil pemeriksaan rambut positif narkotika.
6. Bukti elektronik/forensik komunikasi bila ada.

#### 5.5 Pemeriksaan sidang pengadilan

1. Surat permohonan Jaksa yang mendapat penetapan Hakim.
2. Surat dakwaan.
3. Resume berkas perkara.
4. Surat perintah pelimpahan perkara.
5. Surat penetapan persidangan.
6. Hasil forensik alat komunikasi bila ada; pada formulir sumber nomor 5 berulang, tidak dinormalisasi diam-diam.

#### 5.6 Perilaku komponen checklist

Setiap item memiliki `requirement_id`, `source_label`, `source_number`, `source_page`, `policy_version`, `applicability`, `availability`, `document_version_ids[]`, `verification_state`, `reviewer`, `reviewed_at`, dan `notes`.

Tambahkan `condition_assessment` = belum dinilai/memenuhi/tidak memenuhi/tidak berlaku/tidak diketahui, serta `requirement_basis` = bab/lampiran/policy disahkan/konflik belum selesai. Keberadaan file (`availability=ada`) tidak membuktikan hasil urine atau kondisi waktunya memenuhi persyaratan.

`applicability`: belum dinilai/berlaku/tidak berlaku dengan dasar. `availability`: ada/tidak ada sesuai formulir. Status â€œtidak berlakuâ€ adalah metadata aplikasi, tidak mengganti kolom Ada/Tidak Ada dalam formulir resmi. Aturan ekspor untuk kondisi tidak berlaku harus disahkan.

Upload berkas satu PDF yang memuat beberapa jenis dokumen boleh dipetakan ke beberapa item dengan rentang halaman. Sebaliknya satu item bisa mempunyai beberapa file. Simpan hubungan many-to-many; jangan memaksa nama file menentukan jenis dokumen.

**Gate konfigurasi:** bab dan lampiran berbeda untuk BB serta penuntutan. Simpan kedua sumber; tandai persyaratan belum disahkan sebagai `POLICY_REVIEW_REQUIRED`. Di lingkungan produksi jangan membuat keputusan otomatis berdasarkan aturan yang belum disahkan. Pada data uji boleh memakai konfigurasi kandidat dengan label jelas.

### 6. Upload, versi file, dan metadata dokumen

| Field | Isi |
|---|---|
| document_id / version_id | ID logis dan versi immutable |
| category / template_version_id | Jenis dokumen serta versi template |
| original_filename / mime_type / byte_size | Metadata terdeteksi server, bukan hanya kiriman browser |
| storage_object_key | Key penyimpanan privat; bukan URL publik permanen |
| sha256 | Checksum file nyata, bukan bukti TTE |
| document_number / document_date / issuer | Metadata surat, bila ada |
| uploaded_by / uploaded_at | Aktor dan waktu server |
| source_signatories[] | Nama, jabatan, institusi, dasar mandat; untuk dokumen bertanda tangan |
| signature_method | Basah hasil pindai / elektronik eksternal / belum ditandatangani |
| authenticity_review | Belum diperiksa / diperiksa sesuai prosedur / bermasalah; tidak menyebut kriptografis bila belum diverifikasi |
| scan_status | Uploading / quarantined / ready / rejected |
| supersedes_version_id / revision_reason | Hubungan dan alasan perubahan |
| confidentiality / access_scope | Pembatasan menurut kategori dan kewenangan |

Usulan awal: PDF/JPEG/PNG, ukuran maksimum configurable (contoh 20 MB/file), deteksi MIME/magic bytes, scan malware, karantina sebelum dipakai. File PDF aktif/berpassword diarahkan ke pemeriksaan, bukan diproses sembarangan. Ukuran ini bukan ketentuan buku.

Unduh melalui otorisasi server dan URL sementara. Thumbnail/OCR mengikuti izin file asli. Notifikasi email tidak memuat diagnosis, NIK, rekening, atau lampiran medis; cukup ajakan membuka aplikasi yang terautentikasi.

### 7. Verifikasi, revisi, dan disposisi Ketua tanpa akun Ketua

Admin memeriksa versi berkas yang dikirim, bukan versi yang sedang diedit pemohon. Checklist verifikasi mencakup identitas konsisten, jalur sesuai dasar permohonan, isi/nomor/tanggal surat terbaca, keterkaitan BB/lab, waktu, dan kondisi khusus anak/WNA.

#### Data yang dicatat

`Verification`: application_version, requirement_id, document_version_id, outcome, reason_code, reason_text, reviewed_by, reviewed_at. Hasil item: `PENDING`, `VALID`, `CORRECTION_REQUIRED`, `INVALID`.

`CorrectionRequest`: item/field yang dikoreksi, alasan, target actor, created_at, response_at, replacement_version, resolution. Pemohon mengubah bagian yang diminta, bukan seluruh pengajuan tanpa kontrol.

`DispositionRecord`: approved/rejected, decided_at, chair_person_id, chair_position, mandate_reference, signed_evidence_document_version_id, reason, recorded_by_admin_id, recorded_at, evidence_review.

**Dua identitas harus berbeda secara konsep:** pembuat keputusan eksternal dan petugas pencatat. Admin mengklik â€œCatat keputusan Ketuaâ€, bukan â€œSaya menyetujui sebagai Ketuaâ€.

`chair_person_id` berasal dari record person/mandat, tidak otomatis dari session Admin. Snapshot nama, jabatan, tingkat TAT, masa kewenangan dan bukti surat ikut dikunci. Mekanisme ini berlaku juga pada pencatatan hasil pembahasan, bukan hanya disposisi awal.

Penolakan resmi membutuhkan alasan dan Surat Penolakan TAT Lampiran 5. Koreksi bukan penolakan resmi. Jika pemohon mengajukan kembali setelah ditolak, buat pengajuan baru dengan tautan ke versi yang ditolak; nomor, waktu dan keputusan lama tetap utuh.

Jika terperiksa bukan tersangka/terdakwa, catat rujukan ke layanan rehabilitasi yang sesuai dan dasar penanganannya; jangan memalsukan disposisi TAT untuk melanjutkan asesmen pidana.

### 8. Penugasan, kalender, dan prasyarat

#### 8.1 Data penugasan

`TeamAssignment`: application_id, stream(MEDICAL/LEGAL), person_id, user_id nullable, institution, profession, role_in_team, mandate_document_id, valid_from/to, assigned_by, accepted_at, attendance, conflict_of_interest_note.

Tim medis dua pelaksana sesuai ketentuan. Tim hukum disesuaikan fase: penangkapan memakai unsur yang disebut dengan kemungkinan minimal dua unsur ketika salah satu berhalangan; P19/penuntutan/persidangan memuat BNN, Polri, Kejaksaan. Record signatory dalam template tidak menjadi algoritme hitung jumlah anggota.

Sistem menampilkan peringatan jika pemeriksa hukum juga penyidik/Jaksa pemohon karena buku menyatakan pemeriksa diutamakan berbeda. Jangan mengubah kata â€œdiutamakanâ€ menjadi larangan mutlak tanpa kebijakan.

#### 8.2 Data jadwal

`AssessmentSchedule`: session_type, starts_at, ends_at, timezone, delivery_mode, location, meeting_link_private, participants[], invitation_document_id, reason_for_remote_or_alternative_location, supporting_document_id, version, reschedule_reason.

Konflik jadwal memunculkan warning/gate sesuai kebijakan. Reschedule tidak menghapus jadwal lama atau mereset SLA. Undangan/pemberitahuan ke Pengaju dan tim memiliki status terkirim/gagal/diterima, dengan retry tercatat.

#### 8.3 Checklist pra-asesmen

1. Identitas terperiksa telah dicocokkan.
2. Bukti surat bebas biaya tersedia sebelum pemeriksaan.
3. ASSENT anak, tanda tangan/pilihan persetujuan, dan pendampingan tercatat bila berlaku.
4. Pendamping/penerjemah terjadwal dan hadir bila diperlukan.
5. Komposisi tim dan mandat telah diperiksa.
6. Kondisi kesehatan/kendala lokasi/daring dicatat.
7. Dokumen administrasi yang menjadi dasar pemeriksaan dapat diakses petugas.

`ConsentRecord`: jenis formulir, template_version, child_or_client_identity_snapshot, dibacakan_oleh, dibacakan_at, pilihan setuju/tidak setuju/belum selesai, parent_guardian_identity, relationship, witness_identity, signed_document_id, remarks. Jangan default `setuju`.

`CompanionRecord`: nama, jenis hubungan/peran, instansi bila ada, kontak, dasar keterlibatan, attendance session. `InterpreterRecord`: nama, bahasa, instansi/penugasan, sesi, bukti hadir.

Surat bebas biaya memuat Nama, Tempat/Tanggal Lahir, Agama, Alamat, Telp, pernyataan, saksi, pembuat pernyataan, materai dan tanggal sesuai template (PDF 191). Bukan formulir tagihan.

Kondisi darurat ditangani tenaga berwenang tanpa dihambat checklist software. Aplikasi menyediakan event penanganan darurat/rujukan dan alasan tahap rutin belum selesai; bukan override diam-diam.

### 9. Medis: field, checklist, dan finalisasi

#### 9.1 Halaman medis

Urutan tab: **Identitas sesi â†’ ASI â†’ Pemeriksaan fisik/lab â†’ Diagnosis â†’ Instrumen penempatan â†’ Ringkasan/usulan â†’ Pemeriksaan akhir**.

Header tiap sesi: application_id, registration_number, client snapshot, nomor rekam medik bila ada, tanggal kedatangan, waktu mulai/selesai asesmen, dua pelaksana, metode pelaksanaan, template instrumen, serta sumber anamnesis.

**Rekomendasi:** implementasikan kedua template Lampiran 7.1 dan 7.2. Jangan mewajibkan keduanya diisi penuh untuk semua orang; pilihan instrumen dan kapan dipakai harus disahkan koordinator/pemilik proses medis. Dilarang mengganti instrumen dengan skor ASSIST generik.

#### 9.2 Data ASI Wajib Lapor/Rehabilitasi Medis

Tabel berikut menjelaskan kelompok UI; label, nomor, dan opsi persis berada di Lampiran A/worksheet ASI Wajib Lapor (PDF 166 sampai 170).

| Bagian | Data yang diinput | Bentuk kontrol |
|---|---|---|
| Demografis | Kedatangan, no rekam medik, nama, lahir, alamat, HP, jenis kelamin, status perkawinan, pendidikan | Prefill terkontrol + konfirmasi pemeriksa |
| Status medis | Riwayat rawat inap bukan terkait narkotika: penyakit, tahun dirawat, lamanya; penyakit kronis dan jenis; terapi saat ini; tes/status HIV, Hepatitis B/C | Repeated table, pilihan dan uraian |
| Pekerjaan/dukungan | Status/pola pekerjaan, kode pekerjaan, keterampilan, pemberi dukungan, bentuk finansial/tempat tinggal/makan/perawatan | Kode sumber + conditional fields |
| Zat | Alkohol, heroin, metadon/buprenorfin, opiat lain, barbiturat, sedatif/hipnotik, kokain, amfetamin, kanabis, halusinogen, inhalan, lebih dari satu zat | Matrix: 30 hari terakhir, sepanjang hidup dalam tahun, cara pakai |
| Riwayat terapi/overdosis | Zat utama, pernah rehab, jenis terapi, pernah overdosis, kapan, penanggulangan | Pilihan, tanggal/uraian, follow-up condition |
| Legal pada instrumen medis | Riwayat tuntutan 14 kategori serta jumlah yang berakibat vonis | Count per kategori; bukan pengganti asesmen Tim Hukum |
| Keluarga/sosial | Situasi tinggal, orang serumah dengan masalah zat, hubungan, konflik serius | Matrix 30 hari/sepanjang hidup, pilihan dan keterangan |
| Psikiatris | Depresi, cemas, halusinasi, kesulitan mengingat/fokus, perilaku kasar, pikiran/percobaan bunuh diri, pengobatan psikiater | Ya/tidak per periode sesuai instrumen, catatan petugas |
| Pemeriksaan fisik | Tekanan darah, nadi, RR, suhu, pencernaan, jantung/pembuluh, pernapasan, SSP, THT/kulit, keterangan | Angka+unit, pemeriksaan sistemik |
| Urinalisis | Benzodiazepin, kanabis, opiat, amfetamin, kokain, barbiturat, alkohol | Jawaban sesuai kode form + status apakah diperiksa + referensi lab |
| Ringkasan | Severity domain Medis, Pekerjaan/Dukungan, Napza, Legal, Keluarga/Sosial, Psikiatris; diagnosis Napza/lain, resume masalah | Nilai 0 sampai 9 sesuai form dan narasi; bukan diagnosis otomatis |
| Rencana terapi | Asesmen lanjut, evaluasi psikologis, detoksifikasi, wawancara motivasional, intervensi singkat, terapi rumatan, rehab inap, konseling, lainnya | Opsi sumber + isian rincian |
| Pengesahan | Petugas asesmen, mengetahui dokter, menyetujui pasien | Identitas, tanda tangan/dokumen bukti sesuai prosedur |

Temuan risiko keselamatan pada wawancara psikiatris diarahkan kepada pemeriksa berwenang melalui peringatan privat; jangan muncul pada tracking publik atau diputuskan otomatis oleh skor.

#### 9.3 ASI Full

Template Full mempunyai keluarga item G, M, E, D, L, F, P, catatan, rating klien, confidence rating, dan penutup. **Jangan membuat urutan nomor asumtif:** nomor yang tidak tercetak tidak diinventasikan.

Simpan jawaban menurut `template_item_id`, `source_code`, `matrix_row`, `matrix_column`, `period`, `repeat_index`, dan `value`. Periode 30 hari dan sepanjang hidup tidak digabung. Skala klien 0 sampai 4 berbeda dari severity ringkasan 0 sampai 9 versi lainnya.

Kode khusus `X`, `N`, `NN`, `00` mengikuti item/instruksi. `0`, belum dijawab, menolak menjawab, tidak berlaku, dan tidak tahu adalah keadaan berbeda. Instruksi â€œisilah semuanyaâ€ harus dibaca bersama hak tidak menjawab dan kode khusus yang tersedia (PDF 155).

#### 9.4 Diagnosis dan instrumen penempatan

`MedicalConclusion`: diagnosis_entries[] berisi sistem kode, versi sumber, kode, nama, primer/sekunder, alasan; pola penggunaan; fakta medis; kebutuhan layanan; usulan durasi beserta unit; alasan rekomendasi; reviewing_clinicians[].

Daftar diagnosis Lampiran 9 adalah referensi berisi pola kode seperti `F1x.xx`, bukan semua pola merupakan kode pasien final yang bisa dipilih tanpa rincian. Jangan membangun dropdown yang menyimpan wildcard sebagai diagnosis spesifik secara otomatis.

`PlacementAssessment`: enam dimensi; per dimensi simpan selected_indicator_ids[], severity_assessed, explanatory_notes, source_page, examiner; keseluruhan simpan proposed_service_level, rationale, discordance_review, consultation, explanation_to_client, client_response.

Dimensi: intoksikasi/putus zat; kondisi medis; emosional/perilaku/kognitif; kesiapan berubah; kekambuhan; lingkungan. Level 0 sampai 4 mengikuti tabel. **Tidak ada rata-rata/total/max otomatis untuk menentukan hospitalisasi.** Tabel tambahan PDF 183 menyatakan beberapa dimensi tidak sendiri mengindikasikan tingkat 4; pertimbangan profesional wajib.

#### 9.5 Checklist sebelum final medis

1. Identitas dan tanggal sesi cocok.
2. Dua pelaksana serta kewenangannya tercatat.
3. Template dan versi instrumen jelas.
4. Item berlaku telah dijawab atau mempunyai kode/penjelasan yang diizinkan.
5. Hasil lab mempunyai sumber dan tidak diperiksa tidak dianggap negatif.
6. Diagnosis, fakta medis, dan usulan tidak berisi nilai contoh.
7. Instrumen penempatan dan pertimbangan sudah ditelaah sesuai kebijakan.
8. Persetujuan/pengesahan pada form yang dipakai tersedia sesuai prosedur.
9. Pemeriksa meninjau preview hasil sebelum finalisasi.

Finalisasi mengunci versi. Koreksi setelah final menjadi amendemen dengan alasan, penulis, waktu, reviewer, dan versi baru. Admin tidak boleh mengubah diagnosis.

### 10. Hukum: field, checklist, dan finalisasi

Urutan tab: **Identitas â†’ Dokumen/perkara â†’ Wawancara â†’ Riwayat hukum â†’ Peran/jaringan â†’ Bukti analisis â†’ Kesimpulan â†’ Pemeriksaan akhir**.

#### 10.1 Data sesuai Lampiran 8

| Kelompok | Field sumber yang perlu ada |
|---|---|
| Sesi | TANGGAL ASESMEN HUKUM, TIM ASESMEN HUKUM TINGKAT |
| Identitas | NAMA, NIK, USIA, TEMPAT TANGGAL LAHIR, ALAMAT, NOMOR HANDPHONE, NOMOR REKENING, STATUS PERKAWINAN, RIWAYAT PENDIDIKAN, RIWAYAT PEKERJAAN, rata-rata penghasilan satu bulan, CATATAN |
| Kejadian | KRONOLOGIS KEJADIAN, jenis narkotika, hasil urine positif beserta nama zat atau negatif |
| Riwayat | Narkotika, psikotropika, pencurian, perampokan, pembunuhan, pemerkosaan, lainnya sesuai pilihan |
| Penahanan | Tindak pidana, tempat/tanggal penahanan, lamanya, penangguhan, bebas demi hukum, proses hukum lanjut |
| Persidangan | Tindak pidana, vonis Hakim dan lama, ditempatkan di Rutan/Lapas |
| Zat saat penangkapan | Heroin, ganja, ekstasi, sabu/methamphetamine, kokain, carisoprodol, cannabinoid sintetis, lainnya |
| Tujuan penguasaan | Dipakai sendiri, bersama-sama, titipan orang, akan dijual, lainnya |
| Perolehan | Metode pembelian: langsung, teman, jaringan, aplikasi, lainnya, berikut isian |
| Pembayaran | Cash, transfer dengan ada/tidak bukti, uang elektronik; untuk siapa, berapa kali, harga |
| Penelusuran | Pengecekan database intelijen, bukti pendukung |
| Akhir | FAKTA FAKTA HUKUM, KESIMPULAN, tempat/tanggal, anggota dan NIP/NRP/tanda tangan |

Sumber: PDF 171 sampai 173. Jumlah blok tanda tangan pada contoh tidak boleh sendiri menentukan komposisi semua jalur.

#### 10.2 Data tambahan untuk membuktikan proses

`LegalInterview`: interviewee_type, identity, capacity, conducted_at, interviewer, chronology_notes, document_refs, sequence. Pisahkan wawancara petugas/penyidik/JPU dan terperiksa.

Validasi urutan dari waktu kejadian yang dicatat; bila berbeda dari urutan sumber, simpan penyimpangan dan alasan untuk ditelaah, bukan mengubah timestamp agar seolah-olah urut.

`LegalCheck`: check_type(SIPP/intelijen/riwayat TAT/bukti elektronik/lainnya), source_reference, checked_at, checked_by, findings, limitations, evidence_document_ids, lawful_authority_reference. Jika tidak mendapat akses, simpan `NOT_PERFORMED` dengan alasan, bukan â€œtidak ditemukan jaringanâ€.

`LegalConclusion`: fakta, pasal yang ditelaah, peran dan alasan, indikasi jaringan beserta dasar, telaah jenis/jumlah BB dan SEMA, riwayat relevan, usulan kelanjutan perkara, usulan penempatan terkait hukum. Bedakan dugaan, temuan, dan kesimpulan.

Jangan membuat pilihan â€œpengedar = pasti tidak boleh rehabilitasiâ€ atau â€œdi bawah ambang = otomatis penghentian perkaraâ€. Rekomendasi buku bercabang; keputusan tetap Tim/Ketua yang berwenang (PDF 82 sampai 85).

#### 10.3 Checklist final hukum

1. Tim, unsur, mandat dan sesi benar.
2. Dokumen yang ditelaah mempunyai versi/referensi.
3. Wawancara dan urutannya tercatat atau kendalanya dijelaskan.
4. Jenis/jumlah/satuan BB tidak tertukar.
5. Hasil penelusuran mempunyai sumber dan batas kepastian.
6. Fakta, kesimpulan dan rekomendasi dibedakan.
7. Isian kondisional tidak dibuat-buat demi melengkapi form.
8. Tanda tangan/pengesahan anggota sesuai prosedur tersedia.

Final/amendemen mengikuti mekanisme medis. Ringkasan yang diperlukan untuk pembahasan dapat dibagikan menurut izin; data sensitif rinci tidak otomatis dibuka ke Pengaju.

### 11. Pembahasan kasus, keputusan, dan dokumen akhir

#### 11.1 Data pertemuan dan keputusan

`CaseConference`: scheduled_at, held_at, mode, location, chair_person_id, chair_mandate_ref, attendees[], attendance_evidence, medical_assessment_version_id, legal_assessment_version_id, discussion_notes, divergent_opinions, clarification_requests, chair_confirmation_evidence_document_version_id.

`Decision`: version, client_category, medical_findings, legal_findings, substance_and_usage_pattern, diagnoses_snapshot, network_conclusion, rehabilitation_recommendation, proposed_service_type, duration_value/unit, facility_id + snapshot, legal_case_continuation, reporting_obligation, reasoning, decided_by_external_person, decided_at, recorded_by.

Istilah enum kategori/kesimpulan disahkan Tim; jangan memaksakan bentuk pilihan yang mengubah makna sumber. Durasi ditetapkan pihak berwenang, bukan default 3/6 bulan dari contoh.

Pisahkan **rapat dilaksanakan**, **hasil pembahasan dicatat untuk draf**, dan **keputusan final terautentikasi dalam dokumen sah**. Catatan Admin tidak sendiri mengesahkan rekomendasi. Bukti konfirmasi Ketua untuk penyusunan draf mengikuti SOP; dokumen BA bertanda tangan dapat sekaligus menjadi bukti keputusan final. Jangan mensyaratkan surat keputusan tambahan yang tidak ada dalam buku sehingga BA tidak bisa disusun sebelum ditandatangani.

#### 11.2 Flow dengan empat role

1. Sistem menampilkan kesiapan hasil final Medis/Hukum dan versi yang akan dibahas.
2. Admin mencatat jadwal, Ketua, peserta, dan bukti pelaksanaan.
3. Medis/Hukum dapat memeriksa bahwa ringkasan substansi sesuai hasil mereka; ini bukan pengganti tanda tangan resmi.
4. Bila perlu klarifikasi, buat pekerjaan ke tim terkait. Hasil lama tetap tercatat; versi baru harus dirujuk eksplisit.
5. Admin mencatat hasil keputusan Ketua/TAT berdasarkan bukti. Perbedaan analisis serta alasan keputusan tidak dihapus.
6. Admin menghasilkan draf BA dan surat jawaban dari snapshot keputusan yang sama.
7. Dokumen ditandatangani di luar aplikasi sesuai prosedur, diunggah dan diperiksa.
8. Admin menerbitkan paket hasil hanya jika dua dokumen sah dan konsisten.

#### 11.3 Field dokumen keluaran

**BA Pelaksanaan Asesmen Terpadu, Lampiran 11:** kop/tingkat, nomor BA, hari/tanggal/jam/tempat, Ketua dan mandat, Tim Medis/Hukum beserta pangkat/NIP/NRP/jabatan, dasar SK dan surat permohonan, nomor register, identitas subjek, hasil medis, hasil hukum, alat bukti/lab/BB, fakta, kesimpulan, rekomendasi, penutup, tanda tangan. Sumber PDF 184 sampai 188.

**Surat Jawaban Permohonan, Lampiran 12:** nomor, tanggal, klasifikasi RAHASIA, lampiran BA, perihal, penerima, dasar/rujukan, pelaksanaan asesmen, Nama/NIK/Tempat-Tgl lahir/Jenis Kelamin/Kewarganegaraan, kesimpulan, rekomendasi jenis dan durasi layanan/lembaga, ketentuan tindak lanjut, Ketua berwenang, tembusan yang sah. Sumber PDF 189 sampai 190.

**Surat Penolakan, Lampiran 5:** metadata surat, penerima, referensi permohonan, alasan, pernyataan hasil penelaahan dan tanda tangan Ketua sesuai format. Jangan memakai surat jawaban hasil sebagai surat penolakan.

Template contoh mempunyai tanggal/rujukan/jabatan/narasi lama. Simpan sumber asli terpisah; operational template harus disahkan. Nama pejabat pusat dan logo TTE contoh bukan signer/sertifikat universal.

`DocumentRelease`: decision_version_id, ba_version_id, response_letter_version_id, evidence_checked_by/at, released_by/at, recipients[], delivery_receipts[], supersedes_release_id.

Jika bukti tanda tangan/isi belum sesuai, status tetap `AWAITING_SIGNED_OUTPUTS`; tidak ada tombol â€œpaksa terbitâ€. Checksum file membuktikan integritas versi dalam sistem, bukan keabsahan tanda tangan eksternal.

Release hanya lolos bila BA dan surat jawaban merujuk keputusan serta versi final Medis/Hukum yang sama, isi cocok, pengesah/mandat/tingkat/tanggal sesuai, pemeriksaan tanda tangan eksternal mengikuti prosedur disahkan, tidak ada amendemen baru yang membuat hasil stale, serta paket/penerima dicatat. Selama prosedur K12 belum disahkan, sistem menyimpan draf/bukti tetapi tidak menandai hasil resmi terbit.

### 12. Penyerahan hasil, rehab, dan tindak lanjut tanpa akun rehab

**Pemohon menerima hasil resmi, bukan seluruh catatan mentah pemeriksaan.** Paket yang ditujukan kepadanya, termasuk BA bila menjadi lampiran surat, mengikuti dokumen sah dan izin. Internal notes tidak ikut otomatis.

`Delivery`: recipient_user/organization/person, document_release_id, channel, sent_at, delivery_status, acknowledged_at, acknowledgement_evidence_id, recorded_by. Pengakuan terima melalui aplikasi adalah bukti penerimaan, bukan TTE substansi keputusan.

#### 12.1 Alur rehabilitasi

1. Admin mencatat tindak lanjut yang diharapkan dari hasil TAT.
2. Pengaju mengoordinasikan lembaga tujuan dan melaporkan hasil koordinasi.
3. Pengaju mengunggah bukti serah terima/admisinya; Admin memverifikasi.
4. Pengaju mengirim pembaruan pelaksanaan berdasarkan bukti dari fasilitas.
5. Admin mencatat dilaksanakan/tidak, kendala, eskalasi, dan akhir tindak lanjut.
6. Medis/Hukum memberi pendapat hanya bila ada penugasan lanjutan; perubahan rekomendasi memerlukan kewenangan dan bukti, bukan edit bebas.

#### 12.2 Data tindak lanjut

| Key | Data dan aturan |
|---|---|
| followup.recommendation_version_id | Versi rekomendasi yang dilaksanakan |
| followup.execution_status | Belum dilaporkan / dilaporkan terlaksana / terverifikasi terlaksana / dilaporkan tidak terlaksana / terverifikasi tidak terlaksana / perlu klarifikasi |
| followup.facility_id + snapshot | Lembaga tujuan, jenis, alamat, kontak; bukan akun baru |
| followup.coordination_at, followup.contact_person | Waktu/personel koordinasi berdasarkan laporan |
| followup.handover_at, followup.admission_at | Waktu serah terima dan penerimaan layanan; tidak disamakan |
| followup.handover_document_id | Salinan BA Serah Terima untuk sekretariat |
| followup.service_type, followup.actual_start/end | Jenis layanan dan realisasi waktu |
| followup.progress_events[] | Tanggal kejadian, isi laporan, pelapor, sumber, waktu entri, dokumen bukti |
| followup.reporting_obligations[] | Kewajiban lapor, pihak penerima, tanggal pelaksanaan dan bukti |
| followup.obstacle | Kapasitas penuh / belum diantar / kendala dokumen / lainnya dengan alasan dan sumber |
| followup.escalation | Kepada siapa, kapan, keputusan dan bukti |
| followup.completion_document_id | Bukti selesai/perubahan/berhenti sesuai keadaan sebenarnya |
| followup.verified_by/at | Admin pemeriksa laporan, bukan pencipta fakta layanan |

Sumber menyebut penyerahan salinan BA Serah Terima ke sekretariat; rawat jalan wajib lapor setiap pelaksanaan rehabilitasi, rawat inap setelah selesai (PDF 86 sampai 87). Template rinci serah terima dan laporan progres tidak diberikan lengkap dalam lampiran buku; gunakan format lembaga/SOP yang disahkan. Jangan menamakannya format lampiran juknis yang tidak ada.

**Fasilitas penuh tidak otomatis mengubah keputusan.** Catat koordinasi/alternatif dan eskalasi. Jika tidak direkomendasikan rehab, tindak lanjut terkait hukum/keputusan tetap dicatat; jangan memaksa semua kasus melewati admisi rehab.

Untuk WNA, tambahkan `ExternalReferral`: destination_type, authority_reference, reason, decision_version_id, recipient, sent_at, acknowledgement dan file bukti. Tindak lanjut imigrasi/pelaporan pengadilan mengikuti cabang hasil pada PDF 84 sampai 85, bukan otomatis mengarahkan semua WNA ke rehabilitasi.

Selesainya administrasi TAT dan selesainya rehabilitasi adalah dua status berbeda. Laporan perkembangan yang diinput Pengaju belum menjadi fakta terverifikasi sebelum diperiksa; UI selalu menunjukkan pelapor dan sumber.

### 13. Katalog dokumen lengkap per tahap

| ID jenis aplikasi | Dokumen | Pembuat/pihak asal | Pengelola unggah | Pemakaian |
|---|---|---|---|---|
| ACCOUNT_AUTHORITY | Bukti kewenangan kedinasan | Instansi pemohon/petugas | Pemohon/Admin | Verifikasi akun, R |
| TAT_APPOINTMENT | SK tim/perubahan dan mandat | Pihak berwenang | Admin | Komposisi dan penugasan; Lampiran 1/2 |
| REQUEST_LETTER | Surat permohonan | Penyidik/JPU sesuai jalur | Pengaju | Pengajuan; Lampiran 3 |
| ROUTE_ATTACHMENTS | Identitas, perkara, penangkapan, lab, BB, elektronik | Instansi pemilik dokumen | Pengaju | Lima checklist Lampiran 4 |
| REGISTRATION_FORM | Formulir registrasi + tanda serah/terima | Pemohon/Sekretariat | Admin | Lampiran 4 sesuai jalur |
| DISPOSITION_EVIDENCE | Bukti disposisi persetujuan | Ketua berwenang | Admin | Tidak ada template khusus persetujuan di lampiran; SOP |
| REJECTION_LETTER | Surat penolakan | Ketua | Admin | Lampiran 5 |
| INVITATION | Undangan/jadwal pelaksanaan | Sekretariat sesuai mandat | Admin | Bab III, format operasional disahkan |
| INTELLIGENCE_REQUEST | Permohonan analisis intelijen tertulis | Ketua tingkat terkait | Admin | Bab III; bukan klaim akses API |
| CHILD_ASSENT | Form ASSENT anak | Anak, orang tua/wali, saksi/pihak sesuai format | Admin/petugas ditugaskan | Lampiran 6, kondisional |
| NO_FEE_STATEMENT | Pernyataan bebas biaya | Klien dan saksi | Admin/petugas ditugaskan | Lampiran 13 sebelum asesmen |
| COMPANION_EVIDENCE | Bukti pendamping/penerjemah | Pihak terkait | Admin | Kondisional; format SOP |
| MEDICAL_ASSESSMENT | ASI/pemeriksaan medis final | Tim Medis | Medis | Lampiran 7.1/7.2 sesuai pilihan disahkan |
| DIAGNOSIS_REFERENCE | Referensi PPDGJ/ICD | Sumber juknis | Konfigurasi | Lampiran 9; bukan upload pasien |
| PLACEMENT_INSTRUMENT | Instrumen penempatan terisi | Tim Medis | Medis | Lampiran 10 |
| LEGAL_ASSESSMENT | Form asesmen hukum final | Tim Hukum | Hukum | Lampiran 8 |
| ANALYSIS_EVIDENCE | Hasil penelusuran/wawancara/lab tambahan | Tim/instansi berwenang | Tim terkait | Pendukung analisis dengan scope akses |
| CONFERENCE_EVIDENCE | Kehadiran, catatan, bukti pembahasan | Ketua/Tim/Sekretariat | Admin | Bukti proses; SOP |
| TAT_MINUTES | BA Pelaksanaan Asesmen Terpadu | Ketua, Tim Hukum, Tim Medis | Admin | Lampiran 11 |
| RESPONSE_LETTER | Surat jawaban permohonan | Ketua | Admin | Lampiran 12 |
| RESULT_RECEIPT | Bukti serah/terima hasil | Pengaju/Sekretariat | Pengaju/Admin | Kontrol aplikasi/SOP |
| HANDOVER_TO_REHAB | BA Serah Terima ke lembaga | Pemohon dan fasilitas | Pengaju/Admin | Bab III tindak lanjut, bila berlaku |
| REHAB_PROGRESS | Bukti pelaksanaan/selesai/kendala | Fasilitas/instansi terkait | Pengaju, Admin verifikasi | Tidak mengklaim format resmi lampiran |
| RECORD_ACCESS_REQUEST | Permintaan tertulis rekam data + otorisasi | Pemohon akses/Ketua | Admin | Kerahasiaan Bab V |
| PERIODIC_REPORT | Laporan bulanan/triwulanan/tahunan | Sekretariat sesuai tingkat | Admin | Bab V; recipients disahkan |
| MONEV_FORM | Instrumen penilaian layanan | Petugas supervisi | Admin | Lampiran 15, fase berikutnya |

`ROUTE_ATTACHMENTS` bukan satu kategori file tanpa rincian: jenis spesifik mengikuti requirement_id pada lima checklist. Metadata internal R tidak perlu dicetak sebagai field resmi.

### 14. State machine, exception, dan penguncian

#### 14.1 Status utama pengajuan

| Dari | Aksi â†’ ke | Pelaku aplikasi | Prasyarat |
|---|---|---|---|
| DRAFT | submit â†’ SUBMITTED | Pengaju | Policy penerimaan aktif, identitas/routing minimum, dasar kewenangan, status ketersediaan checklist terisi; submit bukan pernyataan lengkap/layak |
| SUBMITTED | start-review â†’ ADMIN_REVIEW | Admin | Scope administrasi sah |
| ADMIN_REVIEW | request-correction â†’ NEEDS_CORRECTION | Admin | Catatan per field/item |
| NEEDS_CORRECTION | resubmit â†’ ADMIN_REVIEW | Pengaju | Versi baru dan tanggapan; jam SLA tetap |
| ADMIN_REVIEW | complete-review â†’ AWAITING_DISPOSITION | Admin | Checklist terselesaikan atau pengecualian berwenang tercatat |
| ADMIN_REVIEW | refer-out-of-scope â†’ OUT_OF_SCOPE_REFERRED | Admin | Dasar subjek bukan tersangka/terdakwa, tujuan rujukan, alasan, pemberitahuan dan bukti; tidak menerbitkan hasil TAT |
| AWAITING_DISPOSITION | record-rejection â†’ REJECTED | Admin | Keputusan Ketua, alasan, surat penolakan |
| AWAITING_DISPOSITION | record-approval â†’ APPROVED | Admin | Bukti keputusan Ketua, identitas/mandat |
| APPROVED | schedule â†’ SCHEDULED | Admin | Tim dan jadwal sesuai |
| SCHEDULED | start-assessment â†’ ASSESSMENT_ACTIVE | Petugas terkait | Prasyarat pelaksanaan jelas |
| ASSESSMENT_ACTIVE | mark-ready â†’ READY_FOR_CONFERENCE | Sistem dari gate | Kedua asesmen final, versi/pengesahan yang dibutuhkan lengkap |
| READY_FOR_CONFERENCE | record-held â†’ CONFERENCE_HELD | Admin | Bukti pelaksanaan dan peserta; belum berarti hasil disahkan |
| CONFERENCE_HELD | request-clarification â†’ CONFERENCE_CLARIFICATION_REQUIRED | Admin | Isu, tim tujuan, versi terkait, kebutuhan telaah |
| CONFERENCE_CLARIFICATION_REQUIRED | close-clarification â†’ CONFERENCE_HELD | Admin | Jawaban/versi baru, telaah pembahasan lanjutan bila perlu, bukti |
| CONFERENCE_HELD | record-outcome â†’ OUTCOME_RECORDED_FOR_DRAFT | Admin | Versi hasil kedua tim final, identitas Ketua, hasil yang dikonfirmasi untuk draf dan bukti sesuai SOP |
| OUTCOME_RECORDED_FOR_DRAFT | prepare-results â†’ AWAITING_SIGNED_OUTPUTS | Admin | Draf merujuk hasil tercatat; tidak sama dengan hasil resmi |
| AWAITING_SIGNED_OUTPUTS | release â†’ RESULTS_ISSUED | Admin | BA dan surat jawaban sah, konsisten, diperiksa |

`delivery_status` dan `followup_status` terpisah dari status di atas; `RESULTS_ISSUED` tetap menyatakan hasil telah terbit walau rehab berlangsung. `archive_state` adalah administratif setelah kriteria retensi/penutupan disahkan, bukan sinonim rehab selesai.

`POLICY_REVIEW_REQUIRED` adalah blocker, bukan jalur untuk melompati tahapan. Data dapat diterima untuk pencatatan sesuai policy penerimaan, tetapi complete-review tidak lolos bila aturan kelayakan yang berlaku belum disahkan. Hasil review yang mengusulkan penolakan juga dapat diteruskan kepada Ketua dengan alasan; â€œterselesaikanâ€ berarti hasil pemeriksaan jelas, bukan semua item harus valid. Tidak ada pengecualian tanpa otoritas, cakupan, alasan, dan bukti sesuai policy aktif.

Tidak ada command `force-ready`, `force-approve`, `force-conference`, atau `force-release`. Emergency/referral event tidak menjadikan asesmen selesai. Gate kelengkapan profesional tidak bisa dilompati Admin.

#### 14.2 Substatus dan exception

Medis/Hukum masing-masing: `NOT_STARTED`, `DRAFT`, `PENDING_REVIEW`, `FINAL`, `AMENDMENT_REQUIRED`, `SUPERSEDED`. Status review adalah desain internal; tidak mengganti tanda tangan.

Penugasan ulang mencabut akses masa depan sesuai kebijakan, tetapi mempertahankan atribusi pekerjaan lama. Pengunduran jadwal, ketidakhadiran, kendala persetujuan, dan klarifikasi disimpan sebagai event/blocker terstruktur.

Jika asesmen berubah setelah pembahasan tetapi sebelum hasil terbit: tandai keputusan/draf hasil stale, wajib telaah ulang. Jika sesudah hasil terbit: buat amendemen/hasil pengganti dengan bukti kewenangan, jangan overwrite file atau membatalkan hasil sah secara diam-diam.

Perubahan jalur setelah submit: buat revisi administratif yang disetujui, hitung ulang checklist dari versi policy yang dipilih secara eksplisit, catat dasar fase perkara dan dampak waktu; untuk MVP paling aman buat pengajuan terkait baru bila dasar hukum pengajuan berubah.

Permintaan penarikan oleh Pengaju hanya menjadi permintaan, bukan penghapusan perkara. Penanganan administratifnya memerlukan SOP. Tidak ada tombol hapus permanen untuk record yang sudah submit.

### 15. SLA, waktu, notifikasi

Ketentuan sumber: pengajuan masa penangkapan maksimal 3 x 24 jam sejak SP Penangkapan diterbitkan; hasil masa penangkapan paling lambat hari keenam setelah penangkapan; hasil P19/penuntutan/sidang paling lambat 3 hari setelah asesmen terpadu dilaksanakan (PDF 61, 86, 87).

Simpan `event_time`, `recorded_at`, `source_document_id`, `timezone`, `time_precision`, `deadline_policy_version`. Semua waktu server disimpan UTC dan ditampilkan sesuai zona; jadwal Indonesia dapat lintas zona.

â€œHari keenamâ€ dan â€œ3 hari setelah asesmenâ€ membutuhkan kebijakan cut-off/anchor yang disahkan. Jangan mengarang hari kerja, pause saat revisi, atau otomatis memakai waktu medis saja sebagai waktu selesainya asesmen terpadu.

Notifikasi event: pengajuan masuk, koreksi, disposisi tercatat, undangan/perubahan jadwal, tugas asesmen, hasil siap dibahas, dokumen belum lengkap, hasil terbit, penerimaan, tindak lanjut belum dilaporkan, SLA berisiko/terlewati. Reminder H-24/H-6 jam adalah contoh konfigurasi R, bukan ketentuan buku.

Outbox transaksional memastikan event tidak hilang saat email gagal. Status notifikasi terpisah dari status tindakan. `notification_sent` tidak berarti pihak menerima/menyetujui.

### 16. Struktur database yang disarankan

Backend: NestJS modular monolith, PostgreSQL, object storage privat. Tetap gunakan React/Vite untuk frontend. Tidak perlu microservices untuk MVP.

| Entitas | Isi utama dan hubungan |
|---|---|
| organizations, tat_units | Jenis instansi, tingkat, wilayah, kontak, versi referensi |
| users, memberships | Role, organisasi, status akun, dasar kewenangan |
| persons, mandates | Pihak eksternal termasuk Ketua, jabatan, masa berlaku, dokumen mandat |
| clients, cases, applications | Identitas logis, perkara, pengajuan, scope, route/status |
| application_snapshots | Versi identitas/pemohon/perkara saat submit |
| evidence_items, lab_results | Kelompok BB dan pemeriksaan terkait |
| form_templates, template_items | Versi source, code/label/options/period/struktur UI |
| policy_versions | Referensi sumber, tanggal berlaku, otoritas eksternal, bukti persetujuan, status, konflik terbuka dan versi terdahulu |
| requirement_rules, checklist_responses | Kondisi applicability, rule version, hasil checklist |
| documents, document_versions, document_links | Berkas privat, versi immutable, hubungan item/dokumen |
| verifications, correction_requests | Hasil pemeriksaan per versi, respons revisi |
| dispositions | Keputusan Ketua vs Admin pencatat dan bukti |
| assignments, schedules, attendance | Penugasan, sesi, kehadiran dan history |
| consents, companions | Persetujuan, pendampingan, penerjemah |
| assessments, assessment_versions | Medis/Hukum, template, status, versi final |
| instrument_responses | Typed answers, missing state, item/period/matrix context |
| placement_assessments | Dimensi, indikator, penalaran, hasil profesional |
| conferences, decisions | Referensi versi asesmen, hasil pembahasan/keputusan |
| releases, deliveries | Paket resmi dan penyerahan/penerimaan |
| followups, followup_events | Pelaksanaan, bukti sumber, verifikasi |
| record_access_requests, disclosures | Permintaan tertulis, otorisasi, data dibuka, tujuan |
| audit_events, outbox_events | Jejak mutasi/akses dan notifikasi andal |
| report_snapshots | Periode, versi data, pembuat, pengesahan/pengiriman |

Kolom bisnis yang diperlukan untuk filter/laporan disimpan relasional. Jawaban instrumen dapat memakai JSONB dengan schema tervalidasi dan item IDs, bukan JSON bebas untuk seluruh perkara.

Constraint minimum: unique register sesuai scope; unique assessment version per stream/application; hanya satu versi final aktif; FK bukti ke versi immutable; `version` untuk optimistic locking. Jumlah dan satuan BB tidak null bila baris BB dipakai sebagai dasar penilaian.

#### Contoh penyimpanan jawaban instrumen

```json
{
  "assessmentId": "internal-id",
  "templateVersion": "ASI_FULL_JUKNIS_2025_v1",
  "itemId": "stable-item-id",
  "sourceCode": "D1",
  "period": "LAST_30_DAYS",
  "matrixColumn": "DAYS_USED",
  "repeatIndex": 0,
  "answerState": "ANSWERED",
  "value": 4,
  "sourceSpecialCode": null,
  "note": "",
  "revision": 2
}
```

Contoh di atas payload teknis, bukan data klien nyata atau penetapan final item schema. `answerState` terpisah dari `value`: kosong tidak menjadi 0. Kode khusus hanya boleh jika instrumen/item memperbolehkan. Template reference dan header tidak dirender sebagai input pasien.

`template_items.content_kind` = INPUT / REFERENCE / INSTRUCTION / LABEL / SCALE_HEADER / SIGNATURE_BLOCK / OUTPUT_FIELD. Hanya INPUT menghasilkan jawaban instrumen; referensi diagnosis dipakai melalui model diagnosis, signature melalui evidence, bukan sebagai jawaban pasien. Penetapan content_kind/widget/validation perlu review per item; inventaris tidak boleh diimpor dengan semua baris dianggap INPUT.

### 17. Kontrak API dan transaksi

Gunakan command endpoint untuk perubahan tahap, bukan `PATCH status` bebas.

| Endpoint usulan | Pelaku | Perilaku inti |
|---|---|---|
| POST /applications | Pengaju | Buat draf, target unit dan route |
| PATCH /applications/{id}/draft | Pemilik draf | Validasi parsial dan version check |
| POST /applications/{id}/submit | Pengaju | Snapshot, policy pin, waktu server, outbox, idempotency |
| POST /documents/uploads | Pengguna berizin | Inisialisasi upload privat scoped kasus |
| POST /documents/{id}/complete | Pengguna berizin | Verifikasi ukuran/checksum/scan, tidak langsung ready |
| POST /applications/{id}/verifications | Admin | Hasil per item/versi |
| POST /applications/{id}/review/start | Admin | SUBMITTED ke ADMIN_REVIEW, scope sesuai |
| POST /applications/{id}/review/complete | Admin | Gate hasil review dan policy, menuju disposisi |
| POST /applications/{id}/refer-out-of-scope | Admin | Bukti dan rujukan layanan non-TAT, tidak menghasilkan keputusan TAT |
| POST /applications/{id}/corrections | Admin | Catatan field-level |
| POST /applications/{id}/resubmit | Pengaju | Snapshot revisi, invalidasi verifikasi versi terkait |
| POST /applications/{id}/dispositions | Admin | Catat keputusan eksternal dengan bukti; bukan tanda tangan Ketua |
| POST /applications/{id}/assignments | Admin | Validasi mandat, tim, scope |
| POST /applications/{id}/schedules | Admin | Simpan revisi jadwal/undangan |
| POST /applications/{id}/consents | Petugas ditugaskan | Status dan bukti, tanpa default setuju |
| PUT /assessments/{id}/answers | Tim terkait | Draft answer schema + optimistic locking |
| POST /assessments/{id}/finalize | Tim terkait | Completeness, review, snapshot final immutable |
| POST /assessments/{id}/amendments | Tim terkait | Alasan, versi baru, dampak ke hasil |
| POST /applications/{id}/assessment-sessions/start | Tim terkait | Mulai sesi setelah prasyarat; tidak memfinalisasi asesmen |
| POST /applications/{id}/conferences/schedule | Admin | Jadwal pembahasan, bukan finalisasi |
| POST /applications/{id}/conferences/record-held | Admin | Bukti pertemuan dan kehadiran |
| POST /applications/{id}/conferences/request-clarification | Admin | Isu dan penugasan klarifikasi |
| POST /applications/{id}/conferences/close-clarification | Admin | Referensi jawaban/versi baru dan telaah lanjutan |
| POST /applications/{id}/conferences/record-outcome | Admin | Catat hasil Ketua/TAT untuk draf beserta bukti; tidak bertindak sebagai Ketua |
| POST /applications/{id}/result-drafts | Admin | Generate dari snapshot, watermark DRAF |
| POST /applications/{id}/releases | Admin | Gate dokumen sah; publish versi hasil |
| POST /releases/{id}/acknowledgements | Pengaju/Admin mencatat bukti | Penerimaan, bukan approval substansi |
| POST /applications/{id}/followups | Pengaju/Admin | Laporan pelaksanaan dengan sumber |
| POST /followups/{id}/verify | Admin | Terpisah dari laporan asal |
| POST /record-access-requests | Pengguna berizin | Permintaan akses sesuai tujuan dan dasar |
| POST /reports/snapshots | Admin berizin | Data periodik terotorisasi dan reproducible |

Setiap endpoint write memakai actor dari session, bukan dari body yang bisa dipalsukan. `Idempotency-Key` untuk submit/finalize/release; `If-Match` atau field revision untuk mencegah lost update. HTTP 409 untuk konflik versi/transisi; 422 untuk error isian; 401/403 untuk auth/izin tanpa membocorkan detail kasus.

Setiap command mendeklarasikan allowed_role, assignment_scope, allowed_from_status, resulting_status, required_evidence, version_requirement dan idempotency_behavior. `mark-ready` dihitung server setelah gate kedua stream, bukan endpoint bebas pengguna.

GET list memakai scope, pagination, filter dan sort di server. Pencarian NIK/nama tidak tersedia publik. File dan export memerlukan pengecekan izin ulang, termasuk setelah penugasan dicabut.

Audit event: actor, role saat tindakan, organisasi, application_id, event_type, timestamp, record_version, perubahan field yang relevan, reason dan request_id. Jangan menyalin semua jawaban medis/password/token ke log umum.

### 18. Layar web dan perilaku UX

| Halaman | Role | Komponen penting |
|---|---|---|
| Dashboard Pengaju | Pengaju | Draf, koreksi, jadwal, hasil tersedia, tindak lanjut |
| Pengajuan baru | Pengaju | Wizard enam langkah, autosave, checklist jalur, review |
| Antrean administrasi | Admin | Tenggat, usia antrean, kelengkapan, tahap, penanggung jawab |
| Detail pengajuan | Semua sesuai izin | Ringkasan, status terpisah, timeline, tindakan berikutnya |
| Verifikasi | Admin | Preview file vs checklist, perbedaan versi, catatan koreksi |
| Disposisi/hasil eksternal | Admin | Identitas Ketua, bukti, tanggal keputusan vs entri |
| Penugasan/jadwal | Admin; tim melihat | Komposisi, mandat, kalender, undangan, attendance |
| Ruang Medis | Medis | Template, draf, input matrix, preview, final/amendemen |
| Ruang Hukum | Hukum | Wawancara, bukti analisis, fakta/kesimpulan, final |
| Pembahasan kasus | Admin dan tim | Ringkasan berdampingan, versi, klarifikasi, keputusan |
| Dokumen hasil | Admin; penerima sesuai izin | BA/surat jawaban, bukti tanda tangan, release/delivery |
| Tindak lanjut | Pengaju/Admin | Laporan, bukti fasilitas, verifikasi, kendala |
| Laporan/arsip | Admin berizin | Periode, sumber angka, export, bukti pengiriman |
| Administrasi akses | Admin berizin | Akun, mandat, organisasi, policy/template versions |

Header detail selalu menunjukkan nomor tracking/register, jalur, status utama, substatus medis/hukum, waktu kritis, dan penanggung jawab tindakan berikutnya. Field sensitif di-mask pada list; jangan tampilkan rekening/NIK penuh di kartu.

Autosave menampilkan â€œtersimpan pada ...â€ hanya setelah server mengonfirmasi. Saat gagal, tampilkan belum tersimpan dan retry; jangan menutup modal dengan klaim sukses. Konflik versi meminta pemulihan/merge terkontrol, bukan overwrite.

Form panjang memakai kelompok bertahap, navigasi keyboard, label accessible, ringkasan bagian belum lengkap. Jangan menyimpan draf medis sensitif di localStorage secara default. Instruksi sumber tersedia dekat pertanyaan; teks sumber dan penjelasan tambahan aplikasi dibedakan.

### 19. Pelaporan, kerahasiaan, dan konfigurasi berikutnya

Laporan JUKNIS memuat identitas, penangkapan, permohonan, hasil medis/hukum, keputusan TAT, lembaga, dan dilaksanakan/tidak (PDF 104). Dataset resmi berizin dapat lengkap; dashboard umum menggunakan agregat/masking.

Laporan bulanan, triwulanan, tahunan memiliki snapshot, periode, scope wilayah/tingkat, penanggung jawab, versi, penerima, status pengesahan dan bukti kirim. Jangan mengarang tanggal jatuh tempo bulanan tertentu; cadence dan cut-off administratif perlu ditetapkan.

Ekspor manual untuk BOSS/SIN boleh menjadi fasilitas MVP; tidak menampilkan badge â€œtersinkronâ€ tanpa acknowledgement nyata. Format ekspor eksternal menunggu schema resmi, bukan ditebak dari nama sistem.

Monev Lampiran 15 dan pembiayaan DIPA/reimbursement dijadikan fase berikutnya. Tetap catat bebas biaya sekarang. SDM pada tabel skor bab dan jumlah item Lampiran 15 tidak selaras, jadi jangan menghitung grade keseluruhan otomatis.

Pembukaan rekam data: permintaan tertulis â†’ pencatatan dasar/tujuan â†’ keputusan Ketua berwenang sebagai bukti eksternal â†’ paket terbatas â†’ penyampaian dan disclosure log. Bukan tombol Admin â€œbagikan semuaâ€.

Retensi, pemusnahan, lokasi hosting, dasar pemrosesan, kebijakan akses rinci dan penanganan insiden harus disahkan organisasi. Jangan mengarang durasi simpan dari buku.

### 20. Skenario uji penerimaan minimum

1. Pengaju tidak bisa memilih role Medis/Hukum/Admin saat registrasi.
2. Pengaju A tidak dapat membuka kasus atau URL file Pengaju B tanpa delegasi sah.
3. Lima jalur menghasilkan checklist berbeda dan metadata source benar.
4. Kondisi alternatif/bila ada tidak dipaksa menjadi semua file wajib.
5. Kasus tanpa BB dan BB belum diatur tidak disatukan menjadi rule urine yang keliru.
6. Nomor rekening/HP/NIK tidak kehilangan nol awal.
7. Waktu SP, penangkapan, submit dan asesmen terpisah; DATE_ONLY tidak dianggap jam pasti.
8. Submit ganda tidak membuat dua pengajuan.
9. Upload gagal/karantina tidak dihitung sebagai berkas siap.
10. Koreksi membuat versi baru dan membatalkan hasil verifikasi yang sudah tidak relevan.
11. Admin tidak bisa menyetujui sebagai Ketua tanpa mencatat bukti eksternal.
12. Dokumen persetujuan berbeda dari surat penolakan; alasan penolakan tersimpan.
13. Dua personel Medis dapat ditugaskan; jumlah akun/role tidak membatasi jumlah pemeriksa.
14. Dukungan lintas wilayah dengan mandat sah dapat diberikan; tanpa mandat ditolak.
15. Data anak/WNA memunculkan prasyarat yang sesuai, tanpa default persetujuan.
16. Jawaban ASI tersimpan sesuai input; 0 berbeda dari kosong/X/N.
17. Dua petugas menyimpan versi berbeda menghasilkan konflik, bukan lost update.
18. Hasil Medis final tidak dapat diubah Admin atau Pengaju.
19. Asesmen Hukum tidak menyatakan penelusuran negatif ketika belum dilakukan.
20. Case Conference tidak siap bila salah satu stream belum final.
21. Klarifikasi/amendemen menandai keputusan/dokumen draf terdampak.
22. BA dan surat jawaban berasal dari snapshot yang sama, tanpa narasi diagnosis contoh.
23. Publikasi ditolak bila salah satu dokumen sah belum ada.
24. Penerimaan hasil tidak mengubah status menjadi rehab selesai.
25. Pelaporan Pengaju berbeda dari verifikasi Admin; sumber fasilitas tercatat.
26. Fasilitas penuh tidak otomatis mengubah rekomendasi sah.
27. Kasus tanpa rekomendasi rehab tidak dipaksa mempunyai BA serah terima rehab.
28. Laporan periodik berasal dari data, memiliki versi, dan aksesnya sesuai scope.
29. Export CSV/XLSX menetralkan formula injection; log/notifikasi tidak memuat data sensitif berlebihan.
30. Uji backup dan restore mengembalikan DB, versi file, hubungan dokumen, dan histori.
31. Item reference/instruction/label tidak menjadi input pasien.
32. Kode wildcard diagnosis tidak tersimpan sebagai diagnosis final spesifik.
33. Contoh diagnosis, nama pejabat, lembaga dan durasi dari template tidak menjadi nilai pasien baru.
34. Signature block diwakili bukti/identitas, bukan jawaban instrumen.
35. Ketua eksternal tidak memperoleh akun/credential login baru.
36. Outcome pembahasan untuk draf tidak dianggap hasil sah sebelum BA/surat jawaban diperiksa.
37. Status anak belum pasti/penerjemah belum dinilai tidak menjadi otomatis dewasa/tidak perlu penerjemah.

### 21. Prioritas implementasi dan definisi selesai

**Tahap A:** auth/otorisasi, organisasi/mandat, DB, file privat, audit, snapshot, policy version. **Tahap B:** lima jalur pengajuan, revisi, verifikasi, disposisi eksternal, penugasan. **Tahap C:** instrumen Medis/Hukum, final/amendemen, pembahasan. **Tahap D:** dua keluaran sah, penyerahan, tindak lanjut. **Tahap E:** pelaporan, UAT, hardening dan restore.

Satu tahap selesai jika API dan UI bekerja dengan persistence, scope akses diuji, error path diuji, output cocok dengan sumber yang disahkan, serta acceptance test relevan lulus. Menambahkan menu atau dummy data tidak dihitung selesai.

### 22. Daftar keputusan terbuka sebelum produksi

| ID | Keputusan yang diperlukan | Default aman dalam rancangan |
|---|---|---|
| K01 | Requiredness dokumen saat bab berbeda dengan lampiran | Pertahankan dua sumber, jangan auto-reject dari rule belum disahkan |
| K02 | Fungsi/pemilik/requiredness rekening | Field source tetap ada, tanpa asumsi pembayaran/nomor fiktif |
| K03 | Template ASI yang digunakan dan pemetaan kelengkapan | Dua template terpisah; tidak default wajib keduanya |
| K04 | Definisi cut-off hari keenam/3 hari serta tanggal asesmen terpadu | Simpan event dan policy; flag ambiguity |
| K05 | Format disposisi, undangan, serah terima dan bukti hasil eksternal | Pakai SOP berwenang, bukan mengaku template lampiran |
| K06 | Scope sequence/waktu pemberian register dan kode pusat | Nomor tracking terpisah, rule register disahkan |
| K07 | Akses rinci medis/hukum/sekretariat dan delegasi instansi | Least privilege, bukan semua admin membaca semuanya |
| K08 | Recipient laporan tahunan dan nomenklatur lembaga | Konfigurasi berversi; discrepancy prose/diagram disahkan |
| K09 | Scoring monev SDM dan grade | Tidak auto-grade sebelum rumus disahkan |
| K10 | Retensi, lokasi hosting, penyimpanan dokumen/penanganan insiden | Tidak mengarang angka/basis hukum |
| K11 | Kebijakan penarikan, pindah wilayah, perubahan jalur, amendemen hasil | Event/bukti dan telaah manusia, tidak hapus/overwrite |
| K12 | Mekanisme sah pemeriksaan tanda tangan eksternal | Unggah + pemeriksaan administratif berwenang; bukan klaim verifikasi kriptografis |

### 23. Lampiran implementasi

Lampiran A memuat seluruh item terstruktur Lampiran 3 sampai 9 per halaman. Tidak semuanya merupakan input pasien: terdapat label, instruksi, opsi, tanda tangan, dan referensi diagnosis. Source code/nomor yang berulang dipertahankan, internal ID unik.

Lampiran B memuat 30 sel matriks penempatan utama beserta instruksi dan tabel tindak lanjut pendamping. Lampiran C memuat detail dokumen keluaran. Lampiran D memuat field operasional dan daftar bukti.

Inventaris tabel dalam dokumen tunggal ini menyediakan data untuk menyusun form config. **Workbook adalah inventaris implementasi, bukan schema production yang boleh diimpor tanpa review.** Jangan menebak widget atau kewajiban hanya dari adanya kata tertentu pada label.

Tidak ada perubahan source repo, akun, atau data perkara yang dilakukan sebagai bagian pembuatan spesifikasi ini.

**Batas produksi:** diperlukan persetujuan pemilik layanan atas rule dokumen, prosedur bukti keputusan eksternal, pemeriksaan tanda tangan, pemilihan/kelengkapan instrumen, akses rinci, SLA, perubahan/penarikan perkara, dan format/penerima laporan. Rancangan dapat diimplementasikan bertahap dengan data sintetis sambil menuntaskan keputusan tersebut.


---

<a id="section-018"></a>

## Lampiran A. Inventaris lengkap formulir dan referensi

Sumber: [JUKNIS TAT 2025](https://t90182123892.p.clickup-attachments.com/t90182123892/fa5b234e-46f1-4182-8b83-131e7d1bc232/JUKNIS%20TAT%202025.pdf). Label/opsi sumber dipertahankan, line wrapping diratakan. Catatan penjelas bukan tambahan ketentuan resmi. ID J25 adalah ID inventaris aplikasi, bukan kode cetak BNN. 613 baris mencakup input, instruksi, label, opsi, referensi diagnosis, dan tanda tangan; bukan 613 kolom wajib.

### Lampiran 3: PDF 147 / cetak 132

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P147-I001 | Surat permohonan | Kop surat Instansi Penegak Hukum yang menangani perkara TP Narkotika | Input field; derived recommendation: free text/header. |
| J25-P147-I002 | Surat permohonan | Perihal | Source shows: Permohonan Pengajuan Asesmen Terpadu an. Tersangka........................ |
| J25-P147-I003 | Surat permohonan | Laporan Informasi/ Laporan Polisi/ Laporan Kasus Narkotika Nomor | Source item 1.d ends "Nomorâ€¦â€¦"; derived recommendation: identifier. \| QA: exact source label restored; prior explanatory/context label: Nomor Laporan Informasi/ Laporan Polisi/ Laporan Kasus Narkotika |
| J25-P147-I004 | Surat permohonan | Ketua Tim Asesmen Terpadu Tingkat Provinsi | Recipient line; source has dotted blank after Provinsi. |
| J25-P147-I005 | Surat permohonan | di<br>Opsi: Tempat | Addressee location field. |
| J25-P147-I006<br>Kode: 1.a | Surat permohonan | Undang-Undang Nomor 35 Tahun 2009 | Reference item, not a fill field. |
| J25-P147-I007<br>Kode: 1.b | Surat permohonan | Peraturan Bersama Ketua Mahkamah Agung Republik Indonesia, Menteri Hukum dan Hak Asasi Manusia Republik Indonesia, Menteri Kesehatan Republik Indonesia, Menteri Sosial Republik Indonesia, Jaksa Agung Republik Indonesia, Kepala Kepolisian Negara Republik Indonesia, Kepala Badan Narkotika Nasional Republik Indonesia Nomor 01/PB/MA/III/2014, Nomor 03 Tahun 2014, Nomor 11 Tahun 2014, Nomor 03 Tahun 2014, Nomor Per-005/A/JA/03/2014, Nomor 1 Tahun 2014, Perber/01/III/2014/BNN tentang Penanganan Pecandu dan Korban Penyalahgunaan Narkotika ke Dalam Lembaga Rehabilitasi (Berita Negara Republik Indonesia Tahun 2014 Nomor 465) | Reference item, not a fill field. |
| J25-P147-I008<br>Kode: 1.c | Surat permohonan | Petunjuk Teknis Tata Cara Penanganan Tersangka dan/atau Terdakwa Penyalah Guna, Pecandu Narkotika dan Korban Penyalahgunaan Narkotika Melalui Asesmen Terpadu | Reference item, not a fill field. |
| J25-P147-I009<br>Kode: 1.d | Surat permohonan | Laporan Informasi/ Laporan Polisi/ Laporan Kasus Narkotika Nomorâ€¦â€¦ | Fill/reference item; preserve trailing dots. |
| J25-P147-I010<br>Kode: 2 | Surat permohonan | Asesmen Terpadu terhadap tersangka an. ................ | Blank in narrative. |
| J25-P147-I011<br>Kode: 3 | Surat permohonan | persyaratan sebagai berikut: | Source says list is "(DIsesuaikan dengan berkas yang harus dilampirkan pada masa penangkapan atau berdasarkan petunjuk P19 atau untuk penuntutan atau untuk sidang pengadilan)"; free-text/attachment list. |
| J25-P147-I012<br>Kode: 4 | Surat permohonan | Demikian surat permohonan ini buat dan mohon untuk dapat diperiksa. | Narrative closing. |
| J25-P147-I013 | Surat permohonan | Pemohon (Penyidik yang Menangani Perkara/ Jaksa/Hakim) | Signature/role field; conditional by applicant. |
| J25-P147-I014 | Surat permohonan | ( ...................................................) | Signature/name field. |

### Lampiran 4.1 (i): PDF 148 / cetak 133

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P148-I001 | Identitas registrasi | Nama Tersangka atau Terdakwa | Derived recommendation (not source): text. |
| J25-P148-I002 | Identitas registrasi | Nomor Handphone | Derived recommendation (not source): telephone text. |
| J25-P148-I003 | Identitas registrasi | Nomor Rekening | Derived recommendation (not source): account identifier. |
| J25-P148-I004 | Identitas registrasi | Yang Mengajukan Berkas | Derived recommendation (not source): person/agency text. |
| J25-P148-I005 | Identitas registrasi | Asal Instansi | Derived recommendation (not source): institution text. |
| J25-P148-I006 | Identitas registrasi | Tanggal Pengajuan | Derived recommendation (not source): date. |
| J25-P148-I007 | Daftar Berkas Pengajuan | Ada           Tidak Ada<br>Opsi: Ada \| Tidak Ada | Table availability columns; one availability mark per listed item. |
| J25-P148-I008<br>Kode: 1 | Daftar Berkas Pengajuan | Surat Permohonan Asesmen Terpadu dari penyidik kepada Ketua Tim Asesmen Terpadu Tingkat Provinsi atau Tingkat Kabupaten/Kota<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P148-I009<br>Kode: 2 | Daftar Berkas Pengajuan | Fotocopy Kartu Identitas Tersangka (KTP atau Kartu Pelajar atau Kartu Mahasiswa atau Kartu Keluarga atau Paspor)<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P148-I010<br>Kode: 3 | Daftar Berkas Pengajuan | Laporan Informasi atau Laporan Polisi atau Laporan Kasus Narkotika<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P148-I011<br>Kode: 4 | Daftar Berkas Pengajuan | Berita Acara Interogasi atau Berita Acara Pemeriksaan<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P148-I012<br>Kode: 5 | Daftar Berkas Pengajuan | Surat Perintah Penangkapan atau Surat Perintah Tugas<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P148-I013<br>Kode: 6 | Daftar Berkas Pengajuan | Surat Keterangan Hasil Pemeriksaan Urine yang dikeluarkan oleh Fasilitas Kesehatan Milik Pemerintah (seperti Labkesda, Pusdokes Polri, Klinik Polres, IPWL BNN, Puskesmas, RSUD, dll) dengan jangka waktu maksimal 3 x 24 jam setelah diterbitkan Surat Perintah Penangkapan dengan hasil positif<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P148-I014<br>Kode: 7 | Daftar Berkas Pengajuan | Alat bukti elektronik seperti hasil forensik alat komunikasi tersangka, handphone, hasil foto percakapan pada media sosial atau aplikasi pesan atau alat bukti elektronik lainnya. (bila ada)<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P148-I015 | Serah-terima berkas | Yang Menyerahkan Berkas | Signature/name field. |
| J25-P148-I016 | Serah-terima berkas | Penerima Berkas Sekretariat TAT | Signature/name field. |
| J25-P148-I017 | Serah-terima berkas | .......................................... | Signature/name line for Yang Menyerahkan Berkas. |
| J25-P148-I018 | Serah-terima berkas | .............................................. | Signature/name line for Penerima Berkas Sekretariat TAT. |

### Lampiran 4.1 (ii): PDF 149 / cetak 134

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P149-I001 | Identitas registrasi | Nama Tersangka atau Terdakwa | Derived recommendation (not source): text. |
| J25-P149-I002 | Identitas registrasi | Nomor Handphone | Derived recommendation (not source): telephone text. |
| J25-P149-I003 | Identitas registrasi | Nomor Rekening | Derived recommendation (not source): account identifier. |
| J25-P149-I004 | Identitas registrasi | Yang Mengajukan Berkas | Derived recommendation (not source): person/agency text. |
| J25-P149-I005 | Identitas registrasi | Asal Instansi | Derived recommendation (not source): institution text. |
| J25-P149-I006 | Identitas registrasi | Tanggal Pengajuan | Derived recommendation (not source): date. |
| J25-P149-I007 | Daftar Berkas Pengajuan | Ada           Tidak Ada<br>Opsi: Ada \| Tidak Ada | Table availability columns; one availability mark per listed item. |
| J25-P149-I008<br>Kode: 1 | Daftar Berkas Pengajuan | Surat Permohonan Asesmen Terpadu dari penyidik kepada Ketua Tim Asesmen Terpadu Tingkat Nasional atau Tingkat Provinsi atau Tingkat Kabupaten/Kota<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P149-I009<br>Kode: 2 | Daftar Berkas Pengajuan | Fotocopy Kartu Identitas Tersangka (KTP atau Kartu Pelajar atau Kartu Mahasiswa dan Kartu Keluarga atau Paspor)<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P149-I010<br>Kode: 3 | Daftar Berkas Pengajuan | Laporan Polisi (LP) atau Laporan Kasus Narkotika (LKN)<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P149-I011<br>Kode: 4 | Daftar Berkas Pengajuan | Berita Acara Interogasi atau Berita Acara Pemeriksaan Tersangka<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P149-I012<br>Kode: 5 | Daftar Berkas Pengajuan | Surat Perintah Penyidikan<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P149-I013<br>Kode: 6 | Daftar Berkas Pengajuan | Surat Perintah Penangkapan<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P149-I014<br>Kode: 7 | Daftar Berkas Pengajuan | Surat Perintah Penggeledahan<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P149-I015<br>Kode: 8 | Daftar Berkas Pengajuan | Surat Perintah Penyitaan Barang Bukti<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P149-I016<br>Kode: 9 | Daftar Berkas Pengajuan | Berita acara Penggeledahan<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P149-I017<br>Kode: 10 | Daftar Berkas Pengajuan | Berita Acara Penyitaan Barang Bukti<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P149-I018<br>Kode: 11 | Daftar Berkas Pengajuan | Hasil Pemeriksaan Laboratorium Sementara<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P149-I019<br>Kode: 12 | Daftar Berkas Pengajuan | Surat Keterangan Hasil Pemeriksaan Urine yang dikeluarkan oleh Fasilitas Kesehatan Milik Pemerintahan (seperti Labkesda, Pusdokes Polri, Klinik Polres, IPWL BNN, Puskesmas, RSUD, dll) dengan jangka waktu maksimal 3 x 24 jam setelah diterbitkan Surat Perintah Penangkapan<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P149-I020<br>Kode: 13 | Daftar Berkas Pengajuan | Hasil Pemeriksaan Urine Positif atau Negatif apabila berat Barang Bukti kurang dari SEMA 04 Tahun 2010<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P149-I021<br>Kode: 14 | Daftar Berkas Pengajuan | Hasil Pemeriksaan Urine Positif apabila berat Barang Bukti lebih dari SEMA 04 Tahun 2010<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P149-I022<br>Kode: 15 | Daftar Berkas Pengajuan | Hasil Pemeriksaan Urine Positif maupun Negatif untuk Barang Bukti Narkotika yang belum diatur dalam SEMA 04 Tahun 2010<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P149-I023<br>Kode: 16 | Daftar Berkas Pengajuan | Alat bukti elektronik seperti hasil forensik alat komunikasi tersangka, handphone, hasil foto percakapan pada media sosial atau aplikasi pesan atau alat bukti elektronik lainnya (bila ada)<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P149-I024 | Serah-terima berkas | Yang Menyerahkan Berkas | Signature/name field. |
| J25-P149-I025 | Serah-terima berkas | Penerima Berkas Sekretariat TAT | Signature/name field. |
| J25-P149-I026 | Serah-terima berkas | .......................................... | Signature/name line for Yang Menyerahkan Berkas. |
| J25-P149-I027 | Serah-terima berkas | .............................................. | Signature/name line for Penerima Berkas Sekretariat TAT. |

### Lampiran 4.2: PDF 150 / cetak 135

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P150-I001 | Identitas registrasi | Nama Tersangka atau Terdakwa | Derived recommendation (not source): text. |
| J25-P150-I002 | Identitas registrasi | Nomor Handphone | Derived recommendation (not source): telephone text. |
| J25-P150-I003 | Identitas registrasi | Nomor Rekening | Derived recommendation (not source): account identifier. |
| J25-P150-I004 | Identitas registrasi | Yang Mengajukan Berkas | Derived recommendation (not source): person/agency text. |
| J25-P150-I005 | Identitas registrasi | Asal Instansi | Derived recommendation (not source): institution text. |
| J25-P150-I006 | Identitas registrasi | Tanggal Pengajuan | Derived recommendation (not source): date. |
| J25-P150-I007 | Daftar Berkas Pengajuan | Ada           Tidak Ada<br>Opsi: Ada \| Tidak Ada | Table availability columns; one availability mark per listed item. |
| J25-P150-I008<br>Kode: 1 | Daftar Berkas Pengajuan | Surat Permohonan Asesmen Terpadu dari penyidik kepada Ketua Tim Asesmen Terpadu Tingkat Nasional atau Tingkat Provinsi atau Tingkat Kabupaten/Kota<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P150-I009<br>Kode: 2 | Daftar Berkas Pengajuan | Fotocopy Kartu Identitas Tersangka (KTP atau Kartu Pelajar atau Kartu Mahasiswa atau Kartu Keluarga atau Paspor)<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P150-I010<br>Kode: 3 | Daftar Berkas Pengajuan | Surat Perintah Dimulainya Penyidikan (SPDP)<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P150-I011<br>Kode: 4 | Daftar Berkas Pengajuan | Laporan Polisi (LP) atau Laporan Kasus Narkotika (LKN)<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P150-I012<br>Kode: 5 | Daftar Berkas Pengajuan | Surat Perintah Penahanan<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P150-I013<br>Kode: 6 | Daftar Berkas Pengajuan | Berita Acara Pemeriksaan Tersangka<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P150-I014<br>Kode: 7 | Daftar Berkas Pengajuan | Surat Perintah Penyidikan<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P150-I015<br>Kode: 8 | Daftar Berkas Pengajuan | Berita Acara Penyitaan Barang Bukti Narkotika<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P150-I016<br>Kode: 9 | Daftar Berkas Pengajuan | Penetapan Status Barang Bukti Narkotika dari Kejaksaan<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P150-I017<br>Kode: 10 | Daftar Berkas Pengajuan | Surat Keterangan Uji Laboratorium Barang Bukti Narkotika<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P150-I018<br>Kode: 11 | Daftar Berkas Pengajuan | Berita Acara Penetapan Sita Barang Bukti Narkotika dari PN apabila ditemukan barang bukti narkotika<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P150-I019<br>Kode: 12 | Daftar Berkas Pengajuan | Surat Keterangan Hasil Pemeriksaan Urine atau Rambut yang dikeluarkan oleh Fasilitas Kesehatan Milik Pemerintah (seperti Labkesda, Pusdokes Polri, Klinik Polres, IPWL BNN, IPWL BNNP, IPWL BNN Kabupaten/ Kota, Puskesmas IPWL, RSUD, dll) dengan hasil positif<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P150-I020<br>Kode: 13 | Daftar Berkas Pengajuan | Alat bukti elektronik atau hasil forensik alat komunikasi terdakwa. (bila ada)<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P150-I021<br>Kode: 14 | Daftar Berkas Pengajuan | Petunjuk P19 untuk TAT atau Berita Acara Koordinasi untuk Pelaksanaan Asesmen Terpadu dari Kejaksaan<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P150-I022 | Serah-terima berkas | Yang Menyerahkan Berkas | Signature/name field. |
| J25-P150-I023 | Serah-terima berkas | Penerima Berkas Sekretariat TAT | Signature/name field. |
| J25-P150-I024 | Serah-terima berkas | .......................................... | Signature/name line for Yang Menyerahkan Berkas. |
| J25-P150-I025 | Serah-terima berkas | .............................................. | Signature/name line for Penerima Berkas Sekretariat TAT. |

### Lampiran 4.3: PDF 151 / cetak 136

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P151-I001 | Identitas registrasi | Nama Tersangka atau Terdakwa | Derived recommendation (not source): text. |
| J25-P151-I002 | Identitas registrasi | Nomor Handphone | Derived recommendation (not source): telephone text. |
| J25-P151-I003 | Identitas registrasi | Nomor Rekening | Derived recommendation (not source): account identifier. |
| J25-P151-I004 | Identitas registrasi | Yang Mengajukan Berkas | Derived recommendation (not source): person/agency text. |
| J25-P151-I005 | Identitas registrasi | Asal Instansi | Derived recommendation (not source): institution text. |
| J25-P151-I006 | Identitas registrasi | Tanggal Pengajuan | Derived recommendation (not source): date. |
| J25-P151-I007 | Daftar Berkas Pengajuan | Ada           Tidak Ada<br>Opsi: Ada \| Tidak Ada | Table availability columns; one availability mark per listed item. |
| J25-P151-I008<br>Kode: 1 | Daftar Berkas Pengajuan | Surat Permohonan Asesmen Terpadu dari Jaksa Penuntut Umum kepada Ketua Tim Asesmen Terpadu Tingkat Nasional atau Tingkat Provinsi atau Tingkat Kabupaten/Kota<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P151-I009<br>Kode: 2 | Daftar Berkas Pengajuan | Resume Berkas Perkara;<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P151-I010<br>Kode: 3 | Daftar Berkas Pengajuan | Surat Hasil Pemeriksaan Uji Laboratorium terhadap alat bukti<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P151-I011<br>Kode: 4 | Daftar Berkas Pengajuan | Surat Penetapan Penyitaan Barang Bukti dari Pengadilan<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P151-I012<br>Kode: 5 | Daftar Berkas Pengajuan | Surat Hasil Pemeriksaan Rambut dengan hasil positif narkotika<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P151-I013<br>Kode: 6 | Daftar Berkas Pengajuan | Alat bukti elektronik atau hasil forensik alat komunikasi terdakwa. (bila ada)<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P151-I014 | Serah-terima berkas | Yang Menyerahkan Berkas | Signature/name field. |
| J25-P151-I015 | Serah-terima berkas | Penerima Berkas Sekretariat TAT | Signature/name field. |
| J25-P151-I016 | Serah-terima berkas | .......................................... | Signature/name line for Yang Menyerahkan Berkas. |
| J25-P151-I017 | Serah-terima berkas | .............................................. | Signature/name line for Penerima Berkas Sekretariat TAT. |

### Lampiran 4.4: PDF 152 / cetak 137

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P152-I001 | Identitas registrasi | Nama Tersangka atau Terdakwa | Derived recommendation (not source): text. |
| J25-P152-I002 | Identitas registrasi | Nomor Handphone | Derived recommendation (not source): telephone text. |
| J25-P152-I003 | Identitas registrasi | Nomor Rekening | Derived recommendation (not source): account identifier. |
| J25-P152-I004 | Identitas registrasi | Yang Mengajukan Berkas | Derived recommendation (not source): person/agency text. |
| J25-P152-I005 | Identitas registrasi | Asal Instansi | Derived recommendation (not source): institution text. |
| J25-P152-I006 | Identitas registrasi | Tanggal Pengajuan | Derived recommendation (not source): date. |
| J25-P152-I007 | Daftar Berkas Pengajuan | Ada           Tidak Ada<br>Opsi: Ada \| Tidak Ada | Table availability columns; one availability mark per listed item. |
| J25-P152-I008<br>Kode: 1 | Daftar Berkas Pengajuan | Surat Permohonan Asesmen Terpadu dari Jaksa yang mendapat penetapan Hakim kepada Ketua Tim Asesmen Terpadu Tingkat Nasional atau Tingkat Provinsi atau Tingkat Kabupaten/Kota<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P152-I009<br>Kode: 2 | Daftar Berkas Pengajuan | Surat Dakwaan<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P152-I010<br>Kode: 3 | Daftar Berkas Pengajuan | Resume Berkas Perkara<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P152-I011<br>Kode: 4 | Daftar Berkas Pengajuan | Surat Perintah Pelimpahan Perkara<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P152-I012<br>Kode: 5 | Daftar Berkas Pengajuan | Surat Penetapan Persidangan<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P152-I013<br>Kode: 5 | Daftar Berkas Pengajuan | Hasil forensik alat komunikasi terdakwa. (bila ada)<br>Opsi: Ada \| Tidak Ada | Checklist item; source has no separate required marker. |
| J25-P152-I014 | Serah-terima berkas | Yang Menyerahkan Berkas | Signature/name field. |
| J25-P152-I015 | Serah-terima berkas | Penerima Berkas Sekretariat TAT | Signature/name field. |
| J25-P152-I016 | Serah-terima berkas | .......................................... | Signature/name line for Yang Menyerahkan Berkas. |
| J25-P152-I017 | Serah-terima berkas | .............................................. | Signature/name line for Penerima Berkas Sekretariat TAT. |

### Lampiran 5: PDF 153 / cetak 138

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P153-I001 | Surat penolakan | Nomor | Source printed value: B / 743 /VII/Ka/PB.06.00/2023 /BNN; preserve as source. |
| J25-P153-I002 | Surat penolakan | Tanggal surat | Source shows Jakarta,      Juli 2023; date fill. |
| J25-P153-I003 | Surat penolakan | Kualifikasi<br>Opsi: - |  |
| J25-P153-I004 | Surat penolakan | Lampiran<br>Opsi: - |  |
| J25-P153-I005 | Surat penolakan | Perihal<br>Opsi: Penolakan Asesemen Terpadu | Source spelling is â€œAsesemenâ€; preserve typo. |
| J25-P153-I006 | Surat penolakan | a.n â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦. | Name/subject blank. |
| J25-P153-I007 | Surat penolakan | Kepada<br>Opsi: Yth. Penyidik/ Jaksa Penuntut Umum/ Hakim | Recipient options shown in source. |
| J25-P153-I008 | Surat penolakan | di<br>Opsi: Tempat |  |
| J25-P153-I009<br>Kode: 1.a | Surat penolakan | Undang-Undang Nomor 35 Tahun 2009 tentang Narkotika | Reference in letter. |
| J25-P153-I010<br>Kode: 1.b | Surat penolakan | Peraturan Kepala Badan Narkotika Nasional Nomor 11 Tahun 2014 tentang Tata Cara Penanganan Tersangka dan/atau Terdakwa Pecandu Narkotika dan Korban Penyalahgunaan Narkotika ke dalam Lembaga Rehabilitasi | Reference in letter. |
| J25-P153-I011<br>Kode: 1.c | Surat penolakan | Petunjuk Teknis Tata Cara Penanganan Tersangka dan/atau Terdakwa Penyalah Guna, Pecandu Narkotika dan Korban Penyalahgunaan Narkotika melalui Asesmen Terpadu | Reference in letter. |
| J25-P153-I012<br>Kode: 1.d | Surat penolakan | Permohonan Pengajuan Asesmen Terpadu an. Tersangka â€¦â€¦â€¦â€¦â€¦â€¦â€¦ | Name blank. |
| J25-P153-I013<br>Kode: 2 | Surat penolakan | permohonan Asesmen Terpadu an. â€¦â€¦â€¦â€¦â€¦â€¦ditolak karena kurangnya berkas berupaâ€¦â€¦â€¦( sesuai dengan Petunjuk Teknis Petunjuk Teknis Tata Cara Penanganan Tersangka Dan/Atau Terdakwa Penyalah Guna, Pecandu Narkotika, Dan Korban Penyalahgunaan Narkotika Melalui Asesmen Terpadu) | Fill names/missing-document narrative; preserve duplicated â€œPetunjuk Teknisâ€. |
| J25-P153-I014<br>Kode: 3 | Surat penolakan | Pengajuan Asesmen Terpadu an. â€¦â€¦â€¦â€¦.. dapat dilakukan apabila telah melengkapi persyaratan dimaksud. | Name blank. |
| J25-P153-I015<br>Kode: 4 | Surat penolakan | Demikian untuk menjadi maklum. | Narrative closing. |
| J25-P153-I016 | Surat penolakan | Paraf: 1. Konseptor : ..... | Initials/signature line. |
| J25-P153-I017 | Surat penolakan | 2. Plh.Kasubdit Was Tahanan : â€¦. | Initials/signature line. |
| J25-P153-I018 | Surat penolakan | 3. Koorstaf : ..... | Initials/signature line. |
| J25-P153-I019 | Surat penolakan | 4. Direktur Wastahti : ..... | Initials/signature line. |
| J25-P153-I020 | Surat penolakan | 5. Kasubag TU Brantas : ..... | Initials/signature line. |
| J25-P153-I021 | Surat penolakan | 6. Kabag TU Settama BNN : ..... | Initials/signature line. |
| J25-P153-I022 | Surat penolakan | Ketua Tim Asesmen Terpadu Tingkat Provinsi â€¦â€¦â€¦â€¦â€¦ | Signature/role; blank province. |
| J25-P153-I023 | Surat penolakan | â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦ | Signature/name line. |

### Lampiran 6: PDF 154 / cetak 139

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P154-I001 | Lembar persetujuan asesmen terpadu pada anak | Nama (lengkap) | Child assent identity field. |
| J25-P154-I002 | Lembar persetujuan asesmen terpadu pada anak | Tempat/tanggal lahir | Child assent identity field. |
| J25-P154-I003 | Lembar persetujuan asesmen terpadu pada anak | Pekerjaan | Child assent identity field. |
| J25-P154-I004 | Lembar persetujuan asesmen terpadu pada anak | Alamat | Child assent identity field. |
| J25-P154-I005 | Lembar persetujuan asesmen terpadu pada anak | orang tua atau wali saya atas nama..................................................... | Parent/guardian name blank. |
| J25-P154-I006 | Lembar persetujuan asesmen terpadu pada anak | Asesmen Terpadu di .............................................. | Assessment location blank. |
| J25-P154-I007 | Lembar persetujuan asesmen terpadu pada anak | saya menyetujui atau tidak menyetujui *<br>Opsi: menyetujui atau tidak menyetujui | Choice text shown in narrative; source does not render separate checkbox. |
| J25-P154-I008 | Lembar persetujuan asesmen terpadu pada anak | Jakarta, 2025..............2025 | Date line as printed; duplicated/garbled source layout. |
| J25-P154-I009 | Lembar persetujuan asesmen terpadu pada anak | Tersangka/terdakwa | Signature/name and Materai 10.000. |
| J25-P154-I010 | Lembar persetujuan asesmen terpadu pada anak | Orang tua/ wali | Signature/name field. |
| J25-P154-I011 | Lembar persetujuan asesmen terpadu pada anak | Saksi | Signature/name field. |

### Lampiran 7.1 (ASI full): PDF 155 / cetak 140

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P155-I001 | Petunjuk ASI | Skala Rating Klien<br>Opsi: 0 - Tidak sama sekali \| 1 - Ringan \| 2 - Sedang \| 3 - Berat \| 4 - Sangat Berat | Rating scale; source instruction. |
| J25-P155-I002 | Petunjuk ASI | Terdapat dua periode waktu yang akan kita diskusikan:<br>Opsi: 30 hari terakhir \| Sepanjang hidup | Source instruction. \| QA: exact source label restored; prior explanatory/context label: Periode waktu yang didiskusikan |
| J25-P155-I003 | Petunjuk ASI | X = Pertanyaan tidak dijawab. Klien tidak bisa atau tidak mau menjawab.<br>Opsi: X | Source: X = Pertanyaan tidak dijawab. Klien tidak bisa atau tidak mau menjawab. \| QA: exact source label restored; prior explanatory/context label: Kode pertanyaan tidak dijawab |
| J25-P155-I004 | Petunjuk ASI | N = Pertanyaan tidak dapat diterapkan. Harus terdapat instruksi dalam item untuk menggunakan â€Nâ€.<br>Opsi: N | Source: N = Pertanyaan tidak dapat diterapkan; instruction in item required. \| QA: exact source label restored; prior explanatory/context label: Kode pertanyaan tidak dapat diterapkan |
| J25-P155-I005 | Petunjuk ASI | Aturan Paruh Waktu (Half Time Rule)!<br>Opsi: 14 hari atau lebih = 1 bulan \| 6 bulan atau lebih = 1 tahun | Source instruction. |
| J25-P155-I006 | Klasifikasi pekerjaan | Klasifikasi pekerjaan menurut standar internasional<br>Opsi: 1. Anggota dewan legislatif, pejabat pemerintah - tugas utama berhubungan dengan kebijakan pemerintahan, hukum, regulasi, dan pengawasan implementasi. \| 2. Profesional - membutuhkan pengetahuan tingkat tinggi dalam bidang ilmu pengetahuan, atau ilmu sosial/kemanusiaan. \| 3. Teknisi/kumpulan tenaga profesional - membutuhkan pengetahuan teknis, pengalaman di lapangan berhubungan dengan ilmu fisika dan hayati, atau ilmu sosial/kemanusiaan. \| 4. Juru tulis - melaksanakan tugas sekretariat, prosedur surat menyurat dan pekerjaan juru tulis lainnya yang berorientasi pada pelanggan. \| 5. Jasa servis dan penjualan - termasuk jasa travel, katering, sales toko, perawatan rumah, dan menjaga ketertiban. \| 6. Pekerja terlatih di bidang pertanian dan perikanan - termasuk peningkatan hasil panen, pembiakan atau perburuan binatang, penangkapan atau pembudidayaan ikan, dll. \| 7. Keterampilan dan Perdagangan - tugas utama termasuk pembangunan gedung dan bangunan lain, membuat aneka produk, termasuk kerajinan tangan. \| 8. Operator alat dan mesin:tugas utama termasuk mengemudi kendaraan, mengoperasikan mesin, atau dan merakit produk. Seperti: Ojek \| 9. Pekerja kasar - termasuk pekerjaan sederhana dan rutin, seperti penjaja barang di jalan, penyambut tamu, pekerja kebersihan, buruh dan petugas parkir. \| 0. Angkatan bersenjata - termasuk angkatan darat, angkatan laut, angkatan udara, dll. Tidak termasuk polisi non-militer, petugas pabean-pajak, tenaga cadangan militer inaktif | Reference options; source wording/typos preserved. |
| J25-P155-I007 | Daftar zat yang umum digunakan | Daftar zat yang umum digunakan<br>Opsi: Alkohol: Bir, anggur (wine), liquor (vodka, tequila, whisky), grain (metil alkohol), arak/ciu \| Heroin: Smack, H, Horse, Brown Sugar, Putau \| Metadon: Dolophine, LAAM, Metadose \| Opiat: Opium, Fentanyl, Buphrenorphine, Pereda nyeri - Morfin, Dilaudid, Demerol, Percocet, Darvon, Tramadol dll. \| Barbiturat: Nembutal, Seconal, Tuinal, Amytal, Pentobarbital, Secobarbital, Fenobarbital, Fiorinal, Doriden, dll. \| Sed/Hip/: Benzodiazepin = Valium, Librium, Ativan, Serax, Aprazolam \| Trankuil: Tranxene, Dalmane, Halcion, Xanax, Miltown, Lain-lain = Kloral Hidrat, Quaaludes \| Kokain: Kristal Kokain, Free-Base Cocaine, Crack, Rock, dll. \| Amfetamin: Monster, Crank, Benzedrine, Dexedrine, Ritalin, Sabu \| Stimulan: Preludin, Metamfetamin, Speed, Ice, Crystal, Khat \| Kanabis: Marijuana, Hashish, Pot, Bango Igbo, Indian Hemp, Bhang, Charas, Ganja, Mota, Anasha \| Halusinogen: LSD (Acid), Meskalin, Psilocybin (Mushrooms), Peyote, PCP, MDMA, Ekstasi, Angel Dust \| Inhalan: Nitrous Oxide (Whippits), Amyl Nitrite (Poppers), Lem, Solvents, Gasoline, Toluene, Etc. \| Others: PCC, dextro, komix, antimo | Reference options; source spelling preserved. |

### Lampiran 7.1 (ASI full): PDF 156 / cetak 141

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P156-I001<br>Kode: G1 | INFORMASI UMUM | No. Rekam Rehabilitasi | Input field; options shown where applicable. |
| J25-P156-I002<br>Kode: G3 | INFORMASI UMUM | Akankah terapi ini diberikan di dalam fasilitas lembaga pemasyarakatan?<br>Opsi: 0 = Tidak \| 1 = Ya | Input field; options shown where applicable. |
| J25-P156-I003<br>Kode: G4 | INFORMASI UMUM | Tanggal Masuk: | Input field; options shown where applicable. |
| J25-P156-I004<br>Kode: G5 | INFORMASI UMUM | Tanggal wawancara: | Input field; options shown where applicable. |
| J25-P156-I005<br>Kode: G6 | INFORMASI UMUM | Waktu memulai: | Input field; options shown where applicable. |
| J25-P156-I006<br>Kode: G7 | INFORMASI UMUM | Waktu mengakhiri: | Input field; options shown where applicable. |
| J25-P156-I007<br>Kode: G8 | INFORMASI UMUM | Klasifikasi Asesmen:<br>Opsi: 1. Awal \| 2. Lanjutan | Input field; options shown where applicable. |
| J25-P156-I008<br>Kode: G9 | INFORMASI UMUM | Metode Asesmen:<br>Opsi: 1. Tatap Muka \| 2. Daring | Input field; options shown where applicable. |
| J25-P156-I009<br>Kode: G10 | INFORMASI UMUM | Jenis kelamin:<br>Opsi: 1. Laki-laki \| 2. Perempuan | Input field; options shown where applicable. |
| J25-P156-I010<br>Kode: G11 | INFORMASI UMUM | Nomor Kode Pewawancara/Inisial: | Input field; options shown where applicable. |
| J25-P156-I011<br>Kode: G14 | INFORMASI UMUM | Berapa lama Anda tinggal di alamat ini? | Input field; options shown where applicable. |
| J25-P156-I012<br>Kode: G16 | INFORMASI UMUM | Tanggal lahir: | Input field; options shown where applicable. |
| J25-P156-I013<br>Kode: 16a | INFORMASI UMUM | Umur | Input field; options shown where applicable. |
| J25-P156-I014<br>Kode: G17 | INFORMASI UMUM | Apa ras/etnis/kebangsaan Anda? | Input field; options shown where applicable. |
| J25-P156-I015<br>Kode: G18 | INFORMASI UMUM | Apakah Anda memiliki agama?<br>Opsi: 0. Protestan \| 1. Katolik \| 2. Yahudi \| 4. Islam \| 5. Kristen lainnya \| 6. Tidak beragama \| 7. Hindu \| 8. Budha \| 9. Lainnya | Input field; options shown where applicable. |
| J25-P156-I016<br>Kode: G19 | INFORMASI UMUM | Apakah Anda berada di dalam lingkungan terkontrol dalam 30 hari terakhir?<br>Opsi: 1. Tidak \| 2. Penjara \| 3. Terapi Alkohol/NAPZA \| 4. Terapi Medis \| 5. Terapi Psikiatri \| 6. Lainnya | Input field; options shown where applicable. |
| J25-P156-I017<br>Kode: G20 | INFORMASI UMUM | Berapa hari? | Input field; options shown where applicable. |
| J25-P156-I018<br>Kode: G21 | INFORMASI UMUM | SUMBER RUJUKAN: Siapa yang merujuk Anda untuk terapi? | Input field; options shown where applicable. |
| J25-P156-I019 | INFORMASI UMUM | Nama | Address/name block shown with Nama and Alamat lines. |
| J25-P156-I020 | INFORMASI UMUM | Alamat | Address/name block shown with Nama and Alamat lines. |
| J25-P156-I021 | INFORMASI UMUM | Catatan Informasi Umum | Multi-line notes field; source says termasuk nomor pertanyaan dengan catatan Anda. |
| J25-P156-I022 | INFORMASI UMUM | Derajat Keparahan: Medis<br>Opsi: 0 1 2 3 4 5 6 7 8 9 | Severity display; source label has PRO / Problem split over table. |
| J25-P156-I023 | INFORMASI UMUM | Pekerjaan/Dukungan<br>Opsi: 0 1 2 3 4 5 6 7 8 9 | Severity display row. |
| J25-P156-I024 | INFORMASI UMUM | Zat<br>Opsi: 0 1 2 3 4 5 6 7 8 9 | Severity display row. |
| J25-P156-I025 | INFORMASI UMUM | Alkohol<br>Opsi: 0 1 2 3 4 5 6 7 8 9 | Severity display row. |
| J25-P156-I026 | INFORMASI UMUM | Legal<br>Opsi: 0 1 2 3 4 5 6 7 8 9 | Severity display row. |
| J25-P156-I027 | INFORMASI UMUM | Keluarga/sosial<br>Opsi: 0 1 2 3 4 5 6 7 8 9 | Severity display row. |
| J25-P156-I028 | INFORMASI UMUM | Psikiatri<br>Opsi: 0 1 2 3 4 5 6 7 8 9 | Severity display row. |

### Lampiran 7.1 (ASI full): PDF 157 / cetak 142

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P157-I001<br>Kode: M1 | STATUS MEDIS | *Berapa kalikah sepanjang hidup Anda, pernah dirawat inap di rumah sakit untuk masalah fisik?<br>Opsi: 0 = Tidak, 1 = Iya,      2 = Tidak Mengetahui | Input item. |
| J25-P157-I002<br>Kode: M2 | STATUS MEDIS | Berapa tahun dan bulan yang lalu sejak terakhir anda dirawat inap di rumah sakit untuk masalah di atas? | Input item. Conditional source: if not hospitalized in M1, code â€œNNâ€. |
| J25-P157-I003<br>Kode: M3 | STATUS MEDIS | Apakah Anda menderita masalah medis kronis yang selalu mempengaruhi hidup Anda?<br>Opsi: 0 = Tidak \| 1 = Ya | Input item. |
| J25-P157-I004<br>Kode: M4 | STATUS MEDIS | Apakah Anda menggunakan obat yang diresepkan secara teratur untuk gangguan medis/fisik?<br>Opsi: 0 = Tidak \| 1 = Ya | Input item. |
| J25-P157-I005<br>Kode: M5 | STATUS MEDIS | Apakah Anda menerima dukungan finansial untuk kecacatan fisik?<br>Opsi: 0 = Tidak \| 1 = Ya | Input item. |
| J25-P157-I006<br>Kode: M6 | STATUS MEDIS | Berapa harikah Anda mempunyai masalah Medis dalam 30 hari terakhir? | Input item. |
| J25-P157-I007<br>Kode: M7 | STATUS MEDIS | Seberapa terganggukah Anda oleh masalah fisik dalam 30 hari terakhir? | Input item. |
| J25-P157-I008<br>Kode: M8 | STATUS MEDIS | Seberapa pentingkah bagi Anda saat ini pengobatan untuk masalah medis tersebut? | Input item. |
| J25-P157-I009<br>Kode: M10 | STATUS MEDIS | Salah mengemukakan kenyataan dirinya?<br>Opsi: 0 = Tidak \| 1 = Ya | Input item. |
| J25-P157-I010<br>Kode: M11 | STATUS MEDIS | Ketidakmampuan klien untuk memahami?<br>Opsi: 0 = Tidak \| 1 = Ya | Input item. |
| J25-P157-I011<br>Kode: M12 | STATUS MEDIS | Apakah Anda pernah di tes untuk hepatitis?<br>Opsi: 0 = Tidak \| 1 = Ya | Input item. |
| J25-P157-I012<br>Kode: M12a | STATUS MEDIS | Jika ya, apakah hasilnya?<br>Opsi: 1 = Hepatitis Negatif (tidak terinfeksi) \| 2 = Hepatitis Positif (terinfeksi) \| 3 = Tidak tahu | Input item. Conditional source: if parent test item is tidak, code N. |
| J25-P157-I013<br>Kode: M12b | STATUS MEDIS | Apakah Anda ingin melakukan tes Hepatitis?<br>Opsi: 0 = Tidak \| 1 = Ya | Input item. |
| J25-P157-I014<br>Kode: M13 | STATUS MEDIS | Apakah Anda pernah di tes untuk HIV?<br>Opsi: 0 = Tidak \| 1 = Ya | Input item. |
| J25-P157-I015<br>Kode: M13a | STATUS MEDIS | Jika ya, apakah hasilnya?<br>Opsi: 1 = HIV Negatif (tidak terinfeksi) \| 2 = HIV Positif (terinfeksi) \| 3 = Tidak tahu | Input item. Conditional source: if parent test item is tidak, code N. |
| J25-P157-I016<br>Kode: M13b | STATUS MEDIS | Apakah Anda ingin melakukan tes HIV?<br>Opsi: 0 = Tidak \| 1 = Ya | Input item. |
| J25-P157-I017<br>Kode: M14 | STATUS MEDIS | Apakah Anda saat ini sedang mengandung?<br>Opsi: 0 = Tidak, 1 = Iya,      2 = Tidak Mengetahui | Input item. |
| J25-P157-I018<br>Kode: M14a | STATUS MEDIS | Jika mengandung apakah Anda melakukan pemeriksaan prenatal?<br>Opsi: 0 = Tidak, 1 = Iya,      2 = Tidak Mengetahui | Input item. Conditional source: if M14 = 0 or 2 (tidak mengetahui), M14a = N. |
| J25-P157-I019<br>Kode: M14b | STATUS MEDIS | Jika tidak yakin maukah Anda mendapatkan tes kehamilan?<br>Opsi: 0 = Tidak, 1 = Iya,      2 = Tidak Mengetahui | Input item. Conditional source: if M14 = 1 (ya), M14b = N. |
| J25-P157-I020 | STATUS MEDIS | Catatan Medis | Multi-line notes field; source says masukkan nomor pertanyaan dengan catatan Anda. |

### Lampiran 7.1 (ASI full): PDF 158 / cetak 143

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P158-I001<br>Kode: E1 | STATUS PEKERJAAN/DUKUNGAN | *Pendidikan yang diselesaikan:<br>Opsi: level 0 = tidak sekolah \| level 1= kelas 1 - 6 SD \| level 2= kelas 1 - 3 SMP \| level 3= kelas 1 - 3 SMU \| level 4= diploma/akademi/college \| level 5=strata 1 \| Level 6= strata 2 dan 3 (termasuk program doktoral) | Input item. |
| J25-P158-I002<br>Kode: E2 | STATUS PEKERJAAN/DUKUNGAN | *Pelatihan atau Pendidikan Keterampilan yang selesai: | Input item. |
| J25-P158-I003<br>Kode: E3 | STATUS PEKERJAAN/DUKUNGAN | Apakah anda mempunyai profesi, keahlian atau keterampilan?<br>Opsi: 0 = Tidak \| 1 = Ya | Input item. |
| J25-P158-I004<br>Kode: E4 | STATUS PEKERJAAN/DUKUNGAN | Apakah anda memiliki SIM yang masih berlaku?<br>Opsi: 0 = Tidak \| 1 = Ya | Input item. |
| J25-P158-I005<br>Kode: E5 | STATUS PEKERJAAN/DUKUNGAN | Apakah anda memiliki akses kendaraan bermotor?<br>Opsi: 0 = Tidak \| 1 = Ya | Input item. |
| J25-P158-I006<br>Kode: E6 | STATUS PEKERJAAN/DUKUNGAN | Berapa lamakah pekerjaan purna waktu Anda yang paling lama? | Input item. |
| J25-P158-I007<br>Kode: E7 | STATUS PEKERJAAN/DUKUNGAN | Jenis pekerjaan terakhir? | Input item. |
| J25-P158-I008<br>Kode: E8 | STATUS PEKERJAAN/DUKUNGAN | Apakah ada seseorang yang memberikan dukungan hidup pada Anda?<br>Opsi: 0 = Tidak \| 1 = Ya | Input item. |
| J25-P158-I009<br>Kode: E9 | STATUS PEKERJAAN/DUKUNGAN | Apakah dukungan tersebut cukup signifikan untuk kehidupan anda?<br>Opsi: 0 = Tidak \| 1 = Ya | Input item. Conditional source: Jika E8=tidak, maka E9= N. |
| J25-P158-I010<br>Kode: E10 | STATUS PEKERJAAN/DUKUNGAN | Pola pekerjaan tiga tahun terakhir yang utama?<br>Opsi: 1. Purna waktu (35 jam atau lebih) \| 2. Paruh waktu (jam-jam tetap) \| 3. Paruh waktu (jam tidak tetap) \| 4. Mahasiswa/pelajar \| 5. Militer \| 6. Pensiun/Ketidakmampuan \| 7. Tidak bekerja \| 8. Di dalam lingkungan terkontrol \| 9. Ibu/Bapak Rumah Tangga (Homemaker) | Input item. |
| J25-P158-I011<br>Kode: E11 | STATUS PEKERJAAN/DUKUNGAN | Berapa harikah Anda bekerja yang digaji dalam 30 hari terakhir? | Input item. |
| J25-P158-I012<br>Kode: E12 | STATUS PEKERJAAN/DUKUNGAN | Pekerjaan? | Input item. Source instruction: pertanyaan E12-17 dalam 30 hari terakhir (dalam ribuan). |
| J25-P158-I013<br>Kode: E13 | STATUS PEKERJAAN/DUKUNGAN | Kompensasi kehilangan pekerjaan | Input item. Source instruction: pertanyaan E12-17 dalam 30 hari terakhir (dalam ribuan). |
| J25-P158-I014<br>Kode: E14 | STATUS PEKERJAAN/DUKUNGAN | Kesejahteraan sosial | Input item. Source instruction: pertanyaan E12-17 dalam 30 hari terakhir (dalam ribuan). |
| J25-P158-I015<br>Kode: E15 | STATUS PEKERJAAN/DUKUNGAN | Pensiun, jaminan sosial? | Input item. Source instruction: pertanyaan E12-17 dalam 30 hari terakhir (dalam ribuan). |
| J25-P158-I016<br>Kode: E16 | STATUS PEKERJAAN/DUKUNGAN | Pasangan, keluarga, atau teman-teman? | Input item. Source instruction: pertanyaan E12-17 dalam 30 hari terakhir (dalam ribuan). |
| J25-P158-I017<br>Kode: E17 | STATUS PEKERJAAN/DUKUNGAN | Ilegal? | Input item. Source instruction: pertanyaan E12-17 dalam 30 hari terakhir (dalam ribuan). |
| J25-P158-I018<br>Kode: E18 | STATUS PEKERJAAN/DUKUNGAN | Berapa orangkah yang menggantungkan hidupnya pada Anda untuk makan, tempat tinggal, dll? | Input item. |
| J25-P158-I019<br>Kode: E19 | STATUS PEKERJAAN/DUKUNGAN | Berapa harikah Anda mengalami masalah pekerjaan dalam 30 hari terakhir? | Input item. Conditional source: if client imprisoned/detained in 30 days, code NN. |
| J25-P158-I020 | STATUS PEKERJAAN/DUKUNGAN | Catatan Pekerjaan/Dukungan | Multi-line notes field; source includes Level line and currency instruction. |

### Lampiran 7.1 (ASI full): PDF 159 / cetak 144

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P159-I001<br>Kode: E20 | STATUS PEKERJAAN/DUKUNGAN | Seberapa terganggukah Anda dari masalah-masalah pekerjaan ini dalam 30 hari terakhir?<br>Opsi: Skala Rating Klien | Rating/assessment item; E20 source: if E19=N, code N. |
| J25-P159-I002<br>Kode: E21 | STATUS PEKERJAAN/DUKUNGAN | Seberapa pentingkah konseling untuk masalah pekerjaan bagi Anda saat ini?<br>Opsi: Skala Rating Klien |  |
| J25-P159-I003<br>Kode: E23 | STATUS PEKERJAAN/DUKUNGAN | Salah mengemukakan kenyataan dirinya<br>Opsi: 0 = Tidak \| 1 = Ya |  |
| J25-P159-I004<br>Kode: E24 | STATUS PEKERJAAN/DUKUNGAN | Ketidakmampuan klien untuk memahami?<br>Opsi: 0 = Tidak \| 1 = Ya |  |
| J25-P159-I005 | STATUS PEKERJAAN/DUKUNGAN | Catatan Pekerjaan/Dukungan: Sebutkan jenis mata uang yang digunakan...... | Multi-line notes field. |
| J25-P159-I006 | STATUS ZAT/ALKOHOL | Jenis Cara Penggunaan<br>Opsi: 1. Oral (segala sesuatu yang ditelan) \| 2. Hidung (atau segala sesuatu yang melalui membran mukosa) \| 3. Merokok \| 4. Injeksi Non-IV (seperti IM) \| 5. IV (suntikan langsung ke dalam vena) | If more than one, source says choose most risky; order from lowest to highest. |
| J25-P159-I007<br>Kode: D1 | STATUS ZAT/ALKOHOL | Alkohol (seberapapun banyaknya)<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) \| Cara Penggunaan | Three-column source table; D37 has separate method options printed below. |
| J25-P159-I008<br>Kode: D2 | STATUS ZAT/ALKOHOL | Alkohol (sampai intoksikasi)<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) \| Cara Penggunaan | Three-column source table; D37 has separate method options printed below. |
| J25-P159-I009<br>Kode: D3 | STATUS ZAT/ALKOHOL | Heroin<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) \| Cara Penggunaan | Three-column source table; D37 has separate method options printed below. |
| J25-P159-I010<br>Kode: D4 | STATUS ZAT/ALKOHOL | Metadon / Subutex<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) \| Cara Penggunaan | Three-column source table; D37 has separate method options printed below. |
| J25-P159-I011<br>Kode: D5 | STATUS ZAT/ALKOHOL | Opiat lain/analgesik<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) \| Cara Penggunaan | Three-column source table; D37 has separate method options printed below. |
| J25-P159-I012<br>Kode: D6 | STATUS ZAT/ALKOHOL | Barbiturat<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) \| Cara Penggunaan | Three-column source table; D37 has separate method options printed below. |
| J25-P159-I013<br>Kode: D7 | STATUS ZAT/ALKOHOL | Sedatif/Hipnotik/ Tranquilizers<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) \| Cara Penggunaan | Three-column source table; D37 has separate method options printed below. |
| J25-P159-I014<br>Kode: D8 | STATUS ZAT/ALKOHOL | Kokain<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) \| Cara Penggunaan | Three-column source table; D37 has separate method options printed below. |
| J25-P159-I015<br>Kode: D9 | STATUS ZAT/ALKOHOL | Amfetamin/stimulans<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) \| Cara Penggunaan | Three-column source table; D37 has separate method options printed below. |
| J25-P159-I016<br>Kode: D10 | STATUS ZAT/ALKOHOL | Kanabis<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) \| Cara Penggunaan | Three-column source table; D37 has separate method options printed below. |
| J25-P159-I017<br>Kode: D11 | STATUS ZAT/ALKOHOL | Halusinogen<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) \| Cara Penggunaan | Three-column source table; D37 has separate method options printed below. |
| J25-P159-I018<br>Kode: D12 | STATUS ZAT/ALKOHOL | Inhalan<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) \| Cara Penggunaan | Three-column source table; D37 has separate method options printed below. |
| J25-P159-I019<br>Kode: D13 | STATUS ZAT/ALKOHOL | Lebih dari satu zat per hari (termasuk alkohol)<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) \| Cara Penggunaan | Three-column source table; D37 has separate method options printed below. |
| J25-P159-I020<br>Kode: D37 | STATUS ZAT/ALKOHOL | Nikotin<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) \| Cara Penggunaan | Three-column source table; D37 has separate method options printed below. |
| J25-P159-I021 | STATUS ZAT/ALKOHOL | Cara Penggunaan<br>Opsi: 1. Oral/kunyah 2. hirup 3. merokok 4. Injeksi bukan intravena 5. Intravena | Options exact as printed. \| QA: exact source label restored; prior explanatory/context label: Cara penggunaan D37 |
| J25-P159-I022<br>Kode: D14a | STATUS ZAT/ALKOHOL | Kenali zat utama yang disalahgunakan: | Input item. |
| J25-P159-I023<br>Kode: D14b | STATUS ZAT/ALKOHOL | Kenali zat sekunder yang disalahgunakan: | Input item. Source: D14b dapat dikode sebagai N. |
| J25-P159-I024<br>Kode: D15 | STATUS ZAT/ALKOHOL | Berapa lamakah periode abstinen sukarela yang terakhir dari zat-zat yang utama ini?<br>Opsi: Bulan | Input item. Source: Minimal abstinen 1 bulan; Kode 00 = Tidak pernah abstinen. |
| J25-P159-I025<br>Kode: D16 | STATUS ZAT/ALKOHOL | Berapa bulan yang lalu abstinen ini berakhir?<br>Opsi: Bulan | Input item. Source: jika D15 = â€œ00â€, maka D16 = â€œNNâ€; â€œ00â€ = masih abstinen. |

### Lampiran 7.1 (ASI full): PDF 160 / cetak 145

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P160-I001<br>Kode: D17 | STATUS ZAT/ALKOHOL | *Berapa kalikah Anda mengalami Delirium Tremens Alkohol? | Input item. |
| J25-P160-I002<br>Kode: D23 | STATUS ZAT/ALKOHOL | Berapakah biaya yang Anda habiskan selama 30 hari terakhir untuk Alkohol? | Input item. Source unit: (dalam ribuan). |
| J25-P160-I003<br>Kode: D24 | STATUS ZAT/ALKOHOL | Berapakah biaya yang Anda habiskan selama 30 hari terakhir untuk Zat? | Input item. Source unit: (dalam ribuan). |
| J25-P160-I004<br>Kode: D25 | STATUS ZAT/ALKOHOL | Berapa harikah Anda telah mendapatkan layanan rawat jalan untuk zat dalam 30 hari terakhir? | Input item. |
| J25-P160-I005<br>Kode: D36 | STATUS ZAT/ALKOHOL | Berapa kali Anda telah mencoba berhenti dari penggunaan zat tanpa mengikuti terapi? | Input item. |
| J25-P160-I006<br>Kode: D38 | STATUS ZAT/ALKOHOL | Apakah Anda pernah menggunakan jarum bekas orang lain?<br>Opsi: 0 = Tidak \| 1 = Ya | Input item. |
| J25-P160-I007<br>Kode: D38a | STATUS ZAT/ALKOHOL | Berapa kali dalam 30 hari terakhir? | Input item. Conditional source: Jika D38 dalam 30 hari terakhir = 0, maka D38a = N. |
| J25-P160-I008<br>Kode: D19a | STATUS ZAT/ALKOHOL | Berapa kalikah selama hidup Anda pernah memperoleh layanan untuk penyalahgunaan zat/alkohol? | Input item. |
| J25-P160-I009<br>Kode: D21a | STATUS ZAT/ALKOHOL | Berapa kalikah layanan ini hanya untuk detoks: | Input item. Conditional source: Jika D19a = â€œ00â€, maka D21a adalah â€œNNâ€. |
| J25-P160-I010<br>Kode: D26 | STATUS ZAT/ALKOHOL | Berapa harikah dalam 30 hari terakhir Anda mengalami masalah Alkohol? | Input item. |
| J25-P160-I011<br>Kode: D28 | STATUS ZAT/ALKOHOL | Seberapa terganggukah Anda karena permasalahan alkohol dalam 30 hari terakhir? | Input item. |
| J25-P160-I012<br>Kode: D39 | STATUS ZAT/ALKOHOL | Menggunakan skala pengukuran klien, bagaimana Anda mengukur derajat kesetujuan dengan pernyataan berikut ini?<br>Opsi: 0=sangat tidak setuju \| 1=tidak setuju \| 2= ragu-ragu \| 3=setuju \| 4=sangat setuju | Five subitems below. |
| J25-P160-I013<br>Kode: D39a | STATUS ZAT/ALKOHOL | Saya siap mengurangi kebiasaan minum alkohol saya<br>Opsi: 0-4 from D39 | Subitem of D39. |
| J25-P160-I014<br>Kode: D39b | STATUS ZAT/ALKOHOL | Saya siap mengurangi penggunaan zat<br>Opsi: 0-4 from D39 | Subitem of D39. |
| J25-P160-I015<br>Kode: D39c | STATUS ZAT/ALKOHOL | Saya percaya bahwa saya dapat mengatur kebiasaan minum alkohol saya<br>Opsi: 0-4 from D39 | Subitem of D39. |
| J25-P160-I016<br>Kode: D39d | STATUS ZAT/ALKOHOL | Saya percaya bahwa saya dapat mengatur penggunaan zat saya<br>Opsi: 0-4 from D39 | Subitem of D39. |
| J25-P160-I017<br>Kode: D39e | STATUS ZAT/ALKOHOL | Saya tahu bahwa saya memiliki masalah alkohol atau zat dan saya memiliki motivasi untuk mengatasinya!<br>Opsi: 0-4 from D39 | Subitem of D39. |

### Lampiran 7.1 (ASI full): PDF 161 / cetak 146

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P161-I001<br>Kode: D30 | STATUS LEGAL | Seberapa pentingkah bagi Anda layanan untuk masalah alkohol saat ini?<br>Opsi: Skala Rating Klien |  |
| J25-P161-I002<br>Kode: D27 | STATUS LEGAL | Berapa harikah dalam 30 hari terakhir Anda mengalami masalah Zat? |  |
| J25-P161-I003<br>Kode: D29 | STATUS LEGAL | Seberapa terganggu Anda dalam 30 hari terakhir dikarenakan masalah zat?<br>Opsi: Skala Rating Klien |  |
| J25-P161-I004<br>Kode: D31 | STATUS LEGAL | Seberapa penting terapi untuk masalah zat bagi Anda saat ini?<br>Opsi: Skala Rating Klien |  |
| J25-P161-I005<br>Kode: D34 | STATUS LEGAL | Salah mengemukakan kenyataan tentang diri sendiri?<br>Opsi: 0 = Tidak 1 = Ya |  |
| J25-P161-I006<br>Kode: D35 | STATUS LEGAL | Ketidakmampuan klien untuk memahami?<br>Opsi: 0 = Tidak 1 = Ya |  |
| J25-P161-I007 | STATUS LEGAL | Catatan zat/alkohol | Multi-line notes field; source includes left-side notes block. |
| J25-P161-I008<br>Kode: L1 | STATUS LEGAL | Apakah Anda masuk ke lembaga rehabilitasi ini diminta atau dianjurkan oleh sistem peradilan?<br>Opsi: 0 = Tidak \| 1 = Ya |  |
| J25-P161-I009<br>Kode: L2 | STATUS LEGAL | Apakah Anda sedang dalam masa pembebasan bersyarat atau masa percobaan?<br>Opsi: 0 = Tidak \| 1 = Ya | Catat lamanya dan tingkat di dalam catatan legal. |
| J25-P161-I010<br>Kode: L3 | STATUS LEGAL | Mengutil/vandalisme | Input count/item. |
| J25-P161-I011<br>Kode: L4 | STATUS LEGAL | Bebas bersyarat/Masa percobaan | Input count/item. |
| J25-P161-I012<br>Kode: L5 | STATUS LEGAL | Tuntutan hukum terkait zat | Input count/item. |
| J25-P161-I013<br>Kode: L6 | STATUS LEGAL | Pemalsuan | Input count/item. |
| J25-P161-I014<br>Kode: L7 | STATUS LEGAL | Penyerangan bersenjatan | Input count/item. |
| J25-P161-I015<br>Kode: L8 | STATUS LEGAL | Pembobolan dan Pencurian | Input count/item. |
| J25-P161-I016<br>Kode: L9 | STATUS LEGAL | Perampokan | Input count/item. |
| J25-P161-I017<br>Kode: L10 | STATUS LEGAL | Penyerangan | Input count/item. |
| J25-P161-I018<br>Kode: L11 | STATUS LEGAL | Pembakaran rumah | Input count/item. |
| J25-P161-I019<br>Kode: L12 | STATUS LEGAL | Perkosaan | Input count/item. |
| J25-P161-I020<br>Kode: L13 | STATUS LEGAL | Pembunuhan/pembantaian | Input count/item. |
| J25-P161-I021<br>Kode: L14 | STATUS LEGAL | Pelacuran | Input count/item. |
| J25-P161-I022<br>Kode: L15 | STATUS LEGAL | Melecehkan pengadilan | Input count/item. |
| J25-P161-I023<br>Kode: L16 | STATUS LEGAL | Lain-lain: | Input count/item. |
| J25-P161-I024<br>Kode: L17 | STATUS LEGAL | Berapa banyak dari tuntutan ini berakibat pada vonis hukuman? | Input count/item. Conditional source: If L3-16 = 00, then L17 = NN. |
| J25-P161-I025<br>Kode: L18 | STATUS LEGAL | Perilaku membuat keonaran, intoksikasi di tempat umum, menggangu ketertiban? | Input count/item. |
| J25-P161-I026<br>Kode: L19 | STATUS LEGAL | Mengemudi dalam kondisi mabuk/intoksikasi? | Input count/item. |
| J25-P161-I027<br>Kode: L20 | STATUS LEGAL | Pelanggaran utama mengemudi ? | Input count/item. |
| J25-P161-I028<br>Kode: L21 | STATUS LEGAL | Berapa bulankah Anda ditahan atau dipenjara dalam hidup Anda?<br>Opsi: Bulan | Input count/item. |
| J25-P161-I029 | STATUS LEGAL | Catatan legal | Multi-line notes field; source says masukkan nomor pertanyaan dalam catatan Anda. |

### Lampiran 7.1 (ASI full): PDF 162 / cetak 147

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P162-I001<br>Kode: L24 | STATUS KELUARGA/SOSIAL | Apakah Anda sekarang ini menunggu tuntutan, pemeriksaan pengadilan, atau hukuman?<br>Opsi: 0 = Tidak \| 1 = Ya | If no, L25 code NN; only criminal matters. |
| J25-P162-I002<br>Kode: L25 | STATUS KELUARGA/SOSIAL | Untuk perkara apakah itu? | Use jumlah jenis kejahatan L3-L16 dan L18-L20; if L24 tidak, code NN. |
| J25-P162-I003<br>Kode: L26 | STATUS KELUARGA/SOSIAL | Berapa harikah Anda ditahan atau dipenjara dalam 30 hari terakhir? |  |
| J25-P162-I004<br>Kode: L27 | STATUS KELUARGA/SOSIAL | Berapa harikah Anda terlibat dalam kegiatan ilegal untuk memperoleh keuntungan dalam 30 hari terakhir? |  |
| J25-P162-I005 | STATUS KELUARGA/SOSIAL | Untuk Pertanyaan L28-29, mintalah klien menggunakan Skala Rating Klien.<br>Opsi: 0 - Tidak sama sekali \| 1 - Ringan \| 2 - Sedang \| 3 - Berat \| 4 - Sangat Berat | Source refers to rating scale. \| QA: exact source label restored; prior explanatory/context label: Skala Rating Klien untuk L28-L29 |
| J25-P162-I006<br>Kode: L28 | STATUS KELUARGA/SOSIAL | Seberapa serius Anda menganggap masalah legal (hukum) yang Anda miliki saat ini?<br>Opsi: Skala Rating Klien |  |
| J25-P162-I007<br>Kode: L29 | STATUS KELUARGA/SOSIAL | Seberapa penting peran konseling atau rujukan bagi Anda saat ini untuk masalah hukum Anda?<br>Opsi: Skala Rating Klien |  |
| J25-P162-I008<br>Kode: L31 | STATUS KELUARGA/SOSIAL | Salah mengemukakan kenyataan tentang dirinya?<br>Opsi: 0 = Tidak \| 1 = Ya |  |
| J25-P162-I009<br>Kode: L32 | STATUS KELUARGA/SOSIAL | Ketidakmampuan klien memahami?<br>Opsi: 0 = Tidak \| 1 = Ya |  |
| J25-P162-I010 | STATUS KELUARGA/SOSIAL | Catatan legal | Multi-line notes field; source says masukkan nomor pertanyaan dalam catatan Anda. |
| J25-P162-I011<br>Kode: F1 | STATUS KELUARGA/SOSIAL | Status Pernikahan:<br>Opsi: 1- Menikah \| 2- Menikah kembali \| 3- Janda/Duda \| 4- Berpisah \| 5- Bercerai \| 6- Tidak menikah | Jelaskan dalam catatan; menikah yang tercatat di catatan sipil = 1. |
| J25-P162-I012<br>Kode: F3 | STATUS KELUARGA/SOSIAL | Apakah Anda puas berada dalam situasi ini?<br>Opsi: 0 = Tidak \| 1 = Biasa saja 2 = Ya | Merujuk pada Pertanyaan F1. |
| J25-P162-I013<br>Kode: F4 | STATUS KELUARGA/SOSIAL | *Dengan siapa anda tinggal sehari-hari (tiga tahun terakhir):<br>Opsi: 1- Dengan pasangan dan anak \| 2- Dengan pasangan \| 3- Dengan anak saja \| 4- Dengan orang tua \| 5- Dengan keluarga \| 6- Dengan teman \| 7- Tinggal sendiri \| 8- Lingkungan terkontrol \| 9- Tidak tentu | Pilih situasi paling tepat; source mentions three years. |
| J25-P162-I014<br>Kode: F6 | STATUS KELUARGA/SOSIAL | Apakah Anda puas dengan situasi ini?<br>Opsi: 0 = Tidak \| 1 = Biasa saja 2 = Ya |  |
| J25-P162-I015<br>Kode: F4a | STATUS KELUARGA/SOSIAL | Dengan siapa anda tinggal sehari-hari dalam 30 hari terakhir? (Gunakan kode di atas) | Uses F4 options. |
| J25-P162-I016<br>Kode: F7 | STATUS KELUARGA/SOSIAL | Saat ini memiliki masalah alkohol?<br>Opsi: 0 = Tidak \| 1 = Ya |  |
| J25-P162-I017<br>Kode: F8 | STATUS KELUARGA/SOSIAL | Menggunakan zat selain alkohol?<br>Opsi: 0 = Tidak \| 1 = Ya |  |
| J25-P162-I018<br>Kode: F9 | STATUS KELUARGA/SOSIAL | Dengan siapa Anda menghabiskan sebagian besar waktu luang?<br>Opsi: 1-Keluarga 2-Teman 3-Sendiri |  |
| J25-P162-I019<br>Kode: F10 | STATUS KELUARGA/SOSIAL | Apakah Anda puas menghabiskan waktu luang dengan cara seperti ini?<br>Opsi: 0 = Tidak \| 1 = Biasa saja 2 = Ya | Merujuk pada Pertanyaan F9. |
| J25-P162-I020<br>Kode: F39 | STATUS KELUARGA/SOSIAL | Berapa jumlah anak Anda?<br>Opsi: Tinggal bersama Anda \| Tinggal di luar rumah Anda | Two-column display. |
| J25-P162-I021<br>Kode: F39a | STATUS KELUARGA/SOSIAL | Berapa jumlah anak Anda yang berusia di bawah 18 tahun? |  |
| J25-P162-I022<br>Kode: F11a | STATUS KELUARGA/SOSIAL | Berapa jumlah teman dekat Anda yang menggunakan zat atau alkohol? | If no close friends, code N. |

### Lampiran 7.1 (ASI full): PDF 163 / cetak 148

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P163-I001 | STATUS KELUARGA/SOSIAL | Apakah Anda mengalami masalah hubungan yang serius dengan:<br>Opsi: 0 = Tidak \| 1 = Ya | Relationship matrix with 30 Hari Terakhir and Sepanjang Hidup (tahun). |
| J25-P163-I002<br>Kode: F18 | STATUS KELUARGA/SOSIAL | Ibu<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) | Relationship matrix item; if no contact code N; if no relative code N. |
| J25-P163-I003<br>Kode: F19 | STATUS KELUARGA/SOSIAL | Ayah<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) | Relationship matrix item; if no contact code N; if no relative code N. |
| J25-P163-I004<br>Kode: F20 | STATUS KELUARGA/SOSIAL | Saudara Kandung<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) | Relationship matrix item; if no contact code N; if no relative code N. |
| J25-P163-I005<br>Kode: F21 | STATUS KELUARGA/SOSIAL | Pasangan<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) | Relationship matrix item; if no contact code N; if no relative code N. |
| J25-P163-I006<br>Kode: F22 | STATUS KELUARGA/SOSIAL | Anak-anak<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) | Relationship matrix item; if no contact code N; if no relative code N. |
| J25-P163-I007<br>Kode: F23 | STATUS KELUARGA/SOSIAL | Anggota Keluarga Lainnya yang bermakna (jelaskan)______________<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) | Relationship matrix item; if no contact code N; if no relative code N. |
| J25-P163-I008<br>Kode: F24 | STATUS KELUARGA/SOSIAL | Teman Dekat<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) | Relationship matrix item; if no contact code N; if no relative code N. |
| J25-P163-I009<br>Kode: F25 | STATUS KELUARGA/SOSIAL | Tetangga<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) | Relationship matrix item; if no contact code N; if no relative code N. |
| J25-P163-I010<br>Kode: F26 | STATUS KELUARGA/SOSIAL | Rekan sekerja<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) | Relationship matrix item; if no contact code N; if no relative code N. |
| J25-P163-I011 | STATUS KELUARGA/SOSIAL | Adakah seseorang yang menganiaya/melecehkan Anda?<br>Opsi: 0 = Tidak 1 = Ya | Abuse matrix with 30 Hari Terakhir and Sepanjang Hidup (tahun). |
| J25-P163-I012<br>Kode: F27 | STATUS KELUARGA/SOSIAL | Secara emosional?<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) | Abuse matrix item. |
| J25-P163-I013<br>Kode: F28 | STATUS KELUARGA/SOSIAL | Secara fisik?<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) | Abuse matrix item. |
| J25-P163-I014<br>Kode: F29 | STATUS KELUARGA/SOSIAL | Secara seksual?<br>Opsi: 30 Hari Terakhir \| Sepanjang Hidup (tahun) | Abuse matrix item. |
| J25-P163-I015<br>Kode: F30 | STATUS KELUARGA/SOSIAL | Dengan keluarga Anda?<br>Opsi: 30 Hari Terakhir | Source context distinguishes conflict days, disturbance, and importance; preserve labels exactly. |
| J25-P163-I016<br>Kode: F31 | STATUS KELUARGA/SOSIAL | Dengan orang lain (selain keluarga)?<br>Opsi: 30 Hari Terakhir | Source context distinguishes conflict days, disturbance, and importance; preserve labels exactly. |
| J25-P163-I017<br>Kode: F32 | STATUS KELUARGA/SOSIAL | Masalah keluarga?<br>Opsi: Skala Rating Klien | Source context distinguishes conflict days, disturbance, and importance; preserve labels exactly. |
| J25-P163-I018<br>Kode: F33 | STATUS KELUARGA/SOSIAL | Masalah sosial (selain keluarga)?<br>Opsi: Skala Rating Klien | Source context distinguishes conflict days, disturbance, and importance; preserve labels exactly. |
| J25-P163-I019<br>Kode: F34 | STATUS KELUARGA/SOSIAL | Masalah keluarga?<br>Opsi: Skala Rating Klien | Source context distinguishes conflict days, disturbance, and importance; preserve labels exactly. |
| J25-P163-I020<br>Kode: F35 | STATUS KELUARGA/SOSIAL | Masalah sosial<br>Opsi: Skala Rating Klien | Source context distinguishes conflict days, disturbance, and importance; preserve labels exactly. |
| J25-P163-I021<br>Kode: F37 | STATUS KELUARGA/SOSIAL | Salah mengemukakan kenyataan tentang dirinya?<br>Opsi: 0 = Tidak \| 1 = Ya |  |
| J25-P163-I022<br>Kode: F38 | STATUS KELUARGA/SOSIAL | Ketidakmampuan klien memahami?<br>Opsi: 0 = Tidak \| 1 = Ya |  |
| J25-P163-I023 | STATUS KELUARGA/SOSIAL | Catatan Keluarga/Kehidupan Sosial | Multi-line notes field; source says masukkan nomor pertanyaan dengan catatan Anda. |

### Lampiran 7.1 (ASI full): PDF 164 / cetak 149

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P164-I001<br>Kode: P1 | STATUS PSIKIATRIS | *Rawat inap atau residensial?<br>Opsi: Jumlah kali/episode | P1/P2 source excludes substance, work, family counseling; episode is series of continuous visits/therapy. |
| J25-P164-I002<br>Kode: P2 | STATUS PSIKIATRIS | *Rawat jalan/home visit?<br>Opsi: Jumlah kali/episode | P1/P2 source excludes substance, work, family counseling; episode is series of continuous visits/therapy. |
| J25-P164-I003<br>Kode: P3 | STATUS PSIKIATRIS | Apakah Anda mendapat dukungan finansial untuk disabilitas psikiatris?<br>Opsi: 0 = Tidak \| 1 = Ya | P1/P2 source excludes substance, work, family counseling; episode is series of continuous visits/therapy. |
| J25-P164-I004<br>Kode: P4 | STATUS PSIKIATRIS | Mengalami depresi serius-kesedihan, putus asa, kehilangan minat, kesukaran dalam fungsi sehari-hari?<br>Opsi: 0 = Tidak \| 1 = Ya | P4-P10 source: not direct result of alcohol/substance; P13 based on days in P12. |
| J25-P164-I005<br>Kode: P5 | STATUS PSIKIATRIS | Mengalami kecemasan serius/ketegangan, gelisah, merasa khawatir yang berlebihan, ketidakmampuan untuk merasa relaks?<br>Opsi: 0 = Tidak \| 1 = Ya | P4-P10 source: not direct result of alcohol/substance; P13 based on days in P12. |
| J25-P164-I006<br>Kode: P6 | STATUS PSIKIATRIS | Mengalami halusinasi-melihat atau mendengar sesuatu yang tidak ada objeknya?<br>Opsi: 0 = Tidak \| 1 = Ya | P4-P10 source: not direct result of alcohol/substance; P13 based on days in P12. |
| J25-P164-I007<br>Kode: P7 | STATUS PSIKIATRIS | Mengalami kesulitan memahami, konsentrasi, atau mengingat?<br>Opsi: 0 = Tidak \| 1 = Ya | P4-P10 source: not direct result of alcohol/substance; P13 based on days in P12. |
| J25-P164-I008<br>Kode: P8 | STATUS PSIKIATRIS | Mengalami kesukaran mengontrol perilaku kasar, termasuk kemarahan atau kekerasan<br>Opsi: 0 = Tidak \| 1 = Ya | P4-P10 source: not direct result of alcohol/substance; P13 based on days in P12. |
| J25-P164-I009<br>Kode: P9 | STATUS PSIKIATRIS | Mengalami pikiran serius untuk bunuh diri?<br>Opsi: 0 = Tidak \| 1 = Ya | P4-P10 source: not direct result of alcohol/substance; P13 based on days in P12. |
| J25-P164-I010<br>Kode: P10 | STATUS PSIKIATRIS | Mencoba untuk bunuh diri?<br>Opsi: 0 = Tidak \| 1 = Ya | P4-P10 source: not direct result of alcohol/substance; P13 based on days in P12. |
| J25-P164-I011<br>Kode: P11 | STATUS PSIKIATRIS | Apakah penyedia layanan kesehatan merekomendasikan Anda mendapat obat untuk masalah psikologis atau emosional?<br>Opsi: 0 = Tidak \| 1 = Ya |  |
| J25-P164-I012<br>Kode: P12 | STATUS PSIKIATRIS | Berapa harikah dalam 30 hari terakhir Anda mengalami masalah psikologis atau emosional tersebut? |  |
| J25-P164-I013<br>Kode: P13 | STATUS PSIKIATRIS | Seberapa terganggukah Anda oleh masalah psikologis/emosional dalam 30 hari terakhir?<br>Opsi: Skala Rating Klien |  |
| J25-P164-I014<br>Kode: P14 | STATUS PSIKIATRIS | Seberapa pentingkah bagi Anda terapi sekarang ini untuk masalah psikologis atau emosional ini?<br>Opsi: Skala Rating Klien |  |
| J25-P164-I015<br>Kode: P22 | STATUS PSIKIATRIS | Salah mengemukakan kenyataan diri sendiri?<br>Opsi: 0 = Tidak \| 1 = Ya |  |
| J25-P164-I016<br>Kode: P23 | STATUS PSIKIATRIS | Ketidakmampuan klien untuk memahami?<br>Opsi: 0 = Tidak \| 1 = Ya |  |
| J25-P164-I017 | STATUS PSIKIATRIS | Uraikan Diagnosis bila diketahui: | Multi-line diagnosis field. |
| J25-P164-I018 | STATUS PSIKIATRIS | Catatan Status Psikiatri | Multi-line notes field; source says masukkan nomor pertanyaan dengan catatan Anda. |

### Lampiran 7.1 (ASI full): PDF 165 / cetak 150

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P165-I001<br>Kode: G12 | ITEM PENUTUP | Kode Khusus<br>Opsi: 1. Diterminasi oleh pewawancara \| 2. Klien menolak \| 3. Klien tidak dapat merespons (hambatan bahasa atau intelektual, di bawah pengaruh, dll) \| Kode N. Wawancara selesai | Source options exact. |
| J25-P165-I002<br>Kode: G50 | ITEM PENUTUP | Modalitas terapi yang diharapkan paling tepat bagi klien:<br>Opsi: 1. Rawat Jalan (<5 jam per minggu) \| 2. Rawat Jalan Intensif (>- 5 jam per minggu) \| 3. Residensial/Rawat Inap \| 4. Therapeutic Community \| 5. Half-way house/rumah singgah \| 6. Detoks-Rawat Inap (umumnya 3-7 hari) \| 7. Detoks Rawat Jalan/Ambulatory \| 8. Opioid Replacement, rawat jalan (metadon, buprenorfin, dll). \| 9. Lainnya (low threshold, GP, spiritual healers, dll). | Source shows â€œ>- 5 jamâ€; preserve. |
| J25-P165-I003 | ITEM PENUTUP | Jelaskan... | Free-text explanation field. |
| J25-P165-I004 | ITEM PENUTUP | Catatan Keseluruhan | Multi-line notes field. |

### Lampiran 7.2 (ASI wajib lapor): PDF 166 / cetak 151

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P166-I001 | INFORMASI DEMOGRAFIS | Tanggal Kedatangan |  |
| J25-P166-I002 | INFORMASI DEMOGRAFIS | Nomor Rekam Medik |  |
| J25-P166-I003 | INFORMASI DEMOGRAFIS | Nama |  |
| J25-P166-I004 | INFORMASI DEMOGRAFIS | Tgl lahir |  |
| J25-P166-I005 | INFORMASI DEMOGRAFIS | Alamat tempat tinggal |  |
| J25-P166-I006 | INFORMASI DEMOGRAFIS | Telp/HP |  |
| J25-P166-I007 | INFORMASI DEMOGRAFIS | Jenis Kel<br>Opsi: 1 (Lakilaki) 2 (Perempuan) |  |
| J25-P166-I008 | INFORMASI DEMOGRAFIS | Status Perkawinan<br>Opsi: Belum Menikah = 1 \| Menikah = 2 \| Duda / Janda = 3 |  |
| J25-P166-I009 | INFORMASI DEMOGRAFIS | Pendidikan terakhir<br>Opsi: Tidak sekolah/Tdk tamat SD = 0 \| Tamat SD =1 \| Tamat SLTP = 2 \| Tamat SLTA = 3 \| Tamat Akademi = 4 \| Tamat PT = 5 |  |
| J25-P166-I010 | STATUS MEDIS | Tanggal asesmen | Date field. |
| J25-P166-I011<br>Kode: 1 | STATUS MEDIS | Jenis Penyakit | Repeated row/table field with Dirawat tahun and Lamanya columns. \| QA: exact source label restored; prior explanatory/context label: Riwayat rawat inap yang tidak terkait masalah narkotika : Jenis Penyakit |
| J25-P166-I012 | STATUS MEDIS | Jenis Penyakit | Within riwayat rawat inap table. |
| J25-P166-I013 | STATUS MEDIS | Dirawat tahun | Within riwayat rawat inap table. |
| J25-P166-I014 | STATUS MEDIS | Lamanya | Within riwayat rawat inap table. |
| J25-P166-I015<br>Kode: 2 | STATUS MEDIS | Riwayat penyakit kronis<br>Opsi: Ya = 1 \| Tidak = 0 |  |
| J25-P166-I016 | STATUS MEDIS | Jenis Penyakit: | Free text. |
| J25-P166-I017<br>Kode: 3 | STATUS MEDIS | Saat ini sedang menjalani terapi medis ?<br>Opsi: Ya = 1 \| Tidak = 0 |  |
| J25-P166-I018 | STATUS MEDIS | Jenis terapi medis yang dijalani saat ini: | Free text. |
| J25-P166-I019<br>Kode: 4.1 | STATUS MEDIS | HIV<br>Opsi: Ya = 1 \| Tidak = 0 | Status Kesehatan / Apakah Pernah Di Tes matrix. |
| J25-P166-I020<br>Kode: 4.2 | STATUS MEDIS | Hepatitis B<br>Opsi: Ya = 1 \| Tidak = 0 | Status Kesehatan / Apakah Pernah Di Tes matrix. |
| J25-P166-I021<br>Kode: 4.3 | STATUS MEDIS | Hepatitis C<br>Opsi: Ya = 1 \| Tidak = 0 | Status Kesehatan / Apakah Pernah Di Tes matrix. |
| J25-P166-I022 | STATUS MEDIS | Skala Penilaian Pasien | Visible scale label before status medical items. |
| J25-P166-I023 | STATUS PEKERJAAN / DUKUNGAN HIDUP | Skala Penilaian Pasien | Visible scale label before employment/support items. |
| J25-P166-I024 | STATUS PEKERJAAN / DUKUNGAN HIDUP | Tanggal asesmen (â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦.) | Date field. |
| J25-P166-I025<br>Kode: 1 | STATUS PEKERJAAN / DUKUNGAN HIDUP | Status pekerjaan<br>Opsi: Tidak bekerja = 1 \| Bekerja = 2 \| Mahasiswa / pelajar = 8 \| Ibu rumah tangga = 9 |  |
| J25-P166-I026<br>Kode: 2 | STATUS PEKERJAAN / DUKUNGAN HIDUP | Bila bekerja, pola pekerjaan :<br>Opsi: Purna waktu = 1 \| Paruh waktu = 2 \| Tidak tentu = 99 |  |
| J25-P166-I027<br>Kode: 3 | STATUS PEKERJAAN / DUKUNGAN HIDUP | Kode Pekerjaan :<br>Opsi: lihat petunjuk |  |
| J25-P166-I028<br>Kode: 4 | STATUS PEKERJAAN / DUKUNGAN HIDUP | Keterampilan teknis yang dimiliki: |  |
| J25-P166-I029<br>Kode: 5 | STATUS PEKERJAAN / DUKUNGAN HIDUP | Adakah yang memberi dukungan hidup bagi anda ?<br>Opsi: Ya = 1 \| Tidak = 0 (Lanjut domain 4) |  |
| J25-P166-I030<br>Kode: 6 | STATUS PEKERJAAN / DUKUNGAN HIDUP | Bila Ya, siapakah ? |  |
| J25-P166-I031 | STATUS PEKERJAAN / DUKUNGAN HIDUP | Dalam bentuk apakah? |  |
| J25-P166-I032<br>Kode: 7 | STATUS PEKERJAAN / DUKUNGAN HIDUP | Finansial<br>Opsi: Ya = 1 \| Tidak = 0 |  |
| J25-P166-I033 | STATUS PEKERJAAN / DUKUNGAN HIDUP | Tempat tinggal<br>Opsi: Ya = 1 \| Tidak = 0 |  |
| J25-P166-I034 | STATUS PEKERJAAN / DUKUNGAN HIDUP | Makan<br>Opsi: Ya = 1 \| Tidak = 0 |  |
| J25-P166-I035 | STATUS PEKERJAAN / DUKUNGAN HIDUP | Pengobatan /Perawatan<br>Opsi: Ya = 1 \| Tidak = 0 |  |

### Lampiran 7.2 (ASI wajib lapor): PDF 167 / cetak 152

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P167-I001 | STATUS PENGGUNAAN NARKOTIKA | Nomor Rekam Medik |  |
| J25-P167-I002 | STATUS PENGGUNAAN NARKOTIKA | Nama |  |
| J25-P167-I003 | STATUS PENGGUNAAN NARKOTIKA | Tanggal asesmen (â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦.) |  |
| J25-P167-I004 | STATUS PENGGUNAAN NARKOTIKA | Skala Penilaian Pasien |  |
| J25-P167-I005 | STATUS PENGGUNAAN NARKOTIKA | Jenis Cara Penggunaan<br>Opsi: 1. Oral 2. Nasal/sublingual/suppositoria 3. Merokok 4. Injeksi Non-IV 5. IV | Table method options. |
| J25-P167-I006<br>Kode: D.1 | STATUS PENGGUNAAN NARKOTIKA | Alkohol<br>Opsi: 30 Hari terakhir \| Sepanjang Hidup (Thn) \| Cara Pakai | Three-column substance use matrix. |
| J25-P167-I007<br>Kode: D.2 | STATUS PENGGUNAAN NARKOTIKA | Heroin<br>Opsi: 30 Hari terakhir \| Sepanjang Hidup (Thn) \| Cara Pakai | Three-column substance use matrix. |
| J25-P167-I008<br>Kode: D.3 | STATUS PENGGUNAAN NARKOTIKA | Metadon / Buprenorfin<br>Opsi: 30 Hari terakhir \| Sepanjang Hidup (Thn) \| Cara Pakai | Three-column substance use matrix. |
| J25-P167-I009<br>Kode: D.4 | STATUS PENGGUNAAN NARKOTIKA | Opiat lain / Analgesik<br>Opsi: 30 Hari terakhir \| Sepanjang Hidup (Thn) \| Cara Pakai | Three-column substance use matrix. |
| J25-P167-I010<br>Kode: D.5 | STATUS PENGGUNAAN NARKOTIKA | Barbiturat<br>Opsi: 30 Hari terakhir \| Sepanjang Hidup (Thn) \| Cara Pakai | Three-column substance use matrix. |
| J25-P167-I011<br>Kode: D.6 | STATUS PENGGUNAAN NARKOTIKA | Sedatif / Hipnotik<br>Opsi: 30 Hari terakhir \| Sepanjang Hidup (Thn) \| Cara Pakai | Three-column substance use matrix. |
| J25-P167-I012<br>Kode: D.7 | STATUS PENGGUNAAN NARKOTIKA | Kokain<br>Opsi: 30 Hari terakhir \| Sepanjang Hidup (Thn) \| Cara Pakai | Three-column substance use matrix. |
| J25-P167-I013<br>Kode: D.8 | STATUS PENGGUNAAN NARKOTIKA | Amfetamin<br>Opsi: 30 Hari terakhir \| Sepanjang Hidup (Thn) \| Cara Pakai | Three-column substance use matrix. |
| J25-P167-I014<br>Kode: D.9 | STATUS PENGGUNAAN NARKOTIKA | Kanabis<br>Opsi: 30 Hari terakhir \| Sepanjang Hidup (Thn) \| Cara Pakai | Three-column substance use matrix. |
| J25-P167-I015<br>Kode: D.10 | STATUS PENGGUNAAN NARKOTIKA | Halusinogen<br>Opsi: 30 Hari terakhir \| Sepanjang Hidup (Thn) \| Cara Pakai | Three-column substance use matrix. |
| J25-P167-I016<br>Kode: D.11 | STATUS PENGGUNAAN NARKOTIKA | Inhalan<br>Opsi: 30 Hari terakhir \| Sepanjang Hidup (Thn) \| Cara Pakai | Three-column substance use matrix. |
| J25-P167-I017<br>Kode: D.12 | STATUS PENGGUNAAN NARKOTIKA | Lebih dari 1 zat / hari (termasuk alkohol)<br>Opsi: 30 Hari terakhir \| Sepanjang Hidup (Thn) \| Cara Pakai | Three-column substance use matrix. |
| J25-P167-I018<br>Kode: 13 | STATUS PENGGUNAAN NARKOTIKA | Jenis zat utama yang disalahgunakan : |  |
| J25-P167-I019<br>Kode: 14 | STATUS PENGGUNAAN NARKOTIKA | Pernahkah menjalani terapi rehabilitasi ?<br>Opsi: Ya = 1 \| Tidak = 0 |  |
| J25-P167-I020<br>Kode: 15 | STATUS PENGGUNAAN NARKOTIKA | Bila ya, jenis terapi rehabilitasi yang dijalani ? |  |
| J25-P167-I021 | STATUS PENGGUNAAN NARKOTIKA | Keterangan : |  |
| J25-P167-I022<br>Kode: 16 | STATUS PENGGUNAAN NARKOTIKA | Pernahkah mengalami overdosis ?<br>Opsi: Ya = 1 \| Tidak = 0 (lanjut domain 5) |  |
| J25-P167-I023<br>Kode: 17 | STATUS PENGGUNAAN NARKOTIKA | Bila ya, kapan waktu OD? |  |
| J25-P167-I024<br>Kode: 18 | STATUS PENGGUNAAN NARKOTIKA | Cara penanggulangan<br>Opsi: Perawatan di RS = 1 \| Perawatan di Puskesmas = 2 \| Sendiri = 3 |  |
| J25-P167-I025 | STATUS LEGAL | Tanggal asesmen (â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦.) |  |
| J25-P167-I026 | STATUS LEGAL | Skala Penilaian Pasien |  |
| J25-P167-I027<br>Kode: 1 | STATUS LEGAL | Mencuri di toko / vandalisme<br>Opsi: Jumlah kali dalam hidup | Total court charges, not only convictions; source note excludes child crimes unless tried as adult. |
| J25-P167-I028<br>Kode: 2 | STATUS LEGAL | Bebas bersyarat / masa percobaan<br>Opsi: Jumlah kali dalam hidup | Total court charges, not only convictions; source note excludes child crimes unless tried as adult. |
| J25-P167-I029<br>Kode: 3 | STATUS LEGAL | Masalah narkoba<br>Opsi: Jumlah kali dalam hidup | Total court charges, not only convictions; source note excludes child crimes unless tried as adult. |
| J25-P167-I030<br>Kode: 4 | STATUS LEGAL | Pemalsuan<br>Opsi: Jumlah kali dalam hidup | Total court charges, not only convictions; source note excludes child crimes unless tried as adult. |
| J25-P167-I031<br>Kode: 5 | STATUS LEGAL | Penyerangan bersenjata<br>Opsi: Jumlah kali dalam hidup | Total court charges, not only convictions; source note excludes child crimes unless tried as adult. |
| J25-P167-I032<br>Kode: 6 | STATUS LEGAL | Pembobolan dan pencurian<br>Opsi: Jumlah kali dalam hidup | Total court charges, not only convictions; source note excludes child crimes unless tried as adult. |
| J25-P167-I033<br>Kode: 7 | STATUS LEGAL | Perampokan<br>Opsi: Jumlah kali dalam hidup | Total court charges, not only convictions; source note excludes child crimes unless tried as adult. |
| J25-P167-I034<br>Kode: 8 | STATUS LEGAL | Penyerangan<br>Opsi: Jumlah kali dalam hidup | Total court charges, not only convictions; source note excludes child crimes unless tried as adult. |
| J25-P167-I035<br>Kode: 9 | STATUS LEGAL | Pembakaran rumah<br>Opsi: Jumlah kali dalam hidup | Total court charges, not only convictions; source note excludes child crimes unless tried as adult. |
| J25-P167-I036<br>Kode: 10 | STATUS LEGAL | Perkosaan<br>Opsi: Jumlah kali dalam hidup | Total court charges, not only convictions; source note excludes child crimes unless tried as adult. |
| J25-P167-I037<br>Kode: 11 | STATUS LEGAL | Pembunuhan<br>Opsi: Jumlah kali dalam hidup | Total court charges, not only convictions; source note excludes child crimes unless tried as adult. |
| J25-P167-I038<br>Kode: 12 | STATUS LEGAL | Pelacuran<br>Opsi: Jumlah kali dalam hidup | Total court charges, not only convictions; source note excludes child crimes unless tried as adult. |
| J25-P167-I039<br>Kode: 13 | STATUS LEGAL | Melecehkan pengadilan<br>Opsi: Jumlah kali dalam hidup | Total court charges, not only convictions; source note excludes child crimes unless tried as adult. |
| J25-P167-I040<br>Kode: 14 | STATUS LEGAL | lain-lain ; â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦<br>Opsi: Jumlah kali dalam hidup | Total court charges, not only convictions; source note excludes child crimes unless tried as adult. |
| J25-P167-I041<br>Kode: 15 | STATUS LEGAL | Berapa kali tuntutan diatas berakibat vonis hukuman? | Count field. |

### Lampiran 7.2 (ASI wajib lapor): PDF 168 / cetak 153

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P168-I001 | STATUS KELUARGA / SOSIAL | Nomor Rekam Medik |  |
| J25-P168-I002 | STATUS KELUARGA / SOSIAL | Nama |  |
| J25-P168-I003 | STATUS KELUARGA / SOSIAL | Tanggal asesmen (â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦.) |  |
| J25-P168-I004 | STATUS KELUARGA / SOSIAL | Skala Penilaian Pasien |  |
| J25-P168-I005<br>Kode: 1 | STATUS KELUARGA / SOSIAL | Dalam situasi seperti apakah anda tinggal 3 tahun belakangan ini?<br>Opsi: Dengan pasangan & anak = 1 \| Dengan pasangan saja = 2 \| Dengan anak saja = 3 \| Dengan orang tua = 4 \| Dengan Keluarga = 5 \| Dengan teman = 6 \| Sendiri = 7 \| Lingkungan terkontrol = 8 \| Kondisi yang tidak stabil = 9 |  |
| J25-P168-I006<br>Kode: 2 | STATUS KELUARGA / SOSIAL | Apakah anda hidup dengan seseorang yang mempunyai masalah penyalahgunaan zat sekarang ini?<br>Opsi: Ya = 1 Tidak = 0 |  |
| J25-P168-I007<br>Kode: 3.1 | STATUS KELUARGA / SOSIAL | Saudara kandung / tiri<br>Opsi: Ya = 1 \| Tidak = 0 | If yes, check/mark the corresponding relationship. |
| J25-P168-I008<br>Kode: 3.2 | STATUS KELUARGA / SOSIAL | Ayah / Ibu<br>Opsi: Ya = 1 \| Tidak = 0 | If yes, check/mark the corresponding relationship. |
| J25-P168-I009<br>Kode: 3.3 | STATUS KELUARGA / SOSIAL | Pasangan<br>Opsi: Ya = 1 \| Tidak = 0 | If yes, check/mark the corresponding relationship. |
| J25-P168-I010<br>Kode: 3.4 | STATUS KELUARGA / SOSIAL | Om / tante<br>Opsi: Ya = 1 \| Tidak = 0 | If yes, check/mark the corresponding relationship. |
| J25-P168-I011<br>Kode: 3.5 | STATUS KELUARGA / SOSIAL | Teman<br>Opsi: Ya = 1 \| Tidak = 0 | If yes, check/mark the corresponding relationship. |
| J25-P168-I012<br>Kode: 3.6 | STATUS KELUARGA / SOSIAL | Lainnya : â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦<br>Opsi: Ya = 1 \| Tidak = 0 | If yes, check/mark the corresponding relationship. |
| J25-P168-I013<br>Kode: 4 | STATUS KELUARGA / SOSIAL | Apakah anda memiliki konflik serius dalam berhubungan dengan :<br>Opsi: Ya = 1 Tidak = 0 | Matrix columns: 30 hari terakhir \| Sepanjang hidup. |
| J25-P168-I014<br>Kode: 4.1 | STATUS KELUARGA / SOSIAL | Ibu<br>Opsi: 30 hari terakhir \| Sepanjang hidup | Conflict matrix item. |
| J25-P168-I015<br>Kode: 4.2 | STATUS KELUARGA / SOSIAL | Ayah<br>Opsi: 30 hari terakhir \| Sepanjang hidup | Conflict matrix item. |
| J25-P168-I016<br>Kode: 4.3 | STATUS KELUARGA / SOSIAL | Adik / kakak<br>Opsi: 30 hari terakhir \| Sepanjang hidup | Conflict matrix item. |
| J25-P168-I017<br>Kode: 4.4 | STATUS KELUARGA / SOSIAL | Pasangan<br>Opsi: 30 hari terakhir \| Sepanjang hidup | Conflict matrix item. |
| J25-P168-I018<br>Kode: 4.5 | STATUS KELUARGA / SOSIAL | Anak - anak<br>Opsi: 30 hari terakhir \| Sepanjang hidup | Conflict matrix item. |
| J25-P168-I019<br>Kode: 4.6 | STATUS KELUARGA / SOSIAL | Keluarga lain yang berarti (jelaskan â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦.)<br>Opsi: 30 hari terakhir \| Sepanjang hidup | Conflict matrix item. |
| J25-P168-I020<br>Kode: 4.7 | STATUS KELUARGA / SOSIAL | Teman akrab<br>Opsi: 30 hari terakhir \| Sepanjang hidup | Conflict matrix item. |
| J25-P168-I021<br>Kode: 4.8 | STATUS KELUARGA / SOSIAL | Tetangga<br>Opsi: 30 hari terakhir \| Sepanjang hidup | Conflict matrix item. |
| J25-P168-I022<br>Kode: 4.9 | STATUS KELUARGA / SOSIAL | Teman sekerja<br>Opsi: 30 hari terakhir \| Sepanjang hidup | Conflict matrix item. |
| J25-P168-I023 | STATUS PSIKIATRIS | Tanggal asesmen (â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦.) |  |
| J25-P168-I024 | STATUS PSIKIATRIS | Skala Penilaian Pasien |  |
| J25-P168-I025<br>Kode: 1 | STATUS PSIKIATRIS | Mengalami depresi serius (kesedihan, putus asa, kehilangan minat, susah konsentrasi<br>Opsi: Ya = 1 \| Tidak = 0 | Matrix columns: 30 hari terakhir \| Sepanjang hidup. |
| J25-P168-I026<br>Kode: 2 | STATUS PSIKIATRIS | Mengalami rasa cemas serius / ketegangan, gelisah, merasa khawatir berlebihan?<br>Opsi: Ya = 1 \| Tidak = 0 | Matrix columns: 30 hari terakhir \| Sepanjang hidup. |
| J25-P168-I027<br>Kode: 3 | STATUS PSIKIATRIS | Mengalami halusinasi (melihat / mendengar sesuatu yang tidak ada obyeknya )<br>Opsi: Ya = 1 \| Tidak = 0 | Matrix columns: 30 hari terakhir \| Sepanjang hidup. |
| J25-P168-I028<br>Kode: 4 | STATUS PSIKIATRIS | Mengalami kesulitan mengingat atau fokus pada sesuatu<br>Opsi: Ya = 1 \| Tidak = 0 | Matrix columns: 30 hari terakhir \| Sepanjang hidup. |
| J25-P168-I029<br>Kode: 5 | STATUS PSIKIATRIS | Mengalami kesukaran mengontrol perilaku kasar, termasuk kemarahan atau kekerasan<br>Opsi: Ya = 1 \| Tidak = 0 | Matrix columns: 30 hari terakhir \| Sepanjang hidup. |
| J25-P168-I030<br>Kode: 6 | STATUS PSIKIATRIS | Mengalami pikiran serius untuk bunuh diri ?<br>Opsi: Ya = 1 \| Tidak = 0 | Matrix columns: 30 hari terakhir \| Sepanjang hidup. |
| J25-P168-I031<br>Kode: 7 | STATUS PSIKIATRIS | Berusaha untuk bunuh diri ?<br>Opsi: Ya = 1 \| Tidak = 0 | Matrix columns: 30 hari terakhir \| Sepanjang hidup. |
| J25-P168-I032<br>Kode: 8 | STATUS PSIKIATRIS | Menerima pengobatan dari psikiater ?<br>Opsi: Ya = 1 \| Tidak = 0 | Matrix columns: 30 hari terakhir \| Sepanjang hidup. |

### Lampiran 7.2 (ASI wajib lapor): PDF 169 / cetak 154

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P169-I001 | PEMERIKSAAN FISIK | Nomor Rekam Medik |  |
| J25-P169-I002 | PEMERIKSAAN FISIK | Nama |  |
| J25-P169-I003<br>Kode: 1 | PEMERIKSAAN FISIK | Tekanan darah : |  |
| J25-P169-I004<br>Kode: 2 | PEMERIKSAAN FISIK | Nadi : |  |
| J25-P169-I005<br>Kode: 3 | PEMERIKSAAN FISIK | Pernapasan (RR) : |  |
| J25-P169-I006<br>Kode: 4 | PEMERIKSAAN FISIK | Suhu (celcius) : |  |
| J25-P169-I007<br>Kode: 5 | PEMERIKSAAN FISIK | Pemeriksaan Sistemik :<br>Opsi: Sistem pencernaan \| Sistem jantung dan pembuluh darah \| Sistem pernapasan \| Sistem saraf pusat \| THT dan kulit \| Keterangan | Table columns. |
| J25-P169-I008<br>Kode: 6 | PEMERIKSAAN FISIK | Benzodiazepin<br>Opsi: Ya = 1 \| Tidak = 0 | Hasil Urinalisis matrix; source column Jenis Zat. |
| J25-P169-I009<br>Kode: 6 | PEMERIKSAAN FISIK | Kanabis<br>Opsi: Ya = 1 \| Tidak = 0 | Hasil Urinalisis matrix; source column Jenis Zat. |
| J25-P169-I010<br>Kode: 6 | PEMERIKSAAN FISIK | Opiat<br>Opsi: Ya = 1 \| Tidak = 0 | Hasil Urinalisis matrix; source column Jenis Zat. |
| J25-P169-I011<br>Kode: 6 | PEMERIKSAAN FISIK | Amfetamin<br>Opsi: Ya = 1 \| Tidak = 0 | Hasil Urinalisis matrix; source column Jenis Zat. |
| J25-P169-I012<br>Kode: 6 | PEMERIKSAAN FISIK | Kokain<br>Opsi: Ya = 1 \| Tidak = 0 | Hasil Urinalisis matrix; source column Jenis Zat. |
| J25-P169-I013<br>Kode: 6 | PEMERIKSAAN FISIK | Barbiturat<br>Opsi: Ya = 1 \| Tidak = 0 | Hasil Urinalisis matrix; source column Jenis Zat. |
| J25-P169-I014<br>Kode: 6 | PEMERIKSAAN FISIK | Alkohol<br>Opsi: Ya = 1 \| Tidak = 0 | Hasil Urinalisis matrix; source column Jenis Zat. |

### Lampiran 7.2 (ASI wajib lapor): PDF 170 / cetak 155

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P170-I001 | Kesimpulan/diagnosa kerja | Tanggal Kedatangan |  |
| J25-P170-I002 | Kesimpulan/diagnosa kerja | Nomor Rekam Medik |  |
| J25-P170-I003 | Kesimpulan/diagnosa kerja | Nama |  |
| J25-P170-I004 | KESIMPULAN | Masalah yang dihadapi<br>Opsi: 0 1 2 3 4 5 6 7 8 9 | Rows: Medis; Pekerjaan / Dukungan; Napza; Legal; Keluarga / sosial; Psikiatris. |
| J25-P170-I005 | KESIMPULAN | Medis<br>Opsi: 0 1 2 3 4 5 6 7 8 9 | Severity row. |
| J25-P170-I006 | KESIMPULAN | Pekerjaan / Dukungan<br>Opsi: 0 1 2 3 4 5 6 7 8 9 | Severity row. |
| J25-P170-I007 | KESIMPULAN | Napza<br>Opsi: 0 1 2 3 4 5 6 7 8 9 | Severity row. |
| J25-P170-I008 | KESIMPULAN | Legal<br>Opsi: 0 1 2 3 4 5 6 7 8 9 | Severity row. |
| J25-P170-I009 | KESIMPULAN | Keluarga / sosial<br>Opsi: 0 1 2 3 4 5 6 7 8 9 | Severity row. |
| J25-P170-I010 | KESIMPULAN | Psikiatris<br>Opsi: 0 1 2 3 4 5 6 7 8 9 | Severity row. |
| J25-P170-I011 | KESIMPULAN | Klien memenuhi kriteria diagnosis Napza<br>Opsi: F ........................................... |  |
| J25-P170-I012 | DIAGNOSA KERJA | Diagnosis Lainnya | Free-text diagnosis field. |
| J25-P170-I013 | DIAGNOSA KERJA | Resume Masalah | Multi-line free-text field. |
| J25-P170-I014 | RENCANA TERAPI DAN REHABILITASI | Rencana Terapi<br>Opsi: 1 Asesmen lanjutan / mendalam \| 2 Evaluasi Psikologis \| 3 Program Detoksifikasi \| 4 Wawancara Motivasional \| 5 Intervensi Singkat \| 6 Terapi Rumatan â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦. \| 7 Rehabilitasi rawat inap â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦. \| 8 Konseling â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦.. \| 9 Lain-lain â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦ | Plan selection/options; 6-9 include fill lines. |
| J25-P170-I015 | RENCANA TERAPI DAN REHABILITASI | Asesmen lanjutan / mendalam<br>Opsi: 1-9 | Option item; source uses numbered list. |
| J25-P170-I016 | RENCANA TERAPI DAN REHABILITASI | Evaluasi Psikologis<br>Opsi: 1-9 | Option item; source uses numbered list. |
| J25-P170-I017 | RENCANA TERAPI DAN REHABILITASI | Program Detoksifikasi<br>Opsi: 1-9 | Option item; source uses numbered list. |
| J25-P170-I018 | RENCANA TERAPI DAN REHABILITASI | Wawancara Motivasional<br>Opsi: 1-9 | Option item; source uses numbered list. |
| J25-P170-I019 | RENCANA TERAPI DAN REHABILITASI | Intervensi Singkat<br>Opsi: 1-9 | Option item; source uses numbered list. |
| J25-P170-I020 | RENCANA TERAPI DAN REHABILITASI | Terapi Rumatan â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦.<br>Opsi: 1-9 | Option item; source uses numbered list. |
| J25-P170-I021 | RENCANA TERAPI DAN REHABILITASI | Rehabilitasi rawat inap â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦.<br>Opsi: 1-9 | Option item; source uses numbered list. |
| J25-P170-I022 | RENCANA TERAPI DAN REHABILITASI | Konseling â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦..<br>Opsi: 1-9 | Option item; source uses numbered list. |
| J25-P170-I023 | RENCANA TERAPI DAN REHABILITASI | Lain-lain â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦<br>Opsi: 1-9 | Option item; source uses numbered list. |
| J25-P170-I024 | Pengesahan | Tanda tangan / Nama Jelas | Signature/name field for PETUGAS ASESMEN. |
| J25-P170-I025 | Pengesahan | Tanda tangan / Nama Jelas | Signature/name field for MENGETAHUI DOKTER. |
| J25-P170-I026 | Pengesahan | Tanda tangan / Nama Jelas | Signature/name field for MENYETUJUI PASIEN. |

### Lampiran 8 (hukum): PDF 171 / cetak 156

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P171-I001 | I DEMOGRAFI | TANGGAL ASESMEN HUKUM | Input/signature free text as applicable. |
| J25-P171-I002 | I DEMOGRAFI | TIM ASESMEN HUKUM TINGKAT | Input/signature free text as applicable. |
| J25-P171-I003 | I DEMOGRAFI | NAMA | Input/signature free text as applicable. |
| J25-P171-I004 | I DEMOGRAFI | NIK | Input/signature free text as applicable. |
| J25-P171-I005 | I DEMOGRAFI | USIA | Input/signature free text as applicable. |
| J25-P171-I006 | I DEMOGRAFI | TEMPAT TANGGAL LAHIR | Input/signature free text as applicable. |
| J25-P171-I007 | I DEMOGRAFI | ALAMAT | Input/signature free text as applicable. |
| J25-P171-I008 | I DEMOGRAFI | NOMOR HANDPHONE | Input/signature free text as applicable. |
| J25-P171-I009 | I DEMOGRAFI | NOMOR REKENING | Input/signature free text as applicable. |
| J25-P171-I010 | I DEMOGRAFI | STATUS PERKAWINAN | Input/signature free text as applicable. |
| J25-P171-I011 | I DEMOGRAFI | RIWAYAT PENDIDIKAN | Input/signature free text as applicable. |
| J25-P171-I012 | I DEMOGRAFI | RIWAYAT PEKERJAAN | Input/signature free text as applicable. |
| J25-P171-I013 | I DEMOGRAFI | Rata-rata Penghasilan satu bulan | Input/signature free text as applicable. |
| J25-P171-I014 | I DEMOGRAFI | CATATAN | Input/signature free text as applicable. |
| J25-P171-I015 | II KRONOLOGIS KEJADIAN | KRONOLOGIS KEJADIAN | Multi-line narrative field. |
| J25-P171-I016<br>Kode: 1.a | III PENGGUNAAN NARKOTIKA | Jenis Narkotika |  |
| J25-P171-I017<br>Kode: 1.b | III PENGGUNAAN NARKOTIKA | Hasil Pemeriksaan Urine<br>Opsi: â˜ Positif (nama narkotika)â€¦........ \| â˜ Negatif | Checkbox options; positive includes narcotic-name blank. |

### Lampiran 8 (hukum): PDF 172 / cetak 157

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P172-I001<br>Kode: 1 | IV STATUS HUKUM | Riwayat Tindak Pidana<br>Opsi: â˜ narkotika \| â˜ psikotropika \| â˜ pencurian \| â˜ perampokan \| â˜ pembunuhan \| â˜ pemerkosaan \| â˜ Lainnyaâ€¦........ | Checkbox list. |
| J25-P172-I002<br>Kode: 2.a | IV STATUS HUKUM | Tindak Pidana |  |
| J25-P172-I003<br>Kode: 2.b | IV STATUS HUKUM | Tempat penahanan |  |
| J25-P172-I004<br>Kode: 2.c | IV STATUS HUKUM | Tanggal penahanan |  |
| J25-P172-I005<br>Kode: 2.d | IV STATUS HUKUM | Lamanya waktu penahanan |  |
| J25-P172-I006<br>Kode: 2.d.1 | IV STATUS HUKUM | â€¦..........hari<br>Opsi: â˜ â€¦..........hari | Checkbox/amount. |
| J25-P172-I007<br>Kode: 2.d | IV STATUS HUKUM | Penangguhan penahanan<br>Opsi: â˜ | Checkbox option. |
| J25-P172-I008<br>Kode: 2.d | IV STATUS HUKUM | Bebas demi hukum<br>Opsi: â˜ | Checkbox option. |
| J25-P172-I009<br>Kode: 2.d | IV STATUS HUKUM | Proses hukum lanjut (jawab di no 3)<br>Opsi: â˜ | Checkbox option. |
| J25-P172-I010<br>Kode: 3.a | IV STATUS HUKUM | Tindak Pidana | 3.b unit printed: tahun; 3.c options Rutanâ€¦/Lapasâ€¦ |
| J25-P172-I011<br>Kode: 3.b | IV STATUS HUKUM | Vonis Hakim berapa lama | 3.b unit printed: tahun; 3.c options Rutanâ€¦/Lapasâ€¦ |
| J25-P172-I012<br>Kode: 3.c | IV STATUS HUKUM | Ditempatkan di | 3.b unit printed: tahun; 3.c options Rutanâ€¦/Lapasâ€¦ |
| J25-P172-I013<br>Kode: 3.b | IV STATUS HUKUM | tahun<br>Opsi: tahun | Unit printed beside duration. |
| J25-P172-I014<br>Kode: 3.c | IV STATUS HUKUM | Rutanâ€¦.............................................../ Lapasâ€¦.............................. | Placement fields. |
| J25-P172-I015<br>Kode: 4.a | IV STATUS HUKUM | Jenis narkotika yang dimiliki saat penangkapan<br>Opsi: â˜ Heroin \| â˜ Ganja \| â˜ Ekstasi \| â˜ Sabu/methamphetamine \| â˜ Kokain \| â˜ Carisoprodol \| â˜ Cannabinoid sintetis \| â˜ Lainnyaâ€¦.. | Checkbox list. |
| J25-P172-I016<br>Kode: 4.b | IV STATUS HUKUM | Narkotika yang dimiliki apakah<br>Opsi: â˜ Dipakai sendiri \| â˜ Dipakai bersama-sama \| â˜ Titipan orang \| â˜ Akan dijual \| â˜ Lainnyaâ€¦......... | Checkbox list. |
| J25-P172-I017<br>Kode: 4.c | IV STATUS HUKUM | Metode pembelian narkotika<br>Opsi: â˜ Beli langsung diâ€¦................ \| â˜ Dari teman \| â˜ Dari jaringan tertentuâ€¦.. \| â˜ Aplikasi (IG/LINE/â€¦) : \| â˜ Lainnyaâ€¦. | Checkbox list; includes fill blanks. |
| J25-P172-I018<br>Kode: 4.c | IV STATUS HUKUM | Pembayaran<br>Opsi: â˜ Cash \| â˜ Transfer Bukti transfer ada / tidak *) \| â˜ Uang Elektronik | Checkbox list; source includes â€œ*)â€. |
| J25-P172-I019<br>Kode: 4.c | IV STATUS HUKUM | Untuk siapa<br>Opsi: â˜ Diri Sendiri \| â˜ Teman | Checkbox list. |
| J25-P172-I020<br>Kode: 4.c | IV STATUS HUKUM | Sudah berapa kali<br>Opsi: â€¦............kali | Count field. |
| J25-P172-I021<br>Kode: 4.c | IV STATUS HUKUM | Harga narkotika yang dibeli<br>Opsi: : Rpâ€¦. | Amount field. |
| J25-P172-I022<br>Kode: 4.d | IV STATUS HUKUM | Pengecekan pada database intelijen | Free-text/result field. |

### Lampiran 8 (hukum): PDF 173 / cetak 158

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P173-I001 | FAKTA FAKTA HUKUM | FAKTA FAKTA HUKUM | Multi-line narrative field. |
| J25-P173-I002 | KESIMPULAN | KESIMPULAN | Multi-line narrative field. |
| J25-P173-I003 | Pengesahan | Jakarta, | Date/location line. |
| J25-P173-I004<br>Kode: Anggota 1 | Pengesahan | Anggota | Signature/name and NIP/NRP field; source has four member blocks. |
| J25-P173-I005<br>Kode: Anggota 2 | Pengesahan | Anggota | Signature/name and NIP/NRP field; source has four member blocks. |
| J25-P173-I006<br>Kode: Anggota 3 | Pengesahan | Anggota | Signature/name and NIP/NRP field; source has four member blocks. |
| J25-P173-I007<br>Kode: Anggota 4 | Pengesahan | Anggota | Signature/name and NIP/NRP field; source has four member blocks. |
| J25-P173-I008 | Pengesahan | NIP/NRP â€¦................................. | Printed under member signature lines. |

### Lampiran 9 (diagnosis): PDF 174 / cetak 159

| ID / kode sumber | Bagian | Label dan opsi sumber | Catatan penggunaan |
| --- | --- | --- | --- |
| J25-P174-I001<br>Kode: F1x.xx | Klasifikasi PPDGJ III dan ICD-10 | Gangguan Mental dan Perilaku Akibat Penggunaan Zat Psikoaktif (F1x.xx) | Classification item; source code/text preserved. |
| J25-P174-I002<br>Kode: F10.xx | Klasifikasi PPDGJ III dan ICD-10 | Gangguan mental dan perilaku akibat penggunaan alkohol (F10.xx) | Classification item; source code/text preserved. |
| J25-P174-I003<br>Kode: F11.xx | Klasifikasi PPDGJ III dan ICD-10 | Gangguan mental dan perilaku akibat penggunaan opioida (F11.xx) | Classification item; source code/text preserved. |
| J25-P174-I004<br>Kode: F12.xx | Klasifikasi PPDGJ III dan ICD-10 | Gangguan mental dan perilaku akibat penggunaan kanabinoida (F12.xx) | Classification item; source code/text preserved. |
| J25-P174-I005<br>Kode: F13.xx | Klasifikasi PPDGJ III dan ICD-10 | Gangguan mental dan perilaku akibat penggunaan sedativa atau hipnotika (F13.xx) | Classification item; source code/text preserved. |
| J25-P174-I006<br>Kode: F14.xx | Klasifikasi PPDGJ III dan ICD-10 | Gangguan mental dan perilaku akibat penggunaan kokain (F14.xx) | Classification item; source code/text preserved. |
| J25-P174-I007<br>Kode: F15.xx | Klasifikasi PPDGJ III dan ICD-10 | Gangguan mental dan perilaku akibat penggunaan stimulansia lain termasuk kafein (F15.xx) | Classification item; source code/text preserved. |
| J25-P174-I008<br>Kode: F16.xx | Klasifikasi PPDGJ III dan ICD-10 | Gangguan mental dan perilaku akibat penggunaan halusinogenika (F16.xx) | Classification item; source code/text preserved. |
| J25-P174-I009<br>Kode: F17.xx | Klasifikasi PPDGJ III dan ICD-10 | Gangguan mental dan perilaku akibat penggunaan tembakau (F17.xx) | Classification item; source code/text preserved. |
| J25-P174-I010<br>Kode: F18.xx | Klasifikasi PPDGJ III dan ICD-10 | Gangguan mental dan perilaku akibat penggunaan pelarut yang mudah menguap (F18.xx) | Classification item; source code/text preserved. |
| J25-P174-I011<br>Kode: F19.xx | Klasifikasi PPDGJ III dan ICD-10 | Gangguan mental dan perilaku akibat penggunaan zat multipel dan penggunaan zat psikoaktif lainnya (F19.xx) | Classification item; source code/text preserved. |
| J25-P174-I012<br>Kode: F1x.0x | Klasifikasi PPDGJ III dan ICD-10 | Intoksikasi akut (F1x.0x) | Classification item; source code/text preserved. |
| J25-P174-I013<br>Kode: F1x.00 | Klasifikasi PPDGJ III dan ICD-10 | Tanpa komplikasi (F1x.00) | Classification item; source code/text preserved. |
| J25-P174-I014<br>Kode: F1x.01 | Klasifikasi PPDGJ III dan ICD-10 | Dengan trauma atau cedera tubuh lainnya (F1x.01) | Classification item; source code/text preserved. |
| J25-P174-I015<br>Kode: F1x.02 | Klasifikasi PPDGJ III dan ICD-10 | Dengan komplikasi medis lainnya (F1x.02) | Classification item; source code/text preserved. |
| J25-P174-I016<br>Kode: F1x.03 | Klasifikasi PPDGJ III dan ICD-10 | Dengan delirium (F1x.03) | Classification item; source code/text preserved. |
| J25-P174-I017<br>Kode: F1x.04 | Klasifikasi PPDGJ III dan ICD-10 | Dengan distorsi persepsi (F1x.04) | Classification item; source code/text preserved. |
| J25-P174-I018<br>Kode: F1x.05 | Klasifikasi PPDGJ III dan ICD-10 | Dengan koma (F1x.05) | Classification item; source code/text preserved. |
| J25-P174-I019<br>Kode: F1x.06 | Klasifikasi PPDGJ III dan ICD-10 | Dengan konvulsi (F1x.06) | Classification item; source code/text preserved. |
| J25-P174-I020<br>Kode: F10.07 | Klasifikasi PPDGJ III dan ICD-10 | Intoksikasi patologis alkohol (F10.07) | Classification item; source code/text preserved. |
| J25-P174-I021<br>Kode: F1x.1 | Klasifikasi PPDGJ III dan ICD-10 | Penggunaan yang merugikan (F1x.1) | Classification item; source code/text preserved. |
| J25-P174-I022<br>Kode: F1x.2x | Klasifikasi PPDGJ III dan ICD-10 | Sindrom ketergantungan (F1x.2x) | Classification item; source code/text preserved. |
| J25-P174-I023<br>Kode: F1x.20 | Klasifikasi PPDGJ III dan ICD-10 | Kini abstinen (F1x.20) | Classification item; source code/text preserved. |
| J25-P174-I024<br>Kode: F1x.21 | Klasifikasi PPDGJ III dan ICD-10 | Kini abstinen tetapi dalam lingkungan terlindung (F1x.21) | Classification item; source code/text preserved. |
| J25-P174-I025<br>Kode: F1x.22 | Klasifikasi PPDGJ III dan ICD-10 | Kini dalam pengawasan klinis atau dengan pengobatan pengganti (ketergantungan terkendali) (F1x.22) | Classification item; source code/text preserved. |
| J25-P174-I026<br>Kode: F1x.23 | Klasifikasi PPDGJ III dan ICD-10 | Kini abstinen tetapi mendapat terapi aversif atau obat penyekat (F1x.23) | Classification item; source code/text preserved. |
| J25-P174-I027<br>Kode: F1x.24 | Klasifikasi PPDGJ III dan ICD-10 | Kini sedang menggunakan zat (ketergantungan aktif) (F1x.24) | Classification item; source code/text preserved. |
| J25-P174-I028<br>Kode: F1x.25 | Klasifikasi PPDGJ III dan ICD-10 | Penggunaan berkelanjutan (F1x.25) | Classification item; source code/text preserved. |
| J25-P174-I029<br>Kode: F1x.26 | Klasifikasi PPDGJ III dan ICD-10 | Penggunaan episodik (F1x.26) | Classification item; source code/text preserved. |
| J25-P174-I030<br>Kode: F1x.3x | Klasifikasi PPDGJ III dan ICD-10 | Keadaan putus zat (F1x.3x) | Classification item; source code/text preserved. |
| J25-P174-I031<br>Kode: F1x.30 | Klasifikasi PPDGJ III dan ICD-10 | Tanpa komplikasi (F1x.30) | Classification item; source code/text preserved. |
| J25-P174-I032<br>Kode: F1x.31 | Klasifikasi PPDGJ III dan ICD-10 | Dengan komplikasi (F1x.31) | Classification item; source code/text preserved. |
| J25-P174-I033<br>Kode: F1x.4x | Klasifikasi PPDGJ III dan ICD-10 | Keadaan putus zat dengan delirium (F1x.4x) | Classification item; source code/text preserved. |
| J25-P174-I034<br>Kode: F1x.40 | Klasifikasi PPDGJ III dan ICD-10 | Tanpa konvulsi (F1x.40) | Classification item; source code/text preserved. |
| J25-P174-I035<br>Kode: F1x.41 | Klasifikasi PPDGJ III dan ICD-10 | Dengan konvulsi (F1x.41) | Classification item; source code/text preserved. |
| J25-P174-I036<br>Kode: F1x.5x | Klasifikasi PPDGJ III dan ICD-10 | Gangguan psikotik (F1x.5x) | Classification item; source code/text preserved. |
| J25-P174-I037<br>Kode: F1x.50 | Klasifikasi PPDGJ III dan ICD-10 | Lir-skizofrenia (F1x.50) | Classification item; source code/text preserved. |
| J25-P174-I038<br>Kode: F1x.51 | Klasifikasi PPDGJ III dan ICD-10 | Predominan waham (F1x.51) | Classification item; source code/text preserved. |
| J25-P174-I039<br>Kode: F1x.52 | Klasifikasi PPDGJ III dan ICD-10 | Predominan halusinasi (F1x.52) | Classification item; source code/text preserved. |
| J25-P174-I040<br>Kode: F1x.53 | Klasifikasi PPDGJ III dan ICD-10 | Predominan polimorfik (F1x.53) | Classification item; source code/text preserved. |
| J25-P174-I041<br>Kode: F1x.54 | Klasifikasi PPDGJ III dan ICD-10 | Predominan gejala depresif (F1x.54) | Classification item; source code/text preserved. |
| J25-P174-I042<br>Kode: F1x.55 | Klasifikasi PPDGJ III dan ICD-10 | Predominan gejala manik (F1x.55) | Classification item; source code/text preserved. |
| J25-P174-I043<br>Kode: F1x.56 | Klasifikasi PPDGJ III dan ICD-10 | Campuran (F1x.56) | Classification item; source code/text preserved. |
| J25-P174-I044<br>Kode: F1x.6 | Klasifikasi PPDGJ III dan ICD-10 | Sindrom Amnestik (F1x.6) | Classification item; source code/text preserved. |
| J25-P174-I045<br>Kode: F1x.7x | Klasifikasi PPDGJ III dan ICD-10 | Gangguan psikotik residual dan onset lambat (F1x.7x) | Classification item; source code/text preserved. |
| J25-P174-I046<br>Kode: F1x.70 | Klasifikasi PPDGJ III dan ICD-10 | Kilas balik (F1x.70) | Classification item; source code/text preserved. |
| J25-P174-I047<br>Kode: F1x.71 | Klasifikasi PPDGJ III dan ICD-10 | Gangguan kepribadian atau perilaku (F1x.71) | Classification item; source code/text preserved. |
| J25-P174-I048<br>Kode: F1x.72 | Klasifikasi PPDGJ III dan ICD-10 | Gangguan afektif residual (F1x.72) | Classification item; source code/text preserved. |
| J25-P174-I049<br>Kode: F1x.73 | Klasifikasi PPDGJ III dan ICD-10 | Demensia (F1x.73) | Classification item; source code/text preserved. |
| J25-P174-I050<br>Kode: F1x.74 | Klasifikasi PPDGJ III dan ICD-10 | Hendaya kognitif menetap lainnya (F1x.74) | Classification item; source code/text preserved. |
| J25-P174-I051<br>Kode: F1x.75 | Klasifikasi PPDGJ III dan ICD-10 | Gangguan psikotik onset lambat (F1x.75) | Classification item; source code/text preserved. |
| J25-P174-I052<br>Kode: F1x.8 | Klasifikasi PPDGJ III dan ICD-10 | Gangguan mental dan perilaku lainnya (F1x.8) | Classification item; source code/text preserved. |
| J25-P174-I053<br>Kode: F1x.9 | Klasifikasi PPDGJ III dan ICD-10 | Gangguan mental dan perilaku yang tak terinci (F1x.9) | Classification item; source code/text preserved. |


---

<a id="section-019"></a>

## Lampiran B. Matriks penempatan enam dimensi

Sel utama 6 x 5 berikut merupakan transkripsi instrumen, bukan algoritme resep atau penempatan otomatis. PDF asli mengendalikan tata letak dan simbol checkbox. Pilihan pada formulir sumber kosong.

### Intoksikasi Akut dan atau potensi putus zat: level 0

**Sumber:** PDF 175 / cetak 160. **Label:** Tidak Ada. **Rawatan:** Tidak Membutuhkan Rawatan.

O Tidak terdapat tanda intoksikasi atau putus zat

**Keterangan/tindakan sumber:**


### Intoksikasi Akut dan atau potensi putus zat: level 1

**Sumber:** PDF 175 / cetak 160. **Label:** Ringan. **Rawatan:** Rawat Jalan.

O Intoksikasi ringan atau sedang
O Mengganggu fungsi keseharian
O Risiko minimal akan putus zat berat
O Tidak membahayakan diri/orang lain

**Keterangan/tindakan sumber:**

Withdrawal Management (WM)/ Manajemen putus zat untuk gejala ringan atau yang terkontrol

### Intoksikasi Akut dan atau potensi putus zat: level 2

**Sumber:** PDF 175 / cetak 160. **Label:** Sedang. **Rawatan:** Rawat Jalan Intensif.

O Mungkin mengalami Intoksikasi berat tetapi merespon terhadap dukungan
O Risiko sedang mengalami putus zat berat
O Tidak membahayakan diri / orang lain

**Keterangan/tindakan sumber:**

Prioritaskan untuk dihubungkan kepada layanan medis Manajemen Putus Zat (WM)

### Intoksikasi Akut dan atau potensi putus zat: level 3

**Sumber:** PDF 175 / cetak 160. **Label:** Berat. **Rawatan:** Residensial/Pemantauan Medis.

O Intoksikasi berat dengan risiko membahayakan diri/orang lain
O Kesulitan mengatasi kondisi tersebut
O Risiko signifikan mengalami putus zat berat

**Keterangan/tindakan sumber:**

Segera, kebutuhan Manajemen Putus Zat (WM) yang berat atau risiko tinggi sangat membutuhkan dukungan 24 jam/hari

### Intoksikasi Akut dan atau potensi putus zat: level 4

**Sumber:** PDF 175 / cetak 160. **Label:** Sangat Berat. **Rawatan:** Hospitalisasi.

O Incapacitated (tidak berdaya)
O Tanda dan gejala yang berat
O Adanya tanda bahaya misal kejang
O Penggunaan zat tetap berlanjut walaupun mengancam nyawa

**Keterangan/tindakan sumber:**

UGD terdekat

### Komplikasi dan Kondisi Medis: level 0

**Sumber:** PDF 175 / cetak 160. **Label:** Tidak Ada. **Rawatan:** Tidak Membutuhkan Rawatan.

O Berfungsi penuh atau tidak ada rasa nyeri atau ketidaknyamanan berlebih

**Keterangan/tindakan sumber:**


### Komplikasi dan Kondisi Medis: level 1

**Sumber:** PDF 175 / cetak 160. **Label:** Ringan. **Rawatan:** Rawat Jalan.

O Gejala ringan yang mempengaruhi fungsi sehari-hari secara minimal
O Mampu mengatasi ketidaknyamanan fisik

**Keterangan/tindakan sumber:**


### Komplikasi dan Kondisi Medis: level 2

**Sumber:** PDF 175 / cetak 160. **Label:** Sedang. **Rawatan:** Rawat Jalan Intensif.

O Masalah medis akut atau kronis tidak mengancam nyawa tetapi diabaikan dan membutuhkan perawatan baru atau berbeda.
O Masalah kesehatan cukup berdampak pada aktivitas sehari-hari (ADL) dan kemandirian hidup
O Dukungan yang memadai untuk mengatasi masalah medis di rumah dengan intervensi medis

**Keterangan/tindakan sumber:**

Prioritas tindak lanjut dan evaluasi untuk kondisi baru atau tidak terkontrol

### Komplikasi dan Kondisi Medis: level 3

**Sumber:** PDF 175-176 / cetak 160-161. **Label:** Berat. **Rawatan:** Residensial/Pemantauan Medis.

O Kontrol buruk terhadap masalah medis yang memerlukan evaluasi
O Kemampuan buruk untuk mengatasi masalah medis
O Dukungan tidak memadai untuk mengelola masalah medis secara mandiri
O Kesulitan dengan aktivitas sehari-hari dan/atau hidup mandiri

**Keterangan/tindakan sumber:**

Membutuhkan evaluasi dan terapi termasuk pengawasan medis yang terhubung dengan perawatan 24 jam sampai kondisi stabil

### Komplikasi dan Kondisi Medis: level 4

**Sumber:** PDF 175-176 / cetak 160-161. **Label:** Sangat Berat. **Rawatan:** Hospitalisasi.

O Kondisi tidak stabil dengan masalah medis yang parah, termasuk tetapi tidak terbatas pada:
O Nyeri dada yang muncul tiba-tiba
O Delirium tremens (DTs)
O Kehamilan yang tidak stabil
O Muntah darah merah terang
O Kejang putus zat dalam 24 jam terakhir
O Kejang berulang

**Keterangan/tindakan sumber:**

Asesmen segera pada UGD terdekat

### Komplikasi dan Kondisi emosional, perilaku serta kognitif: level 0

**Sumber:** PDF 176 / cetak 161. **Label:** Tidak Ada. **Rawatan:** Tidak Membutuhkan Rawatan.

O Tidak ada gejala berbahaya
O Fungsi sosial baik
O Perawatan diri baik
O Tidak ada gejala yang mengganggu pemulihan

**Keterangan/tindakan sumber:**


### Komplikasi dan Kondisi emosional, perilaku serta kognitif: level 1

**Sumber:** PDF 176 / cetak 161. **Label:** Ringan. **Rawatan:** Rawat Jalan.

O Kemungkinan diagnosis dari kondisi emosional, perilaku, kognitif
O Membutuhkan pengawasan untuk kondisi kesehatan mental yang stabil
O Gejala-gejala tidak mengganggu pemulihan
O Memiliki hendaya dalam hubungan sosial

**Keterangan/tindakan sumber:**

Asesmen lanjutan dan rujukan atau tindak lanjut ke fasilitas layanan kesehatan jiwa yang tersedia (MH: Mental Health)

### Komplikasi dan Kondisi emosional, perilaku serta kognitif: level 2

**Sumber:** PDF 176 / cetak 161. **Label:** Sedang. **Rawatan:** Rawat Jalan Intensif.

O Gejala-gejala mengganggu pemulihan
O Membutuhkan terapi dan manajemen kondisi kesehatan mental
O Tidak ada ancaman langsung terhadap diri sendiri / orang lain
O Gejala-gejala tidak menghambat fungsi kemandirian

**Keterangan/tindakan sumber:**

Prioritas tindak lanjut dan evaluasi untuk kondisi baru atau tidak terkontrol ke fasilitas layanan kesehatan jiwa yang tersedia

### Komplikasi dan Kondisi emosional, perilaku serta kognitif: level 3

**Sumber:** PDF 176 / cetak 161. **Label:** Berat. **Rawatan:** Residensial/Pemantauan Medis.

O Ketidakmampuan untuk merawat diri di rumah
O Mungkin termasuk memiliki dorongan berbahaya untuk melukai diri / orang lain
O Membutuhkan dukungan 24 jam
O Berisiko menjadi level 4 / sangat berat apabila tanpa terapi

**Keterangan/tindakan sumber:**

Asesmen dan terapi segera untuk gejala dan tanda yang tidak stabil

### Komplikasi dan Kondisi emosional, perilaku serta kognitif: level 4

**Sumber:** PDF 176 / cetak 161. **Label:** Sangat Berat. **Rawatan:** Hospitalisasi.

O Gejala-gejala yang mengancam nyawa termasuk ide bunuh diri secara aktif
O Psikosis
O Bahaya yang akan segera terjadi pada diri sendiri / orang lain

**Keterangan/tindakan sumber:**

Asesmen segera pada UGD terdekat

### Kesiapan berubah (motivasi) klien dalam terapi: level 0

**Sumber:** PDF 177 / cetak 162. **Label:** Tidak Ada. **Rawatan:** Tidak Membutuhkan Rawatan.

O Tanggung jawab proaktif klien dalam terapi
O Komitmen untuk merubah penggunaan alkohol atau narkoba lain

**Keterangan/tindakan sumber:**


### Kesiapan berubah (motivasi) klien dalam terapi: level 1

**Sumber:** PDF 177 / cetak 162. **Label:** Ringan. **Rawatan:** Rawat Jalan.

O Bersedia untuk menjalani terapi
O Ambivalen terhadap kebutuhan untuk berubah

**Keterangan/tindakan sumber:**

Membutuhkan layanan intensitas rendah untuk peningkatan motivasi

### Kesiapan berubah (motivasi) klien dalam terapi: level 2

**Sumber:** PDF 177 / cetak 162. **Label:** Sedang. **Rawatan:** Rawat Jalan Intensif.

O Enggan menjalani terapi
O Komitmen rendah untuk mengubah penggunaan alkohol atau narkoba lain
O Kepatuhan terhadap terapi berubah-ubah

**Keterangan/tindakan sumber:**

Membutuhkan layanan intensitas sedang untuk peningkatan motivasi

### Kesiapan berubah (motivasi) klien dalam terapi: level 3

**Sumber:** PDF 177 / cetak 162. **Label:** Berat. **Rawatan:** Residensial/Pemantauan Medis.

O Tidak menyadari dan tidak tertarik pada kebutuhan untuk berubah
O Tidak mau / hanya mampu menyelesaikan sebagian dari terapi
O Kepatuhan Pasif ,atau sekedar menjalani terapi

**Keterangan/tindakan sumber:**

Membutuhkan layanan intensitas tinggi untuk peningkatan motivasi
Untuk mencegah penurunan fungsi / keselamatan

### Kesiapan berubah (motivasi) klien dalam terapi: level 4

**Sumber:** PDF 177 / cetak 162. **Label:** Sangat Berat. **Rawatan:** Hospitalisasi.

O Menolak kebutuhan untuk berubah
O Terlibat dalam perilaku yang berpotensi berbahaya
O Tidak mau / tidak dapat mengikuti rekomendasi terapi

**Keterangan/tindakan sumber:**

Menempatkan pada tempat yang aman untuk situasi akut yang berbahaya dan atau dibutuhkan observasi ketat

### Potensi kekambuhan atau penggunaan berlanjut: level 0

**Sumber:** PDF 177 / cetak 162. **Label:** Tidak Ada. **Rawatan:** Tidak Membutuhkan Rawatan.

O Rendah / tidak ada potensi untuk kambuh

**Keterangan/tindakan sumber:**


### Potensi kekambuhan atau penggunaan berlanjut: level 1

**Sumber:** PDF 177 / cetak 162. **Label:** Ringan. **Rawatan:** Rawat Jalan.

O Risiko minimal untuk penggunaan
O Keterampilan koping dan pencegahan kekambuhan yang memadai

**Keterangan/tindakan sumber:**

Dibutuhkan layanan pencegahan kekambuhan intensitas rendah atau kelompok bantu diri

### Potensi kekambuhan atau penggunaan berlanjut: level 2

**Sumber:** PDF 177-178 / cetak 162-163. **Label:** Sedang. **Rawatan:** Rawat Jalan Intensif.

O Memiliki atau menggunakan keterampilan koping secara tidak konsisten
O Mampu mengelola diri tanpa diminta

**Keterangan/tindakan sumber:**

Dibutuhkan edukasi dan layanan pencegahan kekambuhan
Kebutuhan yang mungkin:
e Manajemen kasus yang intensif
e Manajemen farmakoterapi
e Terapi komunitas asertif (ACT)
e Mungkin dibutuhkan lingkungan tempat tinggal yang terstruktur

### Potensi kekambuhan atau penggunaan berlanjut: level 3

**Sumber:** PDF 177-178 / cetak 162-163. **Label:** Berat. **Rawatan:** Residensial/Pemantauan Medis.

O Kurang mengenali risiko penggunaan alkohol atau narkoba lain
O Keterampilan yang buruk untuk mengatasi kekambuhan

**Keterangan/tindakan sumber:**

Layanan pencegahan kekambuhan termasuk:
e pelatihan keterampilan coping terstruktur
e Strategi memotivasi
e Pengelolaan manajemen kasus dan layanan komunitas secara asertif
e Mungkin dibutuhkan lingkungan tempat tinggal yang terstruktur

### Potensi kekambuhan atau penggunaan berlanjut: level 4

**Sumber:** PDF 177-178 / cetak 162-163. **Label:** Sangat Berat. **Rawatan:** Hospitalisasi.

O Tidak memiliki keterampilan mengatasi masalah kekambuhan/adiksi
O Penggunaan zat / perilaku membahayakan diri / orang lain dalam waktu dekat

**Keterangan/tindakan sumber:**

Dibutuhkan semua layanan seperti di level 3 â€œberatâ€:
e Untuk kasus-kasus akut diperlukan pengaturan linkungan secara klinis selama 24 jam
e Untuk kasus-kasus kronis yang situasinya tidak membahayakan diperlukan lingkungan yang mendukung selama 24 jam

### Lingkungan tempat tinggal atau pemulihan: level 0

**Sumber:** PDF 178 / cetak 163. **Label:** Tidak Ada. **Rawatan:** Tidak Membutuhkan Rawatan.

O Mampu mengatasi dalam lingkungan/suportif

**Keterangan/tindakan sumber:**


### Lingkungan tempat tinggal atau pemulihan: level 1

**Sumber:** PDF 178 / cetak 163. **Label:** Ringan. **Rawatan:** Rawat Jalan.

O Dukungan sosial pasif / tidak tertarik, tetapi masih mampu mengatasinya
O Tidak ada lingkungan yang berisiko serius

**Keterangan/tindakan sumber:**

Mungkin membutuhkan pendampingan dalam:
@ menemukan suatu lingkungan yang mendukung
e mengembangkan dukungan melalui: pelatihan keterampilan
e perawatan anak
e transportasi

### Lingkungan tempat tinggal atau pemulihan: level 2

**Sumber:** PDF 178 / cetak 163. **Label:** Sedang. **Rawatan:** Rawat Jalan Intensif.

O Lingkungan yang tidak mendukung, tetapi sebagian besar waktu mampu mengatasi dalam masyarakat dengan struktur klinis

**Keterangan/tindakan sumber:**

Mungkin membutuhkan pendampingan sama seperti â€œlevel 1â€:
@ manajemen perawatan asertif

### Lingkungan tempat tinggal atau pemulihan: level 3

**Sumber:** PDF 178 / cetak 163. **Label:** Berat. **Rawatan:** Residensial/Pemantauan Medis.

O Lingkungan yang tidak mendukung, kesulitan mengatasi bahkan dengan struktur klinis

**Keterangan/tindakan sumber:**

Membutuhkan pendampingan yang lebih intens ke dalam:
e menemukan lingkungan tempat tinggal yang mendukung
e pelatihan keterampilan (tergantung dari keterampilan coping dan kontrol impulse
@ manajemen perawatan asertif

### Lingkungan tempat tinggal atau pemulihan: level 4

**Sumber:** PDF 178 / cetak 163. **Label:** Sangat Berat. **Rawatan:** Hospitalisasi.

O Lingkungan merugikan / berpengaruh buruk terhadap pemulihan
O Tidak dapat mengatasi dan lingkungan dapat menimbulkan ancaman bagi keselamatan

**Keterangan/tindakan sumber:**

Klien butuh dipisahkan segera dari lingkungan yang berpengaruh buruk
e manajemen perawatan asertif
e membutuhkan perubahan tempat tinggal/lingkungan
e untuk kasus akut yang membahayakan klien membutuhkan segera tempat yang aman


---

<a id="section-020"></a>

## Lampiran C. Petunjuk penempatan dan detail dokumen keluaran

### Juknis TAT 2025 : Lampiran 10-13 (PDF pp.175-191)

### Coverage / method

- **Scope read:** PDF pages 175-191 inclusive, 17/17 pages; Lampiran 10â€™s nine pages (PDF 175-183) were rendered individually at 3300 px and read as raster tables, including page-break continuations. PDF pages 184-191 (Lampiran 11-13) were also rendered/read.
- Printed page mapping in this PDF is **printed p = PDF p âˆ’ 15**: PDF 175-191 = printed pp.160-176.
- The placement form has no usable body-text layer; OCR was used only to assist locating text. The matrix transcription is based on the rendered table layout. Circle marks are transcribed as `O`/`â—‹`-style checklist bullets where visible; blanks are not values.
- **Not auto-prescriptive:** the matrix is an assessment/placement aid. A qualified clinician/authorized TAT must assess the client, verify medical/mental-health risk, document the selected cells, and make the final recommendation. Hospital/UGD, withdrawal-management, psychiatric, and 24-hour-medical decisions require appropriate qualified clinical authority; this document does not prescribe them automatically.

### Lampiran 10 : form, dimensions, severity and flow

Header: **â€œInstrumen Kriteria Penempatan Klien (client placement criteria)â€**, **â€œAdaptasi ASAM Placement Criteria 3â€ Editionâ€**. Five severity columns are printed as:

| Severity | Printed heading | Placement heading |
|---|---|---|
| 0 | 0 (Tidak Ada) | Tidak Membutuhkan Rawatan |
| 1 | 1 (Ringan) | Rawat Jalan |
| 2 | 2 (Sedang) | Rawat Jalan Intensif |
| 3 | 3 (Berat) | Residensial/Pemantauan Medis |
| 4 | 4 (Sangat Berat) | Hospitalisasi |

The complete cell-level transcription is in `placement-fields.csv` (tersedia dalam paket lampiran), 30 rows (6 dimensions Ã— 5 severity levels). The following preserves the dimension names and the tableâ€™s action/flow content; wording and source spelling are retained, including apparent source spellings such as â€œkonsekwensiâ€, â€œstategiâ€, â€œlinkunganâ€, â€œimpulseâ€, and â€œmerubahâ€.

#### Six dimensions and levels (PDF pp.175-178; printed pp.160-163)

1. **Intoksikasi Akut dan atau potensi putus zat** : Level 0: no signs of intoxication/withdrawal. Level 1: light/moderate intoxication; daily-function effect; minimal risk of severe withdrawal; no danger to self/others. Level 2: may have severe intoxication but responds to support; moderate severe-withdrawal risk; no danger to self/others. Level 3: severe intoxication with danger risk; difficulty managing condition; significant severe-withdrawal risk. Level 4: â€œIncapacitated (tidak berdaya)â€; severe signs/symptoms; danger signs such as seizures; continued use despite life threat. Actions progress from **Withdrawal Management (WM)/Manajemen putus zat** for light/controlled symptoms, to medical WM linkage, immediate heavy/high-risk WM with 24-hour support, and UGD terdekat (level 4). **Source:** PDF p.175, printed p.160.
2. **Komplikasi dan Kondisi Medis** : Level 0: fully functioning/no excess pain or discomfort. Levels 1-2 cover light symptoms and medical problems requiring new/different care, including ability/support to manage at home; level 3 covers poor control/poor ability/insufficient support and difficulty with ADL/independent living; level 4 is unstable severe medical condition, with examples: sudden chest pain, delirium tremens (DTs), unstable pregnancy, bright-red hematemesis, withdrawal seizure within 24 hours, recurrent seizures. Actions range from follow-up/evaluation to connected 24-hour care, and immediate UGD assessment. **Source:** PDF pp.175-176, printed pp.160-161.
3. **Komplikasi dan Kondisi emosional, perilaku serta kognitif** : Level 0: no dangerous symptoms; good social function/self-care; no symptoms interfering with recovery. Level 1: possible emotional/behavioral/cognitive diagnosis; stable mental-health monitoring; symptoms do not disturb recovery; social-relationship impairment. Level 2: symptoms disturb recovery; therapy/mental-health management; no immediate threat; no impaired independent function. Level 3: inability to care for self at home; possibly dangerous urge to harm self/others; 24-hour support; risk of becoming level 4 without therapy. Level 4: life-threatening symptoms including active suicidal ideation; psychosis; imminent danger to self/others. Actions are MH referral/follow-up, then priority evaluation, immediate assessment/therapy, or immediate UGD assessment. **Source:** PDF p.176, printed p.161.
4. **Kesiapan berubah (motivasi) klien dalam terapi** : Level 0: proactive responsibility and commitment to change alcohol/other-drug use. Level 1: willing/ambivalent; low-intensity motivation service. Level 2: reluctant, low commitment, variable adherence; medium-intensity motivation service. Level 3: unaware/uninterested in change; unwilling/only partly able to complete therapy; passive adherence; high-intensity motivation service and prevention of functional/safety decline. Level 4: rejects need to change; potentially dangerous behavior; cannot/will not follow recommendations; safe setting and/or close observation. **Source:** PDF p.177, printed p.162.
5. **Potensi kekambuhan atau penggunaan berlanjut** : Level 0: low/no relapse potential. Level 1: minimal use risk and adequate coping/relapse-prevention skills; low-intensity prevention/peer self-help. Level 2: inconsistent coping skills and self-management; education plus relapse prevention, potentially intensive case management, pharmacotherapy management, ACT, and structured residence. Level 3: poor recognition of alcohol/other-drug risk and poor relapse coping; structured coping, motivation, assertive case/community management and possibly structured residence. Level 4: no relapse/addiction coping skills; near-term dangerous use/behavior; all level-3 services, with clinical 24-hour environment for acute cases and supportive 24-hour environment for non-dangerous chronic cases. **Source:** PDF pp.177-178, printed pp.162-163.
6. **Lingkungan tempat tinggal atau pemulihan** : Level 0: can cope in supportive environment. Level 1: passive/uninterested social support but can cope; no seriously risky environment; may need help finding support, building support through skills/childcare/transport. Level 2: unsupportive but usually able to cope with clinical structure; support as level 1 including assertive care management. Level 3: unsupportive and difficult even with clinical structure; more intensive supported housing, skills (coping/impulse control), assertive care management. Level 4: harmful environment; cannot cope and environment threatens safety; immediate separation, assertive care management, housing/environment change, and immediate safe place for dangerous acute cases. **Source:** PDF p.178, printed p.163.

#### Form instructions / decision flow (Lampiran 10 (v)-(vi), PDF pp.179-180; printed pp.164-165)

1. Give a check mark (V) to the client condition that fits in all six dimensions based on assessment.
2. Conduct additional interview with the client or relevant party (family, guardian, companion, or significant person) if needed for the most appropriate rating.
3. Check the service-level recommendation section according to each dimensionâ€™s rating.
   - Each dimension may indicate the same rehabilitation-service level; recommend accordingly.
   - If dimensions do not indicate the same level: further review indicators and confirm assessment quality; determine the level that provides the most benefit for the clientâ€™s situation/condition; if needed discuss with a supervisor or colleague.
4. Use the six-dimensional results to recommend service. Placement is adjusted to the service level with the most check marks for any domain, because the clientâ€™s needs can only be met at that level; a lower level may be inadequate. The page then prints **â€œContoh kasus:â€** but no case text is supplied in the scanned form area.
5. Explain the recommendation and reasons to the client, ask the clientâ€™s opinion, and explore the response, including willingness and reasons to accept/reject.

#### Operational definitions and levels (Lampiran 10 (v)-(viii), PDF pp.181-182; printed pp.166-167)

- Intoksikasi/putus zat: condition of intoxication, risk of substance symptoms, or withdrawal symptoms.
- Medical complications/condition: medical condition and effect on GPZ care.
- Emotional/behavioral/cognitive complications: psychiatric, psychological, behavioral, emotional or cognitive disorder and whether related to GPZ.
- Readiness to change: readiness/motivation to change and engage/start GPZ treatment.
- Relapse/continued use: consequence if treatment fails and capacity to manage urges/triggers.
- Living/recovery environment: whether home/work helps or harms treatment and available family/social support.

Service descriptions: Level 0 does not indicate further treatment, but brief intervention **SBIRT** or education is advised; Level 1 regular outpatient treatment is minimal frequency (at least 4 sessions) for generally mild dependence without physical/mental comorbidity; Level 2 is medium-to-high frequency outpatient (>4 sessions), for moderate/high dependence with recovery motivation/capital and no/mild comorbidity, potentially via medical referral; Level 3 is severe dependence needing inpatient/residential 24-hour supervision, with medical monitoring as needed but not necessarily 24 hours; Level 4 is severe dependence with moderate-to-severe comorbidity needing inpatient 24-hour medical supervision in hospital-based service. Outpatient treatment is stated as 4-12 sessions over 1-3 months. These are service descriptions, not an automatic prescription for a particular client. **Source:** PDF pp.181-182, printed pp.166-167.

#### Matrix-level recommendation table (Lampiran 10 (ix), PDF p.183; printed p.168)

This separate table is headed **â€œRekomendasi Pendekatan dan Tindakan Berdasarkan Dimensi dan Tingkatan Layanan pada Instrumen Kriteria Penempatan Klienâ€** and has columns 1-4 (no level-0 column): **1 Rawat Jalan; 2 Rawat Jalan Intensif; 3 Residensial/Pemantauan Medis; 4 Hospitalisasi**. Verbatim cell text:

| Dimension | 1 Rawat Jalan | 2 Rawat Jalan Intensif | 3 Residensial/Pemantauan Medis | 4 Hospitalisasi |
|---|---|---|---|---|
| Intoksikasi Akut dan atau potensi putus zat | Tidak ada risiko gejala putus obat | Risiko gejala putus zat minimal | Risiko gejala putus zat parah tapi dapat dikelola dalam tingkat 3 | Risiko gejala putus obat parah |
| Komplikasi dan kondisi medis | Tidak ada atau sangat stabil | Tidak ada atau tidak mengganggu rehabilitasi | Memerlukan pemantauan medis tidak intensif | Memerlukan perawatan medis 24 jam |
| Komplikasi dan kondisi emosional, perilaku dan kognitif | Tidak ada atau sangat stabil | Keparahan ringan dengan kemungkinan mengganggu proses rehabilitasi | Keparahan sedang yang memerlukan layanan 24 jam | Masalah berat yang memerlukan rawatan psikiatri 24 jam |
| Kesiapan berubah | Koperatif tapi perlu dimotivasi dan strategi pemantauan | Cukup resisten hingga memerlukan program terstruktur tapi belum sampai menghambat keberhasilan rajal | Resistensi tinggi meski konsekwensi negative dan memerlukan stategi motivasi intensif dalam layanan 24 jam | Masalah dalam dalam dimensi ini tidak mengindikasikan layanan tingkat 4 |
| Potensi kekambuhan atau penggunaan berlanjut | Mampu menjaga abstinensia dan tujuan pemulihan dengan dukungan minimal | Perburukan gejala adiksi dan kecenderungan tinggi mengalami kekambuhan tanpa pemantauan erat | Tidak dapat mengontrol penggunaan dalam layanan rehabilitasi yang lebih rendah intensitasnya | Masalah dalam dalam dimensi ini tidak mengindikasikan layanan tingkat 4 |
| Lingkungan hidup/pemulihan | Suportif dan memiliki keterampilan koping | Tidak suportif tapi terdapat struktur dan dapat diatasi oleh klien | Membahayakan pemulihan dan perlu keluar dari lingkungan tersebut; hambatan melakukan rajal | Masalah dalam dalam dimensi ini tidak mengindikasikan layanan tingkat 4 |

### Lampiran 11 : BA Pelaksanaan Asesmen Terpadu

#### Header and administrative fields (PDF p.184 / printed p.169)

- BNN letterhead: **BADAN NARKOTIKA NASIONAL REPUBLIK INDONESIA (NATIONAL NARCOTICS BOARD REPUBLIC OF INDONESIA)**; Jl. MT. Haryono No. 11 Cawang Jakarta Timur; Telepon: (62-21) 80871566, 80871567; Faksimili: (62-21) 80885225, 80871591, 80871592, 80871593; e-mail: info@bnn.go.id; website: www.bnn.go.id.
- Title: **BERITA ACARA : PELAKSANAAN ASESMEN TERPADU**.
- Number field: **NOMOR: BA/ â€¦....... / XI / 2025 / TAT / BNN**.
- Date/time/place fields: hari, tanggal, bulan, Tahun, sekira jam, bertempat di Sekretariat Tim Asesmen Terpadu Badan Narkotika Nasional Republik Indonesia.
- Chair fields: dipimpin oleh [name], dengan NRP [blank], selaku Ketua Tim Asesmen Terpadu (TAT) Tingkat Provinsi/Kabupaten/Kota [blank].
- Team roster: **Tim Medis**, entries 1-2 each with **Nama, Pangkat, NIP/NRP, Jabatan**; **Tim Hukum**, entries 1-3 each with the same four labels.

#### BA narrative/specimen fields (PDF pp.185-188 / printed pp.170-173)

The following are marked **(CONTOH)** in the source and are **specimen clinical/legal case narrative, not fixed rules or mandatory facts**: Hasil Pemeriksaan Tim Medis; Hasil Pemeriksaan Tim Hukum; Alat Bukti; Kesimpulan and the recommendation example. The specimen includes blank subject/identity and register/referral fields, medical history/use pattern, mental-health/withdrawal observation, legal-use/purchase narrative, laboratory evidence and a sample recommendation. Do not treat its named drug, dates, weights, diagnosis, six-month inpatient period, location, or clinical conclusions as defaults.

- Opening fields: SK Kepala BNN **Nomor** [blank] tentang Tim Asesmen Terpadu Tingkat [blank]; rapat terhadap [blank] dengan **nomor register asesmen** [blank]; referral **surat [blank] Nomor [blank] tanggal [blank] kepada Kepala BNNP/Kabupaten/Kota selaku Ketua TAT Tingkat Provinsi/Kabupaten/Kota [blank]**; **perihal Permohonan Pengajuan Asesmen Terpadu Tersangka a.n [blank]**.
- **1.a. Hasil Pemeriksaan Tim Medis: (CONTOH)** : narrative blanks for suspect name, sex/age, arrest/context, marital status, work, substance use onset/frequency/amount/recency/reasons, other substances/alcohol, withdrawal symptoms, housing/social/family context, and observed intoxication/cooperation.
- **2. Hasil Pemeriksaan Tim Hukum: (CONTOH)** : narrative blanks for work/income, drug type/amount/price, group purchase, source/seller/context, prior use, prior punishment, and whether selling/distribution occurred.
- **b. Alat Bukti: (CONTOH)**: (1) Surat Keterangan Pemeriksaan Narkoba from Pusat Laboratorium Narkotika BNN: number/date, signatory, â€œsample urine a.n.â€ followed by dotted identity blank, result; parent visual QA at 2200 px on actual PDF 186 confirmed that wording. (2) Hasil Pemeriksaan Laboratorium Pusat Laboratorium Narkotika: number/date, signatory, suspect/evidence identity; evidence lines for **Sampel kristal (kodifikasi A)** and **(kodifikasi B)**, seizure source and netto weights (the specimen prints 0,0250 gram and 0,0249 gram); examination samples A1/B1, method GC-MS, result/substance, Golongan I Nomor Urut 61, and statutory reference UU No.35 Tahun 2009.
- **3. Kesimpulan (CONTOH)** : conclusion that the person used Golongan I methamphetamina (sabu) for self, routine pattern/category, diagnosis example; whether there is an indication of illicit-trafficking network involvement; then recommendation fields. The specimen recommendation says inpatient rehabilitation for six months at Balai Besar Rehabilitasi BNN RI and case continuation under applicable law. This is explicitly a CONTOH, not a fixed treatment rule.
- Closing: â€œDemikian Berita Acara Rapat Pelaksanaan Asesmen Terpadu tersangka atas nama [blank] ini dibuat dengan sebenarnya atas kekuatan sumpah jabatan, kemudian ditutup dan ditandatangani di [blank] pada hari dan tanggal tersebut di atas.â€
- Signature labels: **Tim Hukum** three blocks (Jaksa Mudaâ€¦; AKBP; KBP/Penyidik BNN Ahliâ€¦), **Tim Medis** two blocks (each with NIPâ€¦), and **Ketua Tim Asesmen Terpadu Tingkat Provinsiâ€¦ : BRIGADIR JENDERAL POLISI**. Individual names/IDs are blanks in the specimen.

### Lampiran 12 : Surat Jawaban Permohonan Asesmen Terpadu

#### Page 189 / printed 174 (header and references)

Letterhead is the same BNN address/contact. Fields: **Nomor: ${nomor}**; **Jakarta, ${tanggal}**; **Klasifikasi: RAHASIA**; **Lampiran: 1(satu) berkas BA TAT**; **Perihal: Hasil Asesmen Terpadu Tersangka a.n [blank]**; recipient **Yth. Direktur Tindak Pidana Narkoba Bareskrim Polri (contoh), di Tempat**.

â€œ1. Rujukan:â€ lists: (a) UU No.35 Tahun 2009 tentang Narkotika; (b) Perpres No.47 Tahun 2019 amending Perpres No.23 Tahun 2010 on BNN; (c) Peraturan BNN No.1 Tahun 2022 amending Peraturan BNN No.5 Tahun 2020 on BNN organization/work procedure; (d) Joint Regulation No.1 Tahun 2014 on handling addicts/victims into rehabilitation; (e) Peraturan Kepala BNN No.11 Tahun 2014 on handling suspects/defendants who misuse/are addicted/victims into rehabilitation; (f) KEP/01/IX/DE/PB.06/2023/BERANTAS dated 15 September 2023 on the technical guidance; (g) BNN Province/Regency/City Head Decision No. [blank], dated [blank], on TAT at [blank], year [blank]; (h) letter of Direktur Tindak Pidana Narkoba Bareskrim Polri, **Nomor [blank], tanggal [blank], perihal [blank] (CONTOH)**.

#### Page 190 / printed 175 (identity, conclusions, recommendation and electronic signature)

- Section 2: TAT level [blank] has conducted assessment on **hari Senin, tanggal 03 November 2025** for tersangka/terdakwa)*, with fields **Nama, NIK, Tempat/Tgl lahir, Jenis Kelamin, Kewarganegaraan**.
- Section 3: conclusion fields for subject a.n [blank]; specimen wording says Golongan I MDMA (ekstasi) and methamphetamina (sabu), self-use, situational pattern/category, diagnosis F15, and a choice **tidak didapatkan/didapatkan** indication of illicit-trafficking network. The example is not a fixed clinical/legal finding.
- Section 4: TAT level [blank] recommendation to [blank]. (a) choice **tersangka/terdakwa)** and identity blank; care/recovery with **Rehabilitasi Rawat Inap/Jalan sebanyak [blank]** at **RS/Balai Besar Rehabilitasiâ€¦/Lembaga Rehabilitasi/Institusi Penerima Wajib Lapor Badan Narkotika Nasional [blank]**, and **WAJIB LAPOR** to Penyidik Polda/Polres [blank] until rehabilitation is complete. (b) the case is continued under applicable law, adjusted to the TAT case.
- Section 5: **Demikian untuk menjadi periksa.** Footnote: **)* pilih salah satu**.
- Electronic-signature block: **Ditandatangani Secara Elektronik Oleh: Direktur Pengawasan Tahanan dan Barang Bukti selaku Ketua TAT Tingkat Nasional (CONTOH)**, with `${qrcode}` and electronic-certification marks. This named role/signature block is a specimen signature authority display; final authority must be verified against the applicable TAT appointment/decision.
- **Tembusan: (CONTOH)** : 1. Kepala BNN; 2. Sekretaris Utama BNN; 3. Deputi Rehabilitasi BNN; 4. Plt. Inspektur Utama BNN; 5. Plt. Deputi Pemberantasan BNN; 6. Kabareskrim Polri; 7. Direktur B Jaksa Agung Muda Tindak Pidana Umum RI.

### Lampiran 13 : Surat Pernyataan Bebas Biaya Layanan Asesmen Terpadu

**PDF p.191 / printed p.176.** Title: **SURAT PERNYATAAN BEBAS BIAYA LAYANAN : TIM ASESMEN TERPADU**.

Identity fields: **Nama; Tempat/Tanggal Lahir; Agama; Alamat; Telp**. Fixed declaration text:

1. â€œBahwa saya tersangka dalam kasus Tindak Pidana Narkotikaâ€.
2. â€œSaya bersedia diperiksa oleh Tim Asesmen Terpadu yang terdiri dari Tim Medis dan Tim Hukum serta mengikuti alur pemeriksaan yang dilaksanakan oleh Tim Medis dan Tim Hukum.â€
3. â€œDalam mengikuti pemeriksaan yang dilaksanakan oleh Tim Asesmen Terpadu, saya tidak dipungut biaya dan tidak akan memberikan imbalan apapun kepada Tim Asesmen Terpadu.â€
4. â€œBahwa apabila kemudian hari ada pihak pemohon keluarga maupun kerabat mengaku memberikan imbalan kepada Tim Asesmen Terpadu, maka Tim Asesmen Terpadu tidak dapat dituntut secara hukum.â€

Closing: â€œDemikian surat pernyataan ini dibuat dengan penuh kesadaran dan tanpa paksaan dari pihak manapun.â€ Signature area: **Saksi** and **Yang Membuat Pernyataan**, with **(Materai)** under/at the makerâ€™s signature area. Date/place blanks are present above the signature blocks; the specimen visibly contains a â€œ2024â€ date artifact, which should not be treated as a fixed date.

### QA / limitations

- Collection coverage is complete for the assigned page range: **17/17 PDF pages**; processing coverage is complete for the **30 placement cells** (6Ã—5) plus the page-183 6Ã—4 recommendation matrix and form-field summaries.
- Parent QA resolved the earlier urine-specimen reading uncertainty on PDF 186: â€œsample urine a.n.â€ followed by a dotted blank. Lampiran 10 checklist symbols are transcription markers, not filled answers; the actual form is blank. No page was silently skipped.


---

<a id="section-021"></a>

## Lampiran D. Pencatatan, pelaporan, pembiayaan, dan monev

SOURCE adalah isi buku; RECOMMENDATION adalah kontrol implementasi. Bagian pembiayaan/monev dicatat sebagai spesifikasi fase berikutnya, bukan role login tambahan.

### Pembiayaan

#### Biaya layanan / client fee

Kategori: **SOURCE**. PDF 92 / cetak 77.

Biaya TAT dibebankan pada anggaran BNN; tidak diperbolehkan biaya tambahan kepada tersangka/terdakwa; ditandatangani surat pernyataan bebas biaya layanan.

**Catatan implementasi:** Pisahkan bukti pembiayaan DIPA/reimbursement dari pernyataan bebas biaya; jangan menagihkan ke klien.

#### Sumber pembiayaan

Kategori: **SOURCE**. PDF 92 / cetak 77.

DIPA BNN: Rupiah Murni; Hibah; sumber dana lain yang sah sesuai peraturan.

#### ATK dan Computer Supplies: 1 s.d 10 target TAT

Kategori: **SOURCE**. PDF 93 / cetak 78.

Rp 500.000 per tahun

#### ATK dan Computer Supplies: 11 s.d 20 target TAT

Kategori: **SOURCE**. PDF 93 / cetak 78.

Rp 750.000 per tahun

#### ATK dan Computer Supplies: 21 s.d 30 target TAT

Kategori: **SOURCE**. PDF 93 / cetak 78.

Rp 1.000.000 per tahun

#### ATK dan Computer Supplies: 31 s.d 40 target TA

Kategori: **SOURCE**. PDF 93 / cetak 78.

Rp 1.250.000 per tahun

**Anomali sumber:** Source label prints â€œTAâ€, not â€œTATâ€.

#### ATK dan Computer Supplies: 41 s.d 50 target TAT

Kategori: **SOURCE**. PDF 93 / cetak 78.

Rp 1.500.000 per tahun

#### ATK increment

Kategori: **SOURCE**. PDF 93 / cetak 78.

Setiap kelipatan 10 target TAT, ATK bertambah Rp 250.000

**Catatan implementasi:** Maintain target basis and annual period in approval file.

#### Konsumsi case conference

Kategori: **SOURCE**. PDF 93 / cetak 78.

Snack dan makan sesuai indeks SBM; pihak: Ketua TAT, Tim Medis, Tim Hukum, Sekretaris, Tim Sekretariat, serta K/L pendampingan anak bila relevan; dialokasikan berdasar perkiraan jumlah hari.

#### Honorarium Penanggung Jawab

Kategori: **SOURCE**. PDF 93 / cetak 78.

Deputi Pemberantasan BNN; dibayar setiap bulan; honorarium Tim Pelaksana Kegiatan yang ditetapkan pejabat setingkat Menteri, merujuk PMK SBM.

#### Honorarium Ketua TAT Nasional

Kategori: **SOURCE**. PDF 94 / cetak 79.

Direktur Pengawasan Tahanan dan Barang Bukti; dibayar setiap bulan; ditetapkan pejabat setingkat Menteri melalui Keputusan Kepala BNN.

#### Honorarium Ketua TAT Provinsi

Kategori: **SOURCE**. PDF 94 / cetak 79.

Kepala BNNP; dibayar setiap bulan; honorarium ditetapkan KPA melalui Keputusan Kepala BNNP.

#### Honorarium Ketua TAT Kabupaten/Kota

Kategori: **SOURCE**. PDF 94 / cetak 79.

Kepala BNN Kabupaten/Kota; dibayar setiap bulan; ditetapkan KPA melalui Keputusan Kepala BNN Kabupaten/Kota.

#### Honorarium Sekretaris

Kategori: **SOURCE**. PDF 94 / cetak 79.

Dibayar tiap bulan; merujuk PMK SBM Honorarium Tim Pelaksana Kegiatan dan Sekretariat.

#### Honorarium Tim Sekretariat

Kategori: **SOURCE**. PDF 95 / cetak 80.

Teks menyebut â€œPembayaran Honorarium Sekretaris dilakukan tiap bulanâ€; merujuk PMK SBM.

**Anomali sumber:** Likely label/body mismatch; source does not say â€œTim Sekretariatâ€ in payment sentence.

#### Biaya Asesmen

Kategori: **SOURCE**. PDF 95 / cetak 80.

Untuk Tim Medis dan Tim Hukum, daring maupun luring; sesuai Permenkes Nomor 17 Tahun 2023 tentang Penyelenggaraan Institusi Penerima Wajib Lapor.

#### Perjalanan dinas dalam kota

Kategori: **SOURCE**. PDF 95 / cetak 80.

Tim medis/hukum paling banyak 6 orang; transport lokal dan uang harian; personel BNN tidak diberi transport jika di kantor BNN; eksternal yang hadir di BNN atau kegiatan luar kantor 8 jam dapat uang harian; nominal PMK SBM.

#### Perjalanan dinas luar kota

Kategori: **SOURCE**. PDF 96 / cetak 81.

Teks badan menjelaskan kegiatan di luar jangkauan wilayah tugas; uang harian untuk tim eksternal/luar kantor yang memerlukan 8 jam; nominal PMK SBM.

**Anomali sumber:** Heading/body says â€œBiaya Perjalanan Dinas Dalam Kotaâ€ under item b; preserve as source inconsistency.

#### Transportasi koordinasi instansi terkait

Kategori: **SOURCE**. PDF 96 / cetak 81.

Koordinasi dengan Polri, Kejaksaan, lembaga rehabilitasi, K/L pendampingan anak dan instansi berkorelasi.

#### Rapat konsolidasi stakeholder

Kategori: **SOURCE**. PDF 96 / cetak 81.

Konsumsi, honor narasumber dari K/L luar BNN, transport narasumber/peserta menurut lokasi rapat dan status internal/eksternal.

#### Koordinasi kelembagaan

Kategori: **SOURCE**. PDF 97 / cetak 82.

Dalam kota: transport dalam kota; luar kota: transport perjalanan dinas luar kota dan uang harian.

#### Anggaran

Kategori: **SOURCE**. PDF 97 / cetak 82.

Dianggarkan pada DIPA BNN Pusat, Provinsi, Kabupaten/Kota.

#### Reimbursement eligibility

Kategori: **SOURCE**. PDF 97 / cetak 82.

Jika satker kekurangan anggaran tetapi masih menerima permohonan, koordinasi Sekretariat TAT Nasional; dapat mengajukan reimbursement ke satker yang masih memiliki anggaran.

**Anomali sumber:** Source repeats â€œmasih masih memiliki anggaranâ€.

#### Reimbursement administrative documents

Kategori: **SOURCE**. PDF 97 / cetak 82.

Dokumen TAT lengkap sesuai Bab III; surat permohonan reimbursement disertai Rencana Anggaran Biaya pelaksanaan TAT.

#### Daring/virtual/elektronik/online

Kategori: **SOURCE**. PDF 98 / cetak 83.

Layanan tetap dapat dibayar; transport petugas tidak dapat dibayar; konsumsi tidak dapat dibayar bila seluruh petugas daring; hybrid: konsumsi dapat dibayar bagi petugas di kantor BNN.

#### Anggaran tidak terserap

Kategori: **SOURCE**. PDF 98 / cetak 83.

Optimalisasi kegiatan pendukung; dapat dilakukan jika target TAT tercapai; revisi/realokasi ke satker lain yang membutuhkan atau BNN Pusat.

**Anomali sumber:** Source has â€œAsemenâ€ and â€œreimbusementâ€ typographical forms.

### Pencatatan

#### Rekam Data Klien TAT

Kategori: **SOURCE**. PDF 102 / cetak 87.

Dokumen pengajuan; formulir asesmen medis ditandatangani Tim Medis; formulir asesmen hukum ditandatangani Tim Hukum; Berita Acara Pelaksanaan; surat rekomendasi.

#### Kode registrasi klien

Kategori: **SOURCE**. PDF 103 / cetak 88.

Tahun - Kode Provinsi - Kode Kabupaten/Kota - xxx (no. urut klien) - TAT

#### Tahun

Kategori: **SOURCE**. PDF 103 / cetak 88.

Tahun layanan TAT dilakukan

#### Kode Provinsi

Kategori: **SOURCE**. PDF 103 / cetak 88.

Berdasarkan kode data wilayah terlampir

#### Kode Kabupaten/Kota

Kategori: **SOURCE**. PDF 103 / cetak 88.

Berdasarkan kode data wilayah terlampir

#### No Urut Klien

Kategori: **SOURCE**. PDF 103 / cetak 88.

Berdasarkan kedatangan klien

#### Contoh registrasi

Kategori: **SOURCE**. PDF 103 / cetak 88.

BNNP Jawa Barat: 2023 - 32 - 00 - xxx - TAT

### Data Klien TAT

#### Identitas Tersangka/Terdakwa : NIK/Nomor KTP/Nomor paspor

Kategori: **SOURCE**. PDF 104 / cetak 89.

NIK/Nomor KTP/Nomor paspor

#### Identitas : Nomor handphone

Kategori: **SOURCE**. PDF 104 / cetak 89.

Nomor handphone

#### Identitas : Jenis Kelamin

Kategori: **SOURCE**. PDF 104 / cetak 89.

Jenis Kelamin

#### Identitas : Usia

Kategori: **SOURCE**. PDF 104 / cetak 89.

Usia

#### Identitas : Pendidikan

Kategori: **SOURCE**. PDF 104 / cetak 89.

Pendidikan

#### Identitas : Pekerjaan

Kategori: **SOURCE**. PDF 104 / cetak 89.

Pekerjaan

#### Informasi Penangkapan : Pasal yang disangkakan

Kategori: **SOURCE**. PDF 104 / cetak 89.

Pasal yang disangkakan

#### Informasi Penangkapan : Tanggal Penangkapan

Kategori: **SOURCE**. PDF 104 / cetak 89.

Tanggal Penangkapan

#### Informasi Penangkapan : Jenis Narkoba terkait

Kategori: **SOURCE**. PDF 104 / cetak 89.

Jenis Narkoba terkait

#### Informasi Penangkapan : Jumlah

Kategori: **SOURCE**. PDF 104 / cetak 89.

Jumlah

#### Informasi Penangkapan : Satuan

Kategori: **SOURCE**. PDF 104 / cetak 89.

Satuan

#### Informasi Permohonan Asesmen : Instansi Pengirim

Kategori: **SOURCE**. PDF 104 / cetak 89.

Instansi Pengirim

#### Informasi Permohonan Asesmen : Tanggal Permohonan Asesmen

Kategori: **SOURCE**. PDF 104 / cetak 89.

Tanggal Permohonan Asesmen

#### Informasi Permohonan Asesmen : Klasifikasi Masa Permohonan Asesmen

Kategori: **SOURCE**. PDF 104 / cetak 89.

Klasifikasi Masa Permohonan Asesmen

#### Hasil Asesmen Tersangka/Terdakwa : Hasil Asesmen Medis

Kategori: **SOURCE**. PDF 104 / cetak 89.

Hasil Asesmen Medis

#### Hasil Asesmen Tersangka/Terdakwa : Hasil Asesmen Hukum

Kategori: **SOURCE**. PDF 104 / cetak 89.

Hasil Asesmen Hukum

#### Hasil Pelaksanaan Asesmen : Hasil Keputusan TAT

Kategori: **SOURCE**. PDF 104 / cetak 89.

Hasil Keputusan TAT

#### Hasil Pelaksanaan Asesmen : Lembaga Rehabilitasi

Kategori: **SOURCE**. PDF 104 / cetak 89.

Lembaga Rehabilitasi

#### Pelaksanaan Rekomendasi

Kategori: **SOURCE**. PDF 104 / cetak 89.

Dilaksanakan atau tidak

### Pelaporan

#### Channel data bulanan

Kategori: **SOURCE**. PDF 104 / cetak 89.

Tingkat Provinsi/Kabupaten/Kota menyampaikan terpusat setiap bulan melalui tautan Tim Sekretariat TAT Nasional dan input ke Sistem Informasi Narkoba (SIN) BNN.

#### Laporan Bulanan : Kabupaten/Kota

Kategori: **SOURCE**. PDF 105 / cetak 90.

Sekretariat Kab/Kota â†’ Ketua TAT Nasional dan Ketua TAT Provinsi.

#### Laporan Bulanan : Provinsi

Kategori: **SOURCE**. PDF 105 / cetak 90.

Sekretariat Provinsi menyusun laporan provinsi + kompilasi kab/kota â†’ Ketua TAT Nasional.

#### Laporan Bulanan : Nasional

Kategori: **SOURCE**. PDF 105 / cetak 90.

Sekretariat Nasional mengkompilasi provinsi dan kab/kota â†’ Ketua TAT Nasional.

#### Laporan Triwulanan : Kabupaten/Kota

Kategori: **SOURCE**. PDF 106 / cetak 91.

Sekretariat Kab/Kota â†’ Ketua TAT Nasional dan Ketua TAT Provinsi.

#### Laporan Triwulanan : Provinsi

Kategori: **SOURCE**. PDF 106 / cetak 91.

Sekretariat Provinsi menyusun laporan provinsi + kompilasi kab/kota â†’ Ketua TAT Nasional.

#### Laporan Triwulanan : Nasional

Kategori: **SOURCE**. PDF 106 / cetak 91.

Sekretariat Nasional mengkompilasi laporan provinsi/kab/kota â†’ Ketua TAT Nasional dan Penanggung Jawab TAT Nasional.

#### Laporan Tahunan : Kabupaten/Kota

Kategori: **SOURCE**. PDF 106 / cetak 91.

Sekretariat Kab/Kota â†’ Ketua TAT Nasional dan Ketua TAT Provinsi; tembusan Kepala Kejaksaan Negeri, Kapolres.

#### Laporan Tahunan : Provinsi

Kategori: **SOURCE**. PDF 106 / cetak 91.

Sekretariat Provinsi + kompilasi kab/kota â†’ Ketua TAT Nasional BNN; tembusan Kepala Kejaksaan Tinggi, Kapolda.

#### Laporan Tahunan : Nasional

Kategori: **SOURCE**. PDF 107 / cetak 92.

Sekretariat Nasional mengkompilasi; setelah disetujui Ketua TAT Nasional disampaikan kepada Penanggung Jawab TAT Nasional untuk ditandatangani; kepada Kepala BNN; tembusan JAM Pidum Kejaksaan Agung dan Kabareskrim Polri.

#### Diagram annual : tambahan tembusan

Kategori: **SOURCE**. PDF 108 / cetak 93.

Diagram Gambar 5 juga menampilkan Kepala Kantor Wilayah Hukum dan HAM pada Kab/Kota dan Provinsi, serta Direktur Jenderal Pemasyarakatan Kemenkumham RI pada Nasional.

**Anomali sumber:** Differs from prose p105-106, which does not list these recipients.

### Monitoring dan Evaluasi

#### Kelembagaan

Kategori: **SOURCE**. PDF 114 / cetak 99.

22-28=A; 15-21=B; 8-14=C; 7=D

**Catatan implementasi:** Retain item-level scores and category total; source does not state an overall aggregate grade.

#### Prosedur Kerja

Kategori: **SOURCE**. PDF 114 / cetak 99.

19-24=A; 13-18=B; 7-12=C; 6=D

**Catatan implementasi:** Retain item-level scores and category total; source does not state an overall aggregate grade.

#### Sumber Daya Manusia

Kategori: **SOURCE**. PDF 114 / cetak 99.

10-12=A; 7-9=B; 4-6=C; 3=D

**Catatan implementasi:** Retain item-level scores and category total; source does not state an overall aggregate grade.

#### Sarana dan Prasarana

Kategori: **SOURCE**. PDF 115 / cetak 100.

7-8=A; 5-6=B; 3-4=C; 2=D

**Catatan implementasi:** Retain item-level scores and category total; source does not state an overall aggregate grade.

#### Rekam Data Klien TAT

Kategori: **SOURCE**. PDF 115 / cetak 100.

13-16=A; 9-12=B; 5-8=C; 4=D

**Catatan implementasi:** Retain item-level scores and category total; source does not state an overall aggregate grade.

### Lampiran 15

#### NAMA SATKER

Kategori: **SOURCE**. PDF 203 / cetak 188.

BNN â€¦â€¦â€¦â€¦â€¦â€¦â€¦â€¦

#### Tanggal Pelaksanaan Supervisi

Kategori: **SOURCE**. PDF 203 / cetak 188.

blank date

#### Nama Ketua TAT

Kategori: **SOURCE**. PDF 203 / cetak 188.

blank

#### Nama Sekretaris TAT

Kategori: **SOURCE**. PDF 203 / cetak 188.

blank

#### Nama Tim Sekretariat TAT

Kategori: **SOURCE**. PDF 203 / cetak 188.

blank

#### TIM MEDIS : Dokter Spesialis Kesehatan Jiwa

Kategori: **SOURCE**. PDF 203 / cetak 188.

jumlah orang + nama

#### TIM MEDIS : Dokter Umum

Kategori: **SOURCE**. PDF 203 / cetak 188.

jumlah orang + nama

#### TIM MEDIS : Psikolog Klinis

Kategori: **SOURCE**. PDF 203 / cetak 188.

jumlah orang + nama

#### TIM HUKUM : Kejaksaan

Kategori: **SOURCE**. PDF 203 / cetak 188.

jumlah orang + up to 2 names

#### TIM HUKUM : Polri

Kategori: **SOURCE**. PDF 203 / cetak 188.

jumlah orang + up to 2 names

#### TIM HUKUM : BNN

Kategori: **SOURCE**. PDF 203 / cetak 188.

jumlah orang + up to 2 names

#### TIM HUKUM : Balai Pemasyarakatan

Kategori: **SOURCE**. PDF 203 / cetak 188.

jumlah orang + up to 2 names

#### DATA PETUGAS SUPERVISI

Kategori: **SOURCE**. PDF 204 / cetak 189.

NO; NAMA; ASAL INSTANSI; KETERANGAN (KATIM SUPERVISI/TIM HUKUM/TIM MEDIS)

#### DATA RESPONDEN

Kategori: **SOURCE**. PDF 204 / cetak 189.

RESPONDEN 1 dan 2: Nama Responden; Jabatan Responden

#### DATA LAYANAN ASESMEN TERPADU

Kategori: **SOURCE**. PDF 205 / cetak 190.

BNNP/KAB/KOTA; PERIODE: BULAN â€¦ s.d â€¦ TAHUN â€¦

#### TARGET

Kategori: **SOURCE**. PDF 205 / cetak 190.

blank numeric field

#### CAPAIAN

Kategori: **SOURCE**. PDF 205 / cetak 190.

blank numeric field

#### REALISASI ANGGARAN

Kategori: **SOURCE**. PDF 205 / cetak 190.

blank numeric/amount field

#### REKOMENDASI

Kategori: **SOURCE**. PDF 205 / cetak 190.

blank field

#### REHABILITASI LEMBAGA REHAB

Kategori: **SOURCE**. PDF 205 / cetak 190.

blank count/field

#### REHABILITASI RAWAT JALAN (under Lembaga Rehab)

Kategori: **SOURCE**. PDF 205 / cetak 190.

blank count/field

#### REHABILITASI RAWAT INAP (under Lembaga Rehab)

Kategori: **SOURCE**. PDF 205 / cetak 190.

blank count/field

#### REHABILITASI PROSES HUKUM LANJUT

Kategori: **SOURCE**. PDF 205 / cetak 190.

blank count/field

#### REHABILITASI RAWAT JALAN (under Proses Hukum Lanjut)

Kategori: **SOURCE**. PDF 205 / cetak 190.

blank count/field

#### REHABILITASI RAWAT INAP (under Proses Hukum Lanjut)

Kategori: **SOURCE**. PDF 205 / cetak 190.

blank count/field

#### TIDAK REHABILITASI

Kategori: **SOURCE**. PDF 205 / cetak 190.

blank count/field

#### LEMBAGA REHABILITASI YANG DIREKOMENDASIKAN : INSTANSI PEMERINTAH

Kategori: **SOURCE**. PDF 205 / cetak 190.

blank

#### LEMBAGA REHABILITASI YANG DIREKOMENDASIKAN : KOMPONEN MASYARAKAT

Kategori: **SOURCE**. PDF 205 / cetak 190.

blank

#### JUMLAH PELAKSANAAN REKOMENDASI TAT

Kategori: **SOURCE**. PDF 205 / cetak 190.

blank count

#### A.1

Kategori: **SOURCE**. PDF 205 / cetak 190.

BNN Provinsi/Kabupaten/Kota telah memiliki Tim Asesmen Terpadu yang ditetapkan dengan Surat Keputusan Kepala BNN Provinsi/Kabupaten/Kota dengan Komposisi sesuai ketentuan

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### A.2

Kategori: **SOURCE**. PDF 206 / cetak 191.

Pemahaman Tim Sekretariat Asesmen Terpadu terhadap kegiatan layanan Asesmen Terpadu pada BNN Provinsi/Kabupaten/Kota

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### A.3

Kategori: **SOURCE**. PDF 206 / cetak 191.

Tim Asesmen Terpadu BNN Provinsi/Kabupaten/Kota telah diberikan sosialisasi dan memiliki pemahaman terhadap Struktur Organisasi dan Tata Kerja (SOTK)

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### A.4

Kategori: **SOURCE**. PDF 206 / cetak 191.

Tim Asesmen Terpadu BNN Provinsi/Kabupaten/Kota memiliki anggaran layanan Tim Asesmen Terpadu (TAT)

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### A.5

Kategori: **SOURCE**. PDF 206 / cetak 191.

Penyerapan anggaran layanan Tim Asesmen Terpadu (TAT) BNN Provinsi/Kabupaten/Kota

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### A.6

Kategori: **SOURCE**. PDF 207 / cetak 192.

Ketersediaan SOP layanan Asesmen Terpadu di BNN Provinsi/Kabupaten/Kota

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### A.7

Kategori: **SOURCE**. PDF 207 / cetak 192.

Kesesuaian substansi SOP layanan Asesmen Terpadu di BNN Provinsi/Kabupaten/Kota dengan standar

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### B.1

Kategori: **SOURCE**. PDF 207 / cetak 192.

Kesesuaian penerimaan berkas pengajuan asesmen penerapan penerimaan awal klien dengan SOP (Pemberian informasi layanan, asesmen pengisian formulir registrasi, surat bebas biaya layanan)

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### B.2

Kategori: **SOURCE**. PDF 207 / cetak 192.

Penerapan SOP pada asesmen medis TAT di BNN Provinsi/Kabupaten/Kota

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

**Anomali sumber:** Source rubric levels 4 and 3 repeat identical wording (â€œmemiliki SOP ... dan diterapkan ...â€).

#### B.3

Kategori: **SOURCE**. PDF 208 / cetak 193.

Penerapan SOP pada asesmen hukum TAT di BNN Provinsi/Kabupaten/Kota

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

**Anomali sumber:** Source rubric levels 4 and 3 repeat identical wording (â€œmemiliki SOP ... dan diterapkan ...â€).

#### B.4

Kategori: **SOURCE**. PDF 208 / cetak 193.

Penerapan SOP pada rapat pembahasan kasus (case conference) TAT di BNN Provinsi/Kabupaten/Kota

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### B.5

Kategori: **SOURCE**. PDF 208 / cetak 193.

Penerapan SOP Pengeluaran Surat Rekomendasi Asesmen Terpadu di BNN Provinsi/Kabupaten/Kota

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### B.6

Kategori: **SOURCE**. PDF 208 / cetak 193.

BNN Provinsi/Kabupaten/Kota melakukan pencatatan dan pelaporan Data Klien TAT

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### C.1

Kategori: **SOURCE**. PDF 209 / cetak 194.

Tim Medis TAT BNN Provinsi/Kabupaten/Kota

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### C.2

Kategori: **SOURCE**. PDF 209 / cetak 194.

Tim Hukum TAT BNN Provinsi/Kabupaten/Kota

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

**Anomali sumber:** Source rubric levels 4, 3, 2, 1 repeat identical wording.

#### C.3

Kategori: **SOURCE**. PDF 210 / cetak 195.

Ketersediaan SDM sesuai kegiatan layanan Asesmen Terpadu

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### C.4

Kategori: **SOURCE**. PDF 210 / cetak 195.

Ketersediaan petugas Sekretariat TAT BNN Provinsi/Kabupaten/Kota

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### D.1

Kategori: **SOURCE**. PDF 210 / cetak 195.

Ketersediaan sarana prasarana ruang Sekretariat TAT BNN Provinsi/Kabupaten/Kota

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### D.2

Kategori: **SOURCE**. PDF 210 / cetak 195.

Kondisi ruangan layanan Asesmen Terpadu BNN Provinsi/Kabupaten/Kota

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### E.1

Kategori: **SOURCE**. PDF 211 / cetak 196.

Pengarsipan di Sekretariat TAT BNN Provinsi/Kabupaten/Kota

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### E.2

Kategori: **SOURCE**. PDF 211 / cetak 196.

Pencatatan rekam data di database Sekretariat TAT BNN Provinsi/Kabupaten/Kota (seluruh pencatatan rekam data mencantumkan nama, waktu, dan ditandatangani petugas)

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### E.3

Kategori: **SOURCE**. PDF 211 / cetak 196.

Input rekam data layanan TAT BNN Provinsi/Kabupaten/Kota ke dalam google drive TAT dan SIstem Informasi Narkoba

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

#### E.4

Kategori: **SOURCE**. PDF 212 / cetak 197.

Penyimpanan rekam data klien TAT BNN Provinsi/Kabupaten/Kota

**Catatan implementasi:** Record score 1-4 and preserve evidence; no correction inferred.

### Lampiran 1-3

#### SK provinsi : penerbit/penandatangan

Kategori: **SOURCE**. PDF 123 / cetak 108.

Kepala BNN Provinsi; selaku Ketua TAT Provinsi

#### SK kabupaten/kota : penerbit/penandatangan

Kategori: **SOURCE**. PDF 129 / cetak 114.

Kepala BNN Kabupaten/Kota; contoh Kota Batam; selaku Ketua TAT Kota Batam

#### KESATU

Kategori: **SOURCE**. PDF 126 / cetak 111.

Personal dalam lampiran ditunjuk sebagai TAT Provinsi: Sekretariat, Tim Medis, Tim Hukum; mulai Januari â€¦

#### KESATU

Kategori: **SOURCE**. PDF 132 / cetak 117.

Template kab/kota says personal ditunjuk sebagai TAT Provinsi; terdiri Sekretariat, Tim Medis, Tim Hukum; mulai Januari â€¦

**Anomali sumber:** Level mismatch in source.

#### Daftar Nama Tim

Kategori: **SOURCE**. PDF 127 / cetak 112.

NO; NAMA; PANGKAT/GOLONGAN/NRP/NIP; JABATAN; KESATUAN; roles Penanggung Jawab, Ketua, Tim Hukum, Tim Medis, Sekretaris, Tim Sekretariat

#### Daftar Nama Tim

Kategori: **SOURCE**. PDF 133 / cetak 118.

Same columns/roles for kabupaten/kota

#### Menimbang perubahan

Kategori: **SOURCE**. PDF 135 / cetak 120.

Keputusan Kepala BNNN Nomor KEP/494/V/KA/PB.06.00/2025 tentang TAT Nasional disebut sudah tidak sesuai karena perubahan personil

**Anomali sumber:** Typo â€œBNNNâ€; province change template references Nasional.

#### Menimbang letters

Kategori: **SOURCE**. PDF 135 / cetak 120.

Visible sequence a, c, d, e; b not present in extracted/source page

**Anomali sumber:** Missing letter b in source sequence.

#### KETIGA

Kategori: **SOURCE**. PDF 126 / cetak 111.

Biaya diatur Petunjuk Teknis ... Tahun 2023

**Anomali sumber:** Template 2025 points to 2023.

#### KETIGA

Kategori: **SOURCE**. PDF 132 / cetak 117.

Biaya diatur Petunjuk Teknis ... Tahun 2023

**Anomali sumber:** Template 2025 points to 2023.

#### KETIGA

Kategori: **SOURCE**. PDF 137 / cetak 122.

Biaya diatur ... melalui/Keempatâ€¦ Asesmen Terpadu Tahun 2023

**Anomali sumber:** Pagination/word flow artifact and 2023 reference.

#### Ditetapkan pada tanggal

Kategori: **SOURCE**. PDF 126 / cetak 111.

02 Desember 2025

**Anomali sumber:** Fixed example date in template; do not treat as universal due date.

#### Ditetapkan pada tanggal

Kategori: **SOURCE**. PDF 138 / cetak 123.

02 Desember 2025

**Anomali sumber:** Fixed example date in template; do not treat as universal due date.

#### Surat permohonan

Kategori: **SOURCE**. PDF 147 / cetak 132.

Kop instansi; Perihal; Kepada Ketua TAT; Dasar a-d; permohonan terhadap tersangka; persyaratan lampiran; Pemohon (Penyidik/Jaksa/Hakim)

### Lampiran 14

#### Lampiran 14 heading

Kategori: **SOURCE**. PDF 193 / cetak 178.

Lampiran 14 (ii), KODE/LOKASI two columns

**Catatan implementasi:** Use a versioned master code table and preserve source string for audit.

#### Lampiran 14 heading

Kategori: **SOURCE**. PDF 194 / cetak 179.

(iii), two columns

**Catatan implementasi:** Use a versioned master code table and preserve source string for audit.

#### Lampiran 14 heading

Kategori: **SOURCE**. PDF 195 / cetak 180.

(iv), two columns

**Catatan implementasi:** Use a versioned master code table and preserve source string for audit.

#### Lampiran 14 heading

Kategori: **SOURCE**. PDF 196 / cetak 181.

(v), two columns

**Catatan implementasi:** Use a versioned master code table and preserve source string for audit.

#### Lampiran 14 heading

Kategori: **SOURCE**. PDF 197 / cetak 182.

(vi), two columns

**Catatan implementasi:** Use a versioned master code table and preserve source string for audit.

#### Lampiran 14 heading

Kategori: **SOURCE**. PDF 198 / cetak 183.

(v), two columns continuation

**Catatan implementasi:** Use a versioned master code table and preserve source string for audit.

**Anomali sumber:** Repeated/out-of-sequence heading label.

#### Lampiran 14 heading

Kategori: **SOURCE**. PDF 199 / cetak 184.

(vi), two columns

**Catatan implementasi:** Use a versioned master code table and preserve source string for audit.

**Anomali sumber:** Repeated/out-of-sequence heading label.

#### Lampiran 14 heading

Kategori: **SOURCE**. PDF 200 / cetak 185.

(vii), two columns

**Catatan implementasi:** Use a versioned master code table and preserve source string for audit.

#### Lampiran 14 heading

Kategori: **SOURCE**. PDF 201 / cetak 186.

(viii), two columns

**Catatan implementasi:** Use a versioned master code table and preserve source string for audit.

#### Lampiran 14 heading

Kategori: **SOURCE**. PDF 202 / cetak 187.

(vii), one populated column

**Catatan implementasi:** Use a versioned master code table and preserve source string for audit.

**Anomali sumber:** Repeated/out-of-sequence heading label; one-column tail layout.

#### Region code list

Kategori: **SOURCE**. PDF 193 / cetak 178.

15.06 KAB. TANJUNG JABUNG BARAT then 15.08 KAB. BUNGO

**Catatan implementasi:** Use a versioned master code table and preserve source string for audit.

**Anomali sumber:** 15.07 is absent in source list; validate against versioned master, do not silently insert.

#### Region code list

Kategori: **SOURCE**. PDF 195 / cetak 180.

32.73 KOTA BANDUNG then 32.75 KOTA BEKASI

**Catatan implementasi:** Use a versioned master code table and preserve source string for audit.

**Anomali sumber:** 32.74 is absent in source list; validate against versioned master, do not silently insert.

#### Region code list

Kategori: **SOURCE**. PDF 201 / cetak 186.

81.04 KAB. BURU then 81.06 KAB. SERAM BAGIAN BARAT

**Catatan implementasi:** Use a versioned master code table and preserve source string for audit.

**Anomali sumber:** 81.05 is absent in source list; validate against versioned master, do not silently insert.

### Audit control

#### No-client-charge gate

Kategori: **RECOMMENDATION**. PDF  / cetak .

Signed free-service statement plus DIPA/reimbursement evidence; reject any client-billing field.

#### Versioned region-code master

Kategori: **RECOMMENDATION**. PDF  / cetak .

Validate source codes against a dated authoritative master and preserve source code/master date.

#### Annual recipient reconciliation

Kategori: **RECOMMENDATION**. PDF  / cetak .

Resolve prose-versus-diagram recipient difference before publication.

#### Sensitive-data access control

Kategori: **RECOMMENDATION**. PDF  / cetak .

Restrict identity, medical, and legal fields and retain SIN BNN submission evidence.

#### Monev score evidence

Kategori: **RECOMMENDATION**. PDF  / cetak .

Capture item-level score and evidence; do not compute an overall grade without an issued formula.

#### Rubric clarification

Kategori: **RECOMMENDATION**. PDF  / cetak .

Obtain written clarification for B.2/B.3/C.2 repeated rubric text.

#### SK release checklist

Kategori: **RECOMMENDATION**. PDF  / cetak .

Check level, effective date, cost-guide year, legal numbering, recipient copies, and signature placeholders.