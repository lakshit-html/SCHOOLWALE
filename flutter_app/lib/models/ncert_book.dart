class NCERTChapter {
  final String id;
  final int chapterNumber;
  final String title;
  final String pdfUrl;
  final String portalUrl;
  final String summary;
  final String? detailedTheory;
  final List<String> keyFormulas;
  final List<String> highYieldPoints;

  NCERTChapter({
    this.id = '',
    required this.chapterNumber,
    required this.title,
    required this.pdfUrl,
    this.portalUrl = '',
    this.summary = '',
    this.detailedTheory,
    this.keyFormulas = const [],
    this.highYieldPoints = const [],
  });
}

class NCERTBook {
  final String id;
  final String classLevel; // e.g. 'Class 12', 'Class 11'
  final String subject; // 'Physics', 'Chemistry', 'Mathematics', etc.
  final String title;
  final String code;
  final int coverColorHex;
  final String officialPortalUrl;
  final List<NCERTChapter> chapters;

  NCERTBook({
    required this.id,
    required this.classLevel,
    required this.subject,
    required this.title,
    required this.code,
    required this.coverColorHex,
    required this.officialPortalUrl,
    required this.chapters,
  });
}
