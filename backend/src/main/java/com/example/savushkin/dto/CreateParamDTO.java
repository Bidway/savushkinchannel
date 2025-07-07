package com.example.savushkin.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CreateParamDTO {

    @JsonProperty("parentKey")
    String idNode;
    String name;
    String value;
}
