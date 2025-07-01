package com.example.savushkin.controller;

import com.example.savushkin.dto.NodeResponse;
import com.example.savushkin.service.NodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/nodes")
@RequiredArgsConstructor
public class NodeController {
    private final NodeService nodeService;


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNode(@PathVariable Long id) {
        nodeService.deleteNode(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<NodeResponse> getFullHierarchy(
            @RequestParam String site,
            @RequestParam String project) {

        return ResponseEntity.ok(nodeService.getFullHierarchy(site, project));
    }

}