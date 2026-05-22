// 简体中文 — 中国大陆地区使用的简化字
//
// 此文件以英文 (en.ts) 为基础,只翻译访客最常看到的核心字段。
// 未翻译的字段会自动回退到英文显示。需要新增翻译时,直接在下方
// 覆盖对应字段即可。

import { en } from "./en";

export const zh: typeof en = {
  ...en,

  nav: {
    ...en.nav,
    schedule: "赛程",
    registration: "报名",
    contact: "联系我们",
    archeryRecord: "射箭纪录",
    practiceSchedule: "练习日程",
    guideMap: "场馆导览图",
    scoreTarget: "成绩与靶位",
    archive2025: "2025 档案",
    archive2026: "2026 档案",
    gallery: "图库",
    more: "更多",
    groupAbout: "赛事介绍",
    groupParticipate: "参赛指引",
    groupResults: "成绩与媒体",
    invitation: "邀请函",
  },

  sectionNav: {
    ...en.sectionNav,
    schedule: "赛程",
    registration: "报名",
    visa: "签证",
    hotel: "酒店",
    rentcar: "租车",
    contact: "联系我们",
  },

  thanks: {
    ...en.thanks,
    kicker: "致谢词",
    title: "衷心感谢所有让本次赛事得以圆满举办的每一位",
    athletesLabel: "致参赛选手",
    athletesBody:
      "衷心感谢每一位参与 2026 GYEYANG OPEN 的射箭选手。你们注入每一支箭中的热情与竞技精神,让本届赛事成为难忘的回忆。祝各位归途平安,在下一个舞台再创辉煌。",
    staffLabel: "致工作人员、志愿者与赞助商",
    staffBody:
      "我们由衷感谢每一位支持本届赛事的工作人员、志愿者、赞助商,以及为我们加油的市民朋友。正是因为有你们在幕后的默默付出,「2026 GYEYANG OPEN」才能成为长留在世界射箭界心中的盛会。",
    signature: "2026 GYEYANG OPEN 组织委员会",
  },

  pageHeader: {
    ...en.pageHeader,
    invitationTitle: "邀请函",
    invitationSubtitle: "组织委员会主席的欢迎致辞",
    scheduleTitle: "赛事日程",
    scheduleSubtitle: "为期六天的赛事 · 2026 年 5 月 13 日 – 18 日",
    registrationTitle: "报名",
    registrationSubtitle: "选手、教练及官员的报名方式",
    visaTitle: "签证支持",
    visaSubtitle: "为国际参赛者提供的 K-ETA 及入境信息",
    hotelTitle: "合作酒店",
    hotelSubtitle: "赛事场馆附近,选手专属优惠住宿",
    rentcarTitle: "交通",
    rentcarSubtitle: "租车、TABA 出租车应用及国际出租车服务",
    contactTitle: "联系我们",
    contactSubtitle: "与本地组织委员会 (LOC) 联络",
  },

  home: {
    ...en.home,
    quickLinksTitle: "快捷链接",
    quickLinksSubtitle: "2026 赛事所需的一切信息",
    invitation: "邀请函",
    invitationDesc: "主席的致辞",
    schedule: "赛程",
    scheduleDesc: "六天赛事日程",
    registration: "报名",
    registrationDesc: "如何报名参赛",
    visa: "签证",
    visaDesc: "K-ETA 及入境支持",
    hotel: "酒店",
    hotelDesc: "提供优惠的合作酒店",
    rentcar: "交通",
    rentcarDesc: "租车与出租车",
    gallery: "图库",
    galleryDesc: "赛事照片 · 视频 · 海报",
    scoreboard: "成绩榜",
    scoreboardDesc: "实时成绩与靶位",
    contact: "联系我们",
    contactDesc: "与 LOC 联络",
    archive2026: "2026 赛事成绩",
    archive2026Desc: "获奖选手与完整成绩",
  },

  hero: {
    ...en.hero,
    date: "2026 年 5 月 13 日 (周三)",
    subtitle: "2026 GYEYANG OPEN — 国际射箭赛事",
    inProgress: "赛事进行中",
    ended: "赛事已结束",
    applyNow: "立即报名",
    viewResults: "查看成绩",
    viewGallery: "查看图库",
    openApp: "打开选手 APP",
    playVideo: "播放赛事宣传影片",
    nextEditionLabel: "下届赛事预告",
    nextEditionBody:
      "衷心感谢所有共襄盛举的每一位。2027 GYEYANG OPEN 的赛程与报名信息将在确认后于本页面公告,敬请期待。",
  },

  archive2026: {
    ...en.archive2026,
    pageTitle: "2026 GYEYANG OPEN 档案",
    pageSubtitle: "2026 年 5 月 13 – 18 日 | 韩国仁川",
    backToMain: "← 返回 GYEYANG OPEN 主页",
    scheduleTitle: "赛事日程",
    schedulePeriod: "2026 年 5 月 13 日 (周三) ~ 5 月 18 日 (周一)",
    day1Date: "2026 年 5 月 13 日 (周三)",
    day1Title: "官方练习 / 开幕式 / 队长会议",
    day2Date: "2026 年 5 月 14 日 (周四)",
    day2Title: "男女个人排名赛",
    day3Date: "2026 年 5 月 15 日 (周五)",
    day3Title: "个人淘汰赛 (1/48 – 1/16)",
    day4Date: "2026 年 5 月 16 日 (周六)",
    day4Title: "个人赛 (1/8, 1/4) & 团体赛 (1/12 – 1/4)",
    day5Date: "2026 年 5 月 17 日 (周日)",
    day5Title: "决赛 & 颁奖典礼 (KBS / SBS 直播)",
    day6Date: "2026 年 5 月 18 日 (周一)",
    day6Title: "外国选手个人赛 & 文化体验",
    medalistsTitle: "获奖选手",
    medalistsSubtitle:
      "反曲弓男子 / 女子 (个人 & 团体) 及外国选手个人项目的领奖台获奖名单。依射箭传统,铜牌由两位选手共同获得。",
    scoreboardTitle: "最终成绩",
    scoreboardDesc: "在 ianseo 查看完整成绩",
    scoreboardLink: "在 ianseo 查看 2026 成绩",
    venuesTitle: "比赛场地",
    venueQual: "预赛 — 桂阳亚运射箭场",
    venueFinal: "决赛 — 桂阳 Araon Suhyangwon",
    contactTitle: "LOC 联系方式",
    footer: "© 2026 GYEYANG OPEN. 版权所有。",
  },

  gallery: {
    ...en.gallery,
    pageTitle: "图库",
    pageSubtitle: "宣传影片、官方海报与赛事精彩瞬间",
    promoSectionTitle: "宣传影片",
    promoSectionDesc: "2026 GYEYANG OPEN — 世界级射箭选手汇聚仁川",
    postersSectionTitle: "官方海报",
    postersComingSoon: "赛事照片即将上线",
    photosSectionTitle: "赛事照片",
    photosDesc:
      "全球射箭爱好者共度的六天精彩瞬间。从专注的眼神到欢呼的时刻,与照片一同回顾 2026 GYEYANG OPEN。",
  },
};
