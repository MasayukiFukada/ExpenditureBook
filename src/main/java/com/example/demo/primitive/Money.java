package com.example.demo.primitive;

import lombok.Setter;

@Setter
public class Money {
	private int value;
	
	public Money(int value) {
		this.value = value;
	}
	
	public String toDisplay() {
		return String.format("%,d", this.value);
	}
}
