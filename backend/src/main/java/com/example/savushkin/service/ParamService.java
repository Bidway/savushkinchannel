package com.example.savushkin.service;

import com.example.savushkin.dto.CreateParamDTO;
import com.example.savushkin.dto.KeyValue;
import com.example.savushkin.dto.ParamDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ParamService {
    void deleteParamById(Long id);
    ParamDTO createParam(CreateParamDTO createParamDTO);
    ResponseEntity<Void> updateNodeParams(List<KeyValue> keyValues);
}
