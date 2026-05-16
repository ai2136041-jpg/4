import * as Blockly from 'blockly';
import 'blockly/blocks';
import * as ar from 'blockly/msg/ar';
import { javascriptGenerator } from 'blockly/javascript';
import { FieldColour } from '@blockly/field-colour';

// تعيين اللغة العربية
Blockly.setLocale(ar as unknown as { [key: string]: string });

// تعريف اللبنات المخصصة
Blockly.Blocks['on_start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("عند البدء 🏁");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setColour(60);
    this.setTooltip("نقطة بداية تشغيل الكود");
  }
};

Blockly.Blocks['move_object_x'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("تحريك الكائن أفقياً بمقدار")
        .appendField(new Blockly.FieldNumber(10), "STEPS");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['move_object_y'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("تحريك الكائن عمودياً بمقدار")
        .appendField(new Blockly.FieldNumber(10), "STEPS");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['turn_degrees'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("استدر ↻")
        .appendField(new Blockly.FieldNumber(15), "DEGREES")
        .appendField("درجة");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['go_to'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("اذهب إلى س:")
        .appendField(new Blockly.FieldNumber(200), "X")
        .appendField("ص:")
        .appendField(new Blockly.FieldNumber(150), "Y");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['say_text'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("قل")
        .appendField(new Blockly.FieldTextInput("مرحباً!"), "TEXT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
  }
};

Blockly.Blocks['point_in_direction'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("اتجه نحو الاتجاه")
        .appendField(new Blockly.FieldNumber(90), "DIRECTION");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['move_steps'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("تحرك")
        .appendField(new Blockly.FieldNumber(10), "STEPS")
        .appendField("خطوة");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['bounce_edge'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ارتد إذا كنت عند الحافة");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['set_x'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("اجعل الموضع س مساوياً")
        .appendField(new Blockly.FieldNumber(0), "X");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['set_y'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("اجعل الموضع ص مساوياً")
        .appendField(new Blockly.FieldNumber(0), "Y");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['change_background'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("تغيير الخلفية إلى")
        .appendField(new FieldColour("#1e293b"), "COLOR");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
  }
};

Blockly.Blocks['set_shape'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("تغيير الشكل إلى")
        .appendField(new Blockly.FieldDropdown([
          ["مربع","square"], 
          ["كرة","⚽"], 
          ["تفاحة","🍎"], 
          ["فضائي","👾"],
          ["سيارة","🚗"],
          ["صاروخ","🚀"],
          ["نجمة","⭐"],
          ["بطل","😎"]
        ]), "SHAPE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
  }
};

Blockly.Blocks['clear_text'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("امسح النص");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
  }
};

Blockly.Blocks['is_key_pressed'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("مفتاح")
        .appendField(new Blockly.FieldDropdown([
          ["السهم الأيمن", "ArrowRight"],
          ["السهم الأيسر", "ArrowLeft"],
          ["السهم العلوي", "ArrowUp"],
          ["السهم السفلي", "ArrowDown"],
          ["المسافة", " "],
          ["الحرف A", "a"],
          ["الحرف D", "d"],
          ["الحرف W", "w"],
          ["الحرف S", "s"]
        ]), "KEY")
        .appendField("مضغوط؟");
    this.setOutput(true, "Boolean");
    this.setColour(190);
  }
};

Blockly.Blocks['get_x'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("الموضع س");
    this.setOutput(true, "Number");
    this.setColour(190);
  }
};

Blockly.Blocks['get_y'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("الموضع ص");
    this.setOutput(true, "Number");
    this.setColour(190);
  }
};

Blockly.Blocks['get_direction'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("الاتجاه");
    this.setOutput(true, "Number");
    this.setColour(190);
  }
};

Blockly.Blocks['show_title_screen'] = {
  init: function() {
    this.appendValueInput("TITLE").setCheck("String").appendField("عرض شاشة، العنوان:");
    this.appendValueInput("SUB").setCheck("String").appendField("الوصف:");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
  }
};

Blockly.Blocks['hide_title_screen'] = {
  init: function() {
    this.appendDummyInput().appendField("إخفاء الشاشة");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
  }
};

Blockly.Blocks['wait_for_click'] = {
  init: function() {
    this.appendDummyInput().appendField("انتظر نقرة الفأرة");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(35);
  }
};

Blockly.Blocks['player_movement_wasd'] = {
  init: function() {
    this.appendValueInput("SPEED").setCheck("Number").appendField("حركة اللاعب (WASD/الأسهم) بسرعة");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['player_movement_ad'] = {
  init: function() {
    this.appendValueInput("SPEED").setCheck("Number").appendField("تحرك يميناً ويساراً (الأسهم/A/D) بسرعة");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['start_car_game_mode'] = {
  init: function() {
    this.appendDummyInput().appendField("ابدأ نمط سباق السيارات");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
  }
};

Blockly.Blocks['spawn_enemy_car'] = {
  init: function() {
    this.appendValueInput("SPEED").setCheck("Number").appendField("أضف سيارة شرطة بسرعة");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['update_car_game_objects'] = {
  init: function() {
    this.appendValueInput("SPEED").setCheck("Number").appendField("حرك الشارع والسيارات للأسفل بسرعة");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['spawn_enemy_car_lane'] = {
  init: function() {
    this.appendValueInput("LANE").setCheck("Number").appendField("أضف سيارة شرطة في مسار");
    this.appendValueInput("SPEED").setCheck("Number").appendField("بسرعة");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['start_undertale_mode'] = {
  init: function() {
    this.appendDummyInput().appendField("ابدأ نمط المواجهة (Undertale)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
  }
};

Blockly.Blocks['spawn_bone_attack'] = {
  init: function() {
    this.appendValueInput("SIDE").setCheck("Number").appendField("أطلق عظمة من جهة (1يغ, 2يم, 3أعلى)");
    this.appendValueInput("SPEED").setCheck("Number").appendField("بسرعة");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['update_undertale_objects'] = {
  init: function() {
    this.appendDummyInput().appendField("تحديث ضربات المواجهة");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};


Blockly.Blocks['get_increasing_speed'] = {
  init: function() {
    this.appendDummyInput().appendField("السرعة المتزايدة مع الوقت");
    this.setOutput(true, "Number");
    this.setColour(230);
  }
};

Blockly.Blocks['point_towards_mouse'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("اتجه نحو الفأرة");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['shoot_bullet'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("أطلق رصاصة (زومبي)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['spawn_enemy'] = {
  init: function() {
    this.appendValueInput("SPEED")
        .setCheck("Number")
        .appendField("توليد زومبي بسرعة");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['update_game_objects'] = {
  init: function() {
    this.appendValueInput("BULLET_SPEED")
        .setCheck("Number")
        .appendField("تحديث اللعبة (حركة الرصاص والزومبي) بسرعة رصاص");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['is_mouse_down'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("هل الفأرة مضغوطة؟");
    this.setOutput(true, "Boolean");
    this.setColour(190);
  }
};

Blockly.Blocks['get_mouse_x'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("موقع الفأرة س");
    this.setOutput(true, "Number");
    this.setColour(190);
  }
};

Blockly.Blocks['get_mouse_y'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("موقع الفأرة ص");
    this.setOutput(true, "Number");
    this.setColour(190);
  }
};

Blockly.Blocks['get_score'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("النقاط");
    this.setOutput(true, "Number");
    this.setColour(330);
  }
};

Blockly.Blocks['get_round'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("الجولة");
    this.setOutput(true, "Number");
    this.setColour(330);
  }
};

Blockly.Blocks['set_round'] = {
  init: function() {
    this.appendValueInput("ROUND")
        .setCheck("Number")
        .appendField("اجعل الجولة");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
  }
};

Blockly.Blocks['get_enemies_count'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("عدد الزومبي");
    this.setOutput(true, "Number");
    this.setColour(330);
  }
};

Blockly.Blocks['set_visible'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["أظهر", "true"], ["أخفِ", "false"]]), "VISIBLE")
        .appendField("الكائن");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
  }
};

Blockly.Blocks['change_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("تغيير اللون إلى")
        .appendField(new FieldColour("#e74c3c"), "COLOR");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
  }
};

Blockly.Blocks['change_size'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("غير الحجم بمقدار")
        .appendField(new Blockly.FieldNumber(10), "SIZE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
  }
};

Blockly.Blocks['wait_secs'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("انتظر")
        .appendField(new Blockly.FieldNumber(1, 0), "SECS")
        .appendField("ثانية");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(35);
  }
};

Blockly.Blocks['custom_repeat'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("كرر")
        .appendField(new Blockly.FieldNumber(10, 1), "TIMES")
        .appendField("مرات");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(35);
  }
};

Blockly.Blocks['forever_loop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("كرر باستمرار");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(35);
  }
};

Blockly.Blocks['define_custom_code_var'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("تهيئة متغير:")
        .appendField(new Blockly.FieldTextInput("x"), "VAR_NAME");
    this.appendDummyInput()
        .appendField("لغة البرمجة:")
        .appendField(new Blockly.FieldDropdown([
          ["JavaScript", "JS"], 
          ["Python", "PYTHON"], 
          ["C++", "CPP"], 
          ["Java", "JAVA"],
          ["C#", "CSHARP"]
        ]), "LANGUAGE");
    this.appendDummyInput()
        .appendField("الكود الخاص به:")
        .appendField(new Blockly.FieldTextInput("0"), "CODE");
    
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip("لبنة تعريف متغير متقدم مع كود برمجي مخصص");
  }
};

Blockly.Blocks['get_custom_code_var'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("قيمة المتغير المخصص:")
        .appendField(new Blockly.FieldTextInput("x"), "VAR_NAME");
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip("الحصول على قيمة المتغير المخصص");
  }
};

// مولد كود الجافاسكربت للبنات
javascriptGenerator.forBlock['on_start'] = function(block: any, generator: any) {
  const statements_do = generator.statementToCode(block, 'DO');
  return statements_do;
};

javascriptGenerator.forBlock['move_object_x'] = function(block: any, generator: any) {
  const number_steps = block.getFieldValue('STEPS');
  return `checkStop(); moveX(${number_steps});\nawait delay(30);\n`;
};

javascriptGenerator.forBlock['move_object_y'] = function(block: any, generator: any) {
  const number_steps = block.getFieldValue('STEPS');
  return `checkStop(); moveY(${number_steps});\nawait delay(30);\n`;
};

javascriptGenerator.forBlock['turn_degrees'] = function(block: any, generator: any) {
  const angle = block.getFieldValue('DEGREES');
  return `checkStop(); turn(${angle});\nawait delay(30);\n`;
};

javascriptGenerator.forBlock['go_to'] = function(block: any, generator: any) {
  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');
  return `checkStop(); setPosition(${x}, ${y});\nawait delay(30);\n`;
};

javascriptGenerator.forBlock['say_text'] = function(block: any, generator: any) {
  const text = block.getFieldValue('TEXT');
  return `checkStop(); say('${text.replace(/'/g, "\\'")}');\nawait delay(30);\n`;
};

javascriptGenerator.forBlock['point_in_direction'] = function(block: any, generator: any) {
  const angle = block.getFieldValue('DIRECTION');
  return `checkStop(); pointDirection(${angle});\nawait delay(30);\n`;
};

javascriptGenerator.forBlock['move_steps'] = function(block: any, generator: any) {
  const steps = block.getFieldValue('STEPS');
  return `checkStop(); moveSteps(${steps});\nawait delay(30);\n`;
};

javascriptGenerator.forBlock['bounce_edge'] = function(block: any, generator: any) {
  return `checkStop(); bounceEdge();\nawait delay(10);\n`;
};

javascriptGenerator.forBlock['set_x'] = function(block: any, generator: any) {
  const x = block.getFieldValue('X');
  return `checkStop(); setPosition(${x}, null);\nawait delay(30);\n`;
};

javascriptGenerator.forBlock['set_y'] = function(block: any, generator: any) {
  const y = block.getFieldValue('Y');
  return `checkStop(); setPosition(null, ${y});\nawait delay(30);\n`;
};

javascriptGenerator.forBlock['change_background'] = function(block: any, generator: any) {
  const color = block.getFieldValue('COLOR');
  return `checkStop(); changeBg('${color}');\nawait delay(30);\n`;
};

javascriptGenerator.forBlock['set_shape'] = function(block: any, generator: any) {
  const shape = block.getFieldValue('SHAPE');
  return `checkStop(); setShape('${shape}');\nawait delay(30);\n`;
};

javascriptGenerator.forBlock['clear_text'] = function(block: any, generator: any) {
  return `checkStop(); say('');\nawait delay(10);\n`;
};

javascriptGenerator.forBlock['is_key_pressed'] = function(block: any, generator: any) {
  const key = block.getFieldValue('KEY');
  return [`isKeyPressed('${key}')`, generator.ORDER_ATOMIC];
};

javascriptGenerator.forBlock['get_x'] = function(block: any, generator: any) {
  return [`getX()`, generator.ORDER_ATOMIC];
};

javascriptGenerator.forBlock['get_y'] = function(block: any, generator: any) {
  return [`getY()`, generator.ORDER_ATOMIC];
};

javascriptGenerator.forBlock['get_direction'] = function(block: any, generator: any) {
  return [`getDir()`, generator.ORDER_ATOMIC];
};

javascriptGenerator.forBlock['show_title_screen'] = function(block: any, generator: any) {
  const title = generator.valueToCode(block, 'TITLE', generator.ORDER_ATOMIC) || "''";
  const sub = generator.valueToCode(block, 'SUB', generator.ORDER_ATOMIC) || "''";
  return `checkStop(); showTitleScreen(${title}, ${sub});\nawait delay(10);\n`;
};

javascriptGenerator.forBlock['hide_title_screen'] = function() {
  return `checkStop(); hideTitleScreen();\nawait delay(10);\n`;
};

javascriptGenerator.forBlock['wait_for_click'] = function() {
  return `checkStop(); await waitForClick();\n`;
};

javascriptGenerator.forBlock['player_movement_wasd'] = function(block: any, generator: any) {
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '5';
  return `checkStop(); handleWasdMovement(${speed});\n`;
};

javascriptGenerator.forBlock['player_movement_ad'] = function(block: any, generator: any) {
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '5';
  return `checkStop(); handleAdMovement(${speed});\n`;
};

javascriptGenerator.forBlock['start_car_game_mode'] = function() {
  return `checkStop(); enableCarGame();\nawait delay(10);\n`;
};

javascriptGenerator.forBlock['spawn_enemy_car'] = function(block: any, generator: any) {
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '5';
  return `checkStop(); spawnEnemyCar(${speed});\nawait delay(10);\n`;
};

javascriptGenerator.forBlock['update_car_game_objects'] = function(block: any, generator: any) {
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '5';
  return `checkStop(); updateCarGameObjects(${speed});\nawait delay(10);\n`;
};

javascriptGenerator.forBlock['spawn_enemy_car_lane'] = function(block: any, generator: any) {
  const lane = generator.valueToCode(block, 'LANE', generator.ORDER_ATOMIC) || '1';
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '5';
  return `checkStop(); spawnEnemyCarLane(${lane}, ${speed});\nawait delay(10);\n`;
};

javascriptGenerator.forBlock['start_undertale_mode'] = function() {
  return `checkStop(); enableUndertaleGame();\nawait delay(10);\n`;
};

javascriptGenerator.forBlock['spawn_bone_attack'] = function(block: any, generator: any) {
  const side = generator.valueToCode(block, 'SIDE', generator.ORDER_ATOMIC) || '1';
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '5';
  return `checkStop(); spawnBoneAttack(${side}, ${speed});\nawait delay(10);\n`;
};

javascriptGenerator.forBlock['update_undertale_objects'] = function() {
  return `checkStop(); updateUndertaleObjects();\nawait delay(10);\n`;
};

javascriptGenerator.forBlock['get_increasing_speed'] = function(block: any, generator: any) {
  return [`getSmoothSpeed()`, generator.ORDER_ATOMIC];
};

javascriptGenerator.forBlock['point_towards_mouse'] = function() {
  return `checkStop(); pointTowardsMouse();\nawait delay(10);\n`;
};

javascriptGenerator.forBlock['shoot_bullet'] = function() {
  return `checkStop(); shootBullet();\nawait delay(50);\n`; // small recoil delay to prevent spam
};

javascriptGenerator.forBlock['spawn_enemy'] = function(block: any, generator: any) {
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '1';
  return `checkStop(); spawnEnemy(${speed});\nawait delay(10);\n`;
};

javascriptGenerator.forBlock['update_game_objects'] = function(block: any, generator: any) {
  const speed = generator.valueToCode(block, 'BULLET_SPEED', generator.ORDER_ATOMIC) || '10';
  return `checkStop(); updateGameObjects(${speed});\nawait delay(10);\n`;
};

javascriptGenerator.forBlock['is_mouse_down'] = function(block: any, generator: any) {
  return [`isMouseDown()`, generator.ORDER_ATOMIC];
};

javascriptGenerator.forBlock['get_mouse_x'] = function(block: any, generator: any) {
  return [`getMouseX()`, generator.ORDER_ATOMIC];
};

javascriptGenerator.forBlock['get_mouse_y'] = function(block: any, generator: any) {
  return [`getMouseY()`, generator.ORDER_ATOMIC];
};

javascriptGenerator.forBlock['get_score'] = function(block: any, generator: any) {
  return [`getScore()`, generator.ORDER_ATOMIC];
};

javascriptGenerator.forBlock['get_round'] = function(block: any, generator: any) {
  return [`getRound()`, generator.ORDER_ATOMIC];
};

javascriptGenerator.forBlock['set_round'] = function(block: any, generator: any) {
  const r = generator.valueToCode(block, 'ROUND', generator.ORDER_ATOMIC) || '1';
  return `checkStop(); setRound(${r});\nawait delay(10);\n`;
};

javascriptGenerator.forBlock['get_enemies_count'] = function(block: any, generator: any) {
  return [`getEnemiesCount()`, generator.ORDER_ATOMIC];
};

javascriptGenerator.forBlock['set_visible'] = function(block: any, generator: any) {
  const visible = block.getFieldValue('VISIBLE');
  return `checkStop(); setVisible(${visible});\nawait delay(30);\n`;
};

javascriptGenerator.forBlock['change_color'] = function(block: any, generator: any) {
  const colour_color = block.getFieldValue('COLOR');
  return `checkStop(); changeColor('${colour_color}');\nawait delay(30);\n`;
};

javascriptGenerator.forBlock['change_size'] = function(block: any, generator: any) {
  const size = block.getFieldValue('SIZE');
  return `checkStop(); changeSize(${size});\nawait delay(30);\n`;
};

javascriptGenerator.forBlock['wait_secs'] = function(block: any, generator: any) {
  const secs = block.getFieldValue('SECS');
  return `checkStop(); await delay(${secs * 1000});\n`;
};

javascriptGenerator.forBlock['custom_repeat'] = function(block: any, generator: any) {
  const repeats = block.getFieldValue('TIMES');
  const branch = generator.statementToCode(block, 'DO');
  return `for (let i = 0; i < ${repeats}; i++) {\ncheckStop();\n${branch}\nawait delay(10);\n}\n`;
};

javascriptGenerator.forBlock['forever_loop'] = function(block: any, generator: any) {
  const branch = generator.statementToCode(block, 'DO');
  return `while(true) {\ncheckStop();\n${branch}\nawait delay(10);\n}\n`;
};

javascriptGenerator.forBlock['define_custom_code_var'] = function(block: any, generator: any) {
  const varName = block.getFieldValue('VAR_NAME');
  const code = block.getFieldValue('CODE');
  return `checkStop(); let ${varName} = ${code};\n`;
};

javascriptGenerator.forBlock['get_custom_code_var'] = function(block: any, generator: any) {
  const varName = block.getFieldValue('VAR_NAME');
  return [`${varName}`, generator.ORDER_ATOMIC];
};

// صندوق الأدوات (Toolbox)
export const toolboxXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="الأحداث" colour="60">
    <block type="on_start"></block>
  </category>
  <category name="الحركة" colour="230">
    <block type="move_steps"></block>
    <block type="turn_degrees"></block>
    <block type="point_in_direction">
      <field name="DIRECTION">90</field>
    </block>
    <block type="point_towards_mouse"></block>
    <block type="go_to"></block>
    <block type="set_x"></block>
    <block type="set_y"></block>
    <block type="move_object_x"></block>
    <block type="move_object_y"></block>
    <block type="bounce_edge"></block>
    <block type="player_movement_wasd">
      <value name="SPEED"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
    </block>
    <block type="player_movement_ad">
      <value name="SPEED"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
    </block>
    <block type="shoot_bullet"></block>
  </category>
  <category name="المظهر" colour="260">
    <block type="say_text"></block>
    <block type="clear_text"></block>
    <block type="change_color"></block>
    <block type="change_size"></block>
    <block type="set_shape"></block>
    <block type="set_visible"></block>
    <block type="change_background"></block>
    <block type="show_title_screen">
      <value name="TITLE"><shadow type="text"><field name="TEXT">العنوان</field></shadow></value>
      <value name="SUB"><shadow type="text"><field name="TEXT">الوصف الصغير</field></shadow></value>
    </block>
    <block type="hide_title_screen"></block>
  </category>
  <category name="التحكم" colour="35">
    <block type="wait_secs"></block>
    <block type="wait_for_click"></block>
    <block type="custom_repeat">
      <field name="TIMES">10</field>
    </block>
    <block type="forever_loop"></block>
    <block type="controls_if"></block>
    <block type="controls_repeat_ext"></block>
    <block type="controls_whileUntil"></block>
  </category>
  <category name="الاستشعار" colour="190">
    <block type="is_key_pressed"></block>
    <block type="is_mouse_down"></block>
    <block type="get_mouse_x"></block>
    <block type="get_mouse_y"></block>
    <block type="get_x"></block>
    <block type="get_y"></block>
    <block type="get_direction"></block>
  </category>
  <category name="المنطق" colour="210">
    <block type="logic_compare"></block>
    <block type="logic_operation"></block>
    <block type="logic_negate"></block>
    <block type="logic_boolean"></block>
  </category>
  <category name="العمليات الرياضية" colour="230">
    <block type="math_number"></block>
    <block type="math_arithmetic"></block>
    <block type="math_single"></block>
    <block type="math_random_int">
      <value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
      <value name="TO"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
    </block>
  </category>
  <category name="النصوص" colour="160">
    <block type="text"></block>
    <block type="text_join"></block>
    <block type="text_length"></block>
  </category>
  <category name="الألعاب (متغيرات للحفظ)" colour="330">
    <block type="start_car_game_mode"></block>
    <block type="start_undertale_mode"></block>
    <block type="spawn_enemy">
      <value name="SPEED"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
    </block>
    <block type="spawn_enemy_car">
      <value name="SPEED"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
    </block>
    <block type="spawn_enemy_car_lane">
      <value name="LANE"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
      <value name="SPEED"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
    </block>
    <block type="spawn_bone_attack">
      <value name="SIDE"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
      <value name="SPEED"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
    </block>
    <block type="update_game_objects">
      <value name="BULLET_SPEED"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
    </block>
    <block type="update_car_game_objects">
      <value name="SPEED"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
    </block>
    <block type="update_undertale_objects"></block>
    <block type="get_score"></block>
    <block type="get_round"></block>
    <block type="set_round">
      <value name="ROUND"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
    </block>
    <block type="get_enemies_count"></block>
    <block type="get_increasing_speed"></block>
  </category>
  <category name="المتغيرات" colour="330" custom="CUSTOM_VARIABLES"></category>
  <category name="الدوال" colour="290" custom="PROCEDURE"></category>
</xml>
`;

// مساحة العمل الافتراضية بمثال
export const defaultWorkspaceXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="on_start" x="50" y="50">
    <statement name="DO">
      <block type="change_background">
        <field name="COLOR">#451a03</field>
        <next>
          <block type="set_shape">
            <field name="SHAPE">😎</field>
            <next>
              <block type="set_round">
                <value name="ROUND">
                  <block type="math_number"><field name="NUM">1</field></block>
                </value>
                <next>
                  <block type="forever_loop">
                    <statement name="DO">
                      <block type="point_towards_mouse">
                        <next>
                          <block type="controls_if">
                            <value name="IF0">
                              <block type="is_mouse_down"></block>
                            </value>
                            <statement name="DO0">
                              <block type="shoot_bullet"></block>
                            </statement>
                            <next>
                              <block type="controls_if">
                                <value name="IF0">
                                  <block type="logic_compare">
                                    <field name="OP">LT</field>
                                    <value name="A">
                                      <block type="get_enemies_count"></block>
                                    </value>
                                    <value name="B">
                                      <block type="math_arithmetic">
                                        <field name="OP">MULTIPLY</field>
                                        <value name="A">
                                          <block type="get_round"></block>
                                        </value>
                                        <value name="B">
                                          <block type="math_number"><field name="NUM">3</field></block>
                                        </value>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                                <statement name="DO0">
                                  <block type="spawn_enemy">
                                    <value name="SPEED">
                                      <block type="math_arithmetic">
                                        <field name="OP">ADD</field>
                                        <value name="A">
                                          <block type="math_number"><field name="NUM">0.5</field></block>
                                        </value>
                                        <value name="B">
                                          <block type="math_arithmetic">
                                            <field name="OP">MULTIPLY</field>
                                            <value name="A">
                                              <block type="get_round"></block>
                                            </value>
                                            <value name="B">
                                              <block type="math_number"><field name="NUM">0.2</field></block>
                                            </value>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                  </block>
                                </statement>
                                <next>
                                  <block type="update_game_objects">
                                    <value name="BULLET_SPEED">
                                      <block type="math_number"><field name="NUM">15</field></block>
                                    </value>
                                    <next>
                                      <block type="controls_if">
                                        <value name="IF0">
                                          <block type="logic_compare">
                                            <field name="OP">GT</field>
                                            <value name="A">
                                              <block type="get_score"></block>
                                            </value>
                                            <value name="B">
                                              <block type="math_arithmetic">
                                                <field name="OP">MULTIPLY</field>
                                                <value name="A">
                                                  <block type="get_round"></block>
                                                </value>
                                                <value name="B">
                                                  <block type="math_number"><field name="NUM">100</field></block>
                                                </value>
                                              </block>
                                            </value>
                                          </block>
                                        </value>
                                        <statement name="DO0">
                                          <block type="set_round">
                                            <value name="ROUND">
                                              <block type="math_arithmetic">
                                                <field name="OP">ADD</field>
                                                <value name="A">
                                                  <block type="get_round"></block>
                                                </value>
                                                <value name="B">
                                                  <block type="math_number"><field name="NUM">1</field></block>
                                                </value>
                                              </block>
                                            </value>
                                          </block>
                                        </statement>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>
`;

