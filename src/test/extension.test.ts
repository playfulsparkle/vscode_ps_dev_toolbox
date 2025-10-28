import * as assert from "assert";
import * as utils from "../utils";

const complexUnicode = "ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ";
const complexEmoji = "🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴";
const complexAccentedHtml = "ôňúäéíáýžťčšľÔŇÚÄÉÍÁÝŽŤČŠĽéáűőúóüöíÉÁŰŐÚÓÜÖÍ";
const complexMixLowercase = "foo © bar ß baz & qux <> 🍎 🏴󠁧󠁢󠁷󠁬󠁳󠁿 éáőú 𝛲🝲";
const complexMixUppercase = "FOO © BAR SS BAZ & QUX <> 🍎 🏴󠁧󠁢󠁷󠁬󠁳󠁿 ÉÁŐÚ 𝛲🝲";

suite("Dev Toolbox Tests", () => {
	suite("Encode/Decode to named HTML Entities", () => {
		test("Complex ascii lowercase, unicode, emoji characters", () => {
			const encoded = "foo &copy; bar &szlig; baz &amp; qux &lt;&gt; &#x1F34E; &#x1F3F4;&#xE0067;&#xE0062;&#xE0077;&#xE006C;&#xE0073;&#xE007F; &eacute;&aacute;&odblac;&uacute; &#x1D6F2;&#x1F772;";
			assert.strictEqual(utils.encodeNamedHtmlEntities(complexMixLowercase), encoded);
			assert.strictEqual(utils.decodeNamedHtmlEntities(encoded), complexMixLowercase);
		});

		test("Complex ascii uppercase, unicode, emoji characters", () => {
			const encoded = "FOO &copy; BAR SS BAZ &amp; QUX &lt;&gt; &#x1F34E; &#x1F3F4;&#xE0067;&#xE0062;&#xE0077;&#xE006C;&#xE0073;&#xE007F; &Eacute;&Aacute;&Odblac;&Uacute; &#x1D6F2;&#x1F772;";
			assert.strictEqual(utils.encodeNamedHtmlEntities(complexMixUppercase), encoded);
			assert.strictEqual(utils.decodeNamedHtmlEntities(encoded), complexMixUppercase);
		});

		test("Complex accented html entities", () => {
			const encoded = "&ocirc;&ncaron;&uacute;&auml;&eacute;&iacute;&aacute;&yacute;&zcaron;&tcaron;&ccaron;&scaron;&lcaron;&Ocirc;&Ncaron;&Uacute;&Auml;&Eacute;&Iacute;&Aacute;&Yacute;&Zcaron;&Tcaron;&Ccaron;&Scaron;&Lcaron;&eacute;&aacute;&udblac;&odblac;&uacute;&oacute;&uuml;&ouml;&iacute;&Eacute;&Aacute;&Udblac;&Odblac;&Uacute;&Oacute;&Uuml;&Ouml;&Iacute;";
			assert.strictEqual(utils.encodeNamedHtmlEntities(complexAccentedHtml), encoded);
			assert.strictEqual(utils.decodeNamedHtmlEntities(encoded), complexAccentedHtml);
		});
	});

	suite("Encode/Decode to HTML Entities", () => {
		test("Complex unicode characters", () => {
			const encoded = "&#x0110;&#x0111;&#x0129;&#x0128;&#x0169;&#x0168;&#x01A1;&#x01A0;&#x01B0;&#x01AF;&#x1EA1;&#x1EA0;&#x1EA3;&#x1EA2;&#x1EA5;&#x1EA4;&#x1EA7;&#x1EA6;&#x1EA9;&#x1EA8;&#x1EAB;&#x1EAA;&#x1EAD;&#x1EAC;&#x1EAF;&#x1EAE;&#x1EB1;&#x1EB0;&#x1EB3;&#x1EB2;&#x1EB5;&#x1EB4;&#x1EB7;&#x1EB6;&#x1EB9;&#x1EB8;&#x1EBB;&#x1EBA;&#x1EBD;&#x1EBC;&#x1EBF;&#x1EBE;&#x1EC1;&#x1EC0;&#x1EC3;&#x1EC2;&#x1EC5;&#x1EC4;&#x1EC7;&#x1EC6;&#x1EC9;&#x1EC8;&#x1ECB;&#x1ECA;&#x1ECD;&#x1ECC;&#x1ECF;&#x1ECE;&#x1ED1;&#x1ED0;&#x1ED3;&#x1ED2;&#x1ED5;&#x1ED4;&#x1ED7;&#x1ED6;&#x1ED9;&#x1ED8;&#x1EDB;&#x1EDA;&#x1EDD;&#x1EDC;&#x1EDF;&#x1EDE;&#x1EE1;&#x1EE0;&#x1EE3;&#x1EE2;&#x1EE5;&#x1EE4;&#x1EE7;&#x1EE6;&#x1EE9;&#x1EE8;&#x1EEB;&#x1EEA;&#x1EED;&#x1EEC;&#x1EEF;&#x1EEE;&#x1EF1;&#x1EF0;&#x1EF3;&#x1EF2;&#x1EF5;&#x1EF4;&#x1EF7;&#x1EF6;&#x1EF9;&#x1EF8;";
			assert.strictEqual(utils.encodeHtmlHexEntities(complexUnicode), encoded);
			assert.strictEqual(utils.decodeHtmlHexEntities(encoded), complexUnicode);
		});

		test("Complex emoji", () => {
			const encoded = "&#x1F3F4;&#xE0067;&#xE0062;&#xE0077;&#xE006C;&#xE0073;&#xE007F; &#x1F9D1;&#x200D;&#x1F91D;&#x200D;&#x1F9D1; &#x1F468;&#x200D;&#x1F469;&#x200D;&#x1F466;&#x200D;&#x1F466; &#x1F469;&#x200D;&#x1F469;&#x200D;&#x1F467;&#x200D;&#x1F467; &#x1F469;&#x200D;&#x2764;&#xFE0F;&#x200D;&#x1F48B;&#x200D;&#x1F469; &#x1F3F4;";
			assert.strictEqual(utils.encodeHtmlHexEntities(complexEmoji), encoded);
			assert.strictEqual(utils.decodeHtmlHexEntities(encoded), complexEmoji);
		});
	});

	suite("Encode/Decode to Decimal Entities", () => {
		test("Complex unicode characters", () => {
			const encoded = "&#272;&#273;&#297;&#296;&#361;&#360;&#417;&#416;&#432;&#431;&#7841;&#7840;&#7843;&#7842;&#7845;&#7844;&#7847;&#7846;&#7849;&#7848;&#7851;&#7850;&#7853;&#7852;&#7855;&#7854;&#7857;&#7856;&#7859;&#7858;&#7861;&#7860;&#7863;&#7862;&#7865;&#7864;&#7867;&#7866;&#7869;&#7868;&#7871;&#7870;&#7873;&#7872;&#7875;&#7874;&#7877;&#7876;&#7879;&#7878;&#7881;&#7880;&#7883;&#7882;&#7885;&#7884;&#7887;&#7886;&#7889;&#7888;&#7891;&#7890;&#7893;&#7892;&#7895;&#7894;&#7897;&#7896;&#7899;&#7898;&#7901;&#7900;&#7903;&#7902;&#7905;&#7904;&#7907;&#7906;&#7909;&#7908;&#7911;&#7910;&#7913;&#7912;&#7915;&#7914;&#7917;&#7916;&#7919;&#7918;&#7921;&#7920;&#7923;&#7922;&#7925;&#7924;&#7927;&#7926;&#7929;&#7928;";
			assert.strictEqual(utils.encodeHtmlDecimalEntities(complexUnicode), encoded);
			assert.strictEqual(utils.decodeHtmlDecimalEntities(encoded), complexUnicode);
		});

		test("Complex emoji", () => {
			const encoded = "&#127988;&#917607;&#917602;&#917623;&#917612;&#917619;&#917631; &#129489;&#8205;&#129309;&#8205;&#129489; &#128104;&#8205;&#128105;&#8205;&#128102;&#8205;&#128102; &#128105;&#8205;&#128105;&#8205;&#128103;&#8205;&#128103; &#128105;&#8205;&#10084;&#65039;&#8205;&#128139;&#8205;&#128105; &#127988;";
			assert.strictEqual(utils.encodeHtmlDecimalEntities(complexEmoji), encoded);
			assert.strictEqual(utils.decodeHtmlDecimalEntities(encoded), complexEmoji);
		});
	});

	suite("Encode/Decode to Unicode Escape", () => {
		test("Complex unicode characters", () => {
			const encoded = "\\u0110\\u0111\\u0129\\u0128\\u0169\\u0168\\u01A1\\u01A0\\u01B0\\u01AF\\u1EA1\\u1EA0\\u1EA3\\u1EA2\\u1EA5\\u1EA4\\u1EA7\\u1EA6\\u1EA9\\u1EA8\\u1EAB\\u1EAA\\u1EAD\\u1EAC\\u1EAF\\u1EAE\\u1EB1\\u1EB0\\u1EB3\\u1EB2\\u1EB5\\u1EB4\\u1EB7\\u1EB6\\u1EB9\\u1EB8\\u1EBB\\u1EBA\\u1EBD\\u1EBC\\u1EBF\\u1EBE\\u1EC1\\u1EC0\\u1EC3\\u1EC2\\u1EC5\\u1EC4\\u1EC7\\u1EC6\\u1EC9\\u1EC8\\u1ECB\\u1ECA\\u1ECD\\u1ECC\\u1ECF\\u1ECE\\u1ED1\\u1ED0\\u1ED3\\u1ED2\\u1ED5\\u1ED4\\u1ED7\\u1ED6\\u1ED9\\u1ED8\\u1EDB\\u1EDA\\u1EDD\\u1EDC\\u1EDF\\u1EDE\\u1EE1\\u1EE0\\u1EE3\\u1EE2\\u1EE5\\u1EE4\\u1EE7\\u1EE6\\u1EE9\\u1EE8\\u1EEB\\u1EEA\\u1EED\\u1EEC\\u1EEF\\u1EEE\\u1EF1\\u1EF0\\u1EF3\\u1EF2\\u1EF5\\u1EF4\\u1EF7\\u1EF6\\u1EF9\\u1EF8";
			assert.strictEqual(utils.encodeJavaScriptUTF16EscapeSequence(complexUnicode), encoded);
			assert.strictEqual(utils.decodeJavaScriptUTF16EscapeSequence(encoded), complexUnicode);
		});

		test("Complex emoji", () => {
			const encoded = "\\U0001F3F4\\U000E0067\\U000E0062\\U000E0077\\U000E006C\\U000E0073\\U000E007F\\u0020\\U0001F9D1\\u200D\\U0001F91D\\u200D\\U0001F9D1\\u0020\\U0001F468\\u200D\\U0001F469\\u200D\\U0001F466\\u200D\\U0001F466\\u0020\\U0001F469\\u200D\\U0001F469\\u200D\\U0001F467\\u200D\\U0001F467\\u0020\\U0001F469\\u200D\\u2764\\uFE0F\\u200D\\U0001F48B\\u200D\\U0001F469\\u0020\\U0001F3F4";
			assert.strictEqual(utils.encodeJavaScriptUTF16EscapeSequence(complexEmoji), encoded);
			assert.strictEqual(utils.decodeJavaScriptUTF16EscapeSequence(encoded), complexEmoji);
		});
	});

	suite("Encode/Decode to CSS Unicode", () => {
		test("Complex unicode characters", () => {
			const encoded = "\\0110 \\0111 \\0129 \\0128 \\0169 \\0168 \\01A1 \\01A0 \\01B0 \\01AF \\1EA1 \\1EA0 \\1EA3 \\1EA2 \\1EA5 \\1EA4 \\1EA7 \\1EA6 \\1EA9 \\1EA8 \\1EAB \\1EAA \\1EAD \\1EAC \\1EAF \\1EAE \\1EB1 \\1EB0 \\1EB3 \\1EB2 \\1EB5 \\1EB4 \\1EB7 \\1EB6 \\1EB9 \\1EB8 \\1EBB \\1EBA \\1EBD \\1EBC \\1EBF \\1EBE \\1EC1 \\1EC0 \\1EC3 \\1EC2 \\1EC5 \\1EC4 \\1EC7 \\1EC6 \\1EC9 \\1EC8 \\1ECB \\1ECA \\1ECD \\1ECC \\1ECF \\1ECE \\1ED1 \\1ED0 \\1ED3 \\1ED2 \\1ED5 \\1ED4 \\1ED7 \\1ED6 \\1ED9 \\1ED8 \\1EDB \\1EDA \\1EDD \\1EDC \\1EDF \\1EDE \\1EE1 \\1EE0 \\1EE3 \\1EE2 \\1EE5 \\1EE4 \\1EE7 \\1EE6 \\1EE9 \\1EE8 \\1EEB \\1EEA \\1EED \\1EEC \\1EEF \\1EEE \\1EF1 \\1EF0 \\1EF3 \\1EF2 \\1EF5 \\1EF4 \\1EF7 \\1EF6 \\1EF9 \\1EF8 ";
			assert.strictEqual(utils.encodeCssUnicodeEscape(complexUnicode), encoded);
			assert.strictEqual(utils.decodeCssUnicodeEscape(encoded), complexUnicode);
		});

		test("Complex emoji", () => {
			const encoded = "\\01F3F4 \\0E0067 \\0E0062 \\0E0077 \\0E006C \\0E0073 \\0E007F  \\01F9D1 \\200D \\01F91D \\200D \\01F9D1  \\01F468 \\200D \\01F469 \\200D \\01F466 \\200D \\01F466  \\01F469 \\200D \\01F469 \\200D \\01F467 \\200D \\01F467  \\01F469 \\200D \\2764 \\FE0F \\200D \\01F48B \\200D \\01F469  \\01F3F4 ";
			assert.strictEqual(utils.encodeCssUnicodeEscape(complexEmoji), encoded);
			assert.strictEqual(utils.decodeCssUnicodeEscape(encoded), complexEmoji);
		});
	});

	suite("Encode/Decode to Unicode Codepoint", () => {
		test("Complex unicode characters", () => {
			const encoded = "U+0110U+0111U+0129U+0128U+0169U+0168U+01A1U+01A0U+01B0U+01AFU+1EA1U+1EA0U+1EA3U+1EA2U+1EA5U+1EA4U+1EA7U+1EA6U+1EA9U+1EA8U+1EABU+1EAAU+1EADU+1EACU+1EAFU+1EAEU+1EB1U+1EB0U+1EB3U+1EB2U+1EB5U+1EB4U+1EB7U+1EB6U+1EB9U+1EB8U+1EBBU+1EBAU+1EBDU+1EBCU+1EBFU+1EBEU+1EC1U+1EC0U+1EC3U+1EC2U+1EC5U+1EC4U+1EC7U+1EC6U+1EC9U+1EC8U+1ECBU+1ECAU+1ECDU+1ECCU+1ECFU+1ECEU+1ED1U+1ED0U+1ED3U+1ED2U+1ED5U+1ED4U+1ED7U+1ED6U+1ED9U+1ED8U+1EDBU+1EDAU+1EDDU+1EDCU+1EDFU+1EDEU+1EE1U+1EE0U+1EE3U+1EE2U+1EE5U+1EE4U+1EE7U+1EE6U+1EE9U+1EE8U+1EEBU+1EEAU+1EEDU+1EECU+1EEFU+1EEEU+1EF1U+1EF0U+1EF3U+1EF2U+1EF5U+1EF4U+1EF7U+1EF6U+1EF9U+1EF8";
			assert.strictEqual(utils.encodeUnicodeCodePointNotation(complexUnicode), encoded);
			assert.strictEqual(utils.decodeUnicodeCodePointNotation(encoded), complexUnicode);
		});

		test("Complex emoji", () => {
			const encoded = "U+1F3F4U+E0067U+E0062U+E0077U+E006CU+E0073U+E007FU+0020U+1F9D1U+200DU+1F91DU+200DU+1F9D1U+0020U+1F468U+200DU+1F469U+200DU+1F466U+200DU+1F466U+0020U+1F469U+200DU+1F469U+200DU+1F467U+200DU+1F467U+0020U+1F469U+200DU+2764U+FE0FU+200DU+1F48BU+200DU+1F469U+0020U+1F3F4";
			assert.strictEqual(utils.encodeUnicodeCodePointNotation(complexEmoji), encoded);
			assert.strictEqual(utils.decodeUnicodeCodePointNotation(encoded), complexEmoji);
		});
	});

	suite("Encode/Decode ES6 Unicode Code Point Escape", () => {
		test("Complex unicode characters", () => {
			const encoded = "\\u{110}\\u{111}\\u{129}\\u{128}\\u{169}\\u{168}\\u{1A1}\\u{1A0}\\u{1B0}\\u{1AF}\\u{1EA1}\\u{1EA0}\\u{1EA3}\\u{1EA2}\\u{1EA5}\\u{1EA4}\\u{1EA7}\\u{1EA6}\\u{1EA9}\\u{1EA8}\\u{1EAB}\\u{1EAA}\\u{1EAD}\\u{1EAC}\\u{1EAF}\\u{1EAE}\\u{1EB1}\\u{1EB0}\\u{1EB3}\\u{1EB2}\\u{1EB5}\\u{1EB4}\\u{1EB7}\\u{1EB6}\\u{1EB9}\\u{1EB8}\\u{1EBB}\\u{1EBA}\\u{1EBD}\\u{1EBC}\\u{1EBF}\\u{1EBE}\\u{1EC1}\\u{1EC0}\\u{1EC3}\\u{1EC2}\\u{1EC5}\\u{1EC4}\\u{1EC7}\\u{1EC6}\\u{1EC9}\\u{1EC8}\\u{1ECB}\\u{1ECA}\\u{1ECD}\\u{1ECC}\\u{1ECF}\\u{1ECE}\\u{1ED1}\\u{1ED0}\\u{1ED3}\\u{1ED2}\\u{1ED5}\\u{1ED4}\\u{1ED7}\\u{1ED6}\\u{1ED9}\\u{1ED8}\\u{1EDB}\\u{1EDA}\\u{1EDD}\\u{1EDC}\\u{1EDF}\\u{1EDE}\\u{1EE1}\\u{1EE0}\\u{1EE3}\\u{1EE2}\\u{1EE5}\\u{1EE4}\\u{1EE7}\\u{1EE6}\\u{1EE9}\\u{1EE8}\\u{1EEB}\\u{1EEA}\\u{1EED}\\u{1EEC}\\u{1EEF}\\u{1EEE}\\u{1EF1}\\u{1EF0}\\u{1EF3}\\u{1EF2}\\u{1EF5}\\u{1EF4}\\u{1EF7}\\u{1EF6}\\u{1EF9}\\u{1EF8}";
			assert.strictEqual(utils.encodeUnicodeCodePointEscapeSequence(complexUnicode), encoded);
			assert.strictEqual(utils.decodeUnicodeCodePointEscapeSequence(encoded), complexUnicode);
		});

		test("Complex emoji", () => {
			const encoded = "\\u{1F3F4}\\u{E0067}\\u{E0062}\\u{E0077}\\u{E006C}\\u{E0073}\\u{E007F} \\u{1F9D1}\\u{200D}\\u{1F91D}\\u{200D}\\u{1F9D1} \\u{1F468}\\u{200D}\\u{1F469}\\u{200D}\\u{1F466}\\u{200D}\\u{1F466} \\u{1F469}\\u{200D}\\u{1F469}\\u{200D}\\u{1F467}\\u{200D}\\u{1F467} \\u{1F469}\\u{200D}\\u{2764}\\u{FE0F}\\u{200D}\\u{1F48B}\\u{200D}\\u{1F469} \\u{1F3F4}";
			assert.strictEqual(utils.encodeUnicodeCodePointEscapeSequence(complexEmoji), encoded);
			assert.strictEqual(utils.decodeUnicodeCodePointEscapeSequence(encoded), complexEmoji);
		});
	});

	suite("Encode/Decode Extended Hex Escape", () => {
		test("Complex unicode characters", () => {
			const encoded = "\\x{110}\\x{111}\\x{129}\\x{128}\\x{169}\\x{168}\\x{1A1}\\x{1A0}\\x{1B0}\\x{1AF}\\x{1EA1}\\x{1EA0}\\x{1EA3}\\x{1EA2}\\x{1EA5}\\x{1EA4}\\x{1EA7}\\x{1EA6}\\x{1EA9}\\x{1EA8}\\x{1EAB}\\x{1EAA}\\x{1EAD}\\x{1EAC}\\x{1EAF}\\x{1EAE}\\x{1EB1}\\x{1EB0}\\x{1EB3}\\x{1EB2}\\x{1EB5}\\x{1EB4}\\x{1EB7}\\x{1EB6}\\x{1EB9}\\x{1EB8}\\x{1EBB}\\x{1EBA}\\x{1EBD}\\x{1EBC}\\x{1EBF}\\x{1EBE}\\x{1EC1}\\x{1EC0}\\x{1EC3}\\x{1EC2}\\x{1EC5}\\x{1EC4}\\x{1EC7}\\x{1EC6}\\x{1EC9}\\x{1EC8}\\x{1ECB}\\x{1ECA}\\x{1ECD}\\x{1ECC}\\x{1ECF}\\x{1ECE}\\x{1ED1}\\x{1ED0}\\x{1ED3}\\x{1ED2}\\x{1ED5}\\x{1ED4}\\x{1ED7}\\x{1ED6}\\x{1ED9}\\x{1ED8}\\x{1EDB}\\x{1EDA}\\x{1EDD}\\x{1EDC}\\x{1EDF}\\x{1EDE}\\x{1EE1}\\x{1EE0}\\x{1EE3}\\x{1EE2}\\x{1EE5}\\x{1EE4}\\x{1EE7}\\x{1EE6}\\x{1EE9}\\x{1EE8}\\x{1EEB}\\x{1EEA}\\x{1EED}\\x{1EEC}\\x{1EEF}\\x{1EEE}\\x{1EF1}\\x{1EF0}\\x{1EF3}\\x{1EF2}\\x{1EF5}\\x{1EF4}\\x{1EF7}\\x{1EF6}\\x{1EF9}\\x{1EF8}";
			assert.strictEqual(utils.encodePCREUnicodeHexadecimalEcape(complexUnicode), encoded);
			assert.strictEqual(utils.decodePCREUnicodeHexadecimalEcape(encoded), complexUnicode);
		});

		test("Complex emoji", () => {
			const encoded = "\\x{1F3F4}\\x{E0067}\\x{E0062}\\x{E0077}\\x{E006C}\\x{E0073}\\x{E007F} \\x{1F9D1}\\x{200D}\\x{1F91D}\\x{200D}\\x{1F9D1} \\x{1F468}\\x{200D}\\x{1F469}\\x{200D}\\x{1F466}\\x{200D}\\x{1F466} \\x{1F469}\\x{200D}\\x{1F469}\\x{200D}\\x{1F467}\\x{200D}\\x{1F467} \\x{1F469}\\x{200D}\\x{2764}\\x{FE0F}\\x{200D}\\x{1F48B}\\x{200D}\\x{1F469} \\x{1F3F4}";
			assert.strictEqual(utils.encodePCREUnicodeHexadecimalEcape(complexEmoji), encoded);
			assert.strictEqual(utils.decodePCREUnicodeHexadecimalEcape(encoded), complexEmoji);
		});
	});

	suite("Encode/Decode Hex Code Points", () => {
		test("Complex unicode characters", () => {
			const encoded = "0x1100x1110x1290x1280x1690x1680x1A10x1A00x1B00x1AF0x1EA10x1EA00x1EA30x1EA20x1EA50x1EA40x1EA70x1EA60x1EA90x1EA80x1EAB0x1EAA0x1EAD0x1EAC0x1EAF0x1EAE0x1EB10x1EB00x1EB30x1EB20x1EB50x1EB40x1EB70x1EB60x1EB90x1EB80x1EBB0x1EBA0x1EBD0x1EBC0x1EBF0x1EBE0x1EC10x1EC00x1EC30x1EC20x1EC50x1EC40x1EC70x1EC60x1EC90x1EC80x1ECB0x1ECA0x1ECD0x1ECC0x1ECF0x1ECE0x1ED10x1ED00x1ED30x1ED20x1ED50x1ED40x1ED70x1ED60x1ED90x1ED80x1EDB0x1EDA0x1EDD0x1EDC0x1EDF0x1EDE0x1EE10x1EE00x1EE30x1EE20x1EE50x1EE40x1EE70x1EE60x1EE90x1EE80x1EEB0x1EEA0x1EED0x1EEC0x1EEF0x1EEE0x1EF10x1EF00x1EF30x1EF20x1EF50x1EF40x1EF70x1EF60x1EF90x1EF8";
			assert.strictEqual(utils.encodeHexCodePoints(complexUnicode), encoded, "encode hex code points");
			assert.strictEqual(utils.decodeHexCodePoints(encoded), complexUnicode, "decode hex code points");
		});

		test("Complex emoji", () => {
			const encoded = "0x1F3F40xE00670xE00620xE00770xE006C0xE00730xE007F0x200x1F9D10x200D0x1F91D0x200D0x1F9D10x200x1F4680x200D0x1F4690x200D0x1F4660x200D0x1F4660x200x1F4690x200D0x1F4690x200D0x1F4670x200D0x1F4670x200x1F4690x200D0x27640xFE0F0x200D0x1F48B0x200D0x1F4690x200x1F3F4";

			assert.strictEqual(utils.encodeHexCodePoints(complexEmoji), encoded, "encode hex code points");
			assert.strictEqual(utils.decodeHexCodePoints(encoded), complexEmoji, "decode hex code points");
		});
	});

	// suite("String Utilities", () => {

	// });

	suite("Encoding Utilities", () => {
		test("base64Encode/base64Decode roundtrip", () => {
			const original = "Playful Sparkle 🎉";
			const encoded = utils.base64Encode(original);
			assert.strictEqual(utils.base64Decode(encoded), original);
		});

		test("base64Decode rejects invalid input", () => {
			assert.strictEqual(utils.base64Decode("Not Base64!"), "Not Base64!");
			assert.strictEqual(utils.base64Decode("Invalid==Chars_"), "Invalid==Chars_");
		});

		test("isValidBase64 detects valid/invalid strings", () => {
			assert.ok(utils.isValidBase64("SGVsbG8="));    // "Hello"
			assert.ok(!utils.isValidBase64("SGVsbG8"));     // Missing padding
			assert.ok(!utils.isValidBase64("SGVsbG8===")); // Extra padding
			assert.ok(!utils.isValidBase64("SGVsbG8$"));   // Invalid character
		});

		test("urlEncode/urlDecode roundtrip", () => {
			const original = "Search for & stuff?";
			const encoded = utils.urlEncode(original);
			assert.strictEqual(utils.urlDecode(encoded), original);
			assert.strictEqual(encoded, "Search%20for%20%26%20stuff%3F");
		});
	});

	suite("GUID Generation", () => {
		test("generateGuid produces valid format", () => {
			const guid = utils.generateGuid();
			assert.ok(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(guid));
		});

		test("generated GUIDs are unique", () => {
			const guids = new Set();
			for (let i = 0; i < 1000; i++) {
				guids.add(utils.generateGuid());
			}
			assert.strictEqual(guids.size, 1000);
		});
	});

	suite("Slugify", () => {
		test("slugify preserves file extensions", () => {
			assert.strictEqual(
				utils.slugify("Document Version 2.0.pdf"),
				"document-version-2-0.pdf"
			);
			assert.strictEqual(
				utils.slugify("Image with spaces.jpeg"),
				"image-with-spaces.jpeg"
			);
		});

		test("slugify single large 'selection'", () => {
			assert.strictEqual(
				utils.slugify("Document Version 1.0.pdf\r\nDocument Version 2.0.pdf"),
				"document-version-1-0.pdf\r\ndocument-version-2-0.pdf"
			);
			assert.strictEqual(
				utils.slugify("Image with spaces 1.jpeg\r\nImage with spaces 2.jpeg"),
				"image-with-spaces-1.jpeg\r\nimage-with-spaces-2.jpeg"
			);
		});

		test("slugify handles special characters", () => {
			assert.strictEqual(
				utils.slugify("Modülär Ärchïtecture~!@#$%^&*().txt"),
				"modular-architecture.txt"
			);
			assert.strictEqual(
				utils.slugify("Hello   World--__--Test"),
				"hello-world-test"
			);
		});

		test("slugify removes diacritics", () => {
			assert.strictEqual(
				utils.slugify("Àççèñtéd Chäràctêrs"),
				"accented-characters"
			);
			assert.strictEqual(
				utils.slugify("Ñörmälîzätïon"),
				"normalization"
			);
		});
	});

	suite("Remove Non-Printable Characters", () => {
		test("removes non-printable characters", () => {
			const input = "Hello\u0000 World\u200B!";
			const expected = "Hello  World !";
			assert.strictEqual(utils.removeNonPrintableCharacters(input), expected);
		});

		test("preserves printable characters", () => {
			const input = "Hello World!";
			const expected = "Hello World!";
			assert.strictEqual(utils.removeNonPrintableCharacters(input), expected);
		});

		test("preserves whitespace characters", () => {
			const input = "Hello\tWorld\nNew Line\rCarriage Return";
			const expected = "Hello\tWorld\nNew Line\rCarriage Return";
			assert.strictEqual(utils.removeNonPrintableCharacters(input), expected);
		});

		test("handles empty input", () => {
			const input = "";
			const expected = "";
			assert.strictEqual(utils.removeNonPrintableCharacters(input), expected);
		});
	});

	suite("Remove Leading Trailing Whitespace", () => {
		test("removes leading and trailing whitespace from each line", () => {
			const input = "  Line 1  \n\tLine 2\t\n  Line 3  ";
			const expected = "Line 1\nLine 2\nLine 3";
			assert.strictEqual(utils.removeLeadingTrailingWhitespace(input), expected);
		});

		test("preserves lines with no leading or trailing whitespace", () => {
			const input = "Line 1\nLine 2\nLine 3";
			const expected = "Line 1\nLine 2\nLine 3";
			assert.strictEqual(utils.removeLeadingTrailingWhitespace(input), expected);
		});

		test("handles empty input", () => {
			const input = "";
			const expected = "";
			assert.strictEqual(utils.removeLeadingTrailingWhitespace(input), expected);
		});

		test("handles lines with only whitespace", () => {
			const input = "  \n\t\n  ";
			const expected = "\n\n";
			assert.strictEqual(utils.removeLeadingTrailingWhitespace(input), expected);
		});
	});
});