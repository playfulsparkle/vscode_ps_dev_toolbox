import * as assert from "assert";
import * as utils from "../utils";

suite("Dev Toolbox Tests", () => {
	suite("Encode/Decode to named HTML Entities", () => {
		test("Complex ascii lowercase, unicode, emoji characters", () => {
			assert.strictEqual(utils.encodeNamedHtmlEntities("foo © bar ß baz & qux <> 🍎 🏴󠁧󠁢󠁷󠁬󠁳󠁿 éáőú 𝛲🝲"), "foo &copy; bar &szlig; baz &amp; qux &lt;&gt; &#x1F34E; &#x1F3F4;&#xE0067;&#xE0062;&#xE0077;&#xE006C;&#xE0073;&#xE007F; &eacute;&aacute;&odblac;&uacute; &#x1D6F2;&#x1F772;");
			assert.strictEqual(utils.decodeNamedHtmlEntities("foo &copy; bar &szlig; baz &amp; qux &lt;&gt; &#x1F34E; &#x1F3F4;&#xE0067;&#xE0062;&#xE0077;&#xE006C;&#xE0073;&#xE007F; &eacute;&aacute;&odblac;&uacute; &#x1D6F2;&#x1F772;"), "foo © bar ß baz & qux <> 🍎 🏴󠁧󠁢󠁷󠁬󠁳󠁿 éáőú 𝛲🝲");
		});

		test("Complex ascii uppercase, unicode, emoji characters", () => {
			assert.strictEqual(utils.encodeNamedHtmlEntities("FOO © BAR SS BAZ & QUX <> 🍎 🏴󠁧󠁢󠁷󠁬󠁳󠁿 ÉÁŐÚ 𝛲🝲"), "FOO &copy; BAR SS BAZ &amp; QUX &lt;&gt; &#x1F34E; &#x1F3F4;&#xE0067;&#xE0062;&#xE0077;&#xE006C;&#xE0073;&#xE007F; &Eacute;&Aacute;&Odblac;&Uacute; &#x1D6F2;&#x1F772;");
			assert.strictEqual(utils.decodeNamedHtmlEntities("FOO &copy; BAR SS BAZ &amp; QUX &lt;&gt; &#x1F34E; &#x1F3F4;&#xE0067;&#xE0062;&#xE0077;&#xE006C;&#xE0073;&#xE007F; &Eacute;&Aacute;&Odblac;&Uacute; &#x1D6F2;&#x1F772;"), "FOO © BAR SS BAZ & QUX <> 🍎 🏴󠁧󠁢󠁷󠁬󠁳󠁿 ÉÁŐÚ 𝛲🝲");
		});

		test("Complex accented html entities", () => {
			assert.strictEqual(utils.encodeNamedHtmlEntities("ôňúäéíáýžťčšľÔŇÚÄÉÍÁÝŽŤČŠĽéáűőúóüöíÉÁŰŐÚÓÜÖÍ"), "&ocirc;&ncaron;&uacute;&auml;&eacute;&iacute;&aacute;&yacute;&zcaron;&tcaron;&ccaron;&scaron;&lcaron;&Ocirc;&Ncaron;&Uacute;&Auml;&Eacute;&Iacute;&Aacute;&Yacute;&Zcaron;&Tcaron;&Ccaron;&Scaron;&Lcaron;&eacute;&aacute;&udblac;&odblac;&uacute;&oacute;&uuml;&ouml;&iacute;&Eacute;&Aacute;&Udblac;&Odblac;&Uacute;&Oacute;&Uuml;&Ouml;&Iacute;");
			assert.strictEqual(utils.decodeNamedHtmlEntities("&ocirc;&ncaron;&uacute;&auml;&eacute;&iacute;&aacute;&yacute;&zcaron;&tcaron;&ccaron;&scaron;&lcaron;&Ocirc;&Ncaron;&Uacute;&Auml;&Eacute;&Iacute;&Aacute;&Yacute;&Zcaron;&Tcaron;&Ccaron;&Scaron;&Lcaron;&eacute;&aacute;&udblac;&odblac;&uacute;&oacute;&uuml;&ouml;&iacute;&Eacute;&Aacute;&Udblac;&Odblac;&Uacute;&Oacute;&Uuml;&Ouml;&Iacute;"), "ôňúäéíáýžťčšľÔŇÚÄÉÍÁÝŽŤČŠĽéáűőúóüöíÉÁŰŐÚÓÜÖÍ");
		});
	});

	suite("Encode/Decode to HTML Entities", () => {
		test("Complex unicode characters", () => {
			assert.strictEqual(utils.encodeHtmlHexEntities("ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ"), "&#x0110;&#x0111;&#x0129;&#x0128;&#x0169;&#x0168;&#x01A1;&#x01A0;&#x01B0;&#x01AF;&#x1EA1;&#x1EA0;&#x1EA3;&#x1EA2;&#x1EA5;&#x1EA4;&#x1EA7;&#x1EA6;&#x1EA9;&#x1EA8;&#x1EAB;&#x1EAA;&#x1EAD;&#x1EAC;&#x1EAF;&#x1EAE;&#x1EB1;&#x1EB0;&#x1EB3;&#x1EB2;&#x1EB5;&#x1EB4;&#x1EB7;&#x1EB6;&#x1EB9;&#x1EB8;&#x1EBB;&#x1EBA;&#x1EBD;&#x1EBC;&#x1EBF;&#x1EBE;&#x1EC1;&#x1EC0;&#x1EC3;&#x1EC2;&#x1EC5;&#x1EC4;&#x1EC7;&#x1EC6;&#x1EC9;&#x1EC8;&#x1ECB;&#x1ECA;&#x1ECD;&#x1ECC;&#x1ECF;&#x1ECE;&#x1ED1;&#x1ED0;&#x1ED3;&#x1ED2;&#x1ED5;&#x1ED4;&#x1ED7;&#x1ED6;&#x1ED9;&#x1ED8;&#x1EDB;&#x1EDA;&#x1EDD;&#x1EDC;&#x1EDF;&#x1EDE;&#x1EE1;&#x1EE0;&#x1EE3;&#x1EE2;&#x1EE5;&#x1EE4;&#x1EE7;&#x1EE6;&#x1EE9;&#x1EE8;&#x1EEB;&#x1EEA;&#x1EED;&#x1EEC;&#x1EEF;&#x1EEE;&#x1EF1;&#x1EF0;&#x1EF3;&#x1EF2;&#x1EF5;&#x1EF4;&#x1EF7;&#x1EF6;&#x1EF9;&#x1EF8;");
			assert.strictEqual(utils.decodeHtmlHexEntities("&#x0110;&#x0111;&#x0129;&#x0128;&#x0169;&#x0168;&#x01A1;&#x01A0;&#x01B0;&#x01AF;&#x1EA1;&#x1EA0;&#x1EA3;&#x1EA2;&#x1EA5;&#x1EA4;&#x1EA7;&#x1EA6;&#x1EA9;&#x1EA8;&#x1EAB;&#x1EAA;&#x1EAD;&#x1EAC;&#x1EAF;&#x1EAE;&#x1EB1;&#x1EB0;&#x1EB3;&#x1EB2;&#x1EB5;&#x1EB4;&#x1EB7;&#x1EB6;&#x1EB9;&#x1EB8;&#x1EBB;&#x1EBA;&#x1EBD;&#x1EBC;&#x1EBF;&#x1EBE;&#x1EC1;&#x1EC0;&#x1EC3;&#x1EC2;&#x1EC5;&#x1EC4;&#x1EC7;&#x1EC6;&#x1EC9;&#x1EC8;&#x1ECB;&#x1ECA;&#x1ECD;&#x1ECC;&#x1ECF;&#x1ECE;&#x1ED1;&#x1ED0;&#x1ED3;&#x1ED2;&#x1ED5;&#x1ED4;&#x1ED7;&#x1ED6;&#x1ED9;&#x1ED8;&#x1EDB;&#x1EDA;&#x1EDD;&#x1EDC;&#x1EDF;&#x1EDE;&#x1EE1;&#x1EE0;&#x1EE3;&#x1EE2;&#x1EE5;&#x1EE4;&#x1EE7;&#x1EE6;&#x1EE9;&#x1EE8;&#x1EEB;&#x1EEA;&#x1EED;&#x1EEC;&#x1EEF;&#x1EEE;&#x1EF1;&#x1EF0;&#x1EF3;&#x1EF2;&#x1EF5;&#x1EF4;&#x1EF7;&#x1EF6;&#x1EF9;&#x1EF8;"), "ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ");
		});

		test("Complex emoji", () => {
			assert.strictEqual(utils.encodeHtmlHexEntities("🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴"), "&#x1F3F4;&#xE0067;&#xE0062;&#xE0077;&#xE006C;&#xE0073;&#xE007F; &#x1F9D1;&#x200D;&#x1F91D;&#x200D;&#x1F9D1; &#x1F468;&#x200D;&#x1F469;&#x200D;&#x1F466;&#x200D;&#x1F466; &#x1F469;&#x200D;&#x1F469;&#x200D;&#x1F467;&#x200D;&#x1F467; &#x1F469;&#x200D;&#x2764;&#xFE0F;&#x200D;&#x1F48B;&#x200D;&#x1F469; &#x1F3F4;");
			assert.strictEqual(utils.decodeHtmlHexEntities("&#x1F3F4;&#xE0067;&#xE0062;&#xE0077;&#xE006C;&#xE0073;&#xE007F; &#x1F9D1;&#x200D;&#x1F91D;&#x200D;&#x1F9D1; &#x1F468;&#x200D;&#x1F469;&#x200D;&#x1F466;&#x200D;&#x1F466; &#x1F469;&#x200D;&#x1F469;&#x200D;&#x1F467;&#x200D;&#x1F467; &#x1F469;&#x200D;&#x2764;&#xFE0F;&#x200D;&#x1F48B;&#x200D;&#x1F469; &#x1F3F4;"), "🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴");
		});
	});

	suite("Encode/Decode to Decimal Entities", () => {
		test("Complex unicode characters", () => {
			assert.strictEqual(utils.encodeHtmlDecimalEntities("ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ"), "&#272;&#273;&#297;&#296;&#361;&#360;&#417;&#416;&#432;&#431;&#7841;&#7840;&#7843;&#7842;&#7845;&#7844;&#7847;&#7846;&#7849;&#7848;&#7851;&#7850;&#7853;&#7852;&#7855;&#7854;&#7857;&#7856;&#7859;&#7858;&#7861;&#7860;&#7863;&#7862;&#7865;&#7864;&#7867;&#7866;&#7869;&#7868;&#7871;&#7870;&#7873;&#7872;&#7875;&#7874;&#7877;&#7876;&#7879;&#7878;&#7881;&#7880;&#7883;&#7882;&#7885;&#7884;&#7887;&#7886;&#7889;&#7888;&#7891;&#7890;&#7893;&#7892;&#7895;&#7894;&#7897;&#7896;&#7899;&#7898;&#7901;&#7900;&#7903;&#7902;&#7905;&#7904;&#7907;&#7906;&#7909;&#7908;&#7911;&#7910;&#7913;&#7912;&#7915;&#7914;&#7917;&#7916;&#7919;&#7918;&#7921;&#7920;&#7923;&#7922;&#7925;&#7924;&#7927;&#7926;&#7929;&#7928;");
			assert.strictEqual(utils.decodeHtmlDecimalEntities("&#272;&#273;&#297;&#296;&#361;&#360;&#417;&#416;&#432;&#431;&#7841;&#7840;&#7843;&#7842;&#7845;&#7844;&#7847;&#7846;&#7849;&#7848;&#7851;&#7850;&#7853;&#7852;&#7855;&#7854;&#7857;&#7856;&#7859;&#7858;&#7861;&#7860;&#7863;&#7862;&#7865;&#7864;&#7867;&#7866;&#7869;&#7868;&#7871;&#7870;&#7873;&#7872;&#7875;&#7874;&#7877;&#7876;&#7879;&#7878;&#7881;&#7880;&#7883;&#7882;&#7885;&#7884;&#7887;&#7886;&#7889;&#7888;&#7891;&#7890;&#7893;&#7892;&#7895;&#7894;&#7897;&#7896;&#7899;&#7898;&#7901;&#7900;&#7903;&#7902;&#7905;&#7904;&#7907;&#7906;&#7909;&#7908;&#7911;&#7910;&#7913;&#7912;&#7915;&#7914;&#7917;&#7916;&#7919;&#7918;&#7921;&#7920;&#7923;&#7922;&#7925;&#7924;&#7927;&#7926;&#7929;&#7928;"), "ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ");
		});

		test("Complex emoji", () => {
			assert.strictEqual(utils.encodeHtmlDecimalEntities("🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴"), "&#127988;&#917607;&#917602;&#917623;&#917612;&#917619;&#917631; &#129489;&#8205;&#129309;&#8205;&#129489; &#128104;&#8205;&#128105;&#8205;&#128102;&#8205;&#128102; &#128105;&#8205;&#128105;&#8205;&#128103;&#8205;&#128103; &#128105;&#8205;&#10084;&#65039;&#8205;&#128139;&#8205;&#128105; &#127988;");
			assert.strictEqual(utils.decodeHtmlDecimalEntities("&#127988;&#917607;&#917602;&#917623;&#917612;&#917619;&#917631; &#129489;&#8205;&#129309;&#8205;&#129489; &#128104;&#8205;&#128105;&#8205;&#128102;&#8205;&#128102; &#128105;&#8205;&#128105;&#8205;&#128103;&#8205;&#128103; &#128105;&#8205;&#10084;&#65039;&#8205;&#128139;&#8205;&#128105; &#127988;"), "🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴");
		});
	});

	suite("Encode/Decode to Unicode Escape", () => {
		test("Complex unicode characters", () => {
			assert.strictEqual(utils.encodeJavaScriptUnicodeEscapes("ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ"), "\\u0110\\u0111\\u0129\\u0128\\u0169\\u0168\\u01A1\\u01A0\\u01B0\\u01AF\\u1EA1\\u1EA0\\u1EA3\\u1EA2\\u1EA5\\u1EA4\\u1EA7\\u1EA6\\u1EA9\\u1EA8\\u1EAB\\u1EAA\\u1EAD\\u1EAC\\u1EAF\\u1EAE\\u1EB1\\u1EB0\\u1EB3\\u1EB2\\u1EB5\\u1EB4\\u1EB7\\u1EB6\\u1EB9\\u1EB8\\u1EBB\\u1EBA\\u1EBD\\u1EBC\\u1EBF\\u1EBE\\u1EC1\\u1EC0\\u1EC3\\u1EC2\\u1EC5\\u1EC4\\u1EC7\\u1EC6\\u1EC9\\u1EC8\\u1ECB\\u1ECA\\u1ECD\\u1ECC\\u1ECF\\u1ECE\\u1ED1\\u1ED0\\u1ED3\\u1ED2\\u1ED5\\u1ED4\\u1ED7\\u1ED6\\u1ED9\\u1ED8\\u1EDB\\u1EDA\\u1EDD\\u1EDC\\u1EDF\\u1EDE\\u1EE1\\u1EE0\\u1EE3\\u1EE2\\u1EE5\\u1EE4\\u1EE7\\u1EE6\\u1EE9\\u1EE8\\u1EEB\\u1EEA\\u1EED\\u1EEC\\u1EEF\\u1EEE\\u1EF1\\u1EF0\\u1EF3\\u1EF2\\u1EF5\\u1EF4\\u1EF7\\u1EF6\\u1EF9\\u1EF8");
			assert.strictEqual(utils.decodeJavaScriptUnicodeEscapes("\\u0110\\u0111\\u0129\\u0128\\u0169\\u0168\\u01A1\\u01A0\\u01B0\\u01AF\\u1EA1\\u1EA0\\u1EA3\\u1EA2\\u1EA5\\u1EA4\\u1EA7\\u1EA6\\u1EA9\\u1EA8\\u1EAB\\u1EAA\\u1EAD\\u1EAC\\u1EAF\\u1EAE\\u1EB1\\u1EB0\\u1EB3\\u1EB2\\u1EB5\\u1EB4\\u1EB7\\u1EB6\\u1EB9\\u1EB8\\u1EBB\\u1EBA\\u1EBD\\u1EBC\\u1EBF\\u1EBE\\u1EC1\\u1EC0\\u1EC3\\u1EC2\\u1EC5\\u1EC4\\u1EC7\\u1EC6\\u1EC9\\u1EC8\\u1ECB\\u1ECA\\u1ECD\\u1ECC\\u1ECF\\u1ECE\\u1ED1\\u1ED0\\u1ED3\\u1ED2\\u1ED5\\u1ED4\\u1ED7\\u1ED6\\u1ED9\\u1ED8\\u1EDB\\u1EDA\\u1EDD\\u1EDC\\u1EDF\\u1EDE\\u1EE1\\u1EE0\\u1EE3\\u1EE2\\u1EE5\\u1EE4\\u1EE7\\u1EE6\\u1EE9\\u1EE8\\u1EEB\\u1EEA\\u1EED\\u1EEC\\u1EEF\\u1EEE\\u1EF1\\u1EF0\\u1EF3\\u1EF2\\u1EF5\\u1EF4\\u1EF7\\u1EF6\\u1EF9\\u1EF8"), "ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ");
		});

		test("Complex emoji", () => {
			assert.strictEqual(utils.encodeJavaScriptUnicodeEscapes("🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴"), "\\U0001F3F4\\U000E0067\\U000E0062\\U000E0077\\U000E006C\\U000E0073\\U000E007F \\U0001F9D1\\u200D\\U0001F91D\\u200D\\U0001F9D1 \\U0001F468\\u200D\\U0001F469\\u200D\\U0001F466\\u200D\\U0001F466 \\U0001F469\\u200D\\U0001F469\\u200D\\U0001F467\\u200D\\U0001F467 \\U0001F469\\u200D\\u2764\\uFE0F\\u200D\\U0001F48B\\u200D\\U0001F469 \\U0001F3F4");
			assert.strictEqual(utils.decodeJavaScriptUnicodeEscapes("\\U0001F3F4\\U000E0067\\U000E0062\\U000E0077\\U000E006C\\U000E0073\\U000E007F \\U0001F9D1\\u200D\\U0001F91D\\u200D\\U0001F9D1 \\U0001F468\\u200D\\U0001F469\\u200D\\U0001F466\\u200D\\U0001F466 \\U0001F469\\u200D\\U0001F469\\u200D\\U0001F467\\u200D\\U0001F467 \\U0001F469\\u200D\\u2764\\uFE0F\\u200D\\U0001F48B\\u200D\\U0001F469 \\U0001F3F4"), "🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴");
		});
	});

	suite("Encode/Decode to CSS Unicode", () => {
		test("Complex unicode characters", () => {
			assert.strictEqual(utils.encodeCssUnicodeEscape("ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ"), "\\000110 \\000111 \\000129 \\000128 \\000169 \\000168 \\0001A1 \\0001A0 \\0001B0 \\0001AF \\001EA1 \\001EA0 \\001EA3 \\001EA2 \\001EA5 \\001EA4 \\001EA7 \\001EA6 \\001EA9 \\001EA8 \\001EAB \\001EAA \\001EAD \\001EAC \\001EAF \\001EAE \\001EB1 \\001EB0 \\001EB3 \\001EB2 \\001EB5 \\001EB4 \\001EB7 \\001EB6 \\001EB9 \\001EB8 \\001EBB \\001EBA \\001EBD \\001EBC \\001EBF \\001EBE \\001EC1 \\001EC0 \\001EC3 \\001EC2 \\001EC5 \\001EC4 \\001EC7 \\001EC6 \\001EC9 \\001EC8 \\001ECB \\001ECA \\001ECD \\001ECC \\001ECF \\001ECE \\001ED1 \\001ED0 \\001ED3 \\001ED2 \\001ED5 \\001ED4 \\001ED7 \\001ED6 \\001ED9 \\001ED8 \\001EDB \\001EDA \\001EDD \\001EDC \\001EDF \\001EDE \\001EE1 \\001EE0 \\001EE3 \\001EE2 \\001EE5 \\001EE4 \\001EE7 \\001EE6 \\001EE9 \\001EE8 \\001EEB \\001EEA \\001EED \\001EEC \\001EEF \\001EEE \\001EF1 \\001EF0 \\001EF3 \\001EF2 \\001EF5 \\001EF4 \\001EF7 \\001EF6 \\001EF9 \\001EF8 ");
			assert.strictEqual(utils.decodeCssUnicodeEscape("\\000110 \\000111 \\000129 \\000128 \\000169 \\000168 \\0001A1 \\0001A0 \\0001B0 \\0001AF \\001EA1 \\001EA0 \\001EA3 \\001EA2 \\001EA5 \\001EA4 \\001EA7 \\001EA6 \\001EA9 \\001EA8 \\001EAB \\001EAA \\001EAD \\001EAC \\001EAF \\001EAE \\001EB1 \\001EB0 \\001EB3 \\001EB2 \\001EB5 \\001EB4 \\001EB7 \\001EB6 \\001EB9 \\001EB8 \\001EBB \\001EBA \\001EBD \\001EBC \\001EBF \\001EBE \\001EC1 \\001EC0 \\001EC3 \\001EC2 \\001EC5 \\001EC4 \\001EC7 \\001EC6 \\001EC9 \\001EC8 \\001ECB \\001ECA \\001ECD \\001ECC \\001ECF \\001ECE \\001ED1 \\001ED0 \\001ED3 \\001ED2 \\001ED5 \\001ED4 \\001ED7 \\001ED6 \\001ED9 \\001ED8 \\001EDB \\001EDA \\001EDD \\001EDC \\001EDF \\001EDE \\001EE1 \\001EE0 \\001EE3 \\001EE2 \\001EE5 \\001EE4 \\001EE7 \\001EE6 \\001EE9 \\001EE8 \\001EEB \\001EEA \\001EED \\001EEC \\001EEF \\001EEE \\001EF1 \\001EF0 \\001EF3 \\001EF2 \\001EF5 \\001EF4 \\001EF7 \\001EF6 \\001EF9 \\001EF8 "), "ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ");
		});

		test("Complex emoji", () => {
			assert.strictEqual(utils.encodeCssUnicodeEscape("🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴"), "\\1F3F4 \\E0067 \\E0062 \\E0077 \\E006C \\E0073 \\E007F  \\1F9D1 \\00200D \\1F91D \\00200D \\1F9D1  \\1F468 \\00200D \\1F469 \\00200D \\1F466 \\00200D \\1F466  \\1F469 \\00200D \\1F469 \\00200D \\1F467 \\00200D \\1F467  \\1F469 \\00200D \\002764 \\00FE0F \\00200D \\1F48B \\00200D \\1F469  \\1F3F4 ");
			assert.strictEqual(utils.decodeCssUnicodeEscape("\\1F3F4 \\E0067 \\E0062 \\E0077 \\E006C \\E0073 \\E007F  \\1F9D1 \\00200D \\1F91D \\00200D \\1F9D1  \\1F468 \\00200D \\1F469 \\00200D \\1F466 \\00200D \\1F466  \\1F469 \\00200D \\1F469 \\00200D \\1F467 \\00200D \\1F467  \\1F469 \\00200D \\002764 \\00FE0F \\00200D \\1F48B \\00200D \\1F469  \\1F3F4 "), "🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴");
		});
	});

	suite("Encode/Decode to Unicode Codepoint", () => {
		test("Complex unicode characters", () => {
			assert.strictEqual(utils.encodeUnicodeCodePoints("ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ"), "U+0110 U+0111 U+0129 U+0128 U+0169 U+0168 U+01A1 U+01A0 U+01B0 U+01AF U+1EA1 U+1EA0 U+1EA3 U+1EA2 U+1EA5 U+1EA4 U+1EA7 U+1EA6 U+1EA9 U+1EA8 U+1EAB U+1EAA U+1EAD U+1EAC U+1EAF U+1EAE U+1EB1 U+1EB0 U+1EB3 U+1EB2 U+1EB5 U+1EB4 U+1EB7 U+1EB6 U+1EB9 U+1EB8 U+1EBB U+1EBA U+1EBD U+1EBC U+1EBF U+1EBE U+1EC1 U+1EC0 U+1EC3 U+1EC2 U+1EC5 U+1EC4 U+1EC7 U+1EC6 U+1EC9 U+1EC8 U+1ECB U+1ECA U+1ECD U+1ECC U+1ECF U+1ECE U+1ED1 U+1ED0 U+1ED3 U+1ED2 U+1ED5 U+1ED4 U+1ED7 U+1ED6 U+1ED9 U+1ED8 U+1EDB U+1EDA U+1EDD U+1EDC U+1EDF U+1EDE U+1EE1 U+1EE0 U+1EE3 U+1EE2 U+1EE5 U+1EE4 U+1EE7 U+1EE6 U+1EE9 U+1EE8 U+1EEB U+1EEA U+1EED U+1EEC U+1EEF U+1EEE U+1EF1 U+1EF0 U+1EF3 U+1EF2 U+1EF5 U+1EF4 U+1EF7 U+1EF6 U+1EF9 U+1EF8");
			assert.strictEqual(utils.decodeUnicodeCodePoints("U+0110 U+0111 U+0129 U+0128 U+0169 U+0168 U+01A1 U+01A0 U+01B0 U+01AF U+1EA1 U+1EA0 U+1EA3 U+1EA2 U+1EA5 U+1EA4 U+1EA7 U+1EA6 U+1EA9 U+1EA8 U+1EAB U+1EAA U+1EAD U+1EAC U+1EAF U+1EAE U+1EB1 U+1EB0 U+1EB3 U+1EB2 U+1EB5 U+1EB4 U+1EB7 U+1EB6 U+1EB9 U+1EB8 U+1EBB U+1EBA U+1EBD U+1EBC U+1EBF U+1EBE U+1EC1 U+1EC0 U+1EC3 U+1EC2 U+1EC5 U+1EC4 U+1EC7 U+1EC6 U+1EC9 U+1EC8 U+1ECB U+1ECA U+1ECD U+1ECC U+1ECF U+1ECE U+1ED1 U+1ED0 U+1ED3 U+1ED2 U+1ED5 U+1ED4 U+1ED7 U+1ED6 U+1ED9 U+1ED8 U+1EDB U+1EDA U+1EDD U+1EDC U+1EDF U+1EDE U+1EE1 U+1EE0 U+1EE3 U+1EE2 U+1EE5 U+1EE4 U+1EE7 U+1EE6 U+1EE9 U+1EE8 U+1EEB U+1EEA U+1EED U+1EEC U+1EEF U+1EEE U+1EF1 U+1EF0 U+1EF3 U+1EF2 U+1EF5 U+1EF4 U+1EF7 U+1EF6 U+1EF9 U+1EF8"), "ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ");
		});

		test("Complex emoji", () => {
			assert.strictEqual(utils.encodeUnicodeCodePoints("🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴"), "U+1F3F4 U+E0067 U+E0062 U+E0077 U+E006C U+E0073 U+E007F U+0020 U+1F9D1 U+200D U+1F91D U+200D U+1F9D1 U+0020 U+1F468 U+200D U+1F469 U+200D U+1F466 U+200D U+1F466 U+0020 U+1F469 U+200D U+1F469 U+200D U+1F467 U+200D U+1F467 U+0020 U+1F469 U+200D U+2764 U+FE0F U+200D U+1F48B U+200D U+1F469 U+0020 U+1F3F4");
			assert.strictEqual(utils.decodeUnicodeCodePoints("U+1F3F4 U+E0067 U+E0062 U+E0077 U+E006C U+E0073 U+E007F U+0020 U+1F9D1 U+200D U+1F91D U+200D U+1F9D1 U+0020 U+1F468 U+200D U+1F469 U+200D U+1F466 U+200D U+1F466 U+0020 U+1F469 U+200D U+1F469 U+200D U+1F467 U+200D U+1F467 U+0020 U+1F469 U+200D U+2764 U+FE0F U+200D U+1F48B U+200D U+1F469 U+0020 U+1F3F4"), "🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴");
		});
	});

	suite("Encode/Decode ES6 Unicode Code Point Escape", () => {
		test("Complex unicode characters", () => {
			assert.strictEqual(utils.encodeES6UnicodeCodePointEscape("ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ"), "\\u{110}\\u{111}\\u{129}\\u{128}\\u{169}\\u{168}\\u{1A1}\\u{1A0}\\u{1B0}\\u{1AF}\\u{1EA1}\\u{1EA0}\\u{1EA3}\\u{1EA2}\\u{1EA5}\\u{1EA4}\\u{1EA7}\\u{1EA6}\\u{1EA9}\\u{1EA8}\\u{1EAB}\\u{1EAA}\\u{1EAD}\\u{1EAC}\\u{1EAF}\\u{1EAE}\\u{1EB1}\\u{1EB0}\\u{1EB3}\\u{1EB2}\\u{1EB5}\\u{1EB4}\\u{1EB7}\\u{1EB6}\\u{1EB9}\\u{1EB8}\\u{1EBB}\\u{1EBA}\\u{1EBD}\\u{1EBC}\\u{1EBF}\\u{1EBE}\\u{1EC1}\\u{1EC0}\\u{1EC3}\\u{1EC2}\\u{1EC5}\\u{1EC4}\\u{1EC7}\\u{1EC6}\\u{1EC9}\\u{1EC8}\\u{1ECB}\\u{1ECA}\\u{1ECD}\\u{1ECC}\\u{1ECF}\\u{1ECE}\\u{1ED1}\\u{1ED0}\\u{1ED3}\\u{1ED2}\\u{1ED5}\\u{1ED4}\\u{1ED7}\\u{1ED6}\\u{1ED9}\\u{1ED8}\\u{1EDB}\\u{1EDA}\\u{1EDD}\\u{1EDC}\\u{1EDF}\\u{1EDE}\\u{1EE1}\\u{1EE0}\\u{1EE3}\\u{1EE2}\\u{1EE5}\\u{1EE4}\\u{1EE7}\\u{1EE6}\\u{1EE9}\\u{1EE8}\\u{1EEB}\\u{1EEA}\\u{1EED}\\u{1EEC}\\u{1EEF}\\u{1EEE}\\u{1EF1}\\u{1EF0}\\u{1EF3}\\u{1EF2}\\u{1EF5}\\u{1EF4}\\u{1EF7}\\u{1EF6}\\u{1EF9}\\u{1EF8}");
			assert.strictEqual(utils.decodeES6UnicodeCodePointEscape("\\u{110}\\u{111}\\u{129}\\u{128}\\u{169}\\u{168}\\u{1A1}\\u{1A0}\\u{1B0}\\u{1AF}\\u{1EA1}\\u{1EA0}\\u{1EA3}\\u{1EA2}\\u{1EA5}\\u{1EA4}\\u{1EA7}\\u{1EA6}\\u{1EA9}\\u{1EA8}\\u{1EAB}\\u{1EAA}\\u{1EAD}\\u{1EAC}\\u{1EAF}\\u{1EAE}\\u{1EB1}\\u{1EB0}\\u{1EB3}\\u{1EB2}\\u{1EB5}\\u{1EB4}\\u{1EB7}\\u{1EB6}\\u{1EB9}\\u{1EB8}\\u{1EBB}\\u{1EBA}\\u{1EBD}\\u{1EBC}\\u{1EBF}\\u{1EBE}\\u{1EC1}\\u{1EC0}\\u{1EC3}\\u{1EC2}\\u{1EC5}\\u{1EC4}\\u{1EC7}\\u{1EC6}\\u{1EC9}\\u{1EC8}\\u{1ECB}\\u{1ECA}\\u{1ECD}\\u{1ECC}\\u{1ECF}\\u{1ECE}\\u{1ED1}\\u{1ED0}\\u{1ED3}\\u{1ED2}\\u{1ED5}\\u{1ED4}\\u{1ED7}\\u{1ED6}\\u{1ED9}\\u{1ED8}\\u{1EDB}\\u{1EDA}\\u{1EDD}\\u{1EDC}\\u{1EDF}\\u{1EDE}\\u{1EE1}\\u{1EE0}\\u{1EE3}\\u{1EE2}\\u{1EE5}\\u{1EE4}\\u{1EE7}\\u{1EE6}\\u{1EE9}\\u{1EE8}\\u{1EEB}\\u{1EEA}\\u{1EED}\\u{1EEC}\\u{1EEF}\\u{1EEE}\\u{1EF1}\\u{1EF0}\\u{1EF3}\\u{1EF2}\\u{1EF5}\\u{1EF4}\\u{1EF7}\\u{1EF6}\\u{1EF9}\\u{1EF8}"), "ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ");
		});

		test("Complex emoji", () => {
			assert.strictEqual(utils.encodeES6UnicodeCodePointEscape("🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴"), "\\u{1F3F4}\\u{E0067}\\u{E0062}\\u{E0077}\\u{E006C}\\u{E0073}\\u{E007F} \\u{1F9D1}\\u{200D}\\u{1F91D}\\u{200D}\\u{1F9D1} \\u{1F468}\\u{200D}\\u{1F469}\\u{200D}\\u{1F466}\\u{200D}\\u{1F466} \\u{1F469}\\u{200D}\\u{1F469}\\u{200D}\\u{1F467}\\u{200D}\\u{1F467} \\u{1F469}\\u{200D}\\u{2764}\\u{FE0F}\\u{200D}\\u{1F48B}\\u{200D}\\u{1F469} \\u{1F3F4}");
			assert.strictEqual(utils.decodeES6UnicodeCodePointEscape("\\u{1F3F4}\\u{E0067}\\u{E0062}\\u{E0077}\\u{E006C}\\u{E0073}\\u{E007F} \\u{1F9D1}\\u{200D}\\u{1F91D}\\u{200D}\\u{1F9D1} \\u{1F468}\\u{200D}\\u{1F469}\\u{200D}\\u{1F466}\\u{200D}\\u{1F466} \\u{1F469}\\u{200D}\\u{1F469}\\u{200D}\\u{1F467}\\u{200D}\\u{1F467} \\u{1F469}\\u{200D}\\u{2764}\\u{FE0F}\\u{200D}\\u{1F48B}\\u{200D}\\u{1F469} \\u{1F3F4}"), "🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴");
		});
	});

	suite("Encode/Decode Extended Hex Escape", () => {
		test("Complex unicode characters", () => {
			assert.strictEqual(utils.encodeHexEntities("ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ"), "\\x{110}\\x{111}\\x{129}\\x{128}\\x{169}\\x{168}\\x{1A1}\\x{1A0}\\x{1B0}\\x{1AF}\\x{1EA1}\\x{1EA0}\\x{1EA3}\\x{1EA2}\\x{1EA5}\\x{1EA4}\\x{1EA7}\\x{1EA6}\\x{1EA9}\\x{1EA8}\\x{1EAB}\\x{1EAA}\\x{1EAD}\\x{1EAC}\\x{1EAF}\\x{1EAE}\\x{1EB1}\\x{1EB0}\\x{1EB3}\\x{1EB2}\\x{1EB5}\\x{1EB4}\\x{1EB7}\\x{1EB6}\\x{1EB9}\\x{1EB8}\\x{1EBB}\\x{1EBA}\\x{1EBD}\\x{1EBC}\\x{1EBF}\\x{1EBE}\\x{1EC1}\\x{1EC0}\\x{1EC3}\\x{1EC2}\\x{1EC5}\\x{1EC4}\\x{1EC7}\\x{1EC6}\\x{1EC9}\\x{1EC8}\\x{1ECB}\\x{1ECA}\\x{1ECD}\\x{1ECC}\\x{1ECF}\\x{1ECE}\\x{1ED1}\\x{1ED0}\\x{1ED3}\\x{1ED2}\\x{1ED5}\\x{1ED4}\\x{1ED7}\\x{1ED6}\\x{1ED9}\\x{1ED8}\\x{1EDB}\\x{1EDA}\\x{1EDD}\\x{1EDC}\\x{1EDF}\\x{1EDE}\\x{1EE1}\\x{1EE0}\\x{1EE3}\\x{1EE2}\\x{1EE5}\\x{1EE4}\\x{1EE7}\\x{1EE6}\\x{1EE9}\\x{1EE8}\\x{1EEB}\\x{1EEA}\\x{1EED}\\x{1EEC}\\x{1EEF}\\x{1EEE}\\x{1EF1}\\x{1EF0}\\x{1EF3}\\x{1EF2}\\x{1EF5}\\x{1EF4}\\x{1EF7}\\x{1EF6}\\x{1EF9}\\x{1EF8}");
			assert.strictEqual(utils.decodeHexEntities("\\x{110}\\x{111}\\x{129}\\x{128}\\x{169}\\x{168}\\x{1A1}\\x{1A0}\\x{1B0}\\x{1AF}\\x{1EA1}\\x{1EA0}\\x{1EA3}\\x{1EA2}\\x{1EA5}\\x{1EA4}\\x{1EA7}\\x{1EA6}\\x{1EA9}\\x{1EA8}\\x{1EAB}\\x{1EAA}\\x{1EAD}\\x{1EAC}\\x{1EAF}\\x{1EAE}\\x{1EB1}\\x{1EB0}\\x{1EB3}\\x{1EB2}\\x{1EB5}\\x{1EB4}\\x{1EB7}\\x{1EB6}\\x{1EB9}\\x{1EB8}\\x{1EBB}\\x{1EBA}\\x{1EBD}\\x{1EBC}\\x{1EBF}\\x{1EBE}\\x{1EC1}\\x{1EC0}\\x{1EC3}\\x{1EC2}\\x{1EC5}\\x{1EC4}\\x{1EC7}\\x{1EC6}\\x{1EC9}\\x{1EC8}\\x{1ECB}\\x{1ECA}\\x{1ECD}\\x{1ECC}\\x{1ECF}\\x{1ECE}\\x{1ED1}\\x{1ED0}\\x{1ED3}\\x{1ED2}\\x{1ED5}\\x{1ED4}\\x{1ED7}\\x{1ED6}\\x{1ED9}\\x{1ED8}\\x{1EDB}\\x{1EDA}\\x{1EDD}\\x{1EDC}\\x{1EDF}\\x{1EDE}\\x{1EE1}\\x{1EE0}\\x{1EE3}\\x{1EE2}\\x{1EE5}\\x{1EE4}\\x{1EE7}\\x{1EE6}\\x{1EE9}\\x{1EE8}\\x{1EEB}\\x{1EEA}\\x{1EED}\\x{1EEC}\\x{1EEF}\\x{1EEE}\\x{1EF1}\\x{1EF0}\\x{1EF3}\\x{1EF2}\\x{1EF5}\\x{1EF4}\\x{1EF7}\\x{1EF6}\\x{1EF9}\\x{1EF8}"), "ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ");
		});

		test("Complex emoji", () => {
			assert.strictEqual(utils.encodeHexEntities("🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴"), "\\x{1F3F4}\\x{E0067}\\x{E0062}\\x{E0077}\\x{E006C}\\x{E0073}\\x{E007F} \\x{1F9D1}\\x{200D}\\x{1F91D}\\x{200D}\\x{1F9D1} \\x{1F468}\\x{200D}\\x{1F469}\\x{200D}\\x{1F466}\\x{200D}\\x{1F466} \\x{1F469}\\x{200D}\\x{1F469}\\x{200D}\\x{1F467}\\x{200D}\\x{1F467} \\x{1F469}\\x{200D}\\x{2764}\\x{FE0F}\\x{200D}\\x{1F48B}\\x{200D}\\x{1F469} \\x{1F3F4}");
			assert.strictEqual(utils.decodeHexEntities("\\x{1F3F4}\\x{E0067}\\x{E0062}\\x{E0077}\\x{E006C}\\x{E0073}\\x{E007F} \\x{1F9D1}\\x{200D}\\x{1F91D}\\x{200D}\\x{1F9D1} \\x{1F468}\\x{200D}\\x{1F469}\\x{200D}\\x{1F466}\\x{200D}\\x{1F466} \\x{1F469}\\x{200D}\\x{1F469}\\x{200D}\\x{1F467}\\x{200D}\\x{1F467} \\x{1F469}\\x{200D}\\x{2764}\\x{FE0F}\\x{200D}\\x{1F48B}\\x{200D}\\x{1F469} \\x{1F3F4}"), "🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴");
		});
	});

	suite("Encode/Decode Hex Code Points (no-separate)", () => {
		test("Complex unicode characters", () => {
			assert.strictEqual(utils.encodeHexCodePoints("ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ"), "0x110 0x111 0x129 0x128 0x169 0x168 0x1A1 0x1A0 0x1B0 0x1AF 0x1EA1 0x1EA0 0x1EA3 0x1EA2 0x1EA5 0x1EA4 0x1EA7 0x1EA6 0x1EA9 0x1EA8 0x1EAB 0x1EAA 0x1EAD 0x1EAC 0x1EAF 0x1EAE 0x1EB1 0x1EB0 0x1EB3 0x1EB2 0x1EB5 0x1EB4 0x1EB7 0x1EB6 0x1EB9 0x1EB8 0x1EBB 0x1EBA 0x1EBD 0x1EBC 0x1EBF 0x1EBE 0x1EC1 0x1EC0 0x1EC3 0x1EC2 0x1EC5 0x1EC4 0x1EC7 0x1EC6 0x1EC9 0x1EC8 0x1ECB 0x1ECA 0x1ECD 0x1ECC 0x1ECF 0x1ECE 0x1ED1 0x1ED0 0x1ED3 0x1ED2 0x1ED5 0x1ED4 0x1ED7 0x1ED6 0x1ED9 0x1ED8 0x1EDB 0x1EDA 0x1EDD 0x1EDC 0x1EDF 0x1EDE 0x1EE1 0x1EE0 0x1EE3 0x1EE2 0x1EE5 0x1EE4 0x1EE7 0x1EE6 0x1EE9 0x1EE8 0x1EEB 0x1EEA 0x1EED 0x1EEC 0x1EEF 0x1EEE 0x1EF1 0x1EF0 0x1EF3 0x1EF2 0x1EF5 0x1EF4 0x1EF7 0x1EF6 0x1EF9 0x1EF8", "encode hex code points");
			assert.strictEqual(utils.decodeHexCodePoints("0x110 0x111 0x129 0x128 0x169 0x168 0x1A1 0x1A0 0x1B0 0x1AF 0x1EA1 0x1EA0 0x1EA3 0x1EA2 0x1EA5 0x1EA4 0x1EA7 0x1EA6 0x1EA9 0x1EA8 0x1EAB 0x1EAA 0x1EAD 0x1EAC 0x1EAF 0x1EAE 0x1EB1 0x1EB0 0x1EB3 0x1EB2 0x1EB5 0x1EB4 0x1EB7 0x1EB6 0x1EB9 0x1EB8 0x1EBB 0x1EBA 0x1EBD 0x1EBC 0x1EBF 0x1EBE 0x1EC1 0x1EC0 0x1EC3 0x1EC2 0x1EC5 0x1EC4 0x1EC7 0x1EC6 0x1EC9 0x1EC8 0x1ECB 0x1ECA 0x1ECD 0x1ECC 0x1ECF 0x1ECE 0x1ED1 0x1ED0 0x1ED3 0x1ED2 0x1ED5 0x1ED4 0x1ED7 0x1ED6 0x1ED9 0x1ED8 0x1EDB 0x1EDA 0x1EDD 0x1EDC 0x1EDF 0x1EDE 0x1EE1 0x1EE0 0x1EE3 0x1EE2 0x1EE5 0x1EE4 0x1EE7 0x1EE6 0x1EE9 0x1EE8 0x1EEB 0x1EEA 0x1EED 0x1EEC 0x1EEF 0x1EEE 0x1EF1 0x1EF0 0x1EF3 0x1EF2 0x1EF5 0x1EF4 0x1EF7 0x1EF6 0x1EF9 0x1EF8"), "ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ", "decode hex code points");
		});

		test("Complex emoji", () => {
			assert.strictEqual(utils.encodeHexCodePoints("🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴"), "0x1F3F4 0xE0067 0xE0062 0xE0077 0xE006C 0xE0073 0xE007F 0x20 0x1F9D1 0x200D 0x1F91D 0x200D 0x1F9D1 0x20 0x1F468 0x200D 0x1F469 0x200D 0x1F466 0x200D 0x1F466 0x20 0x1F469 0x200D 0x1F469 0x200D 0x1F467 0x200D 0x1F467 0x20 0x1F469 0x200D 0x2764 0xFE0F 0x200D 0x1F48B 0x200D 0x1F469 0x20 0x1F3F4", "encode hex code points");
			assert.strictEqual(utils.decodeHexCodePoints("0x1F3F4 0xE0067 0xE0062 0xE0077 0xE006C 0xE0073 0xE007F 0x20 0x1F9D1 0x200D 0x1F91D 0x200D 0x1F9D1 0x20 0x1F468 0x200D 0x1F469 0x200D 0x1F466 0x200D 0x1F466 0x20 0x1F469 0x200D 0x1F469 0x200D 0x1F467 0x200D 0x1F467 0x20 0x1F469 0x200D 0x2764 0xFE0F 0x200D 0x1F48B 0x200D 0x1F469 0x20 0x1F3F4"), "🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴", "decode hex code points");
		});
	});

	suite("Encode/Decode Hex Code Points (separate)", () => {
		test("Complex unicode characters", () => {
			assert.strictEqual(utils.encodeHexCodePoints("ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ"), "0x110 0x111 0x129 0x128 0x169 0x168 0x1A1 0x1A0 0x1B0 0x1AF 0x1EA1 0x1EA0 0x1EA3 0x1EA2 0x1EA5 0x1EA4 0x1EA7 0x1EA6 0x1EA9 0x1EA8 0x1EAB 0x1EAA 0x1EAD 0x1EAC 0x1EAF 0x1EAE 0x1EB1 0x1EB0 0x1EB3 0x1EB2 0x1EB5 0x1EB4 0x1EB7 0x1EB6 0x1EB9 0x1EB8 0x1EBB 0x1EBA 0x1EBD 0x1EBC 0x1EBF 0x1EBE 0x1EC1 0x1EC0 0x1EC3 0x1EC2 0x1EC5 0x1EC4 0x1EC7 0x1EC6 0x1EC9 0x1EC8 0x1ECB 0x1ECA 0x1ECD 0x1ECC 0x1ECF 0x1ECE 0x1ED1 0x1ED0 0x1ED3 0x1ED2 0x1ED5 0x1ED4 0x1ED7 0x1ED6 0x1ED9 0x1ED8 0x1EDB 0x1EDA 0x1EDD 0x1EDC 0x1EDF 0x1EDE 0x1EE1 0x1EE0 0x1EE3 0x1EE2 0x1EE5 0x1EE4 0x1EE7 0x1EE6 0x1EE9 0x1EE8 0x1EEB 0x1EEA 0x1EED 0x1EEC 0x1EEF 0x1EEE 0x1EF1 0x1EF0 0x1EF3 0x1EF2 0x1EF5 0x1EF4 0x1EF7 0x1EF6 0x1EF9 0x1EF8", "encode hex code points");
			assert.strictEqual(utils.decodeHexCodePoints("0x110 0x111 0x129 0x128 0x169 0x168 0x1A1 0x1A0 0x1B0 0x1AF 0x1EA1 0x1EA0 0x1EA3 0x1EA2 0x1EA5 0x1EA4 0x1EA7 0x1EA6 0x1EA9 0x1EA8 0x1EAB 0x1EAA 0x1EAD 0x1EAC 0x1EAF 0x1EAE 0x1EB1 0x1EB0 0x1EB3 0x1EB2 0x1EB5 0x1EB4 0x1EB7 0x1EB6 0x1EB9 0x1EB8 0x1EBB 0x1EBA 0x1EBD 0x1EBC 0x1EBF 0x1EBE 0x1EC1 0x1EC0 0x1EC3 0x1EC2 0x1EC5 0x1EC4 0x1EC7 0x1EC6 0x1EC9 0x1EC8 0x1ECB 0x1ECA 0x1ECD 0x1ECC 0x1ECF 0x1ECE 0x1ED1 0x1ED0 0x1ED3 0x1ED2 0x1ED5 0x1ED4 0x1ED7 0x1ED6 0x1ED9 0x1ED8 0x1EDB 0x1EDA 0x1EDD 0x1EDC 0x1EDF 0x1EDE 0x1EE1 0x1EE0 0x1EE3 0x1EE2 0x1EE5 0x1EE4 0x1EE7 0x1EE6 0x1EE9 0x1EE8 0x1EEB 0x1EEA 0x1EED 0x1EEC 0x1EEF 0x1EEE 0x1EF1 0x1EF0 0x1EF3 0x1EF2 0x1EF5 0x1EF4 0x1EF7 0x1EF6 0x1EF9 0x1EF8"), "ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ", "decode hex code points");
		});

		test("Complex emoji", () => {
			assert.strictEqual(utils.encodeHexCodePoints("🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴"), "0x1F3F4 0xE0067 0xE0062 0xE0077 0xE006C 0xE0073 0xE007F 0x20 0x1F9D1 0x200D 0x1F91D 0x200D 0x1F9D1 0x20 0x1F468 0x200D 0x1F469 0x200D 0x1F466 0x200D 0x1F466 0x20 0x1F469 0x200D 0x1F469 0x200D 0x1F467 0x200D 0x1F467 0x20 0x1F469 0x200D 0x2764 0xFE0F 0x200D 0x1F48B 0x200D 0x1F469 0x20 0x1F3F4", "encode hex code points");
			assert.strictEqual(utils.decodeHexCodePoints("0x1F3F4 0xE0067 0xE0062 0xE0077 0xE006C 0xE0073 0xE007F 0x20 0x1F9D1 0x200D 0x1F91D 0x200D 0x1F9D1 0x20 0x1F468 0x200D 0x1F469 0x200D 0x1F466 0x200D 0x1F466 0x20 0x1F469 0x200D 0x1F469 0x200D 0x1F467 0x200D 0x1F467 0x20 0x1F469 0x200D 0x2764 0xFE0F 0x200D 0x1F48B 0x200D 0x1F469 0x20 0x1F3F4"), "🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴", "decode hex code points");
		});
	});

	suite("String Utilities", () => {
		test("safeToLowerCase prototype method", () => {
			assert.strictEqual("TEST".safeToLowerCase(), "test");
			assert.strictEqual("İ".safeToLowerCase("tr"), "i");
		});

		test("safeToUppercase prototype method", () => {
			assert.strictEqual("test".safeToUppercase(), "TEST");
			assert.strictEqual("iß".safeToUppercase("de"), "ISS");
		});

		test("safeToLowerCase function with fallback", () => {
			assert.strictEqual(utils.safeToLowerCase("TEST"), "test");
			assert.strictEqual(utils.safeToLowerCase("İ", "invalid-locale"), "i̇");
			assert.strictEqual(utils.safeToLowerCase("İ", "tr"), "i");
		});

		test("safeToUppercase function with fallback", () => {
			assert.strictEqual(utils.safeToUppercase("test"), "TEST");
			assert.strictEqual(utils.safeToUppercase("iß", "invalid-locale"), "ISS");
		});
	});

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