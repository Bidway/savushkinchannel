package com.example.savushkin.service.imlp;

import com.example.savushkin.dto.CreateParamDTO;
import com.example.savushkin.dto.KeyValue;
import com.example.savushkin.dto.ParamDTO;
import com.example.savushkin.model.Description;
import com.example.savushkin.model.Node;
import com.example.savushkin.model.NodeParam;
import com.example.savushkin.repository.DescriptionRepository;
import com.example.savushkin.repository.NodeRepository;
import com.example.savushkin.repository.ParamRepository;
import com.example.savushkin.service.ParamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParamServiceImpl implements ParamService {
    private final ParamRepository paramRepository;
    private final DescriptionRepository descriptionRepository;
    private final NodeRepository nodeRepository;

    @Override
    public void deleteParamById(Long id) {
        paramRepository.deleteById(id);
    }

    @Override
    public ParamDTO createParam(CreateParamDTO createParamDTO) {
        Description description = descriptionRepository.findByName(createParamDTO.getName());
        Node node = nodeRepository.getNodeByIdNode(createParamDTO.getIdNode());
        NodeParam nodeParam = new NodeParam();
        nodeParam.setIdType(description.getId());
        nodeParam.setNode(node);
        nodeParam.setValue(createParamDTO.getValue());
        NodeParam savedParam = paramRepository.save(nodeParam);
        ParamDTO dto = new ParamDTO();
        dto.setId(savedParam.getId());
        dto.setIdNode(savedParam.getNode().getIdNode());
        dto.setName(description.getName());
        dto.setType(description.getType());
        dto.setValue(savedParam.getValue());
        return dto;
    }

    @Override
    public ResponseEntity<Void> updateNodeParams(List<KeyValue> keyValues) {
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
}
