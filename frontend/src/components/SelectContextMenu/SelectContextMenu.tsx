import {useState, useRef, useEffect} from "react";
import './SelectContextMenu.scss';
import type {DeviceParamsType} from "../../types/nodeType.ts";

type MenuState = {
  visible: boolean;
  x: number;
  y: number;
  targetType: 'select' | 'option';
  targetValue?: string;
};

const menuItemStyle: React.CSSProperties = {
  padding: '4px 10px',
  cursor: 'pointer',
};

interface SelectContextMenuProps {
  name: string;
  title: string;
  value: DeviceParamsType[];
}

const SelectContextMenu: React.FC<SelectContextMenuProps> = ({name, title, value}) => {
  const [contextMenu, setContextMenu] = useState<MenuState>({
    visible: false,
    x: 0,
    y: 0,
    targetType: 'select',
  });

  const selectRef = useRef<HTMLSelectElement>(null);

  const handleContextMenu = (e: React.MouseEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const { clientX, clientY } = e;

    const target = e.target as HTMLElement;

    if (target.tagName === 'OPTION') {
      const optionValue = (target as HTMLOptionElement).value;

      // 👉 выделим опцию вручную
      if (selectRef.current) {
        const options = Array.from(selectRef.current.options);
        options.forEach(opt => {
          opt.selected = opt.value === optionValue;
        });
      }

      setContextMenu({
        visible: true,
        x: clientX,
        y: clientY,
        targetType: 'option',
        targetValue: (target as HTMLOptionElement).value,
      });
    } else {
      setContextMenu({
        visible: true,
        x: clientX,
        y: clientY,
        targetType: 'select',
      });
    }
  };

  const handleMenuClick = (action: string) => {
    if (contextMenu.targetType === 'option') {
      console.log(`${action} параметр: ${contextMenu.targetValue}`);
    } else {
      console.log(`${action} параметр`);
    }

    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const closeMenu = () => setContextMenu(prev => ({ ...prev, visible: false }));

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) closeMenu()
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [contextMenu.visible]);

  return (
    <div onClick={closeMenu} className={"select__container"}>
      <label htmlFor={name}>{title}</label>
      <select
        ref={selectRef}
        id={name}
        name={name}
        multiple
        onContextMenu={handleContextMenu}
      >
        <option value="test">test</option>
        <option value="temp">temperature</option>
        <option value="press">pressure</option>
        {value.map(optionNode => (
          <option key={optionNode.key} value={optionNode.value}>{optionNode.value}</option>
        ))}
      </select>

      {contextMenu.visible && (
        <ul
          style={{
            position: 'absolute',
            top: contextMenu.y,
            left: contextMenu.x,
            background: '#fff',
            border: '1px solid #ccc',
            padding: '4px 0',
            margin: 0,
            listStyle: 'none',
            zIndex: 1000,
            width: 120,
          }}
        >
          {contextMenu.targetType === 'option' ? (
            <>
              <li onClick={() => handleMenuClick('Изменить')} style={menuItemStyle}>Изменить</li>
              <li onClick={() => handleMenuClick('Удалить')} style={menuItemStyle}>Удалить</li>
            </>
          ) : (
            <li onClick={() => handleMenuClick('Добавить')} style={menuItemStyle}>Добавить</li>
          )}
        </ul>
      )}
    </div>
  )
};

export default SelectContextMenu;