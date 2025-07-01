package com.example.savushkin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "node")
@Getter
@Setter
public class Node {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_node", unique = true, nullable = false)
    private String idNode;

    @Column(name = "name")
    private String name;

    @Column(name = "parent_id")
    private String parentId;

    @OneToMany(mappedBy = "node", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // Полностью исключаем из JSON
    private List<NodeParam> nodeParams = new ArrayList<>();
}
