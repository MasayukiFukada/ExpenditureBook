package com.example.demo.primitive;

import lombok.Getter;

public class Month {
	@Getter
	private int value;
	
	public Month(int value) {
		this.setValue(value);
	}
	
	public void setValue(int value) {
		if(value > 12) {
			value = 12;
		}else if(value < 1) {
			value = 1;
		}else {
			this.value = value;
		}
	}
}
