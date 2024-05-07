package com.example.demo.primitive;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class MonthTest {

	@Test
	void testSetValue() {
		Month month = new Month(5);
		assertTrue(month.getValue() == 5);
	}
	
	@Test
	void testOver12() {
		Month month = new Month(13);
		assertTrue(month.getValue() == 12);
	}
	
	@Test
	void testUnder1() {
		Month month = new Month(0);
		assertTrue(month.getValue() == 1);
	}

}
