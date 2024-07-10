interface LanguageContentInterface {
    [key: string]: Record<string, any>;
  }
export const languageContent: LanguageContentInterface = {
    english: {
      dashboardLink: "Dashboard",
      dataEntry: "Data Entry",
      dataEntryTitle: "Data Entry",
      noDataFoundAlt: "no data found",
      // Add more English text here as needed
    },
    hindi: {
      dashboardLink: "डैशबोर्ड",
      dataEntry: "डेटा प्रविष्टि",
      dataEntryTitle: "डेटा प्रविष्टि",
      noDataFoundAlt: "कोई डेटा नहीं मिला",
      // Add more Hindi text here as needed
    },
    punjabi: {
      dashboardLink: "ਡੈਸ਼ਬੋਰਡ",
      dataEntry: "ਡਾਟਾ ਐਂਟਰੀ",
      dataEntryTitle: "ਡਾਟਾ ਐਂਟਰੀ",
      noDataFoundAlt: "ਕੋਈ ਡਾਟਾ ਨਹੀਂ ਮਿਲਿਆ",
      // Add more Punjabi text here as needed
    },
  };
