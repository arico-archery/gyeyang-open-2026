"use client";

import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { useInlineT } from "@/lib/i18n/inline";
import { useI18n } from "@/lib/i18n/context";

export default function ContactPage() {
  const { t } = useI18n();
  const ti = useInlineT();

  return (
    <>
      <PageHeader
        kicker="LOC"
        title={t("pageHeader.contactTitle")}
        subtitle={t("pageHeader.contactSubtitle")}
      />

      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* Intro */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              {ti(
                "대회 문의",
                "Tournament Inquiry",
                "赛事咨询",
                "大会に関するお問い合わせ"
              )}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              {ti(
                "대회 운영·참가·시설 등 어떤 문의든 아래 폼을 통해 보내주세요. 운영본부(LOC)에서 확인 후 회신드립니다.",
                "Send any question about the tournament — operations, participation, or facilities — through the form below. The LOC will reply via email.",
                "如有任何关于赛事运营、参赛、场地等的咨询,请通过下方表单提交。本地组织委员会 (LOC) 将通过邮件回复。",
                "大会運営・参加・施設等、ご質問は下記フォームよりお送りください。組織委員会 (LOC) より、メールにて回答いたします。"
              )}
            </p>
          </div>

          {/* Contact form */}
          <ContactForm />

          {/* LOC direct contact card — kept for users who prefer messaging apps */}
          <div className="mt-12 max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-3">
              {ti("LOC 직접 연락처", "LOC Direct Contact", "LOC 直接联系", "LOC 直接連絡先")}
            </p>
            <dl className="space-y-2 text-sm text-slate-700">
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 font-semibold text-slate-500">{ti("이름", "Name", "姓名", "お名前")}</dt>
                <dd>Vivian</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 font-semibold text-slate-500">WhatsApp</dt>
                <dd>
                  +82-10-2124-0016{" "}
                  <span className="text-xs text-slate-400">
                    {ti("(문자 메시지만 가능)", "(text messages only)", "(仅限文字消息)", "(テキストメッセージのみ)")}
                  </span>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 font-semibold text-slate-500">{ti("이메일", "Email", "邮箱", "メール")}</dt>
                <dd>
                  <a
                    href="mailto:gyeyangopen@gmail.com"
                    className="text-blue-600 underline underline-offset-4 hover:text-blue-700"
                  >
                    gyeyangopen@gmail.com
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 font-semibold text-slate-500">{ti("언어", "Languages", "语言", "対応言語")}</dt>
                <dd>
                  {ti("한국어, 영어", "Korean, English", "韩语, 英语", "韓国語, 英語")}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
