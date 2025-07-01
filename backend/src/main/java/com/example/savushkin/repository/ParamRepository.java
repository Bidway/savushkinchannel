package com.example.savushkin.repository;

import com.example.savushkin.model.NodeParam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParamRepository extends JpaRepository<NodeParam, Long> {
}
