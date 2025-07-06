package com.example.savushkin.controller;

import com.example.savushkin.dto.*;
import com.example.savushkin.service.NodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/node")
@RequiredArgsConstructor
public class NodeController {
    private final NodeService nodeService;

    @DeleteMapping("/{idNode}")
    public ResponseEntity<Void> deleteNode(@PathVariable String idNode) {
        nodeService.deleteNodeByIdNode(idNode);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("")
    public ResponseEntity<CreateNodeResponse> createNode(@RequestBody CreateNodeDTO createNodeDTO) {
        CreateNodeResponse response = nodeService.createNode(createNodeDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<NodeResponse> getFullHierarchy(
            @RequestParam String site,
            @RequestParam String project) {
        return ResponseEntity.ok(nodeService.getFullHierarchy(site, project));
    }

}