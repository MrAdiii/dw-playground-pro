/**
 * DataWeave 2.0 Autocomplete Engine for CodeMirror
 * Part of DataWeave Playground Pro
 */
(function(global) {
  "use strict";

  var CMPos = function(l, c) {
    return (global.CodeMirror && global.CodeMirror.Pos) ? global.CodeMirror.Pos(l, c) : { line: l, ch: c };
  };

  // ==========================================
  // 1. DATAWEAVE CORE CATALOG & MIME TYPES
  // ==========================================
  var MIME_TYPES = [
    { text: "application/json", displayText: "application/json", type: "mime", doc: "JSON format (application/json)" },
    { text: "application/csv", displayText: "application/csv", type: "mime", doc: "CSV table format (application/csv)" },
    { text: "application/xml", displayText: "application/xml", type: "mime", doc: "XML document format (application/xml)" },
    { text: "application/yaml", displayText: "application/yaml", type: "mime", doc: "YAML format (application/yaml)" },
    { text: "application/java", displayText: "application/java", type: "mime", doc: "Java Object format (application/java)" },
    { text: "application/dw", displayText: "application/dw", type: "mime", doc: "DataWeave canonical format" },
    { text: "application/octet-stream", displayText: "application/octet-stream", type: "mime", doc: "Binary stream" },
    { text: "application/x-ndjson", displayText: "application/x-ndjson", type: "mime", doc: "Newline Delimited JSON" },
    { text: "application/x-www-form-urlencoded", displayText: "application/x-www-form-urlencoded", type: "mime", doc: "URL-encoded form data" },
    { text: "multipart/form-data", displayText: "multipart/form-data", type: "mime", doc: "Multipart form data" },
    { text: "text/plain", displayText: "text/plain", type: "mime", doc: "Plain text format (text/plain)" },
    { text: "text/csv", displayText: "text/csv", type: "mime", doc: "Plain text CSV format" },
    { text: "text/xml", displayText: "text/xml", type: "mime", doc: "Plain text XML format" },
    { text: "text/yaml", displayText: "text/yaml", type: "mime", doc: "Plain text YAML format" },
    // Common MIME properties
    { text: "application/csv header=true", displayText: "application/csv header=true", type: "mime", doc: "CSV with header row" },
    { text: "application/csv header=false", displayText: "application/csv header=false", type: "mime", doc: "CSV without header row" },
    { text: "application/json indent=true", displayText: "application/json indent=true", type: "mime", doc: "Pretty-printed JSON output" },
    { text: "application/xml writeDeclaration=false", displayText: "application/xml writeDeclaration=false", type: "mime", doc: "XML without <?xml?> header" }
  ];

  var MIME_SHORTCUTS = [
    { text: "application/csv", displayText: "csv -> application/csv", type: "mime", doc: "CSV MIME type" },
    { text: "application/yaml", displayText: "yaml -> application/yaml", type: "mime", doc: "YAML MIME type" },
    { text: "application/xml", displayText: "xml -> application/xml", type: "mime", doc: "XML MIME type" },
    { text: "application/json", displayText: "json -> application/json", type: "mime", doc: "JSON MIME type" },
    { text: "application/java", displayText: "java -> application/java", type: "mime", doc: "Java Object MIME type" },
    { text: "text/plain", displayText: "text -> text/plain", type: "mime", doc: "Plain text MIME type" },
    { text: "application/dw", displayText: "dw -> application/dw", type: "mime", doc: "DataWeave format" }
  ];

  // ==========================================
  // 2. MULE DATAWEAVE STANDARD LIBRARY MODULES
  // ==========================================
  var DW_MODULE_FUNCTIONS = [
    // --- dw::core::Arrays ---
    { text: "countBy ((item) -> $0)", displayText: "countBy", module: "dw::core::Arrays", type: "fn", doc: "dw::core::Arrays::countBy(Array, (T) -> Boolean): Number" },
    { text: "divideBy($0)", displayText: "divideBy", module: "dw::core::Arrays", type: "fn", doc: "dw::core::Arrays::divideBy(Array, size: Number): Array" },
    { text: "drop($0)", displayText: "drop", module: "dw::core::Arrays", type: "fn", doc: "dw::core::Arrays::drop(Array, count: Number): Array" },
    { text: "dropWhile ((item) -> $0)", displayText: "dropWhile", module: "dw::core::Arrays", type: "fn", doc: "dw::core::Arrays::dropWhile(Array, (T) -> Boolean): Array" },
    { text: "every ((item) -> $0)", displayText: "every", module: "dw::core::Arrays", type: "fn", doc: "dw::core::Arrays::every(Array, (T) -> Boolean): Boolean" },
    { text: "firstWith ((item) -> $0)", displayText: "firstWith", module: "dw::core::Arrays", type: "fn", doc: "dw::core::Arrays::firstWith(Array, (T) -> Boolean): T|Null" },
    { text: "join($0)", displayText: "join", module: "dw::core::Arrays", type: "fn", doc: "dw::core::Arrays::join(Array, Array, (item) -> Key, (item) -> Key): Array" },
    { text: "partition ((item) -> $0)", displayText: "partition", module: "dw::core::Arrays", type: "fn", doc: "dw::core::Arrays::partition(Array, (T) -> Boolean): {success: Array, failure: Array}" },
    { text: "slice($0)", displayText: "slice", module: "dw::core::Arrays", type: "fn", doc: "dw::core::Arrays::slice(Array, from: Number, to: Number): Array" },
    { text: "some ((item) -> $0)", displayText: "some", module: "dw::core::Arrays", type: "fn", doc: "dw::core::Arrays::some(Array, (T) -> Boolean): Boolean" },
    { text: "splitAt($0)", displayText: "splitAt", module: "dw::core::Arrays", type: "fn", doc: "dw::core::Arrays::splitAt(Array, index: Number): {l: Array, r: Array}" },
    { text: "splitWhere ((item) -> $0)", displayText: "splitWhere", module: "dw::core::Arrays", type: "fn", doc: "dw::core::Arrays::splitWhere(Array, (T) -> Boolean): {l: Array, r: Array}" },
    { text: "sumBy ((item) -> $0)", displayText: "sumBy", module: "dw::core::Arrays", type: "fn", doc: "dw::core::Arrays::sumBy(Array, (T) -> Number): Number" },
    { text: "take($0)", displayText: "take", module: "dw::core::Arrays", type: "fn", doc: "dw::core::Arrays::take(Array, count: Number): Array" },
    { text: "takeWhile ((item) -> $0)", displayText: "takeWhile", module: "dw::core::Arrays", type: "fn", doc: "dw::core::Arrays::takeWhile(Array, (T) -> Boolean): Array" },

    // --- dw::core::Strings ---
    { text: "camelize($0)", displayText: "camelize", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::camelize(String): String" },
    { text: "capitalize($0)", displayText: "capitalize", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::capitalize(String): String" },
    { text: "dasherize($0)", displayText: "dasherize", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::dasherize(String): String" },
    { text: "underscore($0)", displayText: "underscore", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::underscore(String): String" },
    { text: "ordinalize($0)", displayText: "ordinalize", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::ordinalize(Number): String" },
    { text: "pluralize($0)", displayText: "pluralize", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::pluralize(String): String" },
    { text: "singularize($0)", displayText: "singularize", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::singularize(String): String" },
    { text: "substring($0)", displayText: "substring", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::substring(String, from: Number, to: Number): String" },
    { text: "substringBefore($0)", displayText: "substringBefore", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::substringBefore(String, separator: String): String" },
    { text: "substringAfter($0)", displayText: "substringAfter", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::substringAfter(String, separator: String): String" },
    { text: "substringBeforeLast($0)", displayText: "substringBeforeLast", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::substringBeforeLast(String, separator: String): String" },
    { text: "substringAfterLast($0)", displayText: "substringAfterLast", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::substringAfterLast(String, separator: String): String" },
    { text: "leftPad($0)", displayText: "leftPad", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::leftPad(String, size: Number, pad: String): String" },
    { text: "rightPad($0)", displayText: "rightPad", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::rightPad(String, size: Number, pad: String): String" },
    { text: "repeat($0)", displayText: "repeat", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::repeat(String, count: Number): String" },
    { text: "wrapWith($0)", displayText: "wrapWith", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::wrapWith(String, wrapper: String): String" },
    { text: "unwrap($0)", displayText: "unwrap", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::unwrap(String, wrapper: String): String" },
    { text: "words($0)", displayText: "words", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::words(String): Array<String>" },
    { text: "collapse($0)", displayText: "collapse", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::collapse(String): String" },
    { text: "characterCodeAt($0)", displayText: "characterCodeAt", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::characterCodeAt(String, index: Number): Number" },
    { text: "fromCharCode($0)", displayText: "fromCharCode", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::fromCharCode(Number): String" },
    { text: "isAlpha($0)", displayText: "isAlpha", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::isAlpha(String): Boolean" },
    { text: "isAlphanumeric($0)", displayText: "isAlphanumeric", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::isAlphanumeric(String): Boolean" },
    { text: "isDigits($0)", displayText: "isDigits", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::isDigits(String): Boolean" },
    { text: "isLowerCase($0)", displayText: "isLowerCase", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::isLowerCase(String): Boolean" },
    { text: "isUpperCase($0)", displayText: "isUpperCase", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::isUpperCase(String): Boolean" },
    { text: "isNumeric($0)", displayText: "isNumeric", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::isNumeric(String): Boolean" },
    { text: "isWhitespace($0)", displayText: "isWhitespace", module: "dw::core::Strings", type: "fn", doc: "dw::core::Strings::isWhitespace(String): Boolean" },

    // --- dw::core::Objects ---
    { text: "entrySet($0)", displayText: "entrySet", module: "dw::core::Objects", type: "fn", doc: "dw::core::Objects::entrySet(Object): Array<Entry>" },
    { text: "everyEntry ((value, key) -> $0)", displayText: "everyEntry", module: "dw::core::Objects", type: "fn", doc: "dw::core::Objects::everyEntry(Object, (V, K) -> Boolean): Boolean" },
    { text: "keySet($0)", displayText: "keySet", module: "dw::core::Objects", type: "fn", doc: "dw::core::Objects::keySet(Object): Array<Key>" },
    { text: "nameSet($0)", displayText: "nameSet", module: "dw::core::Objects", type: "fn", doc: "dw::core::Objects::nameSet(Object): Array<String>" },
    { text: "someEntry ((value, key) -> $0)", displayText: "someEntry", module: "dw::core::Objects", type: "fn", doc: "dw::core::Objects::someEntry(Object, (V, K) -> Boolean): Boolean" },
    { text: "valueSet($0)", displayText: "valueSet", module: "dw::core::Objects", type: "fn", doc: "dw::core::Objects::valueSet(Object): Array<Any>" },

    // --- dw::core::Numbers ---
    { text: "fromHex($0)", displayText: "fromHex", module: "dw::core::Numbers", type: "fn", doc: "dw::core::Numbers::fromHex(String): Number" },
    { text: "fromRadixNumber($0)", displayText: "fromRadixNumber", module: "dw::core::Numbers", type: "fn", doc: "dw::core::Numbers::fromRadixNumber(String, radix: Number): Number" },
    { text: "toHex($0)", displayText: "toHex", module: "dw::core::Numbers", type: "fn", doc: "dw::core::Numbers::toHex(Number): String" },
    { text: "toRadixNumber($0)", displayText: "toRadixNumber", module: "dw::core::Numbers", type: "fn", doc: "dw::core::Numbers::toRadixNumber(Number, radix: Number): String" },

    // --- dw::core::Periods ---
    { text: "days($0)", displayText: "days", module: "dw::core::Periods", type: "fn", doc: "dw::core::Periods::days(Number): Period" },
    { text: "hours($0)", displayText: "hours", module: "dw::core::Periods", type: "fn", doc: "dw::core::Periods::hours(Number): Period" },
    { text: "millis($0)", displayText: "millis", module: "dw::core::Periods", type: "fn", doc: "dw::core::Periods::millis(Number): Period" },
    { text: "minutes($0)", displayText: "minutes", module: "dw::core::Periods", type: "fn", doc: "dw::core::Periods::minutes(Number): Period" },
    { text: "months($0)", displayText: "months", module: "dw::core::Periods", type: "fn", doc: "dw::core::Periods::months(Number): Period" },
    { text: "nanos($0)", displayText: "nanos", module: "dw::core::Periods", type: "fn", doc: "dw::core::Periods::nanos(Number): Period" },
    { text: "seconds($0)", displayText: "seconds", module: "dw::core::Periods", type: "fn", doc: "dw::core::Periods::seconds(Number): Period" },
    { text: "years($0)", displayText: "years", module: "dw::core::Periods", type: "fn", doc: "dw::core::Periods::years(Number): Period" },
    { text: "period($0)", displayText: "period", module: "dw::core::Periods", type: "fn", doc: "dw::core::Periods::period(Object): Period" },

    // --- dw::core::Dates ---
    { text: "today()", displayText: "today()", module: "dw::core::Dates", type: "fn", doc: "dw::core::Dates::today(): Date" },
    { text: "yesterday()", displayText: "yesterday()", module: "dw::core::Dates", type: "fn", doc: "dw::core::Dates::yesterday(): Date" },
    { text: "tomorrow()", displayText: "tomorrow()", module: "dw::core::Dates", type: "fn", doc: "dw::core::Dates::tomorrow(): Date" },
    { text: "atBeginningOfDay($0)", displayText: "atBeginningOfDay", module: "dw::core::Dates", type: "fn", doc: "dw::core::Dates::atBeginningOfDay(DateTime): DateTime" },
    { text: "atBeginningOfMonth($0)", displayText: "atBeginningOfMonth", module: "dw::core::Dates", type: "fn", doc: "dw::core::Dates::atBeginningOfMonth(Date|DateTime): Date|DateTime" },
    { text: "atBeginningOfWeek($0)", displayText: "atBeginningOfWeek", module: "dw::core::Dates", type: "fn", doc: "dw::core::Dates::atBeginningOfWeek(Date|DateTime): Date|DateTime" },
    { text: "atBeginningOfYear($0)", displayText: "atBeginningOfYear", module: "dw::core::Dates", type: "fn", doc: "dw::core::Dates::atBeginningOfYear(Date|DateTime): Date|DateTime" },

    // --- dw::core::Binaries ---
    { text: "fromBase64($0)", displayText: "fromBase64", module: "dw::core::Binaries", type: "fn", doc: "dw::core::Binaries::fromBase64(String): Binary" },
    { text: "toBase64($0)", displayText: "toBase64", module: "dw::core::Binaries", type: "fn", doc: "dw::core::Binaries::toBase64(Binary): String" },

    // --- dw::core::URL ---
    { text: "encodeURI($0)", displayText: "encodeURI", module: "dw::core::URL", type: "fn", doc: "dw::core::URL::encodeURI(String): String" },
    { text: "encodeURIComponent($0)", displayText: "encodeURIComponent", module: "dw::core::URL", type: "fn", doc: "dw::core::URL::encodeURIComponent(String): String" },
    { text: "decodeURI($0)", displayText: "decodeURI", module: "dw::core::URL", type: "fn", doc: "dw::core::URL::decodeURI(String): String" },
    { text: "decodeURIComponent($0)", displayText: "decodeURIComponent", module: "dw::core::URL", type: "fn", doc: "dw::core::URL::decodeURIComponent(String): String" },
    { text: "parseURI($0)", displayText: "parseURI", module: "dw::core::URL", type: "fn", doc: "dw::core::URL::parseURI(String): Object" },

    // --- dw::Crypto ---
    { text: "MD5($0)", displayText: "MD5", module: "dw::Crypto", type: "fn", doc: "dw::Crypto::MD5(Binary|String): String" },
    { text: "SHA1($0)", displayText: "SHA1", module: "dw::Crypto", type: "fn", doc: "dw::Crypto::SHA1(Binary|String): String" },
    { text: "HMACBinary($0)", displayText: "HMACBinary", module: "dw::Crypto", type: "fn", doc: "dw::Crypto::HMACBinary(Binary, key: Binary, algorithm: String): Binary" },
    { text: "HMACWith($0)", displayText: "HMACWith", module: "dw::Crypto", type: "fn", doc: "dw::Crypto::HMACWith(Binary, key: Binary, algorithm: String): String" },

    // --- dw::util::Diff ---
    { text: "diff($0)", displayText: "diff", module: "dw::util::Diff", type: "fn", doc: "dw::util::Diff::diff(Any, Any): {matches: Boolean, diffs: Array}" },

    // --- dw::util::Coercions ---
    { text: "toBinary($0)", displayText: "toBinary", module: "dw::util::Coercions", type: "fn", doc: "dw::util::Coercions::toBinary(Any): Binary" },
    { text: "toBoolean($0)", displayText: "toBoolean", module: "dw::util::Coercions", type: "fn", doc: "dw::util::Coercions::toBoolean(Any): Boolean" },
    { text: "toDate($0)", displayText: "toDate", module: "dw::util::Coercions", type: "fn", doc: "dw::util::Coercions::toDate(Any): Date" },
    { text: "toDateTime($0)", displayText: "toDateTime", module: "dw::util::Coercions", type: "fn", doc: "dw::util::Coercions::toDateTime(Any): DateTime" },
    { text: "toLocalDateTime($0)", displayText: "toLocalDateTime", module: "dw::util::Coercions", type: "fn", doc: "dw::util::Coercions::toLocalDateTime(Any): LocalDateTime" },
    { text: "toLocale($0)", displayText: "toLocale", module: "dw::util::Coercions", type: "fn", doc: "dw::util::Coercions::toLocale(String): String" },
    { text: "toNumber($0)", displayText: "toNumber", module: "dw::util::Coercions", type: "fn", doc: "dw::util::Coercions::toNumber(Any): Number" },
    { text: "toPeriod($0)", displayText: "toPeriod", module: "dw::util::Coercions", type: "fn", doc: "dw::util::Coercions::toPeriod(String): Period" },
    { text: "toString($0)", displayText: "toString", module: "dw::util::Coercions", type: "fn", doc: "dw::util::Coercions::toString(Any): String" },
    { text: "toTime($0)", displayText: "toTime", module: "dw::util::Coercions", type: "fn", doc: "dw::util::Coercions::toTime(Any): Time" },
    { text: "toTimeZone($0)", displayText: "toTimeZone", module: "dw::util::Coercions", type: "fn", doc: "dw::util::Coercions::toTimeZone(String): TimeZone" },
    { text: "toUri($0)", displayText: "toUri", module: "dw::util::Coercions", type: "fn", doc: "dw::util::Coercions::toUri(String): String" },

    // --- dw::util::Math ---
    { text: "acos($0)", displayText: "acos", module: "dw::util::Math", type: "fn", doc: "dw::util::Math::acos(Number): Number" },
    { text: "asin($0)", displayText: "asin", module: "dw::util::Math", type: "fn", doc: "dw::util::Math::asin(Number): Number" },
    { text: "atan($0)", displayText: "atan", module: "dw::util::Math", type: "fn", doc: "dw::util::Math::atan(Number): Number" },
    { text: "atan2($0)", displayText: "atan2", module: "dw::util::Math", type: "fn", doc: "dw::util::Math::atan2(Number, Number): Number" },
    { text: "cos($0)", displayText: "cos", module: "dw::util::Math", type: "fn", doc: "dw::util::Math::cos(Number): Number" },
    { text: "cosh($0)", displayText: "cosh", module: "dw::util::Math", type: "fn", doc: "dw::util::Math::cosh(Number): Number" },
    { text: "exp($0)", displayText: "exp", module: "dw::util::Math", type: "fn", doc: "dw::util::Math::exp(Number): Number" },
    { text: "log10($0)", displayText: "log10", module: "dw::util::Math", type: "fn", doc: "dw::util::Math::log10(Number): Number" },
    { text: "sin($0)", displayText: "sin", module: "dw::util::Math", type: "fn", doc: "dw::util::Math::sin(Number): Number" },
    { text: "sinh($0)", displayText: "sinh", module: "dw::util::Math", type: "fn", doc: "dw::util::Math::sinh(Number): Number" },
    { text: "tan($0)", displayText: "tan", module: "dw::util::Math", type: "fn", doc: "dw::util::Math::tan(Number): Number" },
    { text: "tanh($0)", displayText: "tanh", module: "dw::util::Math", type: "fn", doc: "dw::util::Math::tanh(Number): Number" },
    { text: "toDegrees($0)", displayText: "toDegrees", module: "dw::util::Math", type: "fn", doc: "dw::util::Math::toDegrees(Number): Number" },
    { text: "toRadians($0)", displayText: "toRadians", module: "dw::util::Math", type: "fn", doc: "dw::util::Math::toRadians(Number): Number" },

    // --- dw::util::Timer ---
    { text: "currentMilliseconds()", displayText: "currentMilliseconds()", module: "dw::util::Timer", type: "fn", doc: "dw::util::Timer::currentMilliseconds(): Number" },
    { text: "duration($0)", displayText: "duration", module: "dw::util::Timer", type: "fn", doc: "dw::util::Timer::duration(() -> Any): {time: Number, result: Any}" },
    { text: "time($0)", displayText: "time", module: "dw::util::Timer", type: "fn", doc: "dw::util::Timer::time(() -> Any): {start: DateTime, end: DateTime, result: Any}" },

    // --- dw::System ---
    { text: "envVar($0)", displayText: "envVar", module: "dw::System", type: "fn", doc: "dw::System::envVar(String): String|Null" },
    { text: "envVars()", displayText: "envVars()", module: "dw::System", type: "fn", doc: "dw::System::envVars(): Object" }
  ];

  var DW_CATALOG = [
    // Header & Directives
    { text: "%dw 2.0\noutput application/json\n---\n", displayText: "%dw 2.0", type: "kw", doc: "DataWeave 2.0 JSON header template" },
    { text: "output application/json", displayText: "output application/json", type: "kw", doc: "Output JSON directive" },
    { text: "output application/csv", displayText: "output application/csv", type: "kw", doc: "Output CSV directive" },
    { text: "output application/xml", displayText: "output application/xml", type: "kw", doc: "Output XML directive" },
    { text: "output application/yaml", displayText: "output application/yaml", type: "kw", doc: "Output YAML directive" },
    { text: "output application/java", displayText: "output application/java", type: "kw", doc: "Output Java POJO directive" },
    { text: "output text/plain", displayText: "output text/plain", type: "kw", doc: "Output plain text directive" },
    { text: "output application/dw", displayText: "output application/dw", type: "kw", doc: "Output DataWeave canonical directive" },
    { text: "output ", displayText: "output <mime>", type: "kw", doc: "Output MIME type declaration" },
    { text: "input payload application/json", displayText: "input payload application/json", type: "kw", doc: "Input payload MIME directive" },
    { text: "var ", displayText: "var", type: "kw", doc: "Variable declaration: var x = ..." },
    { text: "fun ", displayText: "fun", type: "kw", doc: "Function declaration: fun f(x) = ..." },
    { text: "type ", displayText: "type", type: "kw", doc: "Custom type definition: type T = ..." },
    { text: "ns ", displayText: "ns", type: "kw", doc: "Namespace declaration: ns ns0 http://..." },
    { text: "import * from dw::core::Arrays", displayText: "import dw::core::Arrays", type: "kw", doc: "Import Arrays module" },
    { text: "import * from dw::core::Strings", displayText: "import dw::core::Strings", type: "kw", doc: "Import Strings module" },
    { text: "import * from dw::core::Objects", displayText: "import dw::core::Objects", type: "kw", doc: "Import Objects module" },
    { text: "import * from dw::util::Coercions", displayText: "import dw::util::Coercions", type: "kw", doc: "Import Coercions module" },
    { text: "import * from dw::util::Timer", displayText: "import dw::util::Timer", type: "kw", doc: "Import Timer module" },
    { text: "import * from dw::Crypto", displayText: "import dw::Crypto", type: "kw", doc: "Import Crypto module" },
    { text: "import ", displayText: "import", type: "kw", doc: "Module import statement" },

    // Syntax & Flow
    { text: "---\n", displayText: "---", type: "kw", doc: "Header / Body delimiter" },
    { text: "do {\n  $0\n}", displayText: "do { ... }", type: "kw", doc: "Local scope block" },
    { text: "using ($0)", displayText: "using (...) ", type: "kw", doc: "Local variable declaration" },
    { text: "default ", displayText: "default", type: "kw", doc: "Fallback default value: x default y" },
    { text: "as ", displayText: "as", type: "kw", doc: "Type coercion: val as String" },
    { text: "is ", displayText: "is", type: "kw", doc: "Type check: val is String" },
    { text: "match {\n  case is String -> $0\n  else -> null\n}", displayText: "match { case ... }", type: "snip", doc: "Pattern match expression" },
    { text: "case ", displayText: "case", type: "kw", doc: "Match case branch" },
    { text: "if ($0)  else ", displayText: "if (...) ... else ...", type: "snip", doc: "Conditional expression" },
    { text: "if ", displayText: "if", type: "kw", doc: "Conditional operator" },
    { text: "else ", displayText: "else", type: "kw", doc: "Else branch" },
    { text: "unless ", displayText: "unless", type: "kw", doc: "Unless condition: val unless cond else alt" },
    { text: "otherwise ", displayText: "otherwise", type: "kw", doc: "Otherwise conditional fallback" },
    { text: "and ", displayText: "and", type: "kw", doc: "Logical AND" },
    { text: "or ", displayText: "or", type: "kw", doc: "Logical OR" },
    { text: "not ", displayText: "not", type: "kw", doc: "Logical NOT" },
    { text: "null", displayText: "null", type: "kw", doc: "Null literal" },
    { text: "true", displayText: "true", type: "kw", doc: "Boolean true" },
    { text: "false", displayText: "false", type: "kw", doc: "Boolean false" },
    { text: "update {\n  case .$0 -> \n}", displayText: "update { ... }", type: "snip", doc: "Object update operator" },

    // Context & Variables
    { text: "payload", displayText: "payload", type: "var", doc: "Inbound payload" },
    { text: "vars", displayText: "vars", type: "var", doc: "Named variables map" },
    { text: "attributes", displayText: "attributes", type: "var", doc: "Inbound message attributes" },
    { text: "message", displayText: "message", type: "var", doc: "Mule message object" },
    { text: "error", displayText: "error", type: "var", doc: "Error object in error handlers" },
    { text: "$", displayText: "$", type: "var", doc: "Current element in iteration / lambda" },
    { text: "$$", displayText: "$$", type: "var", doc: "Current index / key in iteration" },
    { text: "$$$", displayText: "$$$", type: "var", doc: "Current attribute / index in mapObject" },

    // Built-in Core Functions (No import required)
    { text: "map ((item, index) -> {\n  $0\n})", displayText: "map ((item, index) -> ...)", type: "snip", doc: "map(Array, (T, Number) -> R): Array" },
    { text: "map ($)", displayText: "map ($)", type: "snip", doc: "map using anonymous shorthand ($)" },
    { text: "map ", displayText: "map", type: "fn", doc: "map(Array, (item, index) -> Any): Array" },
    { text: "mapObject ((value, key, index) -> {\n  $0\n})", displayText: "mapObject ((value, key, index) -> ...)", type: "snip", doc: "mapObject(Object, (V, K, Number) -> Object)" },
    { text: "mapObject ", displayText: "mapObject", type: "fn", doc: "mapObject(Object, (value, key, index) -> Object)" },
    { text: "filter ((item, index) -> $0)", displayText: "filter ((item, index) -> ...)", type: "snip", doc: "filter(Array, (T, Number) -> Boolean): Array" },
    { text: "filter ", displayText: "filter", type: "fn", doc: "filter(Array, (item, index) -> Boolean): Array" },
    { text: "filterObject ((value, key, index) -> $0)", displayText: "filterObject ((value, key, index) -> ...)", type: "snip", doc: "filterObject(Object, (V, K, Number) -> Boolean)" },
    { text: "filterObject ", displayText: "filterObject", type: "fn", doc: "filterObject(Object, (value, key, index) -> Boolean)" },
    { text: "reduce ((item, acc = $0) -> )", displayText: "reduce ((item, acc) -> ...)", type: "snip", doc: "reduce(Array, (T, A) -> A): A" },
    { text: "reduce ", displayText: "reduce", type: "fn", doc: "reduce(Array, (item, acc) -> Any): Any" },
    { text: "pluck ((value, key, index) -> $0)", displayText: "pluck ((value, key, index) -> ...)", type: "snip", doc: "pluck(Object, (V, K, Number) -> Any): Array" },
    { text: "pluck ", displayText: "pluck", type: "fn", doc: "pluck(Object, (value, key, index) -> Any): Array" },
    { text: "groupBy ", displayText: "groupBy", type: "fn", doc: "groupBy(Array|Object, (item) -> Key): Object" },
    { text: "orderBy ", displayText: "orderBy", type: "fn", doc: "orderBy(Array, (item) -> Comparable): Array" },
    { text: "distinctBy ", displayText: "distinctBy", type: "fn", doc: "distinctBy(Array, (item) -> Any): Array" },
    { text: "flatten($0)", displayText: "flatten(...)", type: "fn", doc: "flatten(Array<Array<T>>): Array<T>" },
    { text: "sizeOf($0)", displayText: "sizeOf(...)", type: "fn", doc: "sizeOf(Array|Object|String|Binary): Number" },
    { text: "contains ", displayText: "contains", type: "fn", doc: "contains(Array|String, Any): Boolean" },
    { text: "find ", displayText: "find", type: "fn", doc: "find(Array|String, Any): Array<Number>" },
    { text: "splitBy ", displayText: "splitBy", type: "fn", doc: "splitBy(String, Regex|String): Array<String>" },
    { text: "joinBy ", displayText: "joinBy", type: "fn", doc: "joinBy(Array, String): String" },
    { text: "indexOf ", displayText: "indexOf", type: "fn", doc: "indexOf(Array|String, Any): Number" },
    { text: "lastIndexOf ", displayText: "lastIndexOf", type: "fn", doc: "lastIndexOf(Array|String, Any): Number" },
    { text: "zip ", displayText: "zip", type: "fn", doc: "zip(Array, Array): Array<Array>" },
    { text: "unzip($0)", displayText: "unzip(...)", type: "fn", doc: "unzip(Array<Array>): Array<Array>" },
    { text: "entriesOf($0)", displayText: "entriesOf(...)", type: "fn", doc: "entriesOf(Object): Array<Entry>" },
    { text: "keysOf($0)", displayText: "keysOf(...)", type: "fn", doc: "keysOf(Object): Array<Key>" },
    { text: "valuesOf($0)", displayText: "valuesOf(...)", type: "fn", doc: "valuesOf(Object): Array<Any>" },
    { text: "namesOf($0)", displayText: "namesOf(...)", type: "fn", doc: "namesOf(Object): Array<String>" },
    { text: "sum($0)", displayText: "sum(...)", type: "fn", doc: "sum(Array<Number>): Number" },
    { text: "avg($0)", displayText: "avg(...)", type: "fn", doc: "avg(Array<Number>): Number" },
    { text: "min($0)", displayText: "min(...)", type: "fn", doc: "min(Array<Comparable>): Comparable" },
    { text: "max($0)", displayText: "max(...)", type: "fn", doc: "max(Array<Comparable>): Comparable" },
    { text: "minBy ", displayText: "minBy", type: "fn", doc: "minBy(Array, (item) -> Comparable)" },
    { text: "maxBy ", displayText: "maxBy", type: "fn", doc: "maxBy(Array, (item) -> Comparable)" },
    { text: "isEmpty($0)", displayText: "isEmpty(...)", type: "fn", doc: "isEmpty(Any): Boolean" },
    { text: "isBlank($0)", displayText: "isBlank(...)", type: "fn", doc: "isBlank(String): Boolean" },
    { text: "upper($0)", displayText: "upper(...)", type: "fn", doc: "upper(String): String" },
    { text: "lower($0)", displayText: "lower(...)", type: "fn", doc: "lower(String): String" },
    { text: "trim($0)", displayText: "trim(...)", type: "fn", doc: "trim(String): String" },
    { text: "startsWith ", displayText: "startsWith", type: "fn", doc: "startsWith(String, prefix: String): Boolean" },
    { text: "endsWith ", displayText: "endsWith", type: "fn", doc: "endsWith(String, suffix: String): Boolean" },
    { text: "scan ", displayText: "scan", type: "fn", doc: "scan(String, Regex): Array<Array<String>>" },
    { text: "replace ", displayText: "replace", type: "fn", doc: "replace(String, Regex|String) with String" },
    { text: "match ", displayText: "match", type: "fn", doc: "match(String, Regex): Array<String>" },
    { text: "matches ", displayText: "matches", type: "fn", doc: "matches(String, Regex): Boolean" },
    { text: "padStart($0)", displayText: "padStart(...)", type: "fn", doc: "padStart(String, targetLen, padStr): String" },
    { text: "padEnd($0)", displayText: "padEnd(...)", type: "fn", doc: "padEnd(String, targetLen, padStr): String" },
    { text: "abs($0)", displayText: "abs(...)", type: "fn", doc: "abs(Number): Number" },
    { text: "ceil($0)", displayText: "ceil(...)", type: "fn", doc: "ceil(Number): Number" },
    { text: "floor($0)", displayText: "floor(...)", type: "fn", doc: "floor(Number): Number" },
    { text: "round($0)", displayText: "round(...)", type: "fn", doc: "round(Number): Number" },
    { text: "sqrt($0)", displayText: "sqrt(...)", type: "fn", doc: "sqrt(Number): Number" },
    { text: "mod ", displayText: "mod", type: "fn", doc: "mod(Number, Number): Number" },
    { text: "pow ", displayText: "pow", type: "fn", doc: "pow(Number, Number): Number" },
    { text: "log($0)", displayText: "log(...)", type: "fn", doc: "log(String, Any): Any" },
    { text: "random()", displayText: "random()", type: "fn", doc: "random(): Number (0.0 to 1.0)" },
    { text: "randomInt($0)", displayText: "randomInt(...)", type: "fn", doc: "randomInt(max: Number): Number" },
    { text: "typeOf($0)", displayText: "typeOf(...)", type: "fn", doc: "typeOf(Any): Type" },
    { text: "now()", displayText: "now()", type: "fn", doc: "now(): DateTime" },
    { text: "uuid()", displayText: "uuid()", type: "fn", doc: "uuid(): String (UUID v4)" },
    { text: "read($0)", displayText: "read(...)", type: "fn", doc: "read(String|Binary, mimeType): Any" },
    { text: "readUrl($0)", displayText: "readUrl(...)", type: "fn", doc: "readUrl(String, mimeType): Any" },
    { text: "write($0)", displayText: "write(...)", type: "fn", doc: "write(Any, mimeType): String|Binary" },
    { text: "mergeWith ", displayText: "mergeWith", type: "fn", doc: "mergeWith(Object, Object): Object" },

    // Data Types
    { text: "String", displayText: "String", type: "type", doc: "String data type" },
    { text: "Number", displayText: "Number", type: "type", doc: "Number data type" },
    { text: "Boolean", displayText: "Boolean", type: "type", doc: "Boolean data type" },
    { text: "Array", displayText: "Array", type: "type", doc: "Array collection type" },
    { text: "Object", displayText: "Object", type: "type", doc: "Object key-value type" },
    { text: "DateTime", displayText: "DateTime", type: "type", doc: "DateTime type (|2026-11-21T12:00:00Z|)" },
    { text: "Date", displayText: "Date", type: "type", doc: "Date type (|2026-11-21|)" },
    { text: "Time", displayText: "Time", type: "type", doc: "Time type (|12:00:00|)" },
    { text: "LocalDateTime", displayText: "LocalDateTime", type: "type", doc: "LocalDateTime type" },
    { text: "LocalDate", displayText: "LocalDate", type: "type", doc: "LocalDate type" },
    { text: "LocalTime", displayText: "LocalTime", type: "type", doc: "LocalTime type" },
    { text: "TimeZone", displayText: "TimeZone", type: "type", doc: "TimeZone type" },
    { text: "Period", displayText: "Period", type: "type", doc: "Period duration type" },
    { text: "Binary", displayText: "Binary", type: "type", doc: "Binary byte stream type" },
    { text: "Regex", displayText: "Regex", type: "type", doc: "Regular expression type (/.../)" },
    { text: "Null", displayText: "Null", type: "type", doc: "Null type" },
    { text: "Any", displayText: "Any", type: "type", doc: "Any generic type" },

    // Module References
    { text: "dw::core::Arrays", displayText: "dw::core::Arrays", type: "mod", doc: "Core Arrays standard library" },
    { text: "dw::core::Strings", displayText: "dw::core::Strings", type: "mod", doc: "Core Strings standard library" },
    { text: "dw::core::Objects", displayText: "dw::core::Objects", type: "mod", doc: "Core Objects standard library" },
    { text: "dw::core::Numbers", displayText: "dw::core::Numbers", type: "mod", doc: "Core Numbers standard library" },
    { text: "dw::core::Periods", displayText: "dw::core::Periods", type: "mod", doc: "Core Periods standard library" },
    { text: "dw::core::Dates", displayText: "dw::core::Dates", type: "mod", doc: "Core Dates standard library" },
    { text: "dw::core::Binaries", displayText: "dw::core::Binaries", type: "mod", doc: "Core Binaries standard library" },
    { text: "dw::core::URL", displayText: "dw::core::URL", type: "mod", doc: "Core URL standard library" },
    { text: "dw::util::Coercions", displayText: "dw::util::Coercions", type: "mod", doc: "Coercions utility library" },
    { text: "dw::util::Math", displayText: "dw::util::Math", type: "mod", doc: "Math utility library" },
    { text: "dw::util::Timer", displayText: "dw::util::Timer", type: "mod", doc: "Timer utility library" },
    { text: "dw::util::Diff", displayText: "dw::util::Diff", type: "mod", doc: "Structural Diff utility library" },
    { text: "dw::Crypto", displayText: "dw::Crypto", type: "mod", doc: "Cryptography module" },
    { text: "dw::System", displayText: "dw::System", type: "mod", doc: "System runtime module" }
  ].concat(MIME_TYPES).concat(DW_MODULE_FUNCTIONS);

  // ==========================================
  // 3. AUTO-IMPORT MANAGER
  // ==========================================

  function ensureImport(cm, moduleName) {
    if (!moduleName) return { inserted: false, linesShift: 0 };
    var fullText = cm.getValue();
    var escapedMod = moduleName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    // Check if module is already imported in any form
    var importRegex = new RegExp("(?:from\\s+|import\\s+)" + escapedMod + "\\b");
    if (importRegex.test(fullText)) {
      return { inserted: false, linesShift: 0 };
    }

    var importStatement = "import * from " + moduleName;
    var lines = fullText.split("\n");
    var headerSepLine = -1;

    for (var i = 0; i < lines.length; i++) {
      if (lines[i].trim() === "---") {
        headerSepLine = i;
        break;
      }
    }

    if (headerSepLine >= 0) {
      cm.replaceRange(importStatement + "\n", CMPos(headerSepLine, 0));
      return { inserted: true, insertLine: headerSepLine, linesShift: 1 };
    } else {
      var insertLine = 0;
      if (lines.length > 0 && lines[0].startsWith("%dw")) {
        insertLine = 1;
        if (lines.length > 1 && lines[1].startsWith("output")) {
          insertLine = 2;
        }
      }
      cm.replaceRange(importStatement + "\n", CMPos(insertLine, 0));
      return { inserted: true, insertLine: insertLine, linesShift: 1 };
    }
  }

  // ==========================================
  // 4. PAYLOAD PARSERS (JSON / CSV / XML / YAML)
  // ==========================================

  function parseCsvHeaders(raw) {
    if (!raw || !raw.trim()) return [];
    var lines = raw.split(/\r?\n/).filter(function(l){ return l.trim().length > 0; });
    if (!lines.length) return [];
    var header = lines[0];
    var delimiter = ",";
    var commas = (header.match(/,/g) || []).length;
    var semis = (header.match(/;/g) || []).length;
    var tabs = (header.match(/\t/g) || []).length;
    if (semis > commas && semis > tabs) delimiter = ";";
    else if (tabs > commas && tabs > semis) delimiter = "\t";

    return header.split(delimiter).map(function(c) {
      return c.trim().replace(/^["']|["']$/g, '');
    }).filter(function(c){ return c.length > 0; });
  }

  function parseXmlTree(raw) {
    try {
      var parser = new DOMParser();
      var doc = parser.parseFromString(raw, "text/xml");
      if (doc.getElementsByTagName("parsererror").length > 0) return null;
      
      function buildTree(node) {
        var obj = {
          _tag: node.tagName,
          _attrs: [],
          _children: {}
        };
        if (node.attributes) {
          for (var i = 0; i < node.attributes.length; i++) {
            obj._attrs.push("@" + node.attributes[i].name);
          }
        }
        if (node.children) {
          for (var j = 0; j < node.children.length; j++) {
            var child = node.children[j];
            var tag = child.tagName;
            if (!obj._children[tag]) {
              obj._children[tag] = buildTree(child);
            }
          }
        }
        return obj;
      }
      return buildTree(doc.documentElement);
    } catch(e) {
      return null;
    }
  }

  function parseSimpleYaml(raw) {
    if (!raw || !raw.trim()) return {};
    var lines = raw.split(/\r?\n/);
    var root = {};
    var stack = [{ indent: -1, obj: root }];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      var indent = line.search(/\S/);
      if (indent === -1) continue;

      var m = line.match(/^(\s*)(?:-\s+)?([a-zA-Z0-9_\-]+)\s*:\s*(.*)$/);
      if (m) {
        var key = m[2];
        var valStr = m[3].trim();

        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
          stack.pop();
        }
        var parent = stack[stack.length - 1].obj;

        if (!valStr || valStr.startsWith("#")) {
          parent[key] = parent[key] || {};
          stack.push({ indent: indent, obj: parent[key] });
        } else {
          parent[key] = valStr;
        }
      }
    }
    return root;
  }

  function analyzePayload(rawText, mime) {
    if (!rawText || !rawText.trim()) return null;
    mime = (mime || "").toLowerCase();

    if (mime === "text/plain" || mime.indexOf("text/plain") >= 0) {
      return null;
    }

    if (mime.indexOf("json") >= 0 || rawText.trim().startsWith("{") || rawText.trim().startsWith("[")) {
      try {
        var parsed = JSON.parse(rawText);
        return { type: "json", data: parsed };
      } catch(e) {}
    }

    if (mime.indexOf("csv") >= 0) {
      var cols = parseCsvHeaders(rawText);
      if (cols.length) return { type: "csv", columns: cols };
    }

    if (mime.indexOf("xml") >= 0 || rawText.trim().startsWith("<")) {
      var xmlTree = parseXmlTree(rawText);
      if (xmlTree) return { type: "xml", data: xmlTree };
    }

    if (mime.indexOf("yaml") >= 0 || mime.indexOf("yml") >= 0) {
      var yamlObj = parseSimpleYaml(rawText);
      if (yamlObj && Object.keys(yamlObj).length > 0) return { type: "yaml", data: yamlObj };
    }

    try {
      var jFall = JSON.parse(rawText);
      return { type: "json", data: jFall };
    } catch(e) {}

    if (rawText.indexOf(",") >= 0 && rawText.indexOf("\n") >= 0) {
      var cFall = parseCsvHeaders(rawText);
      if (cFall.length > 1) return { type: "csv", columns: cFall };
    }

    return null;
  }

  // ==========================================
  // 5. PROPERTY SUGGESTION RESOLVER
  // ==========================================

  function getPropertySuggestions(targetExpr, propQuery, payloadInfo, rawVars) {
    var hints = [];
    var parts = targetExpr.split(".");
    var rootName = parts[0];
    var subPath = parts.slice(1);

    if (rootName === "vars") {
      var varsObj = {};
      try {
        if (rawVars && rawVars.trim()) varsObj = JSON.parse(rawVars);
      } catch(e) {}

      var curV = varsObj;
      for (var i = 0; i < subPath.length; i++) {
        if (curV && typeof curV === "object") curV = curV[subPath[i]];
        else { curV = null; break; }
      }

      if (curV && typeof curV === "object") {
        Object.keys(curV).forEach(function(k) {
          var val = curV[k];
          var t = Array.isArray(val) ? "Array" : (typeof val === "object" && val !== null ? "Object" : typeof val);
          var doc = "vars property: " + t + (typeof val !== "object" ? " (" + String(val).slice(0, 25) + ")" : "");
          hints.push({ text: k, displayText: k, type: "var", doc: doc });
        });
      }
      return hints;
    }

    if (rootName === "payload" || rootName === "$" || rootName === "$$") {
      if (!payloadInfo) return hints;

      if (payloadInfo.type === "csv") {
        if (subPath.length === 0) {
          payloadInfo.columns.forEach(function(col) {
            hints.push({
              text: col,
              displayText: col,
              type: "field",
              doc: "CSV column (" + col + ")"
            });
          });
        }
        return hints;
      }

      if (payloadInfo.type === "json" || payloadInfo.type === "yaml") {
        var curObj = payloadInfo.data;
        if (Array.isArray(curObj)) curObj = curObj[0] || {};

        for (var j = 0; j < subPath.length; j++) {
          var seg = subPath[j];
          if (Array.isArray(curObj)) curObj = curObj[0] || {};
          if (curObj && typeof curObj === "object") curObj = curObj[seg];
          else { curObj = null; break; }
        }

        if (Array.isArray(curObj)) curObj = curObj[0] || {};

        if (curObj && typeof curObj === "object") {
          Object.keys(curObj).forEach(function(k) {
            var val = curObj[k];
            var typeDesc = Array.isArray(val) ? "Array" : (typeof val === "object" && val !== null ? "Object" : typeof val);
            var sample = typeof val !== "object" && val !== null ? " (" + String(val).slice(0, 25) + ")" : "";
            hints.push({
              text: k,
              displayText: k,
              type: "field",
              doc: "Field: " + typeDesc + sample
            });
          });
        }
        return hints;
      }

      if (payloadInfo.type === "xml") {
        var xmlNode = payloadInfo.data;
        if (subPath.length === 0) {
          hints.push({ text: xmlNode._tag, displayText: xmlNode._tag, type: "field", doc: "XML root element <" + xmlNode._tag + ">" });
          Object.keys(xmlNode._children).forEach(function(chTag) {
            hints.push({ text: chTag, displayText: chTag, type: "field", doc: "XML child element <" + chTag + ">" });
          });
          xmlNode._attrs.forEach(function(at) {
            hints.push({ text: at, displayText: at, type: "field", doc: "XML attribute " + at });
          });
          return hints;
        }

        var curXml = xmlNode;
        for (var x = 0; x < subPath.length; x++) {
          var step = subPath[x];
          if (step === curXml._tag) continue;
          if (curXml._children && curXml._children[step]) curXml = curXml._children[step];
          else { curXml = null; break; }
        }

        if (curXml) {
          Object.keys(curXml._children).forEach(function(chTag) {
            hints.push({ text: chTag, displayText: chTag, type: "field", doc: "XML element <" + chTag + ">" });
          });
          curXml._attrs.forEach(function(at) {
            hints.push({ text: at, displayText: at, type: "field", doc: "XML attribute " + at });
          });
        }
        return hints;
      }
    }

    return hints;
  }

  // ==========================================
  // 6. DYNAMIC SCRIPT & VARIABLES HINTS
  // ==========================================

  function getDynamicHints(varsProvider, scriptProvider) {
    var hints = [];
    try {
      var rawVars = typeof varsProvider === "function" ? varsProvider() : "";
      if (rawVars && rawVars.trim()) {
        var parsed = JSON.parse(rawVars);
        if (typeof parsed === "object" && parsed !== null) {
          Object.keys(parsed).forEach(function(k) {
            hints.push({
              text: k,
              displayText: k,
              type: "var",
              doc: "Variable (vars." + k + ")"
            });
            hints.push({
              text: "vars." + k,
              displayText: "vars." + k,
              type: "var",
              doc: "vars." + k + " (" + typeof parsed[k] + ")"
            });
          });
        }
      }
    } catch(e) {}

    try {
      var scText = typeof scriptProvider === "function" ? scriptProvider() : "";
      if (scText) {
        var varRegex = /\bvar\s+([a-zA-Z0-9_$]+)/g;
        var match;
        while ((match = varRegex.exec(scText)) !== null) {
          var vName = match[1];
          if (vName && !hints.some(function(h){ return h.displayText === vName; })) {
            hints.push({
              text: vName,
              displayText: vName,
              type: "var",
              doc: "Script variable (var " + vName + ")"
            });
          }
        }
        var funRegex = /\bfun\s+([a-zA-Z0-9_$]+)/g;
        while ((match = funRegex.exec(scText)) !== null) {
          var fName = match[1];
          if (fName && !hints.some(function(h){ return h.displayText === fName; })) {
            hints.push({
              text: fName + "($0)",
              displayText: fName + "(...)",
              type: "fn",
              doc: "Script function (fun " + fName + ")"
            });
          }
        }
      }
    } catch(e) {}

    return hints;
  }

  // ==========================================
  // 7. MAIN AUTOCOMPLETE PROVIDER FACTORY
  // ==========================================

  function createDataWeaveHint(opts) {
    opts = opts || {};
    var getVars = opts.getVars || function(){ return ""; };
    var getScript = opts.getScript || function(){ return ""; };
    var getPayload = opts.getPayload || function(){ return ""; };
    var getPayloadMime = opts.getPayloadMime || function(){ return "application/json"; };

    return function(cm, options) {
      var cursor = cm.getCursor();
      var line = cm.getLine(cursor.line);
      var lineBefore = line.slice(0, cursor.ch);

      // CASE 1: PROPERTY ACCESS (payload.xxx or vars.xxx)
      var propMatch = lineBefore.match(/(payload|vars|\$|[a-zA-Z0-9_$]+(?:\.[a-zA-Z0-9_$]+)*)\.([a-zA-Z0-9_$-]*)$/);
      if (propMatch) {
        var targetExpr = propMatch[1];
        var propQuery = propMatch[2].toLowerCase();
        var payloadInfo = analyzePayload(getPayload(), getPayloadMime());
        var propHints = getPropertySuggestions(targetExpr, propQuery, payloadInfo, getVars());

        if (propHints && propHints.length > 0) {
          var filteredProps = propHints.filter(function(h) {
            if (!propQuery) return true;
            return h.text.toLowerCase().indexOf(propQuery) >= 0;
          });

          if (filteredProps.length > 0) {
            var propStart = cursor.ch - propMatch[2].length;
            var propEnd = cursor.ch;
            return {
              list: filteredProps.map(function(item) {
                return {
                  text: item.text,
                  displayText: item.displayText,
                  className: "dw-hint-" + (item.type || "field"),
                  data: item,
                  render: renderHintItem,
                  hint: function(c) {
                    c.replaceRange(item.text, CMPos(cursor.line, propStart), CMPos(cursor.line, propEnd), "complete");
                  }
                };
              }),
              from: CMPos(cursor.line, propStart),
              to: CMPos(cursor.line, propEnd)
            };
          }
        }
      }

      // CASE 2: OUTPUT MIME DECLARATION (output application/...)
      var outputMatch = lineBefore.match(/\boutput\s+([a-zA-Z0-9_\/-]*)$/);
      if (outputMatch) {
        var mimeQuery = outputMatch[1].toLowerCase();
        var mimeCandidates = MIME_TYPES.concat(MIME_SHORTCUTS);
        var filteredMimes = mimeCandidates.filter(function(m) {
          if (!mimeQuery) return true;
          var dt = m.displayText.toLowerCase();
          var tx = m.text.toLowerCase();
          return tx.startsWith(mimeQuery) || dt.indexOf(mimeQuery) >= 0 || tx.indexOf(mimeQuery) >= 0;
        });

        if (filteredMimes.length > 0) {
          var mimeStart = cursor.ch - outputMatch[1].length;
          var mimeEnd = cursor.ch;
          return {
            list: filteredMimes.map(function(item) {
              return {
                text: item.text,
                displayText: item.displayText,
                className: "dw-hint-mime",
                data: item,
                render: renderHintItem,
                hint: function(c) {
                  c.replaceRange(item.text, CMPos(cursor.line, mimeStart), CMPos(cursor.line, mimeEnd), "complete");
                }
              };
            }),
            from: CMPos(cursor.line, mimeStart),
            to: CMPos(cursor.line, mimeEnd)
          };
        }
      }

      // CASE 3: GENERAL CATALOG / KEYWORDS / FUNCTIONS
      var start = cursor.ch;
      var end = cursor.ch;

      while (start > 0 && /[a-zA-Z0-9_$%:\.\/-]/.test(line.charAt(start - 1))) {
        start--;
      }
      while (end < line.length && /[a-zA-Z0-9_$%:\.\/-]/.test(line.charAt(end))) {
        end++;
      }

      var curWord = line.slice(start, cursor.ch);
      var curWordLower = curWord.toLowerCase();

      var allHints = DW_CATALOG.concat(getDynamicHints(getVars, getScript));
      var matches = [];

      allHints.forEach(function(item) {
        var dt = (item.displayText || item.text).toLowerCase();
        var tx = item.text.toLowerCase();
        var matchScore = -1;

        if (!curWord) {
          matchScore = 100;
        } else if (dt.startsWith(curWordLower) || tx.startsWith(curWordLower)) {
          matchScore = 1;
        } else if (dt.indexOf(curWordLower) >= 0 || tx.indexOf(curWordLower) >= 0) {
          matchScore = 2;
        }

        if (matchScore > 0) {
          matches.push({
            score: matchScore,
            item: item
          });
        }
      });

      matches.sort(function(a, b) {
        if (a.score !== b.score) return a.score - b.score;
        return (a.item.displayText || a.item.text).localeCompare(b.item.displayText || b.item.text);
      });

      var list = matches.map(function(m) {
        var it = m.item;
        return {
          text: it.text,
          displayText: it.displayText || it.text,
          className: "dw-hint-" + (it.type || "kw"),
          data: it,
          render: renderHintItem,
          hint: function(c) {
            var from = CMPos(cursor.line, start);
            var to = CMPos(cursor.line, end);
            var insertText = it.text;
            var offset = insertText.indexOf("$0");
            if (offset >= 0) {
              insertText = insertText.replace("$0", "");
            }

            // Insert function text
            c.replaceRange(insertText, from, to, "complete");

            // Auto-insert Mule import if required
            var importResult = { inserted: false, linesShift: 0 };
            if (it.module) {
              importResult = ensureImport(c, it.module);
            }

            // Calculate new cursor position
            if (offset >= 0) {
              var lines = insertText.slice(0, offset).split("\n");
              var shiftedLine = from.line;
              if (importResult.inserted && from.line >= importResult.insertLine) {
                shiftedLine += importResult.linesShift;
              }
              var targetLine = shiftedLine + lines.length - 1;
              var targetCh = (lines.length === 1 ? from.ch : 0) + lines[lines.length - 1].length;
              c.setCursor({ line: targetLine, ch: targetCh });
            }
          }
        };
      });

      if (!list.length) return null;

      return {
        list: list,
        from: CMPos(cursor.line, start),
        to: CMPos(cursor.line, end)
      };
    };
  }

  function renderHintItem(elt, self, data) {
    var it = data.data || data;
    elt.className += " dw-hint-item";

    var left = document.createElement("div");
    left.className = "dw-hint-left";

    var badge = document.createElement("span");
    badge.className = "dw-hint-badge dw-badge-" + (it.type || "kw");
    badge.textContent = it.type || "kw";

    var name = document.createElement("span");
    name.className = "dw-hint-name";
    name.textContent = it.displayText || it.text;

    left.appendChild(badge);
    left.appendChild(name);

    if (it.module) {
      var modTag = document.createElement("span");
      modTag.className = "dw-hint-mod-tag";
      modTag.textContent = it.module.replace(/^dw::/, "");
      left.appendChild(modTag);
    }

    var doc = document.createElement("span");
    doc.className = "dw-hint-doc";
    doc.textContent = it.doc || "";

    elt.appendChild(left);
    elt.appendChild(doc);
  }

  function setupAutocomplete(edSc, edVars, edIn, inMime) {
    if (!global.CodeMirror || !edSc || !edSc.cm || !global.CodeMirror.showHint) return;

    var dwHint = createDataWeaveHint({
      getVars: function() { return edVars ? edVars.getValue() : ""; },
      getScript: function() { return edSc ? edSc.getValue() : ""; },
      getPayload: function() { return edIn ? edIn.getValue() : ""; },
      getPayloadMime: function() { return inMime ? inMime.value : "application/json"; }
    });

    edSc.cm.on("inputRead", function(cm, change) {
      if (change.origin === "+input") {
        var ch = change.text[0];
        if (/[a-zA-Z0-9_$%:\.\/-]/.test(ch)) {
          var cur = cm.getCursor();
          var tok = cm.getTokenAt(cur);
          if (tok.type !== "string" && tok.type !== "comment") {
            if (!cm.state.completionActive) {
              cm.showHint({
                hint: dwHint,
                completeSingle: false
              });
            }
          }
        }
      }
    });

    edSc.cm.setOption("extraKeys", Object.assign({}, edSc.cm.getOption("extraKeys") || {}, {
      "Ctrl-Space": function(cm) {
        cm.showHint({
          hint: dwHint,
          completeSingle: false
        });
      }
    }));
  }

  global.DataWeaveAutocomplete = {
    catalog: DW_CATALOG,
    moduleFunctions: DW_MODULE_FUNCTIONS,
    mimeTypes: MIME_TYPES,
    analyzePayload: analyzePayload,
    ensureImport: ensureImport,
    createHint: createDataWeaveHint,
    setup: setupAutocomplete
  };

})(window);
