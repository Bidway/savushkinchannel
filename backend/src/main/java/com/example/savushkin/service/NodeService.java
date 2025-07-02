package com.example.savushkin.service;

import com.example.savushkin.dto.KeyValue;
import com.example.savushkin.dto.NodeResponse;
import com.example.savushkin.model.Node;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface NodeService {

    void deleteNode(Long id);
    ResponseEntity<Void> updateNode(List<KeyValue> keyValues);
    NodeResponse getFullHierarchy(String site, String project);
}
