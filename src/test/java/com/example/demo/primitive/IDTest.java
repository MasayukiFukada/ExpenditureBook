package com.example.demo.primitive;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class IDTest {

	@Test
	@DisplayName("通常の初期化")
	void initinalTest() {
		ID id = new ID();
		assertTrue(id.isSet() == false);
		assertTrue(id.getId() == "");
	}
	
	@Test
	@DisplayName("初期値付きで初期化")
	void initialValueTest() {
		ID id = new ID("first");
		assertTrue(id.isSet() == true);
		assertTrue(id.getId() == "first");
	}
	
	@Test
	@DisplayName("Ver4をセット")
	void v4Test() {
		ID id = new ID();
		id.setNewVer4ID();
		assertTrue(id.isSet() == true);
		assertTrue(id.getId() != "");
		
		String before = id.getId();
		id.setNewVer4ID();
		assertTrue(id.getId() == before);
	}

	@Test
	@DisplayName("Ver7をセット")
	void v7Test() {
		ID id = new ID();
		id.setNewVer7ID();
		assertTrue(id.isSet() == true);
		assertTrue(id.getId() != "");

		String before = id.getId();
		id.setNewVer7ID();
		assertTrue(id.getId() == before);
	}
}
