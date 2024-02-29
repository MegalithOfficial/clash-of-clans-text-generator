import React, { useState } from 'react';
import { Input, Box } from '@chakra-ui/react';
import { ChromePicker } from 'react-color';

function ColorInput() {
  const [color, setColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleInputChange = (event) => {
    const inputColor = event.target.value;
    // Check if the input color is a valid hex code
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(inputColor)) {
      setColor(inputColor);
    }
  };

  const handleColorPickerChange = (newColor) => {
    setColor(newColor.hex);
  };

  const handleColorBoxClick = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleColorPickerClose = () => {
    setShowColorPicker(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Input
        value={color}
        onChange={handleInputChange}
        maxLength={7} // Maximum length for hex code input
      />
      <Box
        position="absolute"
        top="50%"
        right="10px"
        width="20px"
        height="20px"
        borderRadius="md"
        backgroundColor={color}
        transform="translateY(-50%)"
        cursor="pointer"
        onClick={handleColorBoxClick}
      />
      {showColorPicker && (
        <div style={{ position: 'absolute', zIndex: 999 }}>
          <ChromePicker
            color={color}
            onChange={handleColorPickerChange}
            onChangeComplete={handleColorPickerClose}
          />
        </div>
      )}
    </div>
  );
}

export default ColorInput;
