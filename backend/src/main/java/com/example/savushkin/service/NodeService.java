package com.example.savushkin.service;

import com.example.savushkin.dto.*;
import com.example.savushkin.model.Node;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface NodeService {

    void deleteNode(Long id);
    void deleteNodeByIdNode(String idNode);
    CreateNodeResponse createNode(CreateNodeDTO createNodeDTO);
    ResponseEntity<Void> updateNode(List<KeyValue> keyValues);
    NodeResponse getFullHierarchy(String site, String project);
    void deleteParamById(Long id);
    ParamDTO createParam(CreateParamDTO createParamDTO);
}
