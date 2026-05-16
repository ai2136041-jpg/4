export const templates = [
  {
    id: 'default',
    name: 'لعبة الزومبي',
    icon: '🧟',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="on_start" x="50" y="50">
    <statement name="DO">
      <block type="change_background">
        <field name="COLOR">#1e293b</field>
        <next>
          <block type="set_shape">
            <field name="SHAPE">😎</field>
            <next>
              <block type="show_title_screen">
                <value name="TITLE">
                  <block type="text"><field name="TEXT">مواجهة الزومبي 🧟</field></block>
                </value>
                <value name="SUB">
                  <block type="text"><field name="TEXT">انقر للبدء! استخدم الأسهم للحركة والفأرة للالتفاف وإطلاق النار</field></block>
                </value>
                <next>
                  <block type="wait_for_click">
                    <next>
                      <block type="hide_title_screen">
                        <next>
                          <block type="set_round">
                            <value name="ROUND">
                              <block type="math_number"><field name="NUM">1</field></block>
                            </value>
                            <next>
                              <block type="forever_loop">
                                <statement name="DO">
                                  <block type="player_movement_wasd">
                                    <value name="SPEED">
                                      <block type="math_number"><field name="NUM">4</field></block>
                                    </value>
                                    <next>
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
                                                          <block type="math_number"><field name="NUM">0.8</field></block>
                                                        </value>
                                                        <value name="B">
                                                          <block type="math_arithmetic">
                                                            <field name="OP">MULTIPLY</field>
                                                            <value name="A">
                                                              <block type="get_round"></block>
                                                            </value>
                                                            <value name="B">
                                                              <block type="math_number"><field name="NUM">0.4</field></block>
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
                                                      <block type="math_number"><field name="NUM">18</field></block>
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
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`
  },
  {
    id: 'car_game',
    name: 'لعبة سباق السيارات',
    icon: '🏎️',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="on_start" x="50" y="50">
    <statement name="DO">
      <block type="start_car_game_mode">
        <next>
          <block type="set_y">
            <field name="Y">220</field>
            <next>
              <block type="set_x">
                <field name="X">180</field>
                <next>
                  <block type="show_title_screen">
                    <value name="TITLE">
                      <block type="text"><field name="TEXT">سباق السيارات 🏎️</field></block>
                    </value>
                    <value name="SUB">
                      <block type="text"><field name="TEXT">انقر للبدء! استخدم A و D لتفادي السيارات</field></block>
                    </value>
                    <next>
                      <block type="wait_for_click">
                        <next>
                          <block type="hide_title_screen">
                            <next>
                              <block type="forever_loop">
                                <statement name="DO">
                                  <block type="player_movement_ad">
                                    <value name="SPEED"><block type="math_number"><field name="NUM">6</field></block></value>
                                    <next>
                                      <block type="controls_if">
                                        <value name="IF0">
                                          <block type="logic_compare">
                                            <field name="OP">LT</field>
                                            <value name="A"><block type="get_enemies_count"></block></value>
                                            <value name="B"><block type="math_number"><field name="NUM">3</field></block></value>
                                          </block>
                                        </value>
                                        <statement name="DO0">
                                          <block type="spawn_enemy_car_lane">
                                            <value name="LANE">
                                              <block type="math_random_int">
                                                <value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                                <value name="TO"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
                                              </block>
                                            </value>
                                            <value name="SPEED"><block type="get_increasing_speed"></block></value>
                                          </block>
                                        </statement>
                                        <next>
                                          <block type="update_car_game_objects">
                                            <value name="SPEED"><block type="get_increasing_speed"></block></value>
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
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`
  },
  {
    id: 'bouncing_ball',
    name: 'الكرة النطاطة',
    icon: '⚽',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="on_start" x="50" y="50">
    <statement name="DO">
      <block type="set_shape">
        <field name="SHAPE">⚽</field>
        <next>
          <block type="go_to">
            <field name="X">200</field>
            <field name="Y">200</field>
            <next>
              <block type="point_in_direction">
                <field name="DIRECTION">45</field>
                <next>
                  <block type="forever_loop">
                    <statement name="DO">
                      <block type="move_steps">
                        <field name="STEPS">10</field>
                        <next>
                          <block type="bounce_edge"></block>
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
</xml>`
  },
  {
    id: 'dancing_alien',
    name: 'الرقص في الفضاء',
    icon: '🚀',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="on_start" x="50" y="50">
    <statement name="DO">
      <block type="change_background">
        <field name="COLOR">#0f172a</field>
        <next>
          <block type="set_shape">
            <field name="SHAPE">🚀</field>
            <next>
              <block type="go_to">
                <field name="X">200</field>
                <field name="Y">200</field>
                <next>
                  <block type="custom_repeat">
                    <field name="TIMES">12</field>
                    <statement name="DO">
                      <block type="turn_degrees">
                        <field name="DEGREES">30</field>
                        <next>
                          <block type="change_size">
                            <field name="SIZE">15</field>
                            <next>
                              <block type="wait_secs">
                                <field name="SECS">0.2</field>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </statement>
                    <next>
                      <block type="say_text">
                        <field name="TEXT">وصلنا القمر!</field>
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
</xml>`
  },
  {
    id: 'undertale',
    name: 'لعبة المواجهة',
    icon: '💀',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="on_start" x="50" y="50">
    <statement name="DO">
      <block type="start_undertale_mode">
        <next>
          <block type="show_title_screen">
            <value name="TITLE">
              <block type="text"><field name="TEXT">نمط المواجهة 💀</field></block>
            </value>
            <value name="SUB">
              <block type="text"><field name="TEXT">انقر للبدء! استخدم الأسهم للحركة وحاول البقاء حيا</field></block>
            </value>
            <next>
              <block type="wait_for_click">
                <next>
                  <block type="hide_title_screen">
                    <next>
                      <block type="forever_loop">
                        <statement name="DO">
                          <block type="player_movement_wasd">
                            <value name="SPEED"><block type="math_number"><field name="NUM">4</field></block></value>
                            <next>
                              <block type="controls_if">
                                <value name="IF0">
                                  <block type="logic_compare">
                                    <field name="OP">LT</field>
                                    <value name="A"><block type="get_enemies_count"></block></value>
                                    <value name="B"><block type="math_number"><field name="NUM">5</field></block></value>
                                  </block>
                                </value>
                                <statement name="DO0">
                                  <block type="spawn_bone_attack">
                                    <value name="SIDE">
                                      <block type="math_random_int">
                                        <value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                        <value name="TO"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
                                      </block>
                                    </value>
                                    <value name="SPEED"><block type="get_increasing_speed"></block></value>
                                  </block>
                                </statement>
                                <next>
                                  <block type="update_undertale_objects"></block>
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
        </next>
      </block>
    </statement>
  </block>
</xml>`
  }
];
