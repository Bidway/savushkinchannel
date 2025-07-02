package com.example.savushkin.controller;

import com.example.savushkin.dto.KeyValue;
import com.example.savushkin.dto.NodeResponse;
import com.example.savushkin.service.NodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NodeController {
    private final NodeService nodeService;


    @DeleteMapping("/nodes/{id}")
    public ResponseEntity<Void> deleteNode(@PathVariable Long id) {
        nodeService.deleteNode(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/device-params")
    public ResponseEntity updateNode(@RequestBody List<KeyValue> keyValues) {
        return ResponseEntity.ok(nodeService.updateNode(keyValues));
    }

    @GetMapping("/nodes/search")
    public ResponseEntity<NodeResponse> getFullHierarchy(
            @RequestParam String site,
            @RequestParam String project) {

        return ResponseEntity.ok(nodeService.getFullHierarchy(site, project));
    }

}