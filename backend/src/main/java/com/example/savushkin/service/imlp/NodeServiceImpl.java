package com.example.savushkin.service.imlp;

import com.example.savushkin.dto.*;
import com.example.savushkin.model.Description;
import com.example.savushkin.model.Node;
import com.example.savushkin.model.NodeParam;
import com.example.savushkin.repository.DescriptionRepository;
import com.example.savushkin.repository.NodeRepository;
import com.example.savushkin.service.NodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NodeServiceImpl implements NodeService {
    private final NodeRepository nodeRepository;
    private final DescriptionRepository descriptionRepository;

    @Override
    public void deleteNode(Long id) {
        nodeRepository.deleteById(id);
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
        List<NodeParam> allParams = nodeRepository.findParamsByNodeIds(nodesIds);
        allParams.forEach(param -> {
           ParamDTO dto = new ParamDTO();
           dto.setId(param.getId());
           dto.setIdNode(param.getNode().getIdNode());
           dto.setName(descriptions.get(param.getIdType().intValue()).getName());
           dto.setType(descriptions.get(param.getIdType().intValue()).getType());
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
