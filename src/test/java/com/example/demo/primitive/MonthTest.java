package com.example.demo.primitive;


import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class MonthTest {

	@Test
	@DisplayName("通常のテスト")
	void testSetValue() {
		Month month = new Month(5);
		assertTrue(month.getValue() == 5);
	}
	
	@Test
	@DisplayName("12を超える場合")
	void testOver12() {
		Month month = new Month(13);
		assertTrue(month.getValue() == 12);
	}
	
	@Test
	@DisplayName("1を切る場合")
	void testUnder1() {
		Month month = new Month(0);
		assertTrue(month.getValue() == 1);
	}

}
