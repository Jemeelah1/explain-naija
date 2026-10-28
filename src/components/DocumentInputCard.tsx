"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Languages,
  Copy,
  Check,
  RotateCcw,
  Info,
  FileText,
} from "lucide-react";

export interface BreakdownContent {
  summary: string;
  whoIsAffected: string;
  actionSteps: string[];
}

export interface DocumentSample {
  id: string;
  label: string;
  title: string;
  category: string;
  originalText: string;
  sampleBreakdown: BreakdownContent; // for backward compatibility
  translations: Record<string, BreakdownContent>;
}

export const SECTION_LABELS: Record<
  string,
  {
    plainWords: string;
    whoIsAffected: string;
    nextSteps: string;
    outputHeading: string;
    noticeTitle: string;
    noticeDesc: string;
  }
> = {
  "simple-english": {
    plainWords: "1. In Plain Words",
    whoIsAffected: "2. Who Is Affected",
    nextSteps: "3. Your Next Steps",
    outputHeading: "Standard Output Structure in Simple English",
    noticeTitle: "Document Verified & Ready for Simple English",
    noticeDesc:
      "Explain Naija simplifies complex circulars into plain language, impacted groups, and numbered action items.",
  },
  pidgin: {
    plainWords: "1. For Simple Pidgin",
    whoIsAffected: "2. People Wey Dis Matter Concern",
    nextSteps: "3. Wetin You Gats Do Next",
    outputHeading: "As E Dey Go for Nigerian Pidgin (Wazobia)",
    noticeTitle: "Document Don Set for Nigerian Pidgin",
    noticeDesc:
      "Explain Naija don breakdown this whole matter put inside clear Nigerian Pidgin wey everybody go understand sharp-sharp.",
  },
  yoruba: {
    plainWords: "1. Ní Èdè Yorùbá Tó Yé Kiri",
    whoIsAffected: "2. Àwọn Tí Ọ̀rọ̀ Yìí Kàn",
    nextSteps: "3. Àwọn Ohun Tó Yẹ Kí O Ṣe Lẹ́sẹ̀kẹsẹ̀",
    outputHeading: "Àkópọ̀ Ní Èdè Yorùbá (Translated in Yorùbá)",
    noticeTitle: "A ti túmọ̀ ìwé yìí sí Èdè Yorùbá kedere",
    noticeDesc:
      "Explain Naija ti yọ gbogbo èdè òfin tó díjú kúrò, ó sì ti ṣe àlàyé rẹ̀ ní Èdè Yorùbá tó yé gbogbo ènìyàn.",
  },
  hausa: {
    plainWords: "1. A Sauƙaƙe da Harshen Hausa",
    whoIsAffected: "2. Waɗanda Wannan Sanarwa Ta Shafa",
    nextSteps: "3. Matakan da Ya Kamata Ka Ɗauka Yanzu",
    outputHeading: "Fassarar Bayani da Harshen Hausa",
    noticeTitle: "An fassara wannan bayanin zuwa Harshen Hausa",
    noticeDesc:
      "Explain Naija ta saukaka dukkan kalmomin doka masu wuya, ta mayar da su bayani mai sauki a cikin Harshen Hausa.",
  },
  igbo: {
    plainWords: "1. N'Okwu Dị Mfe nke Asụsụ Igbo",
    whoIsAffected: "2. Ndị Ihe A Metụtara",
    nextSteps: "3. Ihe Ndị Kwesịrị Ka I Mee Ozugbo",
    outputHeading: "Nkọwa N'Asụsụ Igbo (Translated in Asụsụ Igbo)",
    noticeTitle: "A kọwaala akwụkwọ a n'Asụsụ Igbo",
    noticeDesc:
      "Explain Naija ewepụla okwu iwu niile gbagwojuru anya ma kọwaa ya n'ụzọ dị mfe nke onye ọ bụla ga-aghọta n'Asụsụ Igbo.",
  },
};

const CUSTOM_TEXT_TRANSLATIONS: Record<string, BreakdownContent> = {
  "simple-english": {
    summary:
      "This document outlines specific compliance requirements and regulatory guidelines. In plain terms, it instructs you to align your records and take timely action to remain compliant with state or federal regulations.",
    whoIsAffected:
      "Citizens, registered businesses, contractors, and individuals directly subject to the regulatory directives mentioned.",
    actionSteps: [
      "Review your current documentation to confirm it aligns with the stated requirements.",
      "Take note of all statutory dates and cut-off deadlines mentioned in the document.",
      "Verify directly with official agency desks or state registry portals before making payments.",
    ],
  },
  pidgin: {
    summary:
      "Dis official paper dey talk about important government rules wey concern your business, pocket, or rights as citizen. In simple words: dem dey tell you make you arrange your documents well and follow di correct steps make government penalty no catch you.",
    whoIsAffected:
      "Everyday Nigerians, market traders, small business owners, and anybody wey di announcement mention.",
    actionSteps: [
      "Check your papers and records make you sure say everything complete as dem talk.",
      "Mark di deadline for calendar make date no pass you by.",
      "No go pay any middleman or fake agent—verify directly from di official government office.",
    ],
  },
  yoruba: {
    summary:
      "Ìwé àṣẹ yìí gbé àwọn ìlànà àti òfin tuntun jáde tí ó kan owó, iṣẹ́, tàbí ẹ̀tọ́ rẹ gẹ́gẹ́ bí ọmọ Nàìjíríà. Ní ṣókí: ó pàṣẹ fún ọ láti tò àwọn ìwé rẹ lẹ́sẹẹsẹ kí o sì ṣe ohun tí ìjọba béèrè fún kí ìtanràn má baà wáyé.",
    whoIsAffected:
      "Gbogbo àwọn ará ìlú, àwọn oníṣòwò, àti àwọn tí ọ̀rọ̀ àkọsílẹ̀ tàbí ìwé ìpínlẹ̀ yìí kàn tààràtà.",
    actionSteps: [
      "Ṣàyẹ̀wò gbogbo àwọn ìwé tí o ní lọ́wọ́ láti rí i dájú pé wọ́n péye bí ìjọba ṣe béèrè.",
      "Ṣàkíyèsí ọjọ́ ìgbẹ̀yìn (deadline) tí a fún ni kí àkókò má baà kọjá ọ́.",
      "Bí ó bá jẹ́ ọ̀rọ̀ owó tàbí ìwé-ẹ̀rí, lọ sí ọ́fíìsì ìjọba tòótọ́ fún ìfọwọ́sí kí o má baà bọ́ sọ́wọ́ àwọn gbajúmọ̀.",
    ],
  },
  hausa: {
    summary:
      "Wannan sanarwa tana kunshe da muhimman dokoki da jagororin gwamnati da suka shafi hakkokinku, kasuwancinku, ko kudadenku. A saukake: tana umartar ku da ku gyara takardunku sannan ku bi ka'idojin da aka shimfida don kauce wa tara ko hukunci.",
    whoIsAffected:
      "Dukkan yan Najeriya, kanana da manyan yan kasuwa, da duk wanda wannan sanarwa ta shafi bangaren ayyukansa.",
    actionSteps: [
      "Bincika takardun ku don tabbatar da cewa suna cika dukkan sharruddan da aka zayyana.",
      "Kula da ranar karewa (deadline) don tabbatar da cewa ba ku makara ba.",
      "Kada ku biya kudi ga kowane wakili na bogi; ku tabbatar kai tsaye a ofishin gwamnati mai lamba.",
    ],
  },
  igbo: {
    summary:
      "Akwụkwọ ọchịchị a nwere iwu na ụkpụrụ dị mkpa metụtara azụmahịa gị, ego gị, ma ọ bụ ikike gị dị ka nwa amaala Naịjirịa. N'okwu dị mfe: ọ na-agwa gị ka ị hazie akwụkwọ gị nke ọma ma mezuo ihe achọrọ ka ntaramahụhụ ghara ịdakwasị gị.",
    whoIsAffected:
      "Ụmụ amaala Naịjirịa niile, ndị nwe obere na nnukwu azụmahịa, na onye ọ bụla ọkwa a kpọtụrụ aha.",
    actionSteps: [
      "Nyochaa akwụkwọ gị niile ugbu a iji hụ na ha dabara n'ụkpụrụ e depụtara n'akwụkwọ a.",
      "Rịba ama ụbọchị ikpeazụ e nyere maka usoro a ka oge ghara ịgafe gị.",
      "Akwụla onye ọ bụla ego ọrụ n'okporo ụzọ; gaa n'ọfịs gọọmentị ma ọ bụ ebe nrụọrụ weebụ kwesịrị ekwesị.",
    ],
  },
};

export const SAMPLE_DOCUMENTS: DocumentSample[] = [
  {
    id: "tax-reform",
    label: "Tax Reform Notice",
    title: "Federal Inland Revenue Service (FIRS) Circular 2025/03",
    category: "Government Announcement",
    originalText:
      "Pursuant to the provisions of Section 40 of the Finance Act and subsequent statutory amendments, all designated Small and Medium Enterprises (SMEs) with an aggregate turnover exceeding the statutory threshold of ₦50,000,000 per annum are hereby mandated to effect withholding adjustments on qualifying vendor disbursements, notwithstanding prior administrative waivers, failure of which shall incur compound fiscal penalties under Section 62(b).",
    sampleBreakdown: {
      summary:
        "If your registered business makes more than ₦50 Million in a year, you must now deduct tax before paying your suppliers or contractors and remit it to the government. Old exemptions no longer apply.",
      whoIsAffected:
        "Registered SMEs making over ₦50m yearly, business owners paying contractors, and vendors.",
      actionSteps: [
        "Check your 12-month bank inflows to confirm if your turnover crossed ₦50m.",
        "Deduct the withholding percentage before paying qualifying invoices.",
        "Remit the deducted funds to FIRS on or before the 21st of every month to avoid fines.",
      ],
    },
    translations: {
      "simple-english": {
        summary:
          "If your registered business makes more than ₦50 Million in a year, you must now deduct tax before paying your suppliers or contractors and remit it to the government. Old exemptions no longer apply.",
        whoIsAffected:
          "Registered SMEs making over ₦50m yearly, business owners paying contractors, and vendors.",
        actionSteps: [
          "Check your 12-month bank inflows to confirm if your turnover crossed ₦50m.",
          "Deduct the withholding percentage before paying qualifying invoices.",
          "Remit the deducted funds to FIRS on or before the 21st of every month to avoid fines.",
        ],
      },
      pidgin: {
        summary:
          "If your registered business dey make pass ₦50 Million for one whole year, government talk say you gats deduct tax commot before you pay your suppliers or contractors, then send di money give FIRS. All those old excuses or waivers no dey work again.",
        whoIsAffected:
          "Every registered SME business wey dey make pass ₦50m yearly, contractors, and vendors.",
        actionSteps: [
          "Check your bank statement for di past 12 months make you sure say money wey enter cross ₦50m.",
          "Cut out di withholding tax percentage before you pay any vendor invoice.",
          "Pay di deducted money go FIRS bank account before di 21st of every month make heavy penalty no catch you.",
        ],
      },
      yoruba: {
        summary:
          "Bí iṣòwò rẹ bá ń wọlé tó ju ₦50 Mílíọ̀nù lọ láàárín ọdún kan, ìjọba ti pàṣẹ pé o gbọ́dọ̀ yọ owó orí (withholding tax) kúrò nínú owó tí o fẹ́ san fún àwọn tó ń pèsè ọjà tàbí àwọn alagbaṣe rẹ kí o sì san án fún àjọ FIRS. Àwọn àyè àkókò àtijọ́ kò sí mọ́.",
        whoIsAffected:
          "Àwọn ilé-iṣẹ́ kéékèèké tí wọ́n ti forúkọsílẹ̀ tí owó wọn ju ₦50m lọ lọ́dún, àti àwọn oníṣòwò tó ń sanwó fún àwọn alagbaṣe.",
        actionSteps: [
          "Ṣàyẹ̀wò àkọsílẹ̀ owó ilé-ìfowópamọ́ (bank statement) rẹ fún oṣù méjìlá sẹ́yìn láti mọ̀ bóyá owó tó wọlé kọjá ₦50m.",
          "Yọ ìpín owó orí tí wọ́n sọ kúrò kí o tó san owó ìwé-owó (invoice) àwọn tó ṣe iṣẹ́ fún ọ.",
          "San owó náà wọlé fún àjọ FIRS kí ọjọ́ kọkànlélógún (21st) oṣù tó kọjá kí wọ́n má baà fìyà owó orí jẹ ọ́.",
        ],
      },
      hausa: {
        summary:
          "Idan kasuwancin ku da aka yi wa rijista yana samun kuɗin shiga da ya wuce Naira Miliyan 50 (₦50,000,000) a shekara, gwamnati ta wajabta muku cire haraji (withholding tax) kafin ku biya yan kwangila ko masu kawo muku kaya, sannan ku tura wa hukumar FIRS. Ba a sake amincewa da tsoffin uzuri ba.",
        whoIsAffected:
          "Kanana da matsakaitan masana'antu masu samun sama da miliyan 50 a shekara, da masu biyan yan kwangila.",
        actionSteps: [
          "Duba bayanan asusun bankin ku na watanni 12 da suka gabata don tabbatar da adadin kudin da ya shigo.",
          "Cire kaso na haraji da aka kayyade kafin biyan kowane lissafin kudi (invoice).",
          "Aika kudin da kuka cire zuwa asusun FIRS kafin ranar 21 ga kowane wata don kauce wa tara da hukunci.",
        ],
      },
      igbo: {
        summary:
          "Ọ bụrụ na azụmahịa gị debanyere aha na-enweta ihe karịrị nde Naira iri ise (₦50,000,000) n'ime otu afọ, gọọmentị ekwuola na ị ga-ewepụ ụtụ isi (withholding tax) tupu ị kwụọ ndị na-ebubata ngwa ahịa ma ọ bụ ndị na-arụrụ gị ọrụ ụgwọ, wee ziga ya nye FIRS. Oge mgbaghara agwụla.",
        whoIsAffected:
          "Ụlọ ọrụ azụmahịa niile debanyere aha na-enweta ihe karịrị ₦50m n'afọ, na ndị nwe ahịa na-akwụ ndị ọrụ ụgwọ.",
        actionSteps: [
          "Lelee nkwupụta ụlọ akụ (bank statement) gị nke ọnwa iri na abụọ gara aga iji hụ ma ego batara karịrị ₦50m.",
          "Wepụ pasentị ụtụ isi a chọrọ tupu ị kwụọ ụgwọ akwụkwọ ọnụahịa ọ bụla.",
          "Kwufee ego ahụ ewepụtara nye FIRS tupu ma ọ bụ na ụbọchị nke iri abụọ na otu (21st) nke ọnwa ọ bụla iji zere ntaramahụhụ.",
        ],
      },
    },
  },
  {
    id: "msme-grant",
    label: "MSME Federal Grant",
    title: "Presidential Conditional Grant Scheme & Palliative Fund",
    category: "Grants & Opportunities",
    originalText:
      "The Federal Government hereby announces tranche allocations under the Presidential Conditional Grant Programme. Eligible nano-businesses within the 774 Local Government Areas are invited to submit verified National Identity Numbers (NIN), Bank Verification Numbers (BVN), and operational proof of commercial domicile to access non-repayable disbursement vouchers capped at ₦50,000 per qualifying applicant.",
    sampleBreakdown: {
      summary:
        "The Federal Government is giving free ₦50,000 grants (you don't have to pay it back) to small shop owners, artisans, and street traders in all 774 local governments across Nigeria.",
      whoIsAffected:
        "Small traders, artisans, food vendors, hairdressers, vulcanizers, and dry cleaners across Nigeria.",
      actionSteps: [
        "Ensure your name on your NIN matches your BVN and bank account exactly.",
        "Take a clear photo of your store, shop, or workspace as proof of business.",
        "Apply through the official portal using only your own phone number—never pay anyone an agent fee.",
      ],
    },
    translations: {
      "simple-english": {
        summary:
          "The Federal Government is giving free ₦50,000 grants (you don't have to pay it back) to small shop owners, artisans, and street traders in all 774 local governments across Nigeria.",
        whoIsAffected:
          "Small traders, artisans, food vendors, hairdressers, vulcanizers, and dry cleaners across Nigeria.",
        actionSteps: [
          "Ensure your name on your NIN matches your BVN and bank account exactly.",
          "Take a clear photo of your store, shop, or workspace as proof of business.",
          "Apply through the official portal using only your own phone number—never pay anyone an agent fee.",
        ],
      },
      pidgin: {
        summary:
          "Federal Government dey dash small business owners, artisans, and street traders free ₦50,000 grant (free money wey you no go pay back at all) for all di 774 Local Government Areas for Nigeria.",
        whoIsAffected:
          "Mama put, barber, hairdresser, vulcanizer, dry cleaner, and any small business owner for Naija.",
        actionSteps: [
          "Make sure say di name on top your NIN match your BVN and your bank account well-well.",
          "Snap clear picture of your shop, kiosk, or work corner as proof say you get business.",
          "Use only your own personal phone number apply for di official website—no ever give agent kobo!",
        ],
      },
      yoruba: {
        summary:
          "Ìjọba Àpapọ̀ ń pèsè ẹ̀bùn owó ₦50,000 ọ̀fẹ́ (owó tí o kò ní san padà láéláé) fún àwọn oníṣòwò kéékèèké, àwọn oníṣẹ́-ọwọ́, àti àwọn olùtàjà ojú-pópó ní gbogbo ìjọba ìbílẹ̀ 774 ní Nàìjíríà.",
        whoIsAffected:
          "Àwọn olùtàjà oúnjẹ, onídìrí, alágbafo, àwọn oníṣẹ́ táyà, àti gbogbo oníṣòwò kéékèèké ní Nàìjíríà.",
        actionSteps: [
          "Rí i dájú pé orúkọ tó wà lórí NIN rẹ bá èyí tó wà lórí BVN àti àkọọ́lẹ̀ ilé-ìfowópamọ́ rẹ mu pẹ́kípẹ́kí.",
          "Ya àwòrán ṣọ́ọ̀bù, ibi ìtajà, tàbí ibi iṣẹ́ rẹ kedere gẹ́gẹ́ bí ẹ̀rí pé o ní iṣẹ́ lọ́wọ́.",
          "Fi ẹ̀rọ ayélujára ìjọba tòótọ́ bẹ̀rẹ̀ sí í fọwọ́bọ̀wé pẹ̀lú nọ́mbà ẹ̀rọ ìbánisọ̀rọ̀ tìrẹ—má ṣe san kọ́bọ̀ fún aṣojú (agent) kankan.",
        ],
      },
      hausa: {
        summary:
          "Gwamnatin Tarayya na ba da tallafin kyauta na Naira 50,000 (ba bashi ba ne, ba za a biya ba) ga kananan yan kasuwa, magina, da masu sana'o'in hannu a dukkan kananan hukumomi 774 na Najeriya.",
        whoIsAffected:
          "Masu sayar da abinci, masu gyaran gashi, makanikai, masu wanki da guga, da kananan yan kasuwa.",
        actionSteps: [
          "Tabbatar da cewa sunan da ke kan katin NIN dinka yayi daidai da na BVN da asusun bankinka.",
          "Dauki hoton kanti, teburi, ko wurin da kake sana'a a matsayin shaidar aiki.",
          "Yi rajista ta hanyar shafin yanar gizo na hukuma da kanka ta amfani da lambar wayarka—karka biya kowa kudin wakilci.",
        ],
      },
      igbo: {
        summary:
          "Gọọmentị Etiti na-enye onyinye ego ₦50,000 n'efu (nke ị na-agaghị akwụghachi) nye ndị nwe obere ahịa, ndị omenkà, na ndị na-ere ahịa n'okporo ụzọ n'ime gọọmentị ime obodo 774 niile dị na Naịjirịa.",
        whoIsAffected:
          "Ndị na-esi nri na-ere, ndị na-akpụ isi, ndị na-edozi ụgbọ ala, na ndị niile na-azụ obere ahịa na Naịjirịa.",
        actionSteps: [
          "Hụ na aha dị na NIN gị dabara kpọmkwem na nke BVN na akaụntụ ụlọ akụ gị.",
          "Seta foto doro anya nke ụlọ ahịa ma ọ bụ ebe ị na-arụ ọrụ dị ka ihe akaebe nke azụmahịa gị.",
          "Tinye akwụkwọ site na ebe nrụọrụ weebụ gọọmentị site na iji nọmba ekwentị nke gị—akwụla onye ọ bụla ego ọrụ.",
        ],
      },
    },
  },
  {
    id: "land-title",
    label: "Land Registry Notice",
    title: "State Ministry of Physical Planning & Urban Development Gazette",
    category: "Official Documents",
    originalText:
      "Notice is hereby given that under the Urban and Regional Planning and Development Law, all holders of customary titles, deeds of assignment, and unperfected excision claims within newly delineated urban zones must present certificates of occupancy or file regularization memorandums within 90 calendar days, failing which properties will be designated non-compliant.",
    sampleBreakdown: {
      summary:
        "The state government is ordering all land and building owners who only have receipt, survey, or family agreement papers to regularize their documents into a recognized Governor's Consent or C of O within 90 days.",
      whoIsAffected:
        "Homeowners, landlords, and land buyers with unperfected land documents in developing areas.",
      actionSteps: [
        "Locate your original purchase receipt, registered survey plan, and deed of assignment.",
        "Visit your state land registry or urban planning zonal office to verify your layout status.",
        "Begin your regularization filing before the 90-day window expires to protect your property rights.",
      ],
    },
    translations: {
      "simple-english": {
        summary:
          "The state government is ordering all land and building owners who only have receipt, survey, or family agreement papers to regularize their documents into a recognized Governor's Consent or C of O within 90 days.",
        whoIsAffected:
          "Homeowners, landlords, and land buyers with unperfected land documents in developing areas.",
        actionSteps: [
          "Locate your original purchase receipt, registered survey plan, and deed of assignment.",
          "Visit your state land registry or urban planning zonal office to verify your layout status.",
          "Begin your regularization filing before the 90-day window expires to protect your property rights.",
        ],
      },
      pidgin: {
        summary:
          "State government don give serious order say anybody wey get land or house wey only get receipt, survey, or family agreement paper gats go change am to original Governor Consent or C of O within 90 days.",
        whoIsAffected:
          "Landlord, person wey buy land recently, and anybody wey never balance their original land title papers.",
        actionSteps: [
          "Pack all your original purchase receipt, registered survey plan, and deed of assignment together.",
          "Waka go your state land registry or zonal urban planning office make dem check your area layout.",
          "Start your regularization registration sharp-sharp before di 90 days finish so dat government no go seize or lock your property.",
        ],
      },
      yoruba: {
        summary:
          "Ìjọba ìpínlẹ̀ ti fún gbogbo àwọn onílẹ̀ àti onílé tí wọ́n ní ìwé ẹ̀rí rírà (receipt), ìwé àwòrán ilẹ̀ (survey), tàbí àdéhùn mọ̀lẹ́bí péré láṣẹ láti wá gba ìwé àṣẹ gómìnà (Governor's Consent) tàbí C of O láàárín ọjọ́ 90.",
        whoIsAffected:
          "Àwọn olówó ilé, àwọn onílẹ̀, àti àwọn tó ṣẹ̀ṣẹ̀ ra ilẹ̀ tí kò tíì ní ìwé àṣẹ gidi lọ́wọ́.",
        actionSteps: [
          "Wá ìwé rírà ilẹ̀ àtìbẹ̀rẹ̀ rẹ, ètò àwòrán ilẹ̀ tí a forúkọsílẹ̀, àti ìwé àdéhùn ìgbéṣe (deed of assignment) jáde.",
          "Ṣe abẹ́wò sí ọ́fíìsì ilẹ̀ ìpínlẹ̀ rẹ tàbí ẹ̀ka ètò ìlú láti mọ ipò ilẹ̀ rẹ.",
          "Bẹ̀rẹ̀ ìforúkọsílẹ̀ rẹ kí ọjọ́ 90 náà tó pé láti dáàbò bo ẹ̀tọ́ rẹ lórí ilẹ̀ náà.",
        ],
      },
      hausa: {
        summary:
          "Gwamnatin jiha ta ba da umarnin cewa duk masu filaye da gidaje da ke da takardar saye kawai (receipt), ko taswirar safiyo, ko yarjejeniyar iyali, dole ne su gyara takardunsu zuwa takardar C of O ko Amincewar Gwamna (Governor's Consent) a cikin kwanaki 90.",
        whoIsAffected:
          "Masu gidaje, masu filaye, da masu sayen fili a yankunan da ke ci gaba da ba su kammala takardunsu ba.",
        actionSteps: [
          "Nemo ainihin takardar shaidar saye, taswirar safiyo mai rajista, da takardar canja mallaka (deed of assignment).",
          "Ziyarci ofishin rajistar filaye na jiha ko ofishin tsara birane na shiyya don duba matsayin filinku.",
          "Fara aikin rajistar kafin cikar kwanaki 90 don kare hakkin mallakar kadarorinku.",
        ],
      },
      igbo: {
        summary:
          "Gọọmentị steeti na-enye ndị niile nwere ala ma ọ bụ ụlọ nwere naanị akwụkwọ nnata ego (receipt), atụmatụ nyocha (survey), ma ọ bụ akwụkwọ nkwekọrịta ezinụlọ iwu ka ha hazie akwụkwọ ha ka ọ bụrụ C of O ma ọ bụ Nkwado Gọvanọ n'ime ụbọchị 90.",
        whoIsAffected:
          "Ndị nwe ụlọ, ndị nwe ala, na ndị zụrụ ala nwere akwụkwọ ala na-ezughị ezu.",
        actionSteps: [
          "Chọpụta akwụkwọ nnata mbụ gị, atụmatụ nyocha edebanyere aha, na akwụkwọ nnyefe ikike (deed of assignment).",
          "Gaa na ngalaba ndebanye aha ala nke steeti gị iji chọpụta ọnọdụ nhazi ala gị.",
          "Bido usoro nhazi gị tupu ụbọchị 90 agwụ iji chebe ikike ala gị.",
        ],
      },
    },
  },
];

const LANGUAGES = [
  { value: "simple-english", label: "Simple English", tag: "Most Popular" },
  { value: "pidgin", label: "Nigerian Pidgin", tag: "Wazobia" },
  { value: "yoruba", label: "Yorùbá", tag: "Èdè Yorùbá" },
  { value: "hausa", label: "Hausa", tag: "Harshen Hausa" },
  { value: "igbo", label: "Asụsụ Igbo", tag: "Asụsụ Igbo" },
];

interface DocumentInputCardProps {
  selectedSample?: DocumentSample | null;
}

export default function DocumentInputCard({ selectedSample }: DocumentInputCardProps) {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("simple-english");
  const [validationError, setValidationError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeSample, setActiveSample] = useState<DocumentSample | null>(null);
  const [copied, setCopied] = useState(false);
  const [prevSample, setPrevSample] = useState<DocumentSample | null | undefined>(selectedSample);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state when selectedSample prop changes during user navigation
  if (selectedSample !== prevSample) {
    setPrevSample(selectedSample);
    if (selectedSample) {
      setText(selectedSample.originalText);
      setActiveSample(selectedSample);
      setValidationError("");
      setIsSubmitted(false);
    }
  }

  const loadSample = useCallback((sample: DocumentSample) => {
    setText(sample.originalText);
    setActiveSample(sample);
    setValidationError("");
    setIsSubmitted(false);
    if (textareaRef.current) {
      textareaRef.current.value = sample.originalText;
      textareaRef.current.focus();
    }
  }, []);

  // Support global custom event from external trigger buttons
  useEffect(() => {
    const handleCustomSample = (e: Event) => {
      const customEvent = e as CustomEvent<DocumentSample>;
      if (customEvent.detail) {
        loadSample(customEvent.detail);
      }
    };
    window.addEventListener("explain-naija-load-sample", handleCustomSample);
    return () => {
      window.removeEventListener("explain-naija-load-sample", handleCustomSample);
    };
  }, [loadSample]);

  useEffect(() => {
    if (isSubmitted) {
      const breakdownEl = document.getElementById("breakdown-preview");
      if (breakdownEl) {
        breakdownEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [isSubmitted]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (validationError && e.target.value.trim().length > 0) {
      setValidationError("");
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleClear = () => {
    setText("");
    setActiveSample(null);
    setValidationError("");
    setIsSubmitted(false);
    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  };

  const handleExplain = (e: React.FormEvent) => {
    e.preventDefault();
    const domValue = textareaRef.current ? textareaRef.current.value : "";
    const currentText = (text && text.trim().length > 0 ? text : domValue) || "";
    const trimmed = currentText.trim();

    if (!trimmed) {
      setValidationError(
        "Please paste or type an announcement, circular, or document text first to get an explanation."
      );
      setIsSubmitted(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      return;
    }

    if (trimmed.length < 15) {
      setValidationError(
        "Please enter a bit more text (at least a full sentence or paragraph) so we can provide a meaningful explanation."
      );
      setIsSubmitted(false);
      return;
    }

    if (text !== currentText) {
      setText(currentText);
    }

    // Match sample breakdown if activeSample is not set yet
    if (!activeSample) {
      const matched = SAMPLE_DOCUMENTS.find(
        (s) =>
          s.originalText.trim() === trimmed ||
          trimmed.includes(s.title) ||
          s.originalText.includes(trimmed)
      );
      if (matched) {
        setActiveSample(matched);
      }
    }

    setValidationError("");
    setIsSubmitted(true);
  };

  // Get active breakdown according to the currently selected language
  const currentBreakdown: BreakdownContent = (() => {
    if (activeSample?.translations?.[language]) {
      return activeSample.translations[language];
    }
    if (activeSample?.sampleBreakdown) {
      return activeSample.sampleBreakdown;
    }
    return CUSTOM_TEXT_TRANSLATIONS[language] || CUSTOM_TEXT_TRANSLATIONS["simple-english"];
  })();

  const currentLabels = SECTION_LABELS[language] || SECTION_LABELS["simple-english"];

  const copyBreakdown = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedLangLabel = LANGUAGES.find((l) => l.value === language)?.label || "Simple English";

  return (
    <div
      id="input-section"
      className="w-full max-w-4xl mx-auto rounded-3xl bg-white border border-[#E8E2D5] shadow-2xl shadow-[#0C281C]/8 overflow-hidden transition-all duration-300 relative"
    >
      {/* Top subtle decorative accent bar */}
      <div className="h-2 w-full bg-gradient-to-r from-[#0C281C] via-[#1C543C] to-[#84CC16]" />

      <div className="p-6 sm:p-8 md:p-10">
        {/* Card Header with quick status and sample pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F2EDE2]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84CC16] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#84CC16]" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1C543C]">
              Document Simplifier Engine
            </span>
          </div>

          {/* Quick sample chips */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <span className="text-[#5A6D64] font-medium hidden sm:inline">Try sample:</span>
            {SAMPLE_DOCUMENTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  loadSample(sample);
                }}
                className={`px-3 py-1 rounded-full border transition-all text-xs font-medium cursor-pointer ${activeSample?.id === sample.id
                    ? "bg-[#0C281C] text-white border-[#0C281C] shadow-sm"
                    : "bg-[#F8F5EE] hover:bg-[#EDE7DA] text-[#1C543C] border-[#E8E2D5]"
                  }`}
                title={`Load ${sample.label}`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form area */}
        <form onSubmit={handleExplain} className="mt-6 space-y-6">
          {/* Textarea container */}
          <div className="relative">
            <label htmlFor="document-input" className="sr-only">
              Paste notice or announcement
            </label>
            <textarea
              id="document-input"
              ref={textareaRef}
              rows={6}
              value={text}
              onChange={handleTextChange}
              placeholder="Paste a notice, announcement, or anything you want explained…"
              className={`w-full rounded-2xl p-4 sm:p-5 text-base sm:text-lg text-[#1A2421] placeholder-[#8C9B93] bg-[#FCFAF6] border transition-all resize-y focus:outline-none focus:bg-white leading-relaxed ${validationError
                  ? "border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50/20"
                  : "border-[#DDD5C5] focus:border-[#1C543C] focus:ring-2 focus:ring-[#84CC16]/50"
                }`}
            />

            {/* Bottom textarea utility bar */}
            <div className="flex items-center justify-between text-xs text-[#6F8279] mt-2 px-1">
              <div className="flex items-center gap-2">
                <span>{text.length} characters</span>
                {text.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center gap-1 text-[#1C543C] hover:text-[#0C281C] font-medium cursor-pointer underline underline-offset-2 ml-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Clear text
                  </button>
                )}
              </div>
              <span className="text-[#8C9B93] hidden sm:inline">
                Supports circulars, bills, gazettes & statements
              </span>
            </div>

            {/* Validation Message */}
            {validationError && (
              <div
                role="alert"
                className="mt-3 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-sm text-red-700 animate-in fade-in-50 duration-200"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">Please provide some content</p>
                  <p className="mt-0.5 text-red-700">{validationError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Row: Language dropdown + Primary Explain button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            {/* Language Selector */}
            <div className="relative min-w-[220px]">
              <label htmlFor="language-select" className="text-xs font-semibold uppercase tracking-wider text-[#4B5E55] block mb-1.5">
                Explain in language:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1C543C]">
                  <Languages className="w-4 h-4" />
                </div>
                <select
                  id="language-select"
                  value={language}
                  onChange={handleLanguageChange}
                  className="w-full appearance-none rounded-xl bg-[#F8F5EE] hover:bg-[#F2EDE2] border border-[#DDD5C5] pl-10 pr-10 py-3 text-sm font-semibold text-[#0C281C] focus:outline-none focus:ring-2 focus:ring-[#84CC16] focus:border-[#1C543C] cursor-pointer transition-colors"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label} ({lang.tag})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#5A6D64]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Explain Button */}
            <div className="flex flex-col sm:items-end justify-end pt-2 sm:pt-0">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full text-base font-semibold bg-[#0C281C] text-white hover:bg-[#143F2D] active:scale-[0.98] transition-all shadow-lg shadow-[#0C281C]/25 border border-[#184E37] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#84CC16]/60 cursor-pointer group"
              >
                <span>Explain this</span>
                <div className="w-6 h-6 rounded-full bg-[#84CC16]/20 flex items-center justify-center group-hover:bg-[#84CC16]/30 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-[#84CC16]" />
                </div>
              </button>
            </div>
          </div>

          {/* Helper message */}
          <div className="flex items-start gap-2.5 pt-3 text-xs text-[#52655D] bg-[#F8F5EE]/80 rounded-xl p-3 border border-[#E8E2D5]">
            <Info className="w-4 h-4 text-[#1C543C] shrink-0 mt-0.5" />
            <p>
              <strong className="font-semibold text-[#0C281C]">Tip:</strong> Paste text from any government gazette, policy paper, CBN circular, or agency announcement. You can also click the quick samples above to test how it works right away.
            </p>
          </div>
        </form>

        {/* State Display: Multilingual Breakdown Section */}
        {isSubmitted && (
          <div
            id="breakdown-preview"
            className="mt-8 pt-8 border-t border-[#E8E2D5] animate-in fade-in slide-in-from-bottom-3 duration-300"
          >
            {/* Transparent status notice */}
            <div className="rounded-2xl bg-[#F0F8F3] border border-[#C6E6D2] p-5 mb-6">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-[#0C281C] text-[#BEF264] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0C281C]">
                    {currentLabels.noticeTitle}
                  </h4>
                  <p className="text-xs text-[#273730] mt-1 leading-relaxed">
                    {currentLabels.noticeDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive breakdown preview card */}
            <div className="rounded-2xl bg-[#FCFAF6] border border-[#DDD5C5] p-5 sm:p-7 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D5]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1C543C]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0C281C]">
                    {currentLabels.outputHeading}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyBreakdown(
                      `${currentBreakdown.summary}\n\n${currentLabels.nextSteps}:\n${currentBreakdown.actionSteps.join("\n")}`
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1C543C] hover:text-[#0C281C] self-start sm:self-auto cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#84CC16]" />
                      <span>Copied in {selectedLangLabel}!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy {selectedLangLabel} explanation</span>
                    </>
                  )}
                </button>
              </div>

              {/* Breakdown body rendered in selected language */}
              <div className="mt-5 space-y-5 text-sm">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#84CC16]/20 text-[#0C281C] border border-[#84CC16]/40 mb-1.5">
                    {currentLabels.plainWords}
                  </span>
                  <p className="text-[#1A2421] leading-relaxed font-normal">
                    {currentBreakdown.summary}
                  </p>
                </div>

                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E7F3EC] text-[#1C543C] border border-[#C6E6D2] mb-1.5">
                    {currentLabels.whoIsAffected}
                  </span>
                  <p className="text-[#273730] leading-relaxed">
                    {currentBreakdown.whoIsAffected}
                  </p>
                </div>

                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E7F3EC] text-[#1C543C] border border-[#C6E6D2] mb-2">
                    {currentLabels.nextSteps}
                  </span>
                  <ul className="space-y-2.5 text-[#273730]">
                    {currentBreakdown.actionSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#0C281C] text-[#BEF264] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
