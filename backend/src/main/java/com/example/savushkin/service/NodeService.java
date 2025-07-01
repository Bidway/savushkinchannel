package com.example.savushkin.service;

import com.example.savushkin.dto.NodeResponse;
import com.example.savushkin.model.Node;

import java.util.List;

public interface NodeService {

    void deleteNode(Long id);
    NodeResponse getFullHierarchy(String site, String project);
}
