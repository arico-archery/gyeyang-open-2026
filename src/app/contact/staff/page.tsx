"use client";

import PageHeader from "@/components/PageHeader";
import { useInlineT } from "@/lib/i18n/inline";

/**
 * 임원/코치 사전 등록 안내 페이지.
 *
 * 선수가 아닌 임원·코치는 Google Form 으로 사전 등록을 받고, 현장에서
 * 최종 등록을 한다. 이 페이지는 사전 등록 안내 + QR + 현장 등록 흐름을
 * 한 화면에 정리한다.
 */

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScPPmdgPoG0of0x3DT1cbZsnzhMXL-ENhnoNUzx-04aaW6fMQ/viewform?pli=1";

// 외부 QR API — 인쇄·다운로드 시 충분한 해상도 확보
const QR_IMG_URL =
  "https://api.qrserver.com/v1/create-qr-code/?size=480x480&margin=8&data=" +
  encodeURIComponent(GOOGLE_FORM_URL);

export default function StaffContactPage() {
  const ti = useInlineT();

  return (
    <>
      <PageHeader
        kicker={ti("STAFF", "STAFF", "STAFF", "STAFF")}
        title={ti(
          "임원·코치 등록",
          "Staff & Coach Registration",
          "随队人员/教练 注册",
          "役員・コーチ登録"
        )}
        subtitle={ti(
          "선수 외 임원·코치 사전 등록 안내",
          "Pre-registration for staff and coaches",
          "选手以外随队人员、教练的预先注册指南",
          "選手以外の役員・コーチの事前登録について"
        )}
      />

      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          {/* Pre-registration card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
              {ti("임원/코치 등록", "Staff & Coach Registration", "随队人员/教练 注册", "役員・コーチ登録")}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
              <span className="font-semibold text-slate-900">
                {ti("예비 등록", "Pre-Registration", "预先注册", "事前登録")}:{" "}
              </span>
              {ti(
                "임원·코치의 예비 등록을 위해 아래 ",
                "To pre-register staff or coaches, please fill out the ",
                "如需为随队人员或教练进行预先注册,请填写下方的 ",
                "役員・コーチの事前登録のため、下記の "
              )}
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold underline underline-offset-4 hover:text-blue-700"
              >
                {ti("구글 폼", "Google Form", "Google 表单", "Google フォーム")}
              </a>
              {ti(
                "을 작성하거나 아래 QR 코드를 스캔하여 예비 등록을 완료해 주십시오. 확인이 완료되면, 예비 등록을 공식적으로 확정하는 이메일을 보내드리겠습니다.",
                ", or scan the QR code below. Once we have reviewed your submission, you will receive a confirmation email finalizing your pre-registration.",
                " 或扫描下方 QR 码完成预先注册。审核完成后,我们将向您发送确认邮件,正式确认您的预先注册。",
                " にご記入いただくか、下の QR コードをスキャンして事前登録を完了してください。確認後、事前登録の正式確定メールをお送りいたします。"
              )}
            </p>

            {/* QR + form button */}
            <div className="flex flex-col items-center gap-5 py-6 px-4 bg-slate-50 rounded-2xl">
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                aria-label={ti("구글 폼 열기", "Open Google Form", "打开 Google 表单", "Google フォームを開く")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={QR_IMG_URL}
                  alt="QR code — Google Form for Staff/Coach Pre-Registration"
                  width={240}
                  height={240}
                  className="w-60 h-60 bg-white p-3 rounded-xl shadow-sm"
                />
              </a>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {ti("구글 폼 열기", "Open Google Form", "打开 Google 表单", "Google フォームを開く")}
                </a>
              </div>
              <p className="text-xs text-slate-400 text-center max-w-md">
                {ti(
                  "QR 코드를 휴대폰 카메라로 스캔하면 동일한 폼이 열립니다.",
                  "Scan the QR code with your phone camera to open the same form.",
                  "用手机相机扫描 QR 码即可打开相同表单。",
                  "QR コードをスマホのカメラでスキャンすると同じフォームが開きます。"
                )}
              </p>
            </div>
          </div>

          {/* On-site final registration card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
              {ti(
                "현장 최종 등록",
                "On-Site Final Registration",
                "现场最终注册",
                "現地最終登録"
              )}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {ti(
                "현장에 도착하시면, 직원이 신분을 확인하고 AD 카드를 제공해 드립니다.",
                "Upon arrival, our staff will verify your identity and issue your AD card.",
                "抵达现场后,工作人员将核验您的身份并发放 AD 卡。",
                "現地に到着されましたら、スタッフが本人確認のうえ AD カードをお渡しします。"
              )}
            </p>
          </div>

          {/* Side link — tournament inquiry */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-500">
              {ti(
                "선수 참가신청이나 일반 대회 문의는",
                "For athlete registration or general tournament inquiries,",
                "如需进行选手报名或其他赛事咨询,",
                "選手の参加申込や一般的なお問い合わせは"
              )}{" "}
              <a
                href="/contact"
                className="text-blue-600 font-semibold underline underline-offset-4 hover:text-blue-700"
              >
                {ti("대회 문의", "the contact page", "联系页面", "お問い合わせ")}
              </a>
              {ti("로 이동해 주세요.", " instead.", "。", "へお進みください。")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
