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

      var result = {
        list: list,
        from: CMPos(cursor.line, start),
        to: CMPos(cursor.line, end)
      };

      if (global.CodeMirror && global.CodeMirror.on) {
        global.CodeMirror.on(result, "select", function(completion, elt) {
          showDocFlyout(completion, elt);
        });
        global.CodeMirror.on(result, "close", function() {
          hideDocFlyout();
        });
      }

      return result;
    };
  }


  // ==========================================
  // POP-UP DOCUMENTATION & HOVER ENGINE
  // ==========================================
  var DW_DOCS = {
  "map": {
    "name": "map",
    "module": "dw::Core",
    "type": "fn",
    "signature": "map(Array<T>, (item: T, index: Number) -> R): Array<R>",
    "description": "Iterates over items in an array and applies an expression that transforms each element into a new value.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "The array to transform."
      },
      {
        "name": "lambda",
        "type": "(item, index) -> R",
        "desc": "Transformation lambda function."
      }
    ],
    "returns": "Array<R>",
    "example": "%dw 2.0\noutput application/json\n---\n[1, 2, 3] map ((item, index) -> item * 10)\n// [10, 20, 30]"
  },
  "mapObject": {
    "name": "mapObject",
    "module": "dw::Core",
    "type": "fn",
    "signature": "mapObject(Object, (value: Any, key: Key, index: Number) -> Object): Object",
    "description": "Iterates over key-value pairs in an object and transforms each entry into a new key-value pair.",
    "params": [
      {
        "name": "object",
        "type": "Object",
        "desc": "The source object to transform."
      },
      {
        "name": "lambda",
        "type": "(value, key, index) -> Object",
        "desc": "Lambda returning key-value pair."
      }
    ],
    "returns": "Object",
    "example": "%dw 2.0\noutput application/json\n---\n{\n  price: 100,\n  tax: 15\n} mapObject ((v, k) -> {\n  (upper(k)): v * 1.1\n})"
  },
  "filter": {
    "name": "filter",
    "module": "dw::Core",
    "type": "fn",
    "signature": "filter(Array<T>, (item: T, index: Number) -> Boolean): Array<T>",
    "description": "Iterates over an array and returns only elements that satisfy the given predicate condition.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "The input array."
      },
      {
        "name": "condition",
        "type": "(item, index) -> Boolean",
        "desc": "Predicate condition function."
      }
    ],
    "returns": "Array<T>",
    "example": "%dw 2.0\noutput application/json\n---\n[1, 2, 3, 4, 5] filter ((n) -> n > 2)\n// [3, 4, 5]"
  },
  "filterObject": {
    "name": "filterObject",
    "module": "dw::Core",
    "type": "fn",
    "signature": "filterObject(Object, (value: Any, key: Key, index: Number) -> Boolean): Object",
    "description": "Filters key-value pairs from an object, keeping only pairs that evaluate to true.",
    "params": [
      {
        "name": "object",
        "type": "Object",
        "desc": "The source object."
      },
      {
        "name": "predicate",
        "type": "(val, key, idx) -> Boolean",
        "desc": "Filter predicate function."
      }
    ],
    "returns": "Object",
    "example": "%dw 2.0\noutput application/json\n---\n{\n  a: 10,\n  b: 0,\n  c: 25\n} filterObject ((v) -> v > 0)\n// { a: 10, c: 25 }"
  },
  "reduce": {
    "name": "reduce",
    "module": "dw::Core",
    "type": "fn",
    "signature": "reduce(Array<T>, (item: T, accumulator: A) -> A): A",
    "description": "Applies a reduction expression to each element of an array to calculate a single accumulated value.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "The input array."
      },
      {
        "name": "lambda",
        "type": "(item, accumulator) -> Any",
        "desc": "Accumulator lambda expression."
      }
    ],
    "returns": "Any",
    "example": "%dw 2.0\noutput application/json\n---\n[1, 2, 3, 4] reduce ((item, acc = 0) -> acc + item)\n// 10"
  },
  "pluck": {
    "name": "pluck",
    "module": "dw::Core",
    "type": "fn",
    "signature": "pluck(Object, (value: Any, key: Key, index: Number) -> R): Array<R>",
    "description": "Extracts values, keys, or mapped results from an object into an array.",
    "params": [
      {
        "name": "object",
        "type": "Object",
        "desc": "The source object."
      },
      {
        "name": "lambda",
        "type": "(value, key, index) -> Any",
        "desc": "Extraction lambda."
      }
    ],
    "returns": "Array<R>",
    "example": "%dw 2.0\noutput application/json\n---\n{\n  first: \"John\",\n  last: \"Doe\"\n} pluck ((v, k) -> k ++ \": \" ++ v)\n// [\"first: John\", \"last: Doe\"]"
  },
  "groupBy": {
    "name": "groupBy",
    "module": "dw::Core",
    "type": "fn",
    "signature": "groupBy(Array<T> | Object, (item: T) -> Key): Object",
    "description": "Groups elements of an array or object into a new object where keys are the criteria and values are arrays of matching items.",
    "params": [
      {
        "name": "collection",
        "type": "Array | Object",
        "desc": "The collection to partition."
      },
      {
        "name": "criteria",
        "type": "(item) -> Key",
        "desc": "Key grouping function."
      }
    ],
    "returns": "Object",
    "example": "%dw 2.0\noutput application/json\n---\n[\n  {dept: \"IT\", name: \"Alice\"},\n  {dept: \"HR\", name: \"Bob\"},\n  {dept: \"IT\", name: \"Charlie\"}\n] groupBy ((emp) -> emp.dept)"
  },
  "orderBy": {
    "name": "orderBy",
    "module": "dw::Core",
    "type": "fn",
    "signature": "orderBy(Array<T>, (item: T) -> Comparable): Array<T>",
    "description": "Orders the elements of an array by a selected attribute or sorting expression in ascending order.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "The array to sort."
      },
      {
        "name": "criteria",
        "type": "(item) -> Comparable",
        "desc": "Sorting expression."
      }
    ],
    "returns": "Array<T>",
    "example": "%dw 2.0\noutput application/json\n---\n[\n  {name: \"Zack\", age: 30},\n  {name: \"Alice\", age: 25}\n] orderBy ((p) -> p.age)"
  },
  "distinctBy": {
    "name": "distinctBy",
    "module": "dw::Core",
    "type": "fn",
    "signature": "distinctBy(Array<T>, (item: T) -> Any): Array<T>",
    "description": "Filters duplicate elements from an array using an evaluation expression.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "The array to de-duplicate."
      },
      {
        "name": "criteria",
        "type": "(item) -> Any",
        "desc": "Uniqueness criteria function."
      }
    ],
    "returns": "Array<T>",
    "example": "%dw 2.0\noutput application/json\n---\n[\n  {id: 1, name: \"A\"},\n  {id: 1, name: \"B\"},\n  {id: 2, name: \"C\"}\n] distinctBy ((it) -> it.id)"
  },
  "flatten": {
    "name": "flatten",
    "module": "dw::Core",
    "type": "fn",
    "signature": "flatten(Array<Array<T>>): Array<T>",
    "description": "Flattens nested arrays into a single-level array.",
    "params": [
      {
        "name": "array",
        "type": "Array<Array>",
        "desc": "Nested array."
      }
    ],
    "returns": "Array<T>",
    "example": "%dw 2.0\noutput application/json\n---\nflatten([[1, 2], [3, 4], [5]])\n// [1, 2, 3, 4, 5]"
  },
  "sizeOf": {
    "name": "sizeOf",
    "module": "dw::Core",
    "type": "fn",
    "signature": "sizeOf(Array | Object | String | Binary): Number",
    "description": "Returns the number of elements in an array, keys in an object, or characters in a string.",
    "params": [
      {
        "name": "value",
        "type": "Any",
        "desc": "Array, Object, String, or Binary to measure."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\noutput application/json\n---\n{\n  arr: sizeOf([1, 2, 3]), // 3\n  str: sizeOf(\"hello\"),   // 5\n  obj: sizeOf({a: 1})     // 1\n}"
  },
  "typeOf": {
    "name": "typeOf",
    "module": "dw::Core",
    "type": "fn",
    "signature": "typeOf(value: Any): Type",
    "description": "Returns the schema type of the given value (e.g. String, Number, Array, Object, Boolean).",
    "params": [
      {
        "name": "value",
        "type": "Any",
        "desc": "The value whose type is determined."
      }
    ],
    "returns": "Type",
    "example": "%dw 2.0\noutput application/json\n---\ntypeOf(\"hello\") // String\ntypeOf(123)     // Number"
  },
  "entriesOf": {
    "name": "entriesOf",
    "module": "dw::Core",
    "type": "fn",
    "signature": "entriesOf(Object): Array<Entry>",
    "description": "Returns an array of key-value entry objects representing each field in an object.",
    "params": [
      {
        "name": "object",
        "type": "Object",
        "desc": "Source object."
      }
    ],
    "returns": "Array<Entry>",
    "example": "%dw 2.0\noutput application/json\n---\nentriesOf({name: \"Alice\", age: 30})"
  },
  "keysOf": {
    "name": "keysOf",
    "module": "dw::Core",
    "type": "fn",
    "signature": "keysOf(Object): Array<Key>",
    "description": "Returns an array containing all the keys defined in an object.",
    "params": [
      {
        "name": "object",
        "type": "Object",
        "desc": "Input object."
      }
    ],
    "returns": "Array<Key>",
    "example": "%dw 2.0\noutput application/json\n---\nkeysOf({a: 1, b: 2, c: 3})\n// [\"a\", \"b\", \"c\"]"
  },
  "valuesOf": {
    "name": "valuesOf",
    "module": "dw::Core",
    "type": "fn",
    "signature": "valuesOf(Object): Array<Any>",
    "description": "Returns an array containing all the values defined in an object.",
    "params": [
      {
        "name": "object",
        "type": "Object",
        "desc": "Input object."
      }
    ],
    "returns": "Array<Any>",
    "example": "%dw 2.0\noutput application/json\n---\nvaluesOf({a: \"first\", b: \"second\"})\n// [\"first\", \"second\"]"
  },
  "namesOf": {
    "name": "namesOf",
    "module": "dw::Core",
    "type": "fn",
    "signature": "namesOf(Object): Array<String>",
    "description": "Returns an array of string names for every key in the object.",
    "params": [
      {
        "name": "object",
        "type": "Object",
        "desc": "Input object."
      }
    ],
    "returns": "Array<String>",
    "example": "%dw 2.0\noutput application/json\n---\nnamesOf({x: 10, y: 20})\n// [\"x\", \"y\"]"
  },
  "contains": {
    "name": "contains",
    "module": "dw::Core",
    "type": "fn",
    "signature": "contains(Array | String, item: Any): Boolean",
    "description": "Checks if an array contains an element or if a string contains a substring.",
    "params": [
      {
        "name": "source",
        "type": "Array | String",
        "desc": "Collection or string to inspect."
      },
      {
        "name": "item",
        "type": "Any",
        "desc": "Target element or substring."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\noutput application/json\n---\n[1, 2, 3] contains 2 // true\n\"DataWeave\" contains \"Weave\" // true"
  },
  "find": {
    "name": "find",
    "module": "dw::Core",
    "type": "fn",
    "signature": "find(Array | String, item: Any | Regex): Array<Number>",
    "description": "Returns an array of 0-based indices where the target value or regex matches.",
    "params": [
      {
        "name": "source",
        "type": "Array | String",
        "desc": "Collection or string."
      },
      {
        "name": "item",
        "type": "Any | Regex",
        "desc": "Element or regex pattern."
      }
    ],
    "returns": "Array<Number>",
    "example": "%dw 2.0\noutput application/json\n---\n[10, 20, 30, 20] find 20 // [1, 3]\n\"banana\" find \"an\"       // [1, 3]"
  },
  "splitBy": {
    "name": "splitBy",
    "module": "dw::Core",
    "type": "fn",
    "signature": "splitBy(text: String, separator: String | Regex): Array<String>",
    "description": "Splits a string into an array of substrings using a delimiter or regex pattern.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string to split."
      },
      {
        "name": "separator",
        "type": "String | Regex",
        "desc": "Delimiter string or regex."
      }
    ],
    "returns": "Array<String>",
    "example": "%dw 2.0\noutput application/json\n---\n\"apple,banana,cherry\" splitBy \",\"\n// [\"apple\", \"banana\", \"cherry\"]"
  },
  "joinBy": {
    "name": "joinBy",
    "module": "dw::Core",
    "type": "fn",
    "signature": "joinBy(elements: Array, separator: String): String",
    "description": "Concatenates elements of an array into a single string with the specified separator.",
    "params": [
      {
        "name": "elements",
        "type": "Array",
        "desc": "Array of items."
      },
      {
        "name": "separator",
        "type": "String",
        "desc": "Glue string."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\noutput application/json\n---\n[\"Mule\", \"DataWeave\", \"Runtime\"] joinBy \" - \"\n// \"Mule - DataWeave - Runtime\""
  },
  "indexOf": {
    "name": "indexOf",
    "module": "dw::Core",
    "type": "fn",
    "signature": "indexOf(Array | String, item: Any): Number",
    "description": "Returns the first index of an element in an array or substring in a string, or -1 if not found.",
    "params": [
      {
        "name": "source",
        "type": "Array | String",
        "desc": "Source sequence."
      },
      {
        "name": "item",
        "type": "Any",
        "desc": "Target element."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\noutput application/json\n---\n\"hello world\" indexOf \"world\" // 6"
  },
  "lastIndexOf": {
    "name": "lastIndexOf",
    "module": "dw::Core",
    "type": "fn",
    "signature": "lastIndexOf(Array | String, item: Any): Number",
    "description": "Returns the last index of an element in an array or substring in a string, or -1 if not found.",
    "params": [
      {
        "name": "source",
        "type": "Array | String",
        "desc": "Source sequence."
      },
      {
        "name": "item",
        "type": "Any",
        "desc": "Target element."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\noutput application/json\n---\n\"banana\" lastIndexOf \"a\" // 5"
  },
  "zip": {
    "name": "zip",
    "module": "dw::Core",
    "type": "fn",
    "signature": "zip(array1: Array, array2: Array): Array<Array>",
    "description": "Merges two arrays into an array of 2-element tuples paired by index.",
    "params": [
      {
        "name": "array1",
        "type": "Array",
        "desc": "First array."
      },
      {
        "name": "array2",
        "type": "Array",
        "desc": "Second array."
      }
    ],
    "returns": "Array<Array>",
    "example": "%dw 2.0\noutput application/json\n---\nzip([\"a\", \"b\"], [1, 2])\n// [[\"a\", 1], [\"b\", 2]]"
  },
  "unzip": {
    "name": "unzip",
    "module": "dw::Core",
    "type": "fn",
    "signature": "unzip(matrix: Array<Array>): Array<Array>",
    "description": "Transposes an array of arrays, grouping elements by sub-index.",
    "params": [
      {
        "name": "matrix",
        "type": "Array<Array>",
        "desc": "Matrix of tuples."
      }
    ],
    "returns": "Array<Array>",
    "example": "%dw 2.0\noutput application/json\n---\nunzip([[\"a\", 1], [\"b\", 2]])\n// [[\"a\", \"b\"], [1, 2]]"
  },
  "sum": {
    "name": "sum",
    "module": "dw::Core",
    "type": "fn",
    "signature": "sum(Array<Number>): Number",
    "description": "Returns the arithmetic sum of numbers in an array.",
    "params": [
      {
        "name": "numbers",
        "type": "Array<Number>",
        "desc": "Array of numeric values."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\noutput application/json\n---\nsum([10, 20, 30]) // 60"
  },
  "avg": {
    "name": "avg",
    "module": "dw::Core",
    "type": "fn",
    "signature": "avg(Array<Number>): Number",
    "description": "Returns the average (mean) of numbers in an array.",
    "params": [
      {
        "name": "numbers",
        "type": "Array<Number>",
        "desc": "Array of numeric values."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\noutput application/json\n---\navg([10, 20, 30]) // 20"
  },
  "min": {
    "name": "min",
    "module": "dw::Core",
    "type": "fn",
    "signature": "min(Array<Comparable>): Comparable",
    "description": "Returns the lowest value from an array of comparable elements.",
    "params": [
      {
        "name": "elements",
        "type": "Array<Comparable>",
        "desc": "Array of items."
      }
    ],
    "returns": "Comparable",
    "example": "%dw 2.0\noutput application/json\n---\nmin([5, 1, 9, 3]) // 1"
  },
  "max": {
    "name": "max",
    "module": "dw::Core",
    "type": "fn",
    "signature": "max(Array<Comparable>): Comparable",
    "description": "Returns the highest value from an array of comparable elements.",
    "params": [
      {
        "name": "elements",
        "type": "Array<Comparable>",
        "desc": "Array of items."
      }
    ],
    "returns": "Comparable",
    "example": "%dw 2.0\noutput application/json\n---\nmax([5, 1, 9, 3]) // 9"
  },
  "minBy": {
    "name": "minBy",
    "module": "dw::Core",
    "type": "fn",
    "signature": "minBy(Array<T>, (item: T) -> Comparable): T",
    "description": "Returns the element that produces the lowest value when evaluated by the criteria lambda.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "Input array."
      },
      {
        "name": "criteria",
        "type": "(item) -> Comparable",
        "desc": "Evaluation function."
      }
    ],
    "returns": "T",
    "example": "%dw 2.0\noutput application/json\n---\n[{\"price\": 10}, {\"price\": 5}] minBy ((i) -> i.price)"
  },
  "maxBy": {
    "name": "maxBy",
    "module": "dw::Core",
    "type": "fn",
    "signature": "maxBy(Array<T>, (item: T) -> Comparable): T",
    "description": "Returns the element that produces the highest value when evaluated by the criteria lambda.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "Input array."
      },
      {
        "name": "criteria",
        "type": "(item) -> Comparable",
        "desc": "Evaluation function."
      }
    ],
    "returns": "T",
    "example": "%dw 2.0\noutput application/json\n---\n[{\"price\": 10}, {\"price\": 25}] maxBy ((i) -> i.price)"
  },
  "isEmpty": {
    "name": "isEmpty",
    "module": "dw::Core",
    "type": "fn",
    "signature": "isEmpty(value: Any): Boolean",
    "description": "Returns true if the given collection, string, or object is empty, null, or has size 0.",
    "params": [
      {
        "name": "value",
        "type": "Any",
        "desc": "Target value to check."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\noutput application/json\n---\nisEmpty([])       // true\nisEmpty(\"\")       // true\nisEmpty({ a: 1 }) // false"
  },
  "isBlank": {
    "name": "isBlank",
    "module": "dw::Core",
    "type": "fn",
    "signature": "isBlank(text: String): Boolean",
    "description": "Returns true if the given string is empty, null, or consists entirely of whitespace.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\noutput application/json\n---\nisBlank(\"   \")    // true\nisBlank(\"hello\")  // false"
  },
  "upper": {
    "name": "upper",
    "module": "dw::Core",
    "type": "fn",
    "signature": "upper(text: String): String",
    "description": "Converts all characters in the string to uppercase.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\noutput application/json\n---\nupper(\"mule runtime\") // \"MULE RUNTIME\""
  },
  "lower": {
    "name": "lower",
    "module": "dw::Core",
    "type": "fn",
    "signature": "lower(text: String): String",
    "description": "Converts all characters in the string to lowercase.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\noutput application/json\n---\nlower(\"DATAWEAVE\") // \"dataweave\""
  },
  "trim": {
    "name": "trim",
    "module": "dw::Core",
    "type": "fn",
    "signature": "trim(text: String): String",
    "description": "Removes leading and trailing whitespace from a string.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\noutput application/json\n---\ntrim(\"  hello world  \") // \"hello world\""
  },
  "startsWith": {
    "name": "startsWith",
    "module": "dw::Core",
    "type": "fn",
    "signature": "startsWith(text: String, prefix: String): Boolean",
    "description": "Returns true if the string begins with the specified prefix.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      },
      {
        "name": "prefix",
        "type": "String",
        "desc": "Prefix substring."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\noutput application/json\n---\nstartsWith(\"DataWeave\", \"Data\") // true"
  },
  "endsWith": {
    "name": "endsWith",
    "module": "dw::Core",
    "type": "fn",
    "signature": "endsWith(text: String, suffix: String): Boolean",
    "description": "Returns true if the string ends with the specified suffix.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      },
      {
        "name": "suffix",
        "type": "String",
        "desc": "Suffix substring."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\noutput application/json\n---\nendsWith(\"index.json\", \".json\") // true"
  },
  "scan": {
    "name": "scan",
    "module": "dw::Core",
    "type": "fn",
    "signature": "scan(text: String, regex: Regex): Array<Array<String>>",
    "description": "Finds all matches and capture groups for a regular expression in a string.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      },
      {
        "name": "regex",
        "type": "Regex",
        "desc": "Regular expression pattern."
      }
    ],
    "returns": "Array<Array<String>>",
    "example": "%dw 2.0\noutput application/json\n---\n\"10 USD, 20 EUR\" scan /([0-9]+)\\s+([A-Z]+)/"
  },
  "replace": {
    "name": "replace",
    "module": "dw::Core",
    "type": "fn",
    "signature": "replace(text: String, matcher: String | Regex) with replacement: String",
    "description": "Replaces occurrences of a substring or regular expression with a replacement string.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      },
      {
        "name": "matcher",
        "type": "String | Regex",
        "desc": "Pattern to replace."
      },
      {
        "name": "replacement",
        "type": "String",
        "desc": "New replacement string."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\noutput application/json\n---\n\"hello world\" replace \"world\" with \"MuleSoft\""
  },
  "match": {
    "name": "match",
    "module": "Pattern Matching",
    "type": "kw",
    "signature": "<expression> match {\n  case <pattern> -> <result>\n  else -> <default>\n}",
    "description": "Pattern matching expression that compares values against types, regexes, or literals.",
    "params": [],
    "returns": "Any",
    "example": "%dw 2.0\noutput application/json\n---\npayload match {\n  case is Array -> sizeOf(payload)\n  case is Object -> namesOf(payload)\n  case str is String -> upper(str)\n  else -> null\n}"
  },
  "matches": {
    "name": "matches",
    "module": "dw::Core",
    "type": "fn",
    "signature": "matches(text: String, regex: Regex): Boolean",
    "description": "Returns true if the entire string matches the given regular expression pattern.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input text."
      },
      {
        "name": "regex",
        "type": "Regex",
        "desc": "Regular expression pattern."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\noutput application/json\n---\n\"12345\" matches /[0-9]+/ // true"
  },
  "padStart": {
    "name": "padStart",
    "module": "dw::Core",
    "type": "fn",
    "signature": "padStart(text: String, targetLength: Number, pad: String): String",
    "description": "Pads the start of a string with another string until target length is reached.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Source string."
      },
      {
        "name": "targetLength",
        "type": "Number",
        "desc": "Desired length."
      },
      {
        "name": "pad",
        "type": "String",
        "desc": "Padding character."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\noutput application/json\n---\npadStart(\"42\", 5, \"0\") // \"00042\""
  },
  "padEnd": {
    "name": "padEnd",
    "module": "dw::Core",
    "type": "fn",
    "signature": "padEnd(text: String, targetLength: Number, pad: String): String",
    "description": "Pads the end of a string with another string until target length is reached.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Source string."
      },
      {
        "name": "targetLength",
        "type": "Number",
        "desc": "Desired length."
      },
      {
        "name": "pad",
        "type": "String",
        "desc": "Padding character."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\noutput application/json\n---\npadEnd(\"42\", 5, \".\") // \"42...\""
  },
  "abs": {
    "name": "abs",
    "module": "dw::Core",
    "type": "fn",
    "signature": "abs(n: Number): Number",
    "description": "Returns the absolute positive value of a number.",
    "params": [
      {
        "name": "n",
        "type": "Number",
        "desc": "Numeric value."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\noutput application/json\n---\nabs(-42) // 42"
  },
  "ceil": {
    "name": "ceil",
    "module": "dw::Core",
    "type": "fn",
    "signature": "ceil(n: Number): Number",
    "description": "Rounds a number up to the nearest integer.",
    "params": [
      {
        "name": "n",
        "type": "Number",
        "desc": "Floating point number."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\noutput application/json\n---\nceil(3.14) // 4"
  },
  "floor": {
    "name": "floor",
    "module": "dw::Core",
    "type": "fn",
    "signature": "floor(n: Number): Number",
    "description": "Rounds a number down to the nearest integer.",
    "params": [
      {
        "name": "n",
        "type": "Number",
        "desc": "Floating point number."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\noutput application/json\n---\nfloor(3.99) // 3"
  },
  "round": {
    "name": "round",
    "module": "dw::Core",
    "type": "fn",
    "signature": "round(n: Number): Number",
    "description": "Rounds a number to the nearest integer (half rounds up).",
    "params": [
      {
        "name": "n",
        "type": "Number",
        "desc": "Floating point number."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\noutput application/json\n---\nround(3.5) // 4\nround(3.4) // 3"
  },
  "sqrt": {
    "name": "sqrt",
    "module": "dw::Core",
    "type": "fn",
    "signature": "sqrt(n: Number): Number",
    "description": "Returns the square root of a non-negative number.",
    "params": [
      {
        "name": "n",
        "type": "Number",
        "desc": "Input number."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\noutput application/json\n---\nsqrt(144) // 12"
  },
  "mod": {
    "name": "mod",
    "module": "dw::Core",
    "type": "fn",
    "signature": "mod(dividend: Number, divisor: Number): Number",
    "description": "Returns the remainder after dividing the first number by the second.",
    "params": [
      {
        "name": "dividend",
        "type": "Number",
        "desc": "Left operand."
      },
      {
        "name": "divisor",
        "type": "Number",
        "desc": "Right operand."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\noutput application/json\n---\n10 mod 3 // 1"
  },
  "pow": {
    "name": "pow",
    "module": "dw::Core",
    "type": "fn",
    "signature": "pow(base: Number, exponent: Number): Number",
    "description": "Raises base to the power of exponent.",
    "params": [
      {
        "name": "base",
        "type": "Number",
        "desc": "Base number."
      },
      {
        "name": "exponent",
        "type": "Number",
        "desc": "Exponent."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\noutput application/json\n---\n2 pow 8 // 256"
  },
  "log": {
    "name": "log",
    "module": "dw::Core",
    "type": "fn",
    "signature": "log(prefix: String, value: Any): Any",
    "description": "Logs a label and value to the application console while returning the value unchanged for expression chaining.",
    "params": [
      {
        "name": "prefix",
        "type": "String",
        "desc": "Logging label."
      },
      {
        "name": "value",
        "type": "Any",
        "desc": "Value to inspect."
      }
    ],
    "returns": "Any",
    "example": "%dw 2.0\noutput application/json\n---\nlog(\"Debug Items\", payload.items)"
  },
  "random": {
    "name": "random",
    "module": "dw::Core",
    "type": "fn",
    "signature": "random(): Number",
    "description": "Returns a pseudo-random decimal number between 0.0 (inclusive) and 1.0 (exclusive).",
    "params": [],
    "returns": "Number",
    "example": "%dw 2.0\noutput application/json\n---\nrandom() // e.g. 0.7491028"
  },
  "randomInt": {
    "name": "randomInt",
    "module": "dw::Core",
    "type": "fn",
    "signature": "randomInt(max: Number): Number",
    "description": "Returns a pseudo-random integer between 0 (inclusive) and max (exclusive).",
    "params": [
      {
        "name": "max",
        "type": "Number",
        "desc": "Upper bound (exclusive)."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\noutput application/json\n---\nrandomInt(100) // e.g. 42"
  },
  "now": {
    "name": "now",
    "module": "dw::Core",
    "type": "fn",
    "signature": "now(): DateTime",
    "description": "Returns the current timestamp as a DateTime object with system timezone.",
    "params": [],
    "returns": "DateTime",
    "example": "%dw 2.0\noutput application/json\n---\nnow() // |2026-11-21T16:15:00Z|"
  },
  "uuid": {
    "name": "uuid",
    "module": "dw::Core",
    "type": "fn",
    "signature": "uuid(): String",
    "description": "Generates a canonical RFC-4122 Version 4 random UUID string.",
    "params": [],
    "returns": "String",
    "example": "%dw 2.0\noutput application/json\n---\nuuid() // \"a3f5a11c-7f5e-49b2-9a84-18471b0289ab\""
  },
  "read": {
    "name": "read",
    "module": "dw::Core",
    "type": "fn",
    "signature": "read(source: String | Binary, mimeType: String): Any",
    "description": "Parses a raw string or binary stream into a DataWeave value according to the specified MIME type.",
    "params": [
      {
        "name": "source",
        "type": "String | Binary",
        "desc": "Raw text or binary."
      },
      {
        "name": "mimeType",
        "type": "String",
        "desc": "Target MIME format (e.g. 'application/json')."
      }
    ],
    "returns": "Any",
    "example": "%dw 2.0\noutput application/json\n---\nread('{\"name\": \"Alice\"}', 'application/json')"
  },
  "readUrl": {
    "name": "readUrl",
    "module": "dw::Core",
    "type": "fn",
    "signature": "readUrl(url: String, mimeType: String): Any",
    "description": "Reads data from a classpath, file, or remote HTTP URL resource and parses it.",
    "params": [
      {
        "name": "url",
        "type": "String",
        "desc": "Resource URI (e.g. 'classpath://data.json')."
      },
      {
        "name": "mimeType",
        "type": "String",
        "desc": "MIME format."
      }
    ],
    "returns": "Any",
    "example": "%dw 2.0\noutput application/json\n---\nreadUrl(\"classpath://config.yaml\", \"application/yaml\")"
  },
  "write": {
    "name": "write",
    "module": "dw::Core",
    "type": "fn",
    "signature": "write(value: Any, mimeType: String): String | Binary",
    "description": "Serializes a DataWeave value into a formatted string or binary representation according to MIME type.",
    "params": [
      {
        "name": "value",
        "type": "Any",
        "desc": "Value to serialize."
      },
      {
        "name": "mimeType",
        "type": "String",
        "desc": "Target MIME type (e.g. 'application/csv')."
      }
    ],
    "returns": "String | Binary",
    "example": "%dw 2.0\noutput application/json\n---\nwrite(payload, \"application/csv\")"
  },
  "mergeWith": {
    "name": "mergeWith",
    "module": "dw::Core",
    "type": "fn",
    "signature": "mergeWith(source: Object, target: Object): Object",
    "description": "Recursively combines two objects, overriding left values with right values for matching keys.",
    "params": [
      {
        "name": "source",
        "type": "Object",
        "desc": "Base object."
      },
      {
        "name": "target",
        "type": "Object",
        "desc": "Overrides object."
      }
    ],
    "returns": "Object",
    "example": "%dw 2.0\noutput application/json\n---\n{ a: 1, b: 2 } mergeWith { b: 99, c: 3 }\n// { a: 1, b: 99, c: 3 }"
  },
  "camelize": {
    "name": "camelize",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "camelize(text: String): String",
    "description": "Transforms a string separated by spaces, dashes, or underscores into camelCase format.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\ncamelize(\"customer_first_name\")\n// \"customerFirstName\""
  },
  "capitalize": {
    "name": "capitalize",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "capitalize(text: String): String",
    "description": "Capitalizes the first character of each word in a string while converting the rest to lowercase.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\ncapitalize(\"mulesoft dataweave\")\n// \"Mulesoft Dataweave\""
  },
  "dasherize": {
    "name": "dasherize",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "dasherize(text: String): String",
    "description": "Converts camelCase, snake_case, or space-separated strings into kebab-case (hyphenated).",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\ndasherize(\"customerFirstName\")\n// \"customer-first-name\""
  },
  "underscore": {
    "name": "underscore",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "underscore(text: String): String",
    "description": "Converts camelCase or hyphenated strings into snake_case (underscore-separated).",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nunderscore(\"customerFirstName\")\n// \"customer_first_name\""
  },
  "ordinalize": {
    "name": "ordinalize",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "ordinalize(n: Number): String",
    "description": "Appends the English ordinal suffix (st, nd, rd, th) to a number.",
    "params": [
      {
        "name": "n",
        "type": "Number",
        "desc": "Input number."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nordinalize(1)  // \"1st\"\nordinalize(22) // \"22nd\""
  },
  "pluralize": {
    "name": "pluralize",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "pluralize(text: String): String",
    "description": "Returns the plural form of an English noun.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Singular noun."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\npluralize(\"box\")  // \"boxes\"\npluralize(\"user\") // \"users\""
  },
  "singularize": {
    "name": "singularize",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "singularize(text: String): String",
    "description": "Returns the singular form of an English plural noun.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Plural noun."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nsingularize(\"boxes\") // \"box\""
  },
  "substring": {
    "name": "substring",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "substring(text: String, from: Number, to: Number): String",
    "description": "Extracts characters from the string between indices from (inclusive) and to (exclusive).",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      },
      {
        "name": "from",
        "type": "Number",
        "desc": "Start index."
      },
      {
        "name": "to",
        "type": "Number",
        "desc": "End index."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nsubstring(\"DataWeave\", 0, 4) // \"Data\""
  },
  "substringBefore": {
    "name": "substringBefore",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "substringBefore(text: String, separator: String): String",
    "description": "Extracts the portion of a string before the first occurrence of a separator.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      },
      {
        "name": "separator",
        "type": "String",
        "desc": "Separator."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nsubstringBefore(\"user@example.com\", \"@\") // \"user\""
  },
  "substringAfter": {
    "name": "substringAfter",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "substringAfter(text: String, separator: String): String",
    "description": "Extracts the portion of a string after the first occurrence of a separator.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      },
      {
        "name": "separator",
        "type": "String",
        "desc": "Separator."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nsubstringAfter(\"user@example.com\", \"@\") // \"example.com\""
  },
  "substringBeforeLast": {
    "name": "substringBeforeLast",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "substringBeforeLast(text: String, separator: String): String",
    "description": "Extracts the substring before the last occurrence of a delimiter.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      },
      {
        "name": "separator",
        "type": "String",
        "desc": "Delimiter."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nsubstringBeforeLast(\"a.b.c.txt\", \".\") // \"a.b.c\""
  },
  "substringAfterLast": {
    "name": "substringAfterLast",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "substringAfterLast(text: String, separator: String): String",
    "description": "Extracts the substring after the last occurrence of a delimiter.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      },
      {
        "name": "separator",
        "type": "String",
        "desc": "Delimiter."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nsubstringAfterLast(\"archive.tar.gz\", \".\") // \"gz\""
  },
  "leftPad": {
    "name": "leftPad",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "leftPad(text: String, size: Number, pad: String): String",
    "description": "Left-pads a string with pad characters to reach the target size.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Source string."
      },
      {
        "name": "size",
        "type": "Number",
        "desc": "Target length."
      },
      {
        "name": "pad",
        "type": "String",
        "desc": "Pad character."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nleftPad(\"42\", 5, \"0\") // \"00042\""
  },
  "rightPad": {
    "name": "rightPad",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "rightPad(text: String, size: Number, pad: String): String",
    "description": "Right-pads a string with pad characters to reach the target size.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Source string."
      },
      {
        "name": "size",
        "type": "Number",
        "desc": "Target length."
      },
      {
        "name": "pad",
        "type": "String",
        "desc": "Pad character."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nrightPad(\"42\", 5, \" \") // \"42   \""
  },
  "repeat": {
    "name": "repeat",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "repeat(text: String, count: Number): String",
    "description": "Repeats a string count number of times.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      },
      {
        "name": "count",
        "type": "Number",
        "desc": "Repetition count."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nrepeat(\"abc\", 3) // \"abcabcabc\""
  },
  "wrapWith": {
    "name": "wrapWith",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "wrapWith(text: String, wrapper: String): String",
    "description": "Surrounds a string with the specified wrapper string on both sides.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      },
      {
        "name": "wrapper",
        "type": "String",
        "desc": "Wrapper string."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nwrapWith(\"hello\", \"'\") // \"'hello'\""
  },
  "unwrap": {
    "name": "unwrap",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "unwrap(text: String, wrapper: String): String",
    "description": "Removes wrapper characters from the start and end of a string.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Wrapped string."
      },
      {
        "name": "wrapper",
        "type": "String",
        "desc": "Wrapper string."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nunwrap(\"'hello'\", \"'\") // \"hello\""
  },
  "words": {
    "name": "words",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "words(text: String): Array<String>",
    "description": "Splits a sentence into an array of words separated by whitespace.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Sentence string."
      }
    ],
    "returns": "Array<String>",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nwords(\"Hello world Mule\") // [\"Hello\", \"world\", \"Mule\"]"
  },
  "collapse": {
    "name": "collapse",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "collapse(text: String): String",
    "description": "Replaces consecutive whitespace characters with a single space and trims ends.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\ncollapse(\"  hello    world  \") // \"hello world\""
  },
  "characterCodeAt": {
    "name": "characterCodeAt",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "characterCodeAt(text: String, index: Number): Number",
    "description": "Returns the Unicode numeric character code at index.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      },
      {
        "name": "index",
        "type": "Number",
        "desc": "Character position."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\ncharacterCodeAt(\"A\", 0) // 65"
  },
  "fromCharCode": {
    "name": "fromCharCode",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "fromCharCode(code: Number): String",
    "description": "Returns a string created from the given Unicode character code.",
    "params": [
      {
        "name": "code",
        "type": "Number",
        "desc": "Unicode code point."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nfromCharCode(65) // \"A\""
  },
  "isAlpha": {
    "name": "isAlpha",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "isAlpha(text: String): Boolean",
    "description": "Returns true if string contains only alphabetic characters [a-zA-Z].",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nisAlpha(\"MuleSoft\") // true"
  },
  "isAlphanumeric": {
    "name": "isAlphanumeric",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "isAlphanumeric(text: String): Boolean",
    "description": "Returns true if string contains only alphanumeric characters [a-zA-Z0-9].",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nisAlphanumeric(\"Mule4\") // true"
  },
  "isDigits": {
    "name": "isDigits",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "isDigits(text: String): Boolean",
    "description": "Returns true if string contains only decimal digits [0-9].",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nisDigits(\"12345\") // true"
  },
  "isLowerCase": {
    "name": "isLowerCase",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "isLowerCase(text: String): Boolean",
    "description": "Returns true if all characters in the string are lowercase.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nisLowerCase(\"mule\") // true"
  },
  "isUpperCase": {
    "name": "isUpperCase",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "isUpperCase(text: String): Boolean",
    "description": "Returns true if all characters in the string are uppercase.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nisUpperCase(\"MULE\") // true"
  },
  "isNumeric": {
    "name": "isNumeric",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "isNumeric(text: String): Boolean",
    "description": "Returns true if string can be parsed as a valid number.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nisNumeric(\"-12.5\") // true"
  },
  "isWhitespace": {
    "name": "isWhitespace",
    "module": "dw::core::Strings",
    "type": "fn",
    "signature": "isWhitespace(text: String): Boolean",
    "description": "Returns true if string contains only whitespace characters.",
    "params": [
      {
        "name": "text",
        "type": "String",
        "desc": "Input string."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\nisWhitespace(\"   \\t\\n\") // true"
  },
  "countBy": {
    "name": "countBy",
    "module": "dw::core::Arrays",
    "type": "fn",
    "signature": "countBy(Array<T>, (item: T) -> Boolean): Number",
    "description": "Counts how many items in an array satisfy the given predicate function.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "Input array."
      },
      {
        "name": "predicate",
        "type": "(item) -> Boolean",
        "desc": "Condition."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\nimport * from dw::core::Arrays\noutput application/json\n---\ncountBy([1, 2, 3, 4, 5], (n) -> n > 2) // 3"
  },
  "divideBy": {
    "name": "divideBy",
    "module": "dw::core::Arrays",
    "type": "fn",
    "signature": "divideBy(Array<T>, amount: Number): Array<Array<T>>",
    "description": "Chunks an array into sub-arrays of maximum size amount.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "Input array."
      },
      {
        "name": "amount",
        "type": "Number",
        "desc": "Chunk capacity."
      }
    ],
    "returns": "Array<Array<T>>",
    "example": "%dw 2.0\nimport * from dw::core::Arrays\noutput application/json\n---\ndivideBy([1, 2, 3, 4, 5], 2)\n// [[1, 2], [3, 4], [5]]"
  },
  "drop": {
    "name": "drop",
    "module": "dw::core::Arrays",
    "type": "fn",
    "signature": "drop(Array<T>, count: Number): Array<T>",
    "description": "Drops the first count elements from an array.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "Input array."
      },
      {
        "name": "count",
        "type": "Number",
        "desc": "Number of elements to remove."
      }
    ],
    "returns": "Array<T>",
    "example": "%dw 2.0\nimport * from dw::core::Arrays\noutput application/json\n---\ndrop([1, 2, 3, 4, 5], 2) // [3, 4, 5]"
  },
  "dropWhile": {
    "name": "dropWhile",
    "module": "dw::core::Arrays",
    "type": "fn",
    "signature": "dropWhile(Array<T>, (item: T) -> Boolean): Array<T>",
    "description": "Drops elements from the beginning of the array as long as predicate returns true.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "Input array."
      },
      {
        "name": "predicate",
        "type": "(item) -> Boolean",
        "desc": "Drop condition."
      }
    ],
    "returns": "Array<T>",
    "example": "%dw 2.0\nimport * from dw::core::Arrays\noutput application/json\n---\ndropWhile([1, 2, 5, 1], (n) -> n < 3) // [5, 1]"
  },
  "every": {
    "name": "every",
    "module": "dw::core::Arrays",
    "type": "fn",
    "signature": "every(Array<T>, (item: T) -> Boolean): Boolean",
    "description": "Returns true if every item in the array satisfies the predicate.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "Input array."
      },
      {
        "name": "predicate",
        "type": "(item) -> Boolean",
        "desc": "Condition."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\nimport * from dw::core::Arrays\noutput application/json\n---\nevery([2, 4, 6], (n) -> n mod 2 == 0) // true"
  },
  "firstWith": {
    "name": "firstWith",
    "module": "dw::core::Arrays",
    "type": "fn",
    "signature": "firstWith(Array<T>, (item: T) -> Boolean): T | Null",
    "description": "Returns the first element matching predicate, or null if none match.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "Input array."
      },
      {
        "name": "predicate",
        "type": "(item) -> Boolean",
        "desc": "Search condition."
      }
    ],
    "returns": "T | Null",
    "example": "%dw 2.0\nimport * from dw::core::Arrays\noutput application/json\n---\nfirstWith([1, 3, 4, 5], (n) -> n mod 2 == 0) // 4"
  },
  "join": {
    "name": "join",
    "module": "dw::core::Arrays",
    "type": "fn",
    "signature": "join(left: Array, right: Array, (l) -> Key, (r) -> Key): Array",
    "description": "Performs a SQL-style inner join between two arrays on matching key expressions.",
    "params": [
      {
        "name": "left",
        "type": "Array",
        "desc": "Left collection."
      },
      {
        "name": "right",
        "type": "Array",
        "desc": "Right collection."
      },
      {
        "name": "leftKey",
        "type": "(item) -> Key",
        "desc": "Left join key selector."
      },
      {
        "name": "rightKey",
        "type": "(item) -> Key",
        "desc": "Right join key selector."
      }
    ],
    "returns": "Array",
    "example": "%dw 2.0\nimport * from dw::core::Arrays\noutput application/json\n---\njoin(users, orders, (u) -> u.id, (o) -> o.userId)"
  },
  "partition": {
    "name": "partition",
    "module": "dw::core::Arrays",
    "type": "fn",
    "signature": "partition(Array<T>, (item: T) -> Boolean): {success: Array<T>, failure: Array<T>}",
    "description": "Splits an array into success and failure groups based on predicate.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "Input array."
      },
      {
        "name": "predicate",
        "type": "(item) -> Boolean",
        "desc": "Partition condition."
      }
    ],
    "returns": "{success: Array<T>, failure: Array<T>}",
    "example": "%dw 2.0\nimport * from dw::core::Arrays\noutput application/json\n---\npartition([1, 2, 3, 4], (n) -> n > 2)\n// { success: [3, 4], failure: [1, 2] }"
  },
  "slice": {
    "name": "slice",
    "module": "dw::core::Arrays",
    "type": "fn",
    "signature": "slice(Array<T>, from: Number, to: Number): Array<T>",
    "description": "Returns a slice of elements between from (inclusive) and to (exclusive).",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "Input array."
      },
      {
        "name": "from",
        "type": "Number",
        "desc": "Start index."
      },
      {
        "name": "to",
        "type": "Number",
        "desc": "End index."
      }
    ],
    "returns": "Array<T>",
    "example": "%dw 2.0\nimport * from dw::core::Arrays\noutput application/json\n---\nslice([10, 20, 30, 40, 50], 1, 4) // [20, 30, 40]"
  },
  "some": {
    "name": "some",
    "module": "dw::core::Arrays",
    "type": "fn",
    "signature": "some(Array<T>, (item: T) -> Boolean): Boolean",
    "description": "Returns true if at least one item satisfies the predicate.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "Input array."
      },
      {
        "name": "predicate",
        "type": "(item) -> Boolean",
        "desc": "Test condition."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\nimport * from dw::core::Arrays\noutput application/json\n---\nsome([1, 3, 5, 8], (n) -> n mod 2 == 0) // true"
  },
  "splitAt": {
    "name": "splitAt",
    "module": "dw::core::Arrays",
    "type": "fn",
    "signature": "splitAt(Array<T>, index: Number): {l: Array<T>, r: Array<T>}",
    "description": "Splits an array into left and right sub-arrays at the specified index.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "Input array."
      },
      {
        "name": "index",
        "type": "Number",
        "desc": "Split point."
      }
    ],
    "returns": "{l: Array<T>, r: Array<T>}",
    "example": "%dw 2.0\nimport * from dw::core::Arrays\noutput application/json\n---\nsplitAt([1, 2, 3, 4], 2) // { l: [1, 2], r: [3, 4] }"
  },
  "splitWhere": {
    "name": "splitWhere",
    "module": "dw::core::Arrays",
    "type": "fn",
    "signature": "splitWhere(Array<T>, (item: T) -> Boolean): {l: Array<T>, r: Array<T>}",
    "description": "Splits array at the first element matching predicate.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "Input array."
      },
      {
        "name": "predicate",
        "type": "(item) -> Boolean",
        "desc": "Split trigger condition."
      }
    ],
    "returns": "{l: Array<T>, r: Array<T>}",
    "example": "%dw 2.0\nimport * from dw::core::Arrays\noutput application/json\n---\nsplitWhere([1, 2, 3, 4], (n) -> n >= 3)"
  },
  "sumBy": {
    "name": "sumBy",
    "module": "dw::core::Arrays",
    "type": "fn",
    "signature": "sumBy(Array<T>, (item: T) -> Number): Number",
    "description": "Calculates the sum of numbers produced by the selector lambda.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "Input array."
      },
      {
        "name": "selector",
        "type": "(item) -> Number",
        "desc": "Numeric value selector."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\nimport * from dw::core::Arrays\noutput application/json\n---\nsumBy([{\"price\": 10}, {\"price\": 25}], (i) -> i.price) // 35"
  },
  "take": {
    "name": "take",
    "module": "dw::core::Arrays",
    "type": "fn",
    "signature": "take(Array<T>, count: Number): Array<T>",
    "description": "Returns the first count elements from an array.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "Input array."
      },
      {
        "name": "count",
        "type": "Number",
        "desc": "Number of elements to take."
      }
    ],
    "returns": "Array<T>",
    "example": "%dw 2.0\nimport * from dw::core::Arrays\noutput application/json\n---\ntake([1, 2, 3, 4, 5], 3) // [1, 2, 3]"
  },
  "takeWhile": {
    "name": "takeWhile",
    "module": "dw::core::Arrays",
    "type": "fn",
    "signature": "takeWhile(Array<T>, (item: T) -> Boolean): Array<T>",
    "description": "Takes elements from the start of the array as long as predicate returns true.",
    "params": [
      {
        "name": "array",
        "type": "Array<T>",
        "desc": "Input array."
      },
      {
        "name": "predicate",
        "type": "(item) -> Boolean",
        "desc": "Condition."
      }
    ],
    "returns": "Array<T>",
    "example": "%dw 2.0\nimport * from dw::core::Arrays\noutput application/json\n---\ntakeWhile([1, 2, 5, 1], (n) -> n < 3) // [1, 2]"
  },
  "entrySet": {
    "name": "entrySet",
    "module": "dw::core::Objects",
    "type": "fn",
    "signature": "entrySet(Object): Array<Entry>",
    "description": "Returns an array of key-value-attribute entry records from an object.",
    "params": [
      {
        "name": "object",
        "type": "Object",
        "desc": "Source object."
      }
    ],
    "returns": "Array<Entry>",
    "example": "%dw 2.0\nimport * from dw::core::Objects\noutput application/json\n---\nentrySet({ a: 1, b: 2 })"
  },
  "everyEntry": {
    "name": "everyEntry",
    "module": "dw::core::Objects",
    "type": "fn",
    "signature": "everyEntry(Object, (value: Any, key: Key) -> Boolean): Boolean",
    "description": "Returns true if every key-value pair in an object satisfies the predicate.",
    "params": [
      {
        "name": "object",
        "type": "Object",
        "desc": "Source object."
      },
      {
        "name": "predicate",
        "type": "(value, key) -> Boolean",
        "desc": "Entry condition."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\nimport * from dw::core::Objects\noutput application/json\n---\neveryEntry({ a: 10, b: 20 }, (v, k) -> v > 5) // true"
  },
  "keySet": {
    "name": "keySet",
    "module": "dw::core::Objects",
    "type": "fn",
    "signature": "keySet(Object): Array<Key>",
    "description": "Returns an array of unique Key objects from the given object.",
    "params": [
      {
        "name": "object",
        "type": "Object",
        "desc": "Input object."
      }
    ],
    "returns": "Array<Key>",
    "example": "%dw 2.0\nimport * from dw::core::Objects\noutput application/json\n---\nkeySet({ name: \"Mule\", ver: 4 }) // [\"name\", \"ver\"]"
  },
  "nameSet": {
    "name": "nameSet",
    "module": "dw::core::Objects",
    "type": "fn",
    "signature": "nameSet(Object): Array<String>",
    "description": "Returns an array of unique string names for every key in the object.",
    "params": [
      {
        "name": "object",
        "type": "Object",
        "desc": "Input object."
      }
    ],
    "returns": "Array<String>",
    "example": "%dw 2.0\nimport * from dw::core::Objects\noutput application/json\n---\nnameSet({ name: \"Mule\", ver: 4 }) // [\"name\", \"ver\"]"
  },
  "someEntry": {
    "name": "someEntry",
    "module": "dw::core::Objects",
    "type": "fn",
    "signature": "someEntry(Object, (value: Any, key: Key) -> Boolean): Boolean",
    "description": "Returns true if at least one entry in the object satisfies the predicate.",
    "params": [
      {
        "name": "object",
        "type": "Object",
        "desc": "Source object."
      },
      {
        "name": "predicate",
        "type": "(value, key) -> Boolean",
        "desc": "Entry condition."
      }
    ],
    "returns": "Boolean",
    "example": "%dw 2.0\nimport * from dw::core::Objects\noutput application/json\n---\nsomeEntry({ a: 1, b: 20 }, (v, k) -> v > 10) // true"
  },
  "valueSet": {
    "name": "valueSet",
    "module": "dw::core::Objects",
    "type": "fn",
    "signature": "valueSet(Object): Array<Any>",
    "description": "Returns an array of values extracted from the object.",
    "params": [
      {
        "name": "object",
        "type": "Object",
        "desc": "Input object."
      }
    ],
    "returns": "Array<Any>",
    "example": "%dw 2.0\nimport * from dw::core::Objects\noutput application/json\n---\nvalueSet({ a: 100, b: 200 }) // [100, 200]"
  },
  "fromHex": {
    "name": "fromHex",
    "module": "dw::core::Numbers",
    "type": "fn",
    "signature": "fromHex(hex: String): Number",
    "description": "Parses a hexadecimal string representation into a decimal Number.",
    "params": [
      {
        "name": "hex",
        "type": "String",
        "desc": "Hexadecimal string (e.g. 'FF')."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\nimport * from dw::core::Numbers\noutput application/json\n---\nfromHex(\"1A\") // 26"
  },
  "fromRadixNumber": {
    "name": "fromRadixNumber",
    "module": "dw::core::Numbers",
    "type": "fn",
    "signature": "fromRadixNumber(str: String, radix: Number): Number",
    "description": "Parses a number string according to the specified base/radix (2 to 36).",
    "params": [
      {
        "name": "str",
        "type": "String",
        "desc": "Number string representation."
      },
      {
        "name": "radix",
        "type": "Number",
        "desc": "Radix base (e.g. 2, 8, 16)."
      }
    ],
    "returns": "Number",
    "example": "%dw 2.0\nimport * from dw::core::Numbers\noutput application/json\n---\nfromRadixNumber(\"1010\", 2) // 10"
  },
  "toHex": {
    "name": "toHex",
    "module": "dw::core::Numbers",
    "type": "fn",
    "signature": "toHex(n: Number): String",
    "description": "Formats a decimal number into a hexadecimal string.",
    "params": [
      {
        "name": "n",
        "type": "Number",
        "desc": "Decimal number."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Numbers\noutput application/json\n---\ntoHex(255) // \"ff\""
  },
  "toRadixNumber": {
    "name": "toRadixNumber",
    "module": "dw::core::Numbers",
    "type": "fn",
    "signature": "toRadixNumber(n: Number, radix: Number): String",
    "description": "Formats a number into a string in the specified base/radix (2 to 36).",
    "params": [
      {
        "name": "n",
        "type": "Number",
        "desc": "Decimal number."
      },
      {
        "name": "radix",
        "type": "Number",
        "desc": "Target radix (e.g. 2, 8, 16)."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Numbers\noutput application/json\n---\ntoRadixNumber(10, 2) // \"1010\""
  },
  "days": {
    "name": "days",
    "module": "dw::core::Periods",
    "type": "fn",
    "signature": "days(n: Number): Period",
    "description": "Creates a Period duration representing n days.",
    "params": [
      {
        "name": "n",
        "type": "Number",
        "desc": "Day count."
      }
    ],
    "returns": "Period",
    "example": "%dw 2.0\nimport * from dw::core::Periods\noutput application/json\n---\nnow() + days(5)"
  },
  "hours": {
    "name": "hours",
    "module": "dw::core::Periods",
    "type": "fn",
    "signature": "hours(n: Number): Period",
    "description": "Creates a Period duration representing n hours.",
    "params": [
      {
        "name": "n",
        "type": "Number",
        "desc": "Hour count."
      }
    ],
    "returns": "Period",
    "example": "%dw 2.0\nimport * from dw::core::Periods\noutput application/json\n---\nnow() + hours(2)"
  },
  "millis": {
    "name": "millis",
    "module": "dw::core::Periods",
    "type": "fn",
    "signature": "millis(n: Number): Period",
    "description": "Creates a Period duration representing n milliseconds.",
    "params": [
      {
        "name": "n",
        "type": "Number",
        "desc": "Millisecond count."
      }
    ],
    "returns": "Period",
    "example": "%dw 2.0\nimport * from dw::core::Periods\noutput application/json\n---\nmillis(500)"
  },
  "minutes": {
    "name": "minutes",
    "module": "dw::core::Periods",
    "type": "fn",
    "signature": "minutes(n: Number): Period",
    "description": "Creates a Period duration representing n minutes.",
    "params": [
      {
        "name": "n",
        "type": "Number",
        "desc": "Minute count."
      }
    ],
    "returns": "Period",
    "example": "%dw 2.0\nimport * from dw::core::Periods\noutput application/json\n---\nnow() + minutes(30)"
  },
  "months": {
    "name": "months",
    "module": "dw::core::Periods",
    "type": "fn",
    "signature": "months(n: Number): Period",
    "description": "Creates a Period duration representing n months.",
    "params": [
      {
        "name": "n",
        "type": "Number",
        "desc": "Month count."
      }
    ],
    "returns": "Period",
    "example": "%dw 2.0\nimport * from dw::core::Periods\noutput application/json\n---\nnow() + months(3)"
  },
  "nanos": {
    "name": "nanos",
    "module": "dw::core::Periods",
    "type": "fn",
    "signature": "nanos(n: Number): Period",
    "description": "Creates a Period duration representing n nanoseconds.",
    "params": [
      {
        "name": "n",
        "type": "Number",
        "desc": "Nanosecond count."
      }
    ],
    "returns": "Period",
    "example": "%dw 2.0\nimport * from dw::core::Periods\noutput application/json\n---\nnanos(1000)"
  },
  "seconds": {
    "name": "seconds",
    "module": "dw::core::Periods",
    "type": "fn",
    "signature": "seconds(n: Number): Period",
    "description": "Creates a Period duration representing n seconds.",
    "params": [
      {
        "name": "n",
        "type": "Number",
        "desc": "Second count."
      }
    ],
    "returns": "Period",
    "example": "%dw 2.0\nimport * from dw::core::Periods\noutput application/json\n---\nnow() + seconds(45)"
  },
  "years": {
    "name": "years",
    "module": "dw::core::Periods",
    "type": "fn",
    "signature": "years(n: Number): Period",
    "description": "Creates a Period duration representing n years.",
    "params": [
      {
        "name": "n",
        "type": "Number",
        "desc": "Year count."
      }
    ],
    "returns": "Period",
    "example": "%dw 2.0\nimport * from dw::core::Periods\noutput application/json\n---\nnow() + years(1)"
  },
  "period": {
    "name": "period",
    "module": "dw::core::Periods",
    "type": "fn",
    "signature": "period(parts: Object): Period",
    "description": "Constructs a Period object from individual duration fields (days, hours, minutes, seconds).",
    "params": [
      {
        "name": "parts",
        "type": "Object",
        "desc": "Duration components."
      }
    ],
    "returns": "Period",
    "example": "%dw 2.0\nimport * from dw::core::Periods\noutput application/json\n---\nperiod({ days: 2, hours: 4 })"
  },
  "today": {
    "name": "today",
    "module": "dw::core::Dates",
    "type": "fn",
    "signature": "today(): Date",
    "description": "Returns current calendar date (|YYYY-MM-DD|) in system timezone.",
    "params": [],
    "returns": "Date",
    "example": "%dw 2.0\nimport * from dw::core::Dates\noutput application/json\n---\ntoday() // |2026-11-21|"
  },
  "yesterday": {
    "name": "yesterday",
    "module": "dw::core::Dates",
    "type": "fn",
    "signature": "yesterday(): Date",
    "description": "Returns yesterday's calendar date in system timezone.",
    "params": [],
    "returns": "Date",
    "example": "%dw 2.0\nimport * from dw::core::Dates\noutput application/json\n---\nyesterday() // |2026-11-20|"
  },
  "tomorrow": {
    "name": "tomorrow",
    "module": "dw::core::Dates",
    "type": "fn",
    "signature": "tomorrow(): Date",
    "description": "Returns tomorrow's calendar date in system timezone.",
    "params": [],
    "returns": "Date",
    "example": "%dw 2.0\nimport * from dw::core::Dates\noutput application/json\n---\ntomorrow() // |2026-11-22|"
  },
  "atBeginningOfDay": {
    "name": "atBeginningOfDay",
    "module": "dw::core::Dates",
    "type": "fn",
    "signature": "atBeginningOfDay(DateTime): DateTime",
    "description": "Resets the time component of a DateTime to 00:00:00.000.",
    "params": [
      {
        "name": "dt",
        "type": "DateTime",
        "desc": "Input DateTime."
      }
    ],
    "returns": "DateTime",
    "example": "%dw 2.0\nimport * from dw::core::Dates\noutput application/json\n---\natBeginningOfDay(now())"
  },
  "atBeginningOfMonth": {
    "name": "atBeginningOfMonth",
    "module": "dw::core::Dates",
    "type": "fn",
    "signature": "atBeginningOfMonth(Date | DateTime): Date | DateTime",
    "description": "Resets the date to the first day of the current month.",
    "params": [
      {
        "name": "d",
        "type": "Date | DateTime",
        "desc": "Input date."
      }
    ],
    "returns": "Date | DateTime",
    "example": "%dw 2.0\nimport * from dw::core::Dates\noutput application/json\n---\natBeginningOfMonth(today())"
  },
  "atBeginningOfWeek": {
    "name": "atBeginningOfWeek",
    "module": "dw::core::Dates",
    "type": "fn",
    "signature": "atBeginningOfWeek(Date | DateTime): Date | DateTime",
    "description": "Resets the date to the first day of the week (Monday).",
    "params": [
      {
        "name": "d",
        "type": "Date | DateTime",
        "desc": "Input date."
      }
    ],
    "returns": "Date | DateTime",
    "example": "%dw 2.0\nimport * from dw::core::Dates\noutput application/json\n---\natBeginningOfWeek(today())"
  },
  "atBeginningOfYear": {
    "name": "atBeginningOfYear",
    "module": "dw::core::Dates",
    "type": "fn",
    "signature": "atBeginningOfYear(Date | DateTime): Date | DateTime",
    "description": "Resets the date to January 1st of the current year.",
    "params": [
      {
        "name": "d",
        "type": "Date | DateTime",
        "desc": "Input date."
      }
    ],
    "returns": "Date | DateTime",
    "example": "%dw 2.0\nimport * from dw::core::Dates\noutput application/json\n---\natBeginningOfYear(today())"
  },
  "fromBase64": {
    "name": "fromBase64",
    "module": "dw::core::Binaries",
    "type": "fn",
    "signature": "fromBase64(base64Str: String): Binary",
    "description": "Decodes a Base64-encoded string into raw Binary byte stream.",
    "params": [
      {
        "name": "base64Str",
        "type": "String",
        "desc": "Base64 encoded string."
      }
    ],
    "returns": "Binary",
    "example": "%dw 2.0\nimport * from dw::core::Binaries\noutput application/octet-stream\n---\nfromBase64(\"SGVsbG8=\")"
  },
  "toBase64": {
    "name": "toBase64",
    "module": "dw::core::Binaries",
    "type": "fn",
    "signature": "toBase64(b: Binary): String",
    "description": "Encodes raw Binary data into a Base64 string representation.",
    "params": [
      {
        "name": "b",
        "type": "Binary",
        "desc": "Raw byte data."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::Binaries\noutput application/json\n---\ntoBase64(\"Hello\" as Binary)"
  },
  "encodeURI": {
    "name": "encodeURI",
    "module": "dw::core::URL",
    "type": "fn",
    "signature": "encodeURI(uri: String): String",
    "description": "Encodes a complete URI string, escaping special and non-ASCII characters.",
    "params": [
      {
        "name": "uri",
        "type": "String",
        "desc": "Full URI string."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::URL\noutput application/json\n---\nencodeURI(\"https://example.com/search?q=mule runtime\")"
  },
  "encodeURIComponent": {
    "name": "encodeURIComponent",
    "module": "dw::core::URL",
    "type": "fn",
    "signature": "encodeURIComponent(comp: String): String",
    "description": "Encodes a URI query parameter or path segment component.",
    "params": [
      {
        "name": "comp",
        "type": "String",
        "desc": "Component string."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::URL\noutput application/json\n---\nencodeURIComponent(\"mule runtime & dataweave\")"
  },
  "decodeURI": {
    "name": "decodeURI",
    "module": "dw::core::URL",
    "type": "fn",
    "signature": "decodeURI(uri: String): String",
    "description": "Decodes an encoded URI string back into plain characters.",
    "params": [
      {
        "name": "uri",
        "type": "String",
        "desc": "Encoded URI."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::URL\noutput application/json\n---\ndecodeURI(\"https://example.com/search?q=mule%20runtime\")"
  },
  "decodeURIComponent": {
    "name": "decodeURIComponent",
    "module": "dw::core::URL",
    "type": "fn",
    "signature": "decodeURIComponent(comp: String): String",
    "description": "Decodes an encoded URI component fragment.",
    "params": [
      {
        "name": "comp",
        "type": "String",
        "desc": "Encoded component."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::core::URL\noutput application/json\n---\ndecodeURIComponent(\"mule%20runtime%20%26%20dataweave\")"
  },
  "parseURI": {
    "name": "parseURI",
    "module": "dw::core::URL",
    "type": "fn",
    "signature": "parseURI(uriString: String): Object",
    "description": "Parses a URI into its constituent parts: scheme, host, port, path, and queryParams.",
    "params": [
      {
        "name": "uriString",
        "type": "String",
        "desc": "URI string to parse."
      }
    ],
    "returns": "Object",
    "example": "%dw 2.0\nimport * from dw::core::URL\noutput application/json\n---\nparseURI(\"https://api.github.com:443/users?page=1\")"
  },
  "MD5": {
    "name": "MD5",
    "module": "dw::Crypto",
    "type": "fn",
    "signature": "MD5(content: Binary | String): String",
    "description": "Computes the MD5 128-bit hash digest for the given input as a hexadecimal string.",
    "params": [
      {
        "name": "content",
        "type": "Binary | String",
        "desc": "Content to hash."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::Crypto\noutput application/json\n---\nMD5(\"hello world\") // \"5eb63bbbe01eeed093cb22bb8f5acdc3\""
  },
  "SHA1": {
    "name": "SHA1",
    "module": "dw::Crypto",
    "type": "fn",
    "signature": "SHA1(content: Binary | String): String",
    "description": "Computes the SHA-1 160-bit hash checksum for the given input.",
    "params": [
      {
        "name": "content",
        "type": "Binary | String",
        "desc": "Content to hash."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::Crypto\noutput application/json\n---\nSHA1(\"hello world\")"
  },
  "HMACBinary": {
    "name": "HMACBinary",
    "module": "dw::Crypto",
    "type": "fn",
    "signature": "HMACBinary(content: Binary, key: Binary, algorithm: String): Binary",
    "description": "Generates an HMAC cryptographic hash as raw Binary using specified algorithm (e.g. 'HmacSHA256').",
    "params": [
      {
        "name": "content",
        "type": "Binary",
        "desc": "Message payload."
      },
      {
        "name": "key",
        "type": "Binary",
        "desc": "Secret key."
      },
      {
        "name": "algorithm",
        "type": "String",
        "desc": "HMAC algorithm (e.g. 'HmacSHA256')."
      }
    ],
    "returns": "Binary",
    "example": "%dw 2.0\nimport * from dw::Crypto\noutput application/octet-stream\n---\nHMACBinary(\"data\" as Binary, \"secret\" as Binary, \"HmacSHA256\")"
  },
  "HMACWith": {
    "name": "HMACWith",
    "module": "dw::Crypto",
    "type": "fn",
    "signature": "HMACWith(content: Binary, key: Binary, algorithm: String): String",
    "description": "Generates an HMAC cryptographic hash formatted as a hex string.",
    "params": [
      {
        "name": "content",
        "type": "Binary",
        "desc": "Message payload."
      },
      {
        "name": "key",
        "type": "Binary",
        "desc": "Secret key."
      },
      {
        "name": "algorithm",
        "type": "String",
        "desc": "HMAC algorithm (e.g. 'HmacSHA256')."
      }
    ],
    "returns": "String",
    "example": "%dw 2.0\nimport * from dw::Crypto\noutput application/json\n---\nHMACWith(\"data\" as Binary, \"secret\" as Binary, \"HmacSHA256\")"
  },
  "diff": {
    "name": "diff",
    "module": "dw::util::Diff",
    "type": "fn",
    "signature": "diff(a: Any, b: Any): {matches: Boolean, diffs: Array}",
    "description": "Performs structural diff comparison between two documents, returning match status and field-level diffs.",
    "params": [
      {
        "name": "a",
        "type": "Any",
        "desc": "Expected document."
      },
      {
        "name": "b",
        "type": "Any",
        "desc": "Actual document."
      }
    ],
    "returns": "{matches: Boolean, diffs: Array}",
    "example": "%dw 2.0\nimport * from dw::util::Diff\noutput application/json\n---\ndiff({ a: 1, b: 2 }, { a: 1, b: 3 })"
  },
  "currentMilliseconds": {
    "name": "currentMilliseconds",
    "module": "dw::util::Timer",
    "type": "fn",
    "signature": "currentMilliseconds(): Number",
    "description": "Returns current epoch timestamp in milliseconds.",
    "params": [],
    "returns": "Number",
    "example": "%dw 2.0\nimport * from dw::util::Timer\noutput application/json\n---\ncurrentMilliseconds()"
  },
  "duration": {
    "name": "duration",
    "module": "dw::util::Timer",
    "type": "fn",
    "signature": "duration(() -> Any): {time: Number, result: Any}",
    "description": "Times execution duration of the enclosed lambda expression in milliseconds.",
    "params": [
      {
        "name": "lambda",
        "type": "() -> Any",
        "desc": "Expression block to time."
      }
    ],
    "returns": "{time: Number, result: Any}",
    "example": "%dw 2.0\nimport * from dw::util::Timer\noutput application/json\n---\nduration(() -> (1 to 1000) map ($ * 2))"
  },
  "time": {
    "name": "time",
    "module": "dw::util::Timer",
    "type": "fn",
    "signature": "time(() -> Any): {start: DateTime, end: DateTime, result: Any}",
    "description": "Records start and end timestamp of lambda execution along with return result.",
    "params": [
      {
        "name": "lambda",
        "type": "() -> Any",
        "desc": "Expression block to execute."
      }
    ],
    "returns": "{start: DateTime, end: DateTime, result: Any}",
    "example": "%dw 2.0\nimport * from dw::util::Timer\noutput application/json\n---\ntime(() -> (1 to 1000) map ($ * 2))"
  },
  "envVar": {
    "name": "envVar",
    "module": "dw::System",
    "type": "fn",
    "signature": "envVar(name: String): String | Null",
    "description": "Retrieves the value of an operating system environment variable by name.",
    "params": [
      {
        "name": "name",
        "type": "String",
        "desc": "Environment variable name."
      }
    ],
    "returns": "String | Null",
    "example": "%dw 2.0\nimport * from dw::System\noutput application/json\n---\nenvVar(\"PATH\")"
  },
  "envVars": {
    "name": "envVars",
    "module": "dw::System",
    "type": "fn",
    "signature": "envVars(): Object",
    "description": "Returns an object containing all available operating system environment variables.",
    "params": [],
    "returns": "Object",
    "example": "%dw 2.0\nimport * from dw::System\noutput application/json\n---\nenvVars()"
  },
  "payload": {
    "name": "payload",
    "module": "Context Variable",
    "type": "var",
    "signature": "payload: Any",
    "description": "The primary inbound message payload (e.g. JSON, XML, CSV, Java Object). Access attributes with payload.field or payload[0].",
    "params": [],
    "returns": "Any",
    "example": "%dw 2.0\noutput application/json\n---\n{\n  message: payload.message,\n  count: sizeOf(payload.items)\n}"
  },
  "vars": {
    "name": "vars",
    "module": "Context Variable",
    "type": "var",
    "signature": "vars: Object",
    "description": "Map containing all user-defined Mule flow variables. Accessible via vars.myVar or vars['myVar'].",
    "params": [],
    "returns": "Object",
    "example": "%dw 2.0\noutput application/json\n---\n{\n  factor: vars.factor,\n  adjusted: payload.items map ($ * vars.factor)\n}"
  },
  "attributes": {
    "name": "attributes",
    "module": "Context Variable",
    "type": "var",
    "signature": "attributes: Object",
    "description": "Metadata attributes associated with inbound message (e.g. headers, queryParams, uriParams, statusCode, path).",
    "params": [],
    "returns": "Object",
    "example": "%dw 2.0\noutput application/json\n---\n{\n  client: attributes.headers['client-id'],\n  page: attributes.queryParams.page\n}"
  },
  "message": {
    "name": "message",
    "module": "Context Variable",
    "type": "var",
    "signature": "message: Object",
    "description": "The complete Mule message wrapper containing message.payload and message.attributes.",
    "params": [],
    "returns": "Object",
    "example": "%dw 2.0\noutput application/json\n---\nmessage.payload"
  },
  "error": {
    "name": "error",
    "module": "Context Variable",
    "type": "var",
    "signature": "error: Object",
    "description": "Error details object accessible in error handlers (e.g. error.description, error.errorType, error.detailedDescription).",
    "params": [],
    "returns": "Object",
    "example": "%dw 2.0\noutput application/json\n---\n{\n  errCode: error.errorType.identifier,\n  errMsg: error.description\n}"
  },
  "$": {
    "name": "$",
    "module": "Lambda Shorthand",
    "type": "var",
    "signature": "$: Any",
    "description": "Anonymous single-parameter shorthand referring to the current element in a collection iteration or lambda.",
    "params": [],
    "returns": "Any",
    "example": "%dw 2.0\noutput application/json\n---\n[1, 2, 3] map ($ * 10)\n// [10, 20, 30]"
  },
  "$$": {
    "name": "$$",
    "module": "Lambda Shorthand",
    "type": "var",
    "signature": "$$: Number | Key",
    "description": "Anonymous second-parameter shorthand referring to the current index (in arrays) or current key (in objects).",
    "params": [],
    "returns": "Number | Key",
    "example": "%dw 2.0\noutput application/json\n---\n[\"a\", \"b\", \"c\"] map { index: $$, value: $ }"
  },
  "$$$": {
    "name": "$$$",
    "module": "Lambda Shorthand",
    "type": "var",
    "signature": "$$$: Number",
    "description": "Anonymous third-parameter shorthand referring to index in mapObject iterations.",
    "params": [],
    "returns": "Number",
    "example": "%dw 2.0\noutput application/json\n---\n{ a: 1, b: 2 } mapObject { ($$): { val: $, idx: $$$ } }"
  },
  "output": {
    "name": "output",
    "module": "Directive",
    "type": "kw",
    "signature": "output <mimeType> [parameters]",
    "description": "Specifies the target serialization format (e.g. application/json, application/csv, application/xml, application/yaml).",
    "params": [],
    "returns": "Directive",
    "example": "%dw 2.0\noutput application/csv header=true\n---\npayload"
  },
  "input": {
    "name": "input",
    "module": "Directive",
    "type": "kw",
    "signature": "input <source> <mimeType>",
    "description": "Declares the MIME type format of an input payload or variable in the header.",
    "params": [],
    "returns": "Directive",
    "example": "%dw 2.0\ninput payload application/xml\noutput application/json\n---\npayload"
  },
  "var": {
    "name": "var",
    "module": "Declaration",
    "type": "kw",
    "signature": "var <name> = <expression>",
    "description": "Declares an immutable script-level variable in the DataWeave header.",
    "params": [],
    "returns": "Declaration",
    "example": "%dw 2.0\nvar rate = 1.15\noutput application/json\n---\npayload.price * rate"
  },
  "fun": {
    "name": "fun",
    "module": "Declaration",
    "type": "kw",
    "signature": "fun <name>(<params>) = <expression>",
    "description": "Declares a reusable custom function in the header.",
    "params": [],
    "returns": "Declaration",
    "example": "%dw 2.0\nfun toEuro(usd) = usd * 0.92\noutput application/json\n---\ntoEuro(100)"
  },
  "import": {
    "name": "import",
    "module": "Directive",
    "type": "kw",
    "signature": "import [items] from <module>",
    "description": "Imports functions, variables, or types from standard library modules (e.g. dw::core::Strings, dw::Crypto).",
    "params": [],
    "returns": "Directive",
    "example": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n---\ncamelize(\"my_var\")"
  },
  "do": {
    "name": "do",
    "module": "Scope",
    "type": "kw",
    "signature": "do {\n  [var/fun declarations]\n  ---\n  <body expression>\n}",
    "description": "Creates a localized scope block with its own header declarations and body expression.",
    "params": [],
    "returns": "Any",
    "example": "%dw 2.0\noutput application/json\n---\ndo {\n  var x = 10\n  ---\n  x * 2\n}"
  },
  "update": {
    "name": "update",
    "module": "Object Mutation",
    "type": "kw",
    "signature": "<object> update {\n  case .<path> -> <newValue>\n}",
    "description": "Non-destructively modifies nested attributes or elements within objects and arrays.",
    "params": [],
    "returns": "Object",
    "example": "%dw 2.0\noutput application/json\n---\npayload update {\n  case .user.status -> \"ACTIVE\"\n}"
  },
  "default": {
    "name": "default",
    "module": "Operator",
    "type": "kw",
    "signature": "<expression> default <fallbackValue>",
    "description": "Returns the fallback value if the left expression evaluates to null or does not exist.",
    "params": [],
    "returns": "Any",
    "example": "%dw 2.0\noutput application/json\n---\n{\n  name: payload.name default \"Anonymous\"\n}"
  },
  "as": {
    "name": "as",
    "module": "Coercion",
    "type": "kw",
    "signature": "<value> as <Type> [format]",
    "description": "Coerces a value to the specified target type (e.g. as Number, as Date {format: 'yyyy-MM-dd'}).",
    "params": [],
    "returns": "Type",
    "example": "%dw 2.0\noutput application/json\n---\n{\n  num: \"123\" as Number,\n  dt: \"2026-11-21\" as Date\n}"
  },
  "is": {
    "name": "is",
    "module": "Type Check",
    "type": "kw",
    "signature": "<value> is <Type>",
    "description": "Returns true if the value matches the specified type or schema.",
    "params": [],
    "returns": "Boolean",
    "example": "%dw 2.0\noutput application/json\n---\npayload is Object // true"
  }
};

  function getDocInfo(itemOrName) {
    if (!itemOrName) return null;
    if (typeof itemOrName === "string") {
      var query = itemOrName.trim();
      if (DW_DOCS[query]) return DW_DOCS[query];
      var shortQuery = query.split("::").pop();
      if (DW_DOCS[shortQuery]) return DW_DOCS[shortQuery];
      // Search in DW_MODULE_FUNCTIONS or DW_CATALOG
      for (var i = 0; i < DW_MODULE_FUNCTIONS.length; i++) {
        var mf = DW_MODULE_FUNCTIONS[i];
        if (mf.displayText === query || mf.text.indexOf(query) === 0) {
          return {
            name: mf.displayText || query,
            module: mf.module || "Standard Library",
            type: mf.type || "fn",
            signature: mf.doc || mf.text,
            description: "MuleSoft DataWeave Standard Library function (" + (mf.module || "") + ").",
            example: "%dw 2.0\nimport * from " + mf.module + "\noutput application/json\n---\n" + (mf.displayText || query) + "()"
          };
        }
      }
      for (var j = 0; j < DW_CATALOG.length; j++) {
        var cat = DW_CATALOG[j];
        if (cat.displayText === query || cat.text.trim() === query) {
          return {
            name: cat.displayText || query,
            module: cat.module || "dw::Core",
            type: cat.type || "kw",
            signature: cat.text,
            description: cat.doc || ("DataWeave 2.0 " + (cat.type || "element")),
            example: ""
          };
        }
      }
      return null;
    }

    var it = itemOrName.data || itemOrName;
    var rawName = (it.displayText || it.text || "").replace(/\(.*$/, "").trim();
    if (DW_DOCS[rawName]) {
      var d = Object.assign({}, DW_DOCS[rawName]);
      if (it.module) d.module = it.module;
      return d;
    }

    // Dynamic field from payload
    if (it.type === "field") {
      return {
        name: it.displayText || it.text,
        module: "Inbound Payload Field",
        type: "field",
        signature: "payload." + (it.displayText || it.text),
        description: it.doc || "Dynamic field detected in inbound payload.",
        example: "%dw 2.0\noutput application/json\n---\npayload." + (it.displayText || it.text)
      };
    }

    // MIME type
    if (it.type === "mime") {
      return {
        name: it.displayText || it.text,
        module: "MIME Type",
        type: "mime",
        signature: "output " + it.text,
        description: it.doc || ("DataWeave output format: " + it.text),
        example: "%dw 2.0\noutput " + it.text + "\n---\npayload"
      };
    }

    return {
      name: it.displayText || it.text,
      module: it.module || "dw::Core",
      type: it.type || "kw",
      signature: it.doc || it.text,
      description: it.doc || "DataWeave construct.",
      example: ""
    };
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderDocCardHtml(doc) {
    if (!doc) return "";
    var html = '<div class="dw-doc-body">';

    // Header
    html += '<div class="dw-doc-header">';
    html += '  <div class="dw-doc-title-row">';
    html += '    <span class="dw-doc-name">' + escapeHtml(doc.name) + '</span>';
    html += '    <span class="dw-doc-badge dw-badge-' + escapeHtml(doc.type || "kw") + '">' + escapeHtml(doc.type || "kw") + '</span>';
    html += '  </div>';
    if (doc.module) {
      html += '  <div class="dw-doc-mod">' + escapeHtml(doc.module) + '</div>';
    }
    html += '</div>';

    // Signature
    if (doc.signature) {
      html += '<div class="dw-doc-sig-box"><code>' + escapeHtml(doc.signature) + '</code></div>';
    }

    // Description
    if (doc.description) {
      html += '<div class="dw-doc-desc">' + escapeHtml(doc.description) + '</div>';
    }

    // Parameters
    if (doc.params && doc.params.length > 0) {
      html += '<div class="dw-doc-section">';
      html += '  <div class="dw-doc-section-title">Parameters</div>';
      html += '  <table class="dw-doc-params"><tbody>';
      doc.params.forEach(function(p) {
        html += '    <tr>';
        html += '      <td class="dw-doc-param-name">' + escapeHtml(p.name) + '</td>';
        html += '      <td class="dw-doc-param-type">' + escapeHtml(p.type || "Any") + '</td>';
        html += '      <td class="dw-doc-param-desc">' + escapeHtml(p.desc || "") + '</td>';
        html += '    </tr>';
      });
      html += '  </tbody></table>';
      html += '</div>';
    }

    // Returns
    if (doc.returns) {
      html += '<div class="dw-doc-returns"><span class="dw-doc-label">Returns:</span> <code>' + escapeHtml(doc.returns) + '</code></div>';
    }

    // Example
    if (doc.example) {
      html += '<div class="dw-doc-section">';
      html += '  <div class="dw-doc-section-title">Example</div>';
      html += '  <pre class="dw-doc-example"><code>' + escapeHtml(doc.example) + '</code></pre>';
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  // --- FLYOUT & HOVER DOM MANAGERS ---
  var flyoutEl = null;
  var hoverEl = null;
  var hoverTimer = null;
  var activeHoverWord = null;

  function getOrCreateFlyout() {
    if (!flyoutEl) {
      flyoutEl = document.createElement("div");
      flyoutEl.id = "dw-doc-flyout";
      flyoutEl.className = "dw-doc-flyout";
      document.body.appendChild(flyoutEl);
    }
    return flyoutEl;
  }

  function getOrCreateHoverTooltip() {
    if (!hoverEl) {
      hoverEl = document.createElement("div");
      hoverEl.id = "dw-hover-tooltip";
      hoverEl.className = "dw-hover-tooltip";
      document.body.appendChild(hoverEl);

      hoverEl.addEventListener("mouseleave", function() {
        hideHoverTooltip();
      });
    }
    return hoverEl;
  }

  function showDocFlyout(completion, elt) {
    if (!completion) return;
    var doc = getDocInfo(completion.data || completion);
    if (!doc) {
      hideDocFlyout();
      return;
    }

    var flyout = getOrCreateFlyout();
    flyout.innerHTML = renderDocCardHtml(doc);

    // Position alongside .CodeMirror-hints
    requestAnimationFrame(function() {
      var hintsMenu = (elt && elt.closest) ? elt.closest(".CodeMirror-hints") : document.querySelector(".CodeMirror-hints");
      if (!hintsMenu) {
        flyout.style.display = "none";
        return;
      }

      var menuRect = hintsMenu.getBoundingClientRect();
      var flyoutWidth = 380;
      var spaceRight = window.innerWidth - menuRect.right;
      var left;

      if (spaceRight >= flyoutWidth + 12 || spaceRight >= menuRect.left) {
        left = menuRect.right + 6;
      } else {
        left = menuRect.left - flyoutWidth - 6;
      }
      left = Math.max(10, Math.min(left, window.innerWidth - flyoutWidth - 10));

      var top = menuRect.top;
      var flyoutHeight = flyout.offsetHeight || 320;
      if (top + flyoutHeight > window.innerHeight - 10) {
        top = Math.max(10, window.innerHeight - flyoutHeight - 10);
      }

      flyout.style.left = left + "px";
      flyout.style.top = top + "px";
      flyout.style.display = "block";
    });
  }

  function hideDocFlyout() {
    if (flyoutEl) {
      flyoutEl.style.display = "none";
    }
  }

  function showHoverTooltip(cm, pos, clientX, clientY) {
    if (document.querySelector(".CodeMirror-hints") || (cm.state && cm.state.completionActive)) {
      hideHoverTooltip();
      return;
    }

    var word = getWordAt(cm, pos);
    if (!word) {
      hideHoverTooltip();
      return;
    }

    var doc = getDocInfo(word);
    if (!doc) {
      hideHoverTooltip();
      return;
    }

    activeHoverWord = word;
    var tooltip = getOrCreateHoverTooltip();
    tooltip.innerHTML = renderDocCardHtml(doc);

    requestAnimationFrame(function() {
      var coords = cm.charCoords(pos, "window");
      var tooltipWidth = 380;
      var left = coords.left;
      left = Math.max(10, Math.min(left, window.innerWidth - tooltipWidth - 10));

      var top = coords.bottom + 6;
      var tooltipHeight = tooltip.offsetHeight || 260;
      if (top + tooltipHeight > window.innerHeight - 10) {
        top = Math.max(10, coords.top - tooltipHeight - 6);
      }

      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
      tooltip.style.display = "block";
    });
  }

  function hideHoverTooltip() {
    clearTimeout(hoverTimer);
    activeHoverWord = null;
    if (hoverEl) {
      hoverEl.style.display = "none";
    }
  }

  function getWordAt(cm, pos) {
    var tok = cm.getTokenAt(pos);
    if (tok && tok.string) {
      var s = tok.string.trim();
      if (s && /[a-zA-Z0-9_$:.]/.test(s)) {
        return s;
      }
    }
    var line = cm.getLine(pos.line);
    if (!line) return "";
    var ch = pos.ch;
    var start = ch, end = ch;
    while (start > 0 && /[a-zA-Z0-9_$:.]/.test(line.charAt(start - 1))) start--;
    while (end < line.length && /[a-zA-Z0-9_$:.]/.test(line.charAt(end))) end++;
    return line.slice(start, end).trim();
  }

  function setupHoverTooltips(cm) {
    if (!cm || !cm.getWrapperElement) return;
    var wrapper = cm.getWrapperElement();

    wrapper.addEventListener("mousemove", function(e) {
      if (document.querySelector(".CodeMirror-hints") || (cm.state && cm.state.completionActive)) {
        hideHoverTooltip();
        return;
      }

      var pos = cm.coordsChar({ left: e.clientX, top: e.clientY });
      if (!pos) {
        hideHoverTooltip();
        return;
      }

      var word = getWordAt(cm, pos);
      if (!word) {
        hideHoverTooltip();
        return;
      }

      if (word === activeHoverWord && hoverEl && hoverEl.style.display === "block") {
        return; // Already showing for this word
      }

      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function() {
        showHoverTooltip(cm, pos, e.clientX, e.clientY);
      }, 260);
    });

    wrapper.addEventListener("mouseleave", function(e) {
      if (hoverEl && e.relatedTarget === hoverEl) return;
      hideHoverTooltip();
    });

    cm.on("cursorActivity", hideHoverTooltip);
    cm.on("scroll", hideHoverTooltip);
    cm.on("change", hideHoverTooltip);
  }

  function injectDocStyles() {
    if (document.getElementById("dw-doc-styles")) return;
    var style = document.createElement("style");
    style.id = "dw-doc-styles";
    style.textContent = `
      .dw-doc-flyout,
      .dw-hover-tooltip {
        position: fixed;
        z-index: 100000;
        width: 380px;
        max-width: calc(100vw - 32px);
        max-height: 480px;
        background: var(--panel, #0e1520);
        border: 1px solid var(--border-hover, #334155);
        border-radius: 8px;
        box-shadow: 0 16px 40px -4px rgba(0, 0, 0, 0.6), 0 4px 12px -2px rgba(0, 0, 0, 0.35);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: var(--text, #e2e8f0);
        padding: 0;
        display: none;
        overflow: hidden;
        backdrop-filter: blur(14px);
        box-sizing: border-box;
        animation: dwDocFadeIn 0.12s ease-out;
      }

      @keyframes dwDocFadeIn {
        from { opacity: 0; transform: translateY(2px) scale(0.985); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      .dw-doc-body {
        padding: 12px 14px;
        max-height: 480px;
        overflow-y: auto;
        box-sizing: border-box;
      }

      .dw-doc-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border, #1e293b);
      }

      .dw-doc-title-row {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        flex: 1 1 auto;
      }

      .dw-doc-name {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 14px;
        font-weight: 700;
        color: var(--accent, #2dd4bf);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dw-doc-badge {
        display: inline-block;
        font-size: 9.5px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 1px 5px;
        border-radius: 3px;
        letter-spacing: 0.5px;
        flex-shrink: 0;
      }

      .dw-doc-mod {
        font-size: 11px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        color: var(--text-faint, #64748b);
        background: var(--btn-bg, #172234);
        border: 1px solid var(--border, #1e293b);
        padding: 1px 6px;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .dw-doc-sig-box {
        background: rgba(0, 0, 0, 0.28);
        border: 1px solid var(--border, #1e293b);
        border-radius: 6px;
        padding: 8px 10px;
        margin-bottom: 10px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 12px;
        line-height: 1.45;
        color: #38bdf8;
        overflow-x: auto;
        white-space: pre-wrap;
        word-break: break-all;
      }

      .dw-doc-desc {
        font-size: 12.5px;
        line-height: 1.5;
        color: var(--text, #e2e8f0);
        margin-bottom: 10px;
      }

      .dw-doc-section {
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px dashed var(--border, #1e293b);
      }

      .dw-doc-section-title {
        font-size: 10.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: var(--text-faint, #64748b);
        margin-bottom: 6px;
      }

      .dw-doc-params {
        width: 100%;
        border-collapse: collapse;
        font-size: 11.5px;
        margin-bottom: 6px;
      }

      .dw-doc-params td {
        padding: 3px 6px 3px 0;
        vertical-align: top;
      }

      .dw-doc-param-name {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 600;
        color: #fbbf24;
        white-space: nowrap;
      }

      .dw-doc-param-type {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        color: #a78bfa;
        font-size: 11px;
        white-space: nowrap;
      }

      .dw-doc-param-desc {
        color: var(--text-muted, #94a3b8);
        line-height: 1.35;
      }

      .dw-doc-returns {
        font-size: 11.5px;
        color: var(--text-muted, #94a3b8);
        margin-top: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .dw-doc-returns code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        color: #34d399;
        font-size: 11.5px;
      }

      .dw-doc-example {
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid var(--border, #1e293b);
        border-radius: 6px;
        padding: 8px 10px;
        margin: 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 11.5px;
        line-height: 1.45;
        color: #e2e8f0;
        overflow-x: auto;
        white-space: pre;
      }
    `;
    document.head.appendChild(style);
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

    // Initialize hover tooltips and inject doc styles
    injectDocStyles();
    setupHoverTooltips(edSc.cm);

    // Dismiss doc flyout when autocomplete finishes, cursor moves, or user clicks away
    edSc.cm.on("endCompletion", function() {
      hideDocFlyout();
    });

    edSc.cm.on("cursorActivity", function(cm) {
      if (!cm.state.completionActive && !document.querySelector(".CodeMirror-hints")) {
        hideDocFlyout();
      }
    });

    document.addEventListener("mousedown", function(e) {
      if (!e.target.closest(".CodeMirror-hints") && !e.target.closest("#dw-doc-flyout")) {
        hideDocFlyout();
      }
    });
  }

  global.DataWeaveAutocomplete = {
    catalog: DW_CATALOG,
    moduleFunctions: DW_MODULE_FUNCTIONS,
    mimeTypes: MIME_TYPES,
    docs: DW_DOCS,
    getDocInfo: getDocInfo,
    showDocFlyout: showDocFlyout,
    hideDocFlyout: hideDocFlyout,
    setupHoverTooltips: setupHoverTooltips,
    analyzePayload: analyzePayload,
    ensureImport: ensureImport,
    createHint: createDataWeaveHint,
    setup: setupAutocomplete
  };

})(typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : this));
