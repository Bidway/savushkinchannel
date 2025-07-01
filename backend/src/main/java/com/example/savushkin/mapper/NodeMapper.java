package com.example.savushkin.mapper;

import com.example.savushkin.model.Node;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface NodeMapper {
//    Node toEntity(NodeDto dto);
//    NodeDto toDto(Node entity);
//    void updateEntityFromDto(NodeDto dto, @MappingTarget Node entity);
}