package com.example.savushkin.service.imlp;

import com.example.savushkin.config.NodeTemplates;
import com.example.savushkin.dto.*;
import com.example.savushkin.exception.NotFoundException;
import com.example.savushkin.model.Description;
import com.example.savushkin.model.Node;
import com.example.savushkin.model.NodeParam;
import com.example.savushkin.repository.DescriptionRepository;
import com.example.savushkin.repository.NodeRepository;
import com.example.savushkin.repository.ParamRepository;
import com.example.savushkin.service.NodeService;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NodeServiceImpl implements NodeService {
    private final NodeRepository nodeRepository;
    private final DescriptionRepository descriptionRepository;
    private final ParamRepository paramRepository;
    private final EntityManager entityManager;

    @Override
    public void deleteNode(Long id) {
        nodeRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteNodeByIdNode(String idNode) {
        nodeRepository.deleteNodeByIdNode(idNode);
    }

    @Override
    public CreateNodeResponse createNode(CreateNodeDTO createNodeDTO) {
        CreateNodeResponse response = new CreateNodeResponse();
        validateNodeType(createNodeDTO.getType());



        Node node = new Node();
        node.setNodeType(createNodeDTO.getType());
        node.setIdNode("temp");
        node.setName(createNodeDTO.getName());
        node.setParentId(createNodeDTO.getParentId());

        Node savedNode = nodeRepository.save(node);
        savedNode.updateIdNode();
        boolean isParent = "cha".equals(createNodeDTO.getType());
        response.setNodeDTO(convertToDto(savedNode, isParent));

        List<Long> paramIds = NodeTemplates.getTemplateParams(createNodeDTO.getType());
        List<Description> descriptions = descriptionRepository.findAll();
        if (paramIds != null) {
            for (Long paramId : paramIds) {
                NodeParam nodeParam = new NodeParam();
                nodeParam.setIdType(paramId);
                nodeParam.setNode(savedNode);
                nodeParam.setValue("");
                NodeParam savedParam = paramRepository.save(nodeParam);

                ParamDTO dto = new ParamDTO();
                dto.setId(savedParam.getId());
                dto.setIdNode(savedParam.getNode().getIdNode());
                dto.setName(descriptions.get(savedParam.getIdType().intValue()-1).getName());
                dto.setType(descriptions.get(savedParam.getIdType().intValue()-1).getType());
                dto.setValue(savedParam.getValue());

                response.getParams().add(dto);
            }
        }

        return response;
    }

    private void validateNodeType(String type) {
        if (!List.of("dev", "sub", "cha").contains(type)) {
            throw new IllegalArgumentException("Node type must be 'dev', 'sub' or 'cha'");
        }
    }
    private NodeDTO convertToDto(Node node, Boolean isParent) {
        NodeDTO dto = new NodeDTO();
        dto.setIdNode(node.getIdNode());
        dto.setName(node.getName());
        dto.setIsParent(isParent);
        dto.setParentId(node.getParentId());
        return dto;
    }

    @Override
    public ResponseEntity<Void> updateNode(List<KeyValue> keyValues) {
        List<Long> ids = keyValues.stream().map(KeyValue::getKey).collect(Collectors.toList());
        List<NodeParam> nodeParams = paramRepository.findAllByIdIn(ids);

        // Собираем ID, которые не были найдены
        Set<Long> missingIds = new HashSet<>(ids);
        nodeParams.forEach(param -> missingIds.remove(param.getId())); // Удаляем найденные

        if (!missingIds.isEmpty()) {
            // Если есть ID, для которых не нашлось NodeParam, возвращаем BAD_REQUEST
            return ResponseEntity.badRequest().build();
        }

        // Обновляем параметры
        nodeParams.forEach(param -> {
            keyValues.stream()
                    .filter(kv -> kv.getKey().equals(param.getId()))
                    .findFirst()
                    .ifPresent(kv -> param.setValue(kv.getValue()));
        });

        // Сохраняем все изменения (можно batch-обновление, если поддерживается)
        paramRepository.saveAll(nodeParams);

        return ResponseEntity.ok().build();
    }


    @Override
    public NodeResponse getFullHierarchy(String site, String project) {
        NodeResponse response = new NodeResponse();

        List<Node> devices = nodeRepository.findDevicesBySiteAndProject(site, project);
        List<String> deviceIds = devices.stream().map(Node::getIdNode).collect(Collectors.toList());

        List<Node> subtypes = nodeRepository.findByParentIds(deviceIds);
        List<String> subtypeIds = subtypes.stream().map(Node::getIdNode).collect(Collectors.toList());

        List<Node> channels = nodeRepository.findByParentIds(subtypeIds);
        List<String> channelsIds = channels.stream().map(Node::getIdNode).collect(Collectors.toList());

        List<Description> descriptions = descriptionRepository.findAll();

        List<String> nodesIds = new ArrayList<>();
        nodesIds.addAll(deviceIds);
        nodesIds.addAll(subtypeIds);
        nodesIds.addAll(channelsIds);
        List<NodeParam> allParams = paramRepository.findParamsByNodeIds(nodesIds);
        allParams.forEach(param -> {
           ParamDTO dto = new ParamDTO();
           dto.setId(param.getId());
           dto.setIdNode(param.getNode().getIdNode());
           dto.setName(descriptions.get(param.getIdType().intValue()-1).getName());
           dto.setType(descriptions.get(param.getIdType().intValue()-1).getType());
           dto.setValue(param.getValue());

           response.getParams().add(dto);
        });

        List<Node> nodes = new ArrayList<>();
        nodes.addAll(devices);
        nodes.addAll(subtypes);
        nodes.addAll(channels);
        nodes.forEach(node ->{
            NodeDTO dto = new NodeDTO();
            dto.setIdNode(node.getIdNode());
            dto.setName(node.getName());
            dto.setParentId(node.getParentId());
            if(node.getIdNode().substring(0,3).equals("cha")) {
                dto.setIsParent(true);
            } else{
                dto.setIsParent(false);
            }
            response.getNodes().add(dto);
        });
        return response;
    }
}
