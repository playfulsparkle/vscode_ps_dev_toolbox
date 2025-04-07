import * as assert from "assert";
import * as utils from "../utils";

suite("Dev Toolbox Tests", () => {
	suite("Encode/Decode to HTML Entities", () => {
		test("Complex unicode characters", () => {
			assert.strictEqual(utils.encodeHtmlHexEntities("ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ"), "&#x0110;&#x0111;&#x0129;&#x0128;&#x0169;&#x0168;&#x01A1;&#x01A0;&#x01B0;&#x01AF;&#x1EA1;&#x1EA0;&#x1EA3;&#x1EA2;&#x1EA5;&#x1EA4;&#x1EA7;&#x1EA6;&#x1EA9;&#x1EA8;&#x1EAB;&#x1EAA;&#x1EAD;&#x1EAC;&#x1EAF;&#x1EAE;&#x1EB1;&#x1EB0;&#x1EB3;&#x1EB2;&#x1EB5;&#x1EB4;&#x1EB7;&#x1EB6;&#x1EB9;&#x1EB8;&#x1EBB;&#x1EBA;&#x1EBD;&#x1EBC;&#x1EBF;&#x1EBE;&#x1EC1;&#x1EC0;&#x1EC3;&#x1EC2;&#x1EC5;&#x1EC4;&#x1EC7;&#x1EC6;&#x1EC9;&#x1EC8;&#x1ECB;&#x1ECA;&#x1ECD;&#x1ECC;&#x1ECF;&#x1ECE;&#x1ED1;&#x1ED0;&#x1ED3;&#x1ED2;&#x1ED5;&#x1ED4;&#x1ED7;&#x1ED6;&#x1ED9;&#x1ED8;&#x1EDB;&#x1EDA;&#x1EDD;&#x1EDC;&#x1EDF;&#x1EDE;&#x1EE1;&#x1EE0;&#x1EE3;&#x1EE2;&#x1EE5;&#x1EE4;&#x1EE7;&#x1EE6;&#x1EE9;&#x1EE8;&#x1EEB;&#x1EEA;&#x1EED;&#x1EEC;&#x1EEF;&#x1EEE;&#x1EF1;&#x1EF0;&#x1EF3;&#x1EF2;&#x1EF5;&#x1EF4;&#x1EF7;&#x1EF6;&#x1EF9;&#x1EF8;");
			assert.strictEqual(utils.decodeHtmlHexEntities("&#x0110;&#x0111;&#x0129;&#x0128;&#x0169;&#x0168;&#x01A1;&#x01A0;&#x01B0;&#x01AF;&#x1EA1;&#x1EA0;&#x1EA3;&#x1EA2;&#x1EA5;&#x1EA4;&#x1EA7;&#x1EA6;&#x1EA9;&#x1EA8;&#x1EAB;&#x1EAA;&#x1EAD;&#x1EAC;&#x1EAF;&#x1EAE;&#x1EB1;&#x1EB0;&#x1EB3;&#x1EB2;&#x1EB5;&#x1EB4;&#x1EB7;&#x1EB6;&#x1EB9;&#x1EB8;&#x1EBB;&#x1EBA;&#x1EBD;&#x1EBC;&#x1EBF;&#x1EBE;&#x1EC1;&#x1EC0;&#x1EC3;&#x1EC2;&#x1EC5;&#x1EC4;&#x1EC7;&#x1EC6;&#x1EC9;&#x1EC8;&#x1ECB;&#x1ECA;&#x1ECD;&#x1ECC;&#x1ECF;&#x1ECE;&#x1ED1;&#x1ED0;&#x1ED3;&#x1ED2;&#x1ED5;&#x1ED4;&#x1ED7;&#x1ED6;&#x1ED9;&#x1ED8;&#x1EDB;&#x1EDA;&#x1EDD;&#x1EDC;&#x1EDF;&#x1EDE;&#x1EE1;&#x1EE0;&#x1EE3;&#x1EE2;&#x1EE5;&#x1EE4;&#x1EE7;&#x1EE6;&#x1EE9;&#x1EE8;&#x1EEB;&#x1EEA;&#x1EED;&#x1EEC;&#x1EEF;&#x1EEE;&#x1EF1;&#x1EF0;&#x1EF3;&#x1EF2;&#x1EF5;&#x1EF4;&#x1EF7;&#x1EF6;&#x1EF9;&#x1EF8;"), "ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ");
		});

		test("Complex emoji", () => {
			assert.strictEqual(utils.encodeHtmlHexEntities("🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴"), "&#x1F3F4;&#xE0067;&#xE0062;&#xE0077;&#xE006C;&#xE0073;&#xE007F;&#x0020;&#x1F9D1;&#x200D;&#x1F91D;&#x200D;&#x1F9D1;&#x0020;&#x1F468;&#x200D;&#x1F469;&#x200D;&#x1F466;&#x200D;&#x1F466;&#x0020;&#x1F469;&#x200D;&#x1F469;&#x200D;&#x1F467;&#x200D;&#x1F467;&#x0020;&#x1F469;&#x200D;&#x2764;&#xFE0F;&#x200D;&#x1F48B;&#x200D;&#x1F469;&#x0020;&#x1F3F4;");
			assert.strictEqual(utils.decodeHtmlHexEntities("&#x1F3F4;&#xE0067;&#xE0062;&#xE0077;&#xE006C;&#xE0073;&#xE007F;&#x0020;&#x1F9D1;&#x200D;&#x1F91D;&#x200D;&#x1F9D1;&#x0020;&#x1F468;&#x200D;&#x1F469;&#x200D;&#x1F466;&#x200D;&#x1F466;&#x0020;&#x1F469;&#x200D;&#x1F469;&#x200D;&#x1F467;&#x200D;&#x1F467;&#x0020;&#x1F469;&#x200D;&#x2764;&#xFE0F;&#x200D;&#x1F48B;&#x200D;&#x1F469;&#x0020;&#x1F3F4;"), "🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴");
		});
	});

	suite("Encode/Decode to Decimal Entities", () => {
		test("Complex unicode characters", () => {
			assert.strictEqual(utils.encodeHtmlDecimalEntities("ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ"), "&#272;&#273;&#297;&#296;&#361;&#360;&#417;&#416;&#432;&#431;&#7841;&#7840;&#7843;&#7842;&#7845;&#7844;&#7847;&#7846;&#7849;&#7848;&#7851;&#7850;&#7853;&#7852;&#7855;&#7854;&#7857;&#7856;&#7859;&#7858;&#7861;&#7860;&#7863;&#7862;&#7865;&#7864;&#7867;&#7866;&#7869;&#7868;&#7871;&#7870;&#7873;&#7872;&#7875;&#7874;&#7877;&#7876;&#7879;&#7878;&#7881;&#7880;&#7883;&#7882;&#7885;&#7884;&#7887;&#7886;&#7889;&#7888;&#7891;&#7890;&#7893;&#7892;&#7895;&#7894;&#7897;&#7896;&#7899;&#7898;&#7901;&#7900;&#7903;&#7902;&#7905;&#7904;&#7907;&#7906;&#7909;&#7908;&#7911;&#7910;&#7913;&#7912;&#7915;&#7914;&#7917;&#7916;&#7919;&#7918;&#7921;&#7920;&#7923;&#7922;&#7925;&#7924;&#7927;&#7926;&#7929;&#7928;");
			assert.strictEqual(utils.decodeHtmlDecimalEntities("&#272;&#273;&#297;&#296;&#361;&#360;&#417;&#416;&#432;&#431;&#7841;&#7840;&#7843;&#7842;&#7845;&#7844;&#7847;&#7846;&#7849;&#7848;&#7851;&#7850;&#7853;&#7852;&#7855;&#7854;&#7857;&#7856;&#7859;&#7858;&#7861;&#7860;&#7863;&#7862;&#7865;&#7864;&#7867;&#7866;&#7869;&#7868;&#7871;&#7870;&#7873;&#7872;&#7875;&#7874;&#7877;&#7876;&#7879;&#7878;&#7881;&#7880;&#7883;&#7882;&#7885;&#7884;&#7887;&#7886;&#7889;&#7888;&#7891;&#7890;&#7893;&#7892;&#7895;&#7894;&#7897;&#7896;&#7899;&#7898;&#7901;&#7900;&#7903;&#7902;&#7905;&#7904;&#7907;&#7906;&#7909;&#7908;&#7911;&#7910;&#7913;&#7912;&#7915;&#7914;&#7917;&#7916;&#7919;&#7918;&#7921;&#7920;&#7923;&#7922;&#7925;&#7924;&#7927;&#7926;&#7929;&#7928;"), "ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ");
		});

		test("Complex emoji", () => {
			assert.strictEqual(utils.encodeHtmlDecimalEntities("🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴"), "&#127988;&#917607;&#917602;&#917623;&#917612;&#917619;&#917631;&#32;&#129489;&#8205;&#129309;&#8205;&#129489;&#32;&#128104;&#8205;&#128105;&#8205;&#128102;&#8205;&#128102;&#32;&#128105;&#8205;&#128105;&#8205;&#128103;&#8205;&#128103;&#32;&#128105;&#8205;&#10084;&#65039;&#8205;&#128139;&#8205;&#128105;&#32;&#127988;");
			assert.strictEqual(utils.decodeHtmlDecimalEntities("&#127988;&#917607;&#917602;&#917623;&#917612;&#917619;&#917631;&#32;&#129489;&#8205;&#129309;&#8205;&#129489;&#32;&#128104;&#8205;&#128105;&#8205;&#128102;&#8205;&#128102;&#32;&#128105;&#8205;&#128105;&#8205;&#128103;&#8205;&#128103;&#32;&#128105;&#8205;&#10084;&#65039;&#8205;&#128139;&#8205;&#128105;&#32;&#127988;"), "🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴");
		});
	});

	suite("Encode/Decode to Unicode Escape", () => {
		test("Complex unicode characters", () => {
			assert.strictEqual(utils.encodeUnicodeEscapeSequences("ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ"), "\\u0110\\u0111\\u0129\\u0128\\u0169\\u0168\\u01A1\\u01A0\\u01B0\\u01AF\\u1EA1\\u1EA0\\u1EA3\\u1EA2\\u1EA5\\u1EA4\\u1EA7\\u1EA6\\u1EA9\\u1EA8\\u1EAB\\u1EAA\\u1EAD\\u1EAC\\u1EAF\\u1EAE\\u1EB1\\u1EB0\\u1EB3\\u1EB2\\u1EB5\\u1EB4\\u1EB7\\u1EB6\\u1EB9\\u1EB8\\u1EBB\\u1EBA\\u1EBD\\u1EBC\\u1EBF\\u1EBE\\u1EC1\\u1EC0\\u1EC3\\u1EC2\\u1EC5\\u1EC4\\u1EC7\\u1EC6\\u1EC9\\u1EC8\\u1ECB\\u1ECA\\u1ECD\\u1ECC\\u1ECF\\u1ECE\\u1ED1\\u1ED0\\u1ED3\\u1ED2\\u1ED5\\u1ED4\\u1ED7\\u1ED6\\u1ED9\\u1ED8\\u1EDB\\u1EDA\\u1EDD\\u1EDC\\u1EDF\\u1EDE\\u1EE1\\u1EE0\\u1EE3\\u1EE2\\u1EE5\\u1EE4\\u1EE7\\u1EE6\\u1EE9\\u1EE8\\u1EEB\\u1EEA\\u1EED\\u1EEC\\u1EEF\\u1EEE\\u1EF1\\u1EF0\\u1EF3\\u1EF2\\u1EF5\\u1EF4\\u1EF7\\u1EF6\\u1EF9\\u1EF8");
			assert.strictEqual(utils.decodeUnicodeEscapeSequences("\\u0110\\u0111\\u0129\\u0128\\u0169\\u0168\\u01A1\\u01A0\\u01B0\\u01AF\\u1EA1\\u1EA0\\u1EA3\\u1EA2\\u1EA5\\u1EA4\\u1EA7\\u1EA6\\u1EA9\\u1EA8\\u1EAB\\u1EAA\\u1EAD\\u1EAC\\u1EAF\\u1EAE\\u1EB1\\u1EB0\\u1EB3\\u1EB2\\u1EB5\\u1EB4\\u1EB7\\u1EB6\\u1EB9\\u1EB8\\u1EBB\\u1EBA\\u1EBD\\u1EBC\\u1EBF\\u1EBE\\u1EC1\\u1EC0\\u1EC3\\u1EC2\\u1EC5\\u1EC4\\u1EC7\\u1EC6\\u1EC9\\u1EC8\\u1ECB\\u1ECA\\u1ECD\\u1ECC\\u1ECF\\u1ECE\\u1ED1\\u1ED0\\u1ED3\\u1ED2\\u1ED5\\u1ED4\\u1ED7\\u1ED6\\u1ED9\\u1ED8\\u1EDB\\u1EDA\\u1EDD\\u1EDC\\u1EDF\\u1EDE\\u1EE1\\u1EE0\\u1EE3\\u1EE2\\u1EE5\\u1EE4\\u1EE7\\u1EE6\\u1EE9\\u1EE8\\u1EEB\\u1EEA\\u1EED\\u1EEC\\u1EEF\\u1EEE\\u1EF1\\u1EF0\\u1EF3\\u1EF2\\u1EF5\\u1EF4\\u1EF7\\u1EF6\\u1EF9\\u1EF8"), "ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ");
		});

		test("Complex emoji", () => {
			assert.strictEqual(utils.encodeUnicodeEscapeSequences("🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴"), "\\U0001f3f4\\U000e0067\\U000e0062\\U000e0077\\U000e006c\\U000e0073\\U000e007f \\U0001f9d1\\u200D\\U0001f91d\\u200D\\U0001f9d1 \\U0001f468\\u200D\\U0001f469\\u200D\\U0001f466\\u200D\\U0001f466 \\U0001f469\\u200D\\U0001f469\\u200D\\U0001f467\\u200D\\U0001f467 \\U0001f469\\u200D\\u2764\\uFE0F\\u200D\\U0001f48b\\u200D\\U0001f469 \\U0001f3f4");
			assert.strictEqual(utils.decodeUnicodeEscapeSequences("\\U0001f3f4\\U000e0067\\U000e0062\\U000e0077\\U000e006c\\U000e0073\\U000e007f \\U0001f9d1\\u200D\\U0001f91d\\u200D\\U0001f9d1 \\U0001f468\\u200D\\U0001f469\\u200D\\U0001f466\\u200D\\U0001f466 \\U0001f469\\u200D\\U0001f469\\u200D\\U0001f467\\u200D\\U0001f467 \\U0001f469\\u200D\\u2764\\uFE0F\\u200D\\U0001f48b\\u200D\\U0001f469 \\U0001f3f4"), "🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴");
		});
	});

	suite("Encode/Decode to CSS Unicode", () => {
		test("Complex unicode characters", () => {
			assert.strictEqual(utils.encodeCssUnicodeEscape("ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ"), "\\0110 \\0111 \\0129 \\0128 \\0169 \\0168 \\01A1 \\01A0 \\01B0 \\01AF \\1EA1 \\1EA0 \\1EA3 \\1EA2 \\1EA5 \\1EA4 \\1EA7 \\1EA6 \\1EA9 \\1EA8 \\1EAB \\1EAA \\1EAD \\1EAC \\1EAF \\1EAE \\1EB1 \\1EB0 \\1EB3 \\1EB2 \\1EB5 \\1EB4 \\1EB7 \\1EB6 \\1EB9 \\1EB8 \\1EBB \\1EBA \\1EBD \\1EBC \\1EBF \\1EBE \\1EC1 \\1EC0 \\1EC3 \\1EC2 \\1EC5 \\1EC4 \\1EC7 \\1EC6 \\1EC9 \\1EC8 \\1ECB \\1ECA \\1ECD \\1ECC \\1ECF \\1ECE \\1ED1 \\1ED0 \\1ED3 \\1ED2 \\1ED5 \\1ED4 \\1ED7 \\1ED6 \\1ED9 \\1ED8 \\1EDB \\1EDA \\1EDD \\1EDC \\1EDF \\1EDE \\1EE1 \\1EE0 \\1EE3 \\1EE2 \\1EE5 \\1EE4 \\1EE7 \\1EE6 \\1EE9 \\1EE8 \\1EEB \\1EEA \\1EED \\1EEC \\1EEF \\1EEE \\1EF1 \\1EF0 \\1EF3 \\1EF2 \\1EF5 \\1EF4 \\1EF7 \\1EF6 \\1EF9 \\1EF8 ");
			assert.strictEqual(utils.decodeCssUnicodeEscape("\\0110 \\0111 \\0129 \\0128 \\0169 \\0168 \\01A1 \\01A0 \\01B0 \\01AF \\1EA1 \\1EA0 \\1EA3 \\1EA2 \\1EA5 \\1EA4 \\1EA7 \\1EA6 \\1EA9 \\1EA8 \\1EAB \\1EAA \\1EAD \\1EAC \\1EAF \\1EAE \\1EB1 \\1EB0 \\1EB3 \\1EB2 \\1EB5 \\1EB4 \\1EB7 \\1EB6 \\1EB9 \\1EB8 \\1EBB \\1EBA \\1EBD \\1EBC \\1EBF \\1EBE \\1EC1 \\1EC0 \\1EC3 \\1EC2 \\1EC5 \\1EC4 \\1EC7 \\1EC6 \\1EC9 \\1EC8 \\1ECB \\1ECA \\1ECD \\1ECC \\1ECF \\1ECE \\1ED1 \\1ED0 \\1ED3 \\1ED2 \\1ED5 \\1ED4 \\1ED7 \\1ED6 \\1ED9 \\1ED8 \\1EDB \\1EDA \\1EDD \\1EDC \\1EDF \\1EDE \\1EE1 \\1EE0 \\1EE3 \\1EE2 \\1EE5 \\1EE4 \\1EE7 \\1EE6 \\1EE9 \\1EE8 \\1EEB \\1EEA \\1EED \\1EEC \\1EEF \\1EEE \\1EF1 \\1EF0 \\1EF3 \\1EF2 \\1EF5 \\1EF4 \\1EF7 \\1EF6 \\1EF9 \\1EF8 "), "ĐđĩĨũŨơƠưƯạẠảẢấẤầẦẩẨẫẪậẬắẮằẰẳẲẵẴặẶẹẸẻẺẽẼếẾềỀểỂễỄệỆỉỈịỊọỌỏỎốỐồỒổỔỗỖộỘớỚờỜởỞỡỠợỢụỤủỦứỨừỪửỬữỮựỰỳỲỵỴỷỶỹỸ");
		});

		test("Complex emoji", () => {
			assert.strictEqual(utils.encodeCssUnicodeEscape("🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴"), "\\01F3F4 \\0E0067 \\0E0062 \\0E0077 \\0E006C \\0E0073 \\0E007F  \\01F9D1 \\200D \\01F91D \\200D \\01F9D1  \\01F468 \\200D \\01F469 \\200D \\01F466 \\200D \\01F466  \\01F469 \\200D \\01F469 \\200D \\01F467 \\200D \\01F467  \\01F469 \\200D \\2764 \\FE0F \\200D \\01F48B \\200D \\01F469  \\01F3F4 ");
			assert.strictEqual(utils.decodeCssUnicodeEscape("\\01F3F4 \\0E0067 \\0E0062 \\0E0077 \\0E006C \\0E0073 \\0E007F  \\01F9D1 \\200D \\01F91D \\200D \\01F9D1  \\01F468 \\200D \\01F469 \\200D \\01F466 \\200D \\01F466  \\01F469 \\200D \\01F469 \\200D \\01F467 \\200D \\01F467  \\01F469 \\200D \\2764 \\FE0F \\200D \\01F48B \\200D \\01F469  \\01F3F4 "), "🏴󠁧󠁢󠁷󠁬󠁳󠁿 🧑‍🤝‍🧑 👨‍👩‍👦‍👦 👩‍👩‍👧‍👧 👩‍❤️‍💋‍👩 🏴");
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
			const expected = "Hello World!";
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