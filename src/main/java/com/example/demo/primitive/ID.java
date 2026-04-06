package com.example.demo.primitive;

import java.io.Serializable;
import java.util.UUID;

import com.fasterxml.uuid.Generators;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ID implements Serializable {
    // Serializable で必須
    private static final long serialVersionUID = 1L;

    private String id = "";
    private boolean isSet;

    public ID(String set) {
        this.id = set;
        this.isSet = true;
    }

    public void setNewVer4ID() {
        if (this.isSet) {
            return;
        }
        UUID uuid = Generators.randomBasedGenerator().generate();
        this.id = uuid.toString();
        this.isSet = true;
    }

    public void setNewVer7ID() {
        if (this.isSet) {
            return;
        }
        UUID uuid = Generators.timeBasedEpochGenerator().generate();
        this.id = uuid.toString();
        this.isSet = true;
    }
}
