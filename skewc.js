(function() {
  var $imul = Math.imul || function(a, b) {
    var ah = a >>> 16, al = a & 65535, bh = b >>> 16, bl = b & 65535;
    return al * bl + (ah * bl + al * bh << 16) | 0;
  };

  function $extends(derived, base) {
    derived.prototype = Object.create(base.prototype);
    derived.prototype.constructor = derived;
  }

  function StringBuilder() {
    this._buffer = '';
  }

  function Box(_0) {
    this.value = _0;
  }

  var math = {};

  var OperatingSystem = {
    ANDROID: 0,
    IOS: 1,
    LINUX: 2,
    OSX: 3,
    UNKNOWN: 4,
    WINDOWS: 5
  };

  var terminal = {};

  terminal.Color = {
    DEFAULT: 0,
    BOLD: 1,
    GRAY: 90,
    RED: 91,
    GREEN: 92,
    MAGENTA: 95
  };

  var unicode = {};

  unicode.Encoding = {
    UTF8: 0,
    UTF16: 1
  };

  unicode.StringIterator = function() {
    this.value = '';
    this.index = 0;
    this.stop = 0;
  };

  unicode.StringIterator.prototype.reset = function(text, start) {
    this.value = text;
    this.index = start;
    this.stop = text.length;
    return this;
  };

  unicode.StringIterator.prototype.countCodePointsUntil = function(stop) {
    var count = 0;

    while (this.index < stop && this.nextCodePoint() >= 0) {
      count = count + 1 | 0;
    }

    return count;
  };

  unicode.StringIterator.prototype.nextCodePoint = function() {
    if (unicode.STRING_ENCODING === unicode.Encoding.UTF8) {
      if (this.index >= this.stop) {
        return -1;
      }

      var a = this.value.charCodeAt(this.index);
      this.index = this.index + 1 | 0;

      if (a < 192) {
        return a;
      }

      if (this.index >= this.stop) {
        return -1;
      }

      var b = this.value.charCodeAt(this.index);
      this.index = this.index + 1 | 0;

      if (a < 224) {
        return (a & 31) << 6 | b & 63;
      }

      if (this.index >= this.stop) {
        return -1;
      }

      var c = this.value.charCodeAt(this.index);
      this.index = this.index + 1 | 0;

      if (a < 240) {
        return (a & 15) << 12 | (b & 63) << 6 | c & 63;
      }

      if (this.index >= this.stop) {
        return -1;
      }

      var d = this.value.charCodeAt(this.index);
      this.index = this.index + 1 | 0;
      return (a & 7) << 18 | (b & 63) << 12 | (c & 63) << 6 | d & 63;
    } else if (unicode.STRING_ENCODING === unicode.Encoding.UTF16) {
      if (this.index >= this.stop) {
        return -1;
      }

      var a = this.value.charCodeAt(this.index);
      this.index = this.index + 1 | 0;

      if (a < 55296) {
        return a;
      }

      if (this.index >= this.stop) {
        return -1;
      }

      var b = this.value.charCodeAt(this.index);
      this.index = this.index + 1 | 0;
      return ((a << 10) + b | 0) + ((65536 - (55296 << 10) | 0) - 56320 | 0) | 0;
    } else {
      if (this.index >= this.stop) {
        return -1;
      }

      var c = this.value.charCodeAt(this.index);
      this.index = this.index + 1 | 0;
      return c;
    }
  };

  var ContentType = {
    BOOL: 0,
    INT: 1,
    DOUBLE: 2,
    STRING: 3
  };

  function Content() {
  }

  Content.equal = function(left, right) {
    if (left === right) {
      return true;
    }

    if (left !== null && right !== null) {
      var type = left.type();

      if (type === right.type()) {
        switch (type) {
        case 0:
          return left.value === right.value;

        case 1:
          return left.value === right.value;

        case 2:
          return left.value === right.value;

        case 3:
          return left.value === right.value;
        }
      }
    }

    return false;
  };

  Content.prototype.asBool = function() {
    if (this.type() !== ContentType.BOOL) {
      throw new Error('assert type() == .BOOL (src/ast/content.sk:28:5)');
    }

    return this.value;
  };

  Content.prototype.asInt = function() {
    if (this.type() !== ContentType.INT) {
      throw new Error('assert type() == .INT (src/ast/content.sk:33:5)');
    }

    return this.value;
  };

  Content.prototype.asDouble = function() {
    if (this.type() !== ContentType.DOUBLE) {
      throw new Error('assert type() == .DOUBLE (src/ast/content.sk:38:5)');
    }

    return this.value;
  };

  Content.prototype.asString = function() {
    if (this.type() !== ContentType.STRING) {
      throw new Error('assert type() == .STRING (src/ast/content.sk:43:5)');
    }

    return this.value;
  };

  function BoolContent(_0) {
    Content.call(this);
    this.value = _0;
  }

  $extends(BoolContent, Content);

  BoolContent.prototype.type = function() {
    return ContentType.BOOL;
  };

  function IntContent(_0) {
    Content.call(this);
    this.value = _0;
  }

  $extends(IntContent, Content);

  IntContent.prototype.type = function() {
    return ContentType.INT;
  };

  function DoubleContent(_0) {
    Content.call(this);
    this.value = _0;
  }

  $extends(DoubleContent, Content);

  DoubleContent.prototype.type = function() {
    return ContentType.DOUBLE;
  };

  function StringContent(_0) {
    Content.call(this);
    this.value = _0;
  }

  $extends(StringContent, Content);

  StringContent.prototype.type = function() {
    return ContentType.STRING;
  };

  function Node(_0) {
    this.range = Range.EMPTY;
    this.parent = null;
    this.sibling = null;
    this.children = null;
    this.type = null;
    this.scope = null;
    this.symbol = null;
    this.content = null;
    this.flags = 0;
    this.kind = _0;
  }

  Node.prototype.isTrue = function() {
    return this.kind === NodeKind.BOOL && this.asBool();
  };

  Node.prototype.isFalse = function() {
    return this.kind === NodeKind.BOOL && !this.asBool();
  };

  Node.prototype.asBool = function() {
    if (this.kind !== NodeKind.BOOL) {
      throw new Error('assert kind == .BOOL (src/ast/content.sk:90:5)');
    }

    return this.content.asBool();
  };

  Node.prototype.asInt = function() {
    if (this.kind !== NodeKind.INT) {
      throw new Error('assert kind == .INT (src/ast/content.sk:95:5)');
    }

    return this.content.asInt();
  };

  Node.prototype.asDouble = function() {
    if (!in_NodeKind.isReal(this.kind)) {
      throw new Error('assert kind.isReal() (src/ast/content.sk:100:5)');
    }

    return this.content.asDouble();
  };

  Node.prototype.asString = function() {
    if (this.kind !== NodeKind.NAME && this.kind !== NodeKind.STRING) {
      throw new Error('assert kind == .NAME || kind == .STRING (src/ast/content.sk:105:5)');
    }

    return this.content.asString();
  };

  Node.createProgram = function(files) {
    if (!checkAllNodeKinds(files, new NodeKindIs(NodeKind.FILE))) {
      throw new Error('assert checkAllNodeKinds(files, NodeKindIs(.FILE)) (src/ast/create.sk:6:5)');
    }

    return new Node(NodeKind.PROGRAM).withChildren(files);
  };

  Node.createFile = function(block) {
    if (block.kind !== NodeKind.BLOCK) {
      throw new Error('assert block.kind == .BLOCK (src/ast/create.sk:11:5)');
    }

    return new Node(NodeKind.FILE).withChildren([block]);
  };

  Node.createBlock = function(statements) {
    return new Node(NodeKind.BLOCK).withChildren(statements);
  };

  Node.createNodeList = function(nodes) {
    return new Node(NodeKind.NODE_LIST).withChildren(nodes);
  };

  Node.createCase = function(values, block) {
    if (!checkAllNodeKinds(values, new NodeKindIsExpression())) {
      throw new Error('assert checkAllNodeKinds(values, NodeKindIsExpression()) (src/ast/create.sk:24:5)');
    }

    if (block.kind !== NodeKind.BLOCK) {
      throw new Error('assert block.kind == .BLOCK (src/ast/create.sk:25:5)');
    }

    return new Node(NodeKind.CASE).withChildren([Node.createNodeList(values), block]);
  };

  Node.createVariableCluster = function(type, variables) {
    if (!in_NodeKind.isExpression(type.kind)) {
      throw new Error('assert type.kind.isExpression() (src/ast/create.sk:30:5)');
    }

    if (!checkAllNodeKinds(variables, new NodeKindIs(NodeKind.VARIABLE))) {
      throw new Error('assert checkAllNodeKinds(variables, NodeKindIs(.VARIABLE)) (src/ast/create.sk:31:5)');
    }

    variables.unshift(type);
    return new Node(NodeKind.VARIABLE_CLUSTER).withChildren(variables);
  };

  Node.createMemberInitializer = function(name, value) {
    if (name.kind !== NodeKind.NAME) {
      throw new Error('assert name.kind == .NAME (src/ast/create.sk:37:5)');
    }

    if (!in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value.kind.isExpression() (src/ast/create.sk:38:5)');
    }

    return new Node(NodeKind.MEMBER_INITIALIZER).withChildren([name, value]);
  };

  Node.createKeyValue = function(key, value) {
    if (!in_NodeKind.isExpression(key.kind)) {
      throw new Error('assert key.kind.isExpression() (src/ast/create.sk:43:5)');
    }

    if (!in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value.kind.isExpression() (src/ast/create.sk:44:5)');
    }

    return new Node(NodeKind.KEY_VALUE).withChildren([key, value]);
  };

  Node.createNamespace = function(name, block) {
    if (name !== null && name.kind !== NodeKind.NAME) {
      throw new Error('assert name == null || name.kind == .NAME (src/ast/create.sk:49:5)');
    }

    if (block.kind !== NodeKind.BLOCK) {
      throw new Error('assert block.kind == .BLOCK (src/ast/create.sk:50:5)');
    }

    return new Node(NodeKind.NAMESPACE).withChildren([name, block]);
  };

  Node.createEnum = function(name, block) {
    if (name.kind !== NodeKind.NAME) {
      throw new Error('assert name.kind == .NAME (src/ast/create.sk:55:5)');
    }

    if (block.kind !== NodeKind.BLOCK) {
      throw new Error('assert block.kind == .BLOCK (src/ast/create.sk:56:5)');
    }

    return new Node(NodeKind.ENUM).withChildren([name, block]);
  };

  Node.createEnumFlags = function(name, block) {
    if (name.kind !== NodeKind.NAME) {
      throw new Error('assert name.kind == .NAME (src/ast/create.sk:61:5)');
    }

    if (block.kind !== NodeKind.BLOCK) {
      throw new Error('assert block.kind == .BLOCK (src/ast/create.sk:62:5)');
    }

    return new Node(NodeKind.ENUM_FLAGS).withChildren([name, block]);
  };

  Node.createObject = function(kind, name, parameters, bases, block) {
    if (!in_NodeKind.isObject(kind)) {
      throw new Error('assert kind.isObject() (src/ast/create.sk:67:5)');
    }

    if (name.kind !== NodeKind.NAME) {
      throw new Error('assert name.kind == .NAME (src/ast/create.sk:68:5)');
    }

    if (parameters !== null && !checkAllNodeListKinds(parameters, new NodeKindIs(NodeKind.PARAMETER))) {
      throw new Error('assert parameters == null || checkAllNodeListKinds(parameters, NodeKindIs(.PARAMETER)) (src/ast/create.sk:69:5)');
    }

    if (bases !== null && !checkAllNodeListKinds(bases, new NodeKindIsExpression())) {
      throw new Error('assert bases == null || checkAllNodeListKinds(bases, NodeKindIsExpression()) (src/ast/create.sk:70:5)');
    }

    if (block.kind !== NodeKind.BLOCK) {
      throw new Error('assert block.kind == .BLOCK (src/ast/create.sk:71:5)');
    }

    return new Node(kind).withChildren([name, block, bases, parameters]);
  };

  Node.createExtension = function(name, bases, block) {
    if (name.kind !== NodeKind.NAME) {
      throw new Error('assert name.kind == .NAME (src/ast/create.sk:84:5)');
    }

    if (bases !== null && !checkAllNodeListKinds(bases, new NodeKindIsExpression())) {
      throw new Error('assert bases == null || checkAllNodeListKinds(bases, NodeKindIsExpression()) (src/ast/create.sk:85:5)');
    }

    if (block.kind !== NodeKind.BLOCK) {
      throw new Error('assert block.kind == .BLOCK (src/ast/create.sk:86:5)');
    }

    return new Node(NodeKind.EXTENSION).withChildren([name, block, bases]);
  };

  Node.createConstructor = function(name, $arguments, block, superInitializer, memberInitializers) {
    if (name.kind !== NodeKind.NAME) {
      throw new Error('assert name.kind == .NAME (src/ast/create.sk:91:5)');
    }

    if (!checkAllNodeListKinds($arguments, new NodeKindIs(NodeKind.VARIABLE))) {
      throw new Error('assert checkAllNodeListKinds(arguments, NodeKindIs(.VARIABLE)) (src/ast/create.sk:92:5)');
    }

    if (block !== null && block.kind !== NodeKind.BLOCK) {
      throw new Error('assert block == null || block.kind == .BLOCK (src/ast/create.sk:93:5)');
    }

    if (superInitializer !== null && superInitializer.kind !== NodeKind.SUPER_CALL) {
      throw new Error('assert superInitializer == null || superInitializer.kind == .SUPER_CALL (src/ast/create.sk:94:5)');
    }

    if (memberInitializers !== null && !checkAllNodeListKinds(memberInitializers, new NodeKindIs(NodeKind.MEMBER_INITIALIZER))) {
      throw new Error('assert memberInitializers == null || checkAllNodeListKinds(memberInitializers, NodeKindIs(.MEMBER_INITIALIZER)) (src/ast/create.sk:95:5)');
    }

    return new Node(NodeKind.CONSTRUCTOR).withChildren([name, $arguments, block, superInitializer, memberInitializers]);
  };

  Node.createFunction = function(name, $arguments, block, result, parameters) {
    if (name.kind !== NodeKind.NAME) {
      throw new Error('assert name.kind == .NAME (src/ast/create.sk:100:5)');
    }

    if (!checkAllNodeListKinds($arguments, new NodeKindIs(NodeKind.VARIABLE))) {
      throw new Error('assert checkAllNodeListKinds(arguments, NodeKindIs(.VARIABLE)) (src/ast/create.sk:101:5)');
    }

    if (block !== null && block.kind !== NodeKind.BLOCK) {
      throw new Error('assert block == null || block.kind == .BLOCK (src/ast/create.sk:102:5)');
    }

    if (!in_NodeKind.isExpression(result.kind)) {
      throw new Error('assert result.kind.isExpression() (src/ast/create.sk:103:5)');
    }

    if (parameters !== null && !checkAllNodeListKinds(parameters, new NodeKindIs(NodeKind.PARAMETER))) {
      throw new Error('assert parameters == null || checkAllNodeListKinds(parameters, NodeKindIs(.PARAMETER)) (src/ast/create.sk:104:5)');
    }

    return new Node(NodeKind.FUNCTION).withChildren([name, $arguments, block, result, parameters]);
  };

  Node.createVariable = function(name, type, value) {
    if (name.kind !== NodeKind.NAME) {
      throw new Error('assert name.kind == .NAME (src/ast/create.sk:109:5)');
    }

    if (type !== null && !in_NodeKind.isExpression(type.kind)) {
      throw new Error('assert type == null || type.kind.isExpression() (src/ast/create.sk:110:5)');
    }

    if (value !== null && !in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value == null || value.kind.isExpression() (src/ast/create.sk:111:5)');
    }

    return new Node(NodeKind.VARIABLE).withChildren([name, type, value]);
  };

  Node.createParameter = function(name, bound) {
    if (name.kind !== NodeKind.NAME) {
      throw new Error('assert name.kind == .NAME (src/ast/create.sk:116:5)');
    }

    if (bound !== null && !in_NodeKind.isExpression(bound.kind)) {
      throw new Error('assert bound == null || bound.kind.isExpression() (src/ast/create.sk:117:5)');
    }

    return new Node(NodeKind.PARAMETER).withChildren([name, bound]);
  };

  Node.createAlias = function(name, value) {
    if (name.kind !== NodeKind.NAME) {
      throw new Error('assert name.kind == .NAME (src/ast/create.sk:122:5)');
    }

    if (!in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value.kind.isExpression() (src/ast/create.sk:123:5)');
    }

    return new Node(NodeKind.ALIAS).withChildren([name, value]);
  };

  Node.createUsing = function(value) {
    if (!in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value.kind.isExpression() (src/ast/create.sk:128:5)');
    }

    return new Node(NodeKind.USING).withChildren([value]);
  };

  Node.createPreprocessorDefine = function(name, value) {
    if (name.kind !== NodeKind.NAME) {
      throw new Error('assert name.kind == .NAME (src/ast/create.sk:133:5)');
    }

    if (!in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value.kind.isExpression() (src/ast/create.sk:134:5)');
    }

    return new Node(NodeKind.PREPROCESSOR_DEFINE).withChildren([name, value]);
  };

  Node.createPreprocessorDiagnostic = function(kind, value) {
    if (kind !== NodeKind.PREPROCESSOR_ERROR && kind !== NodeKind.PREPROCESSOR_WARNING) {
      throw new Error('assert kind == .PREPROCESSOR_ERROR || kind == .PREPROCESSOR_WARNING (src/ast/create.sk:139:5)');
    }

    if (value.kind !== NodeKind.STRING) {
      throw new Error('assert value.kind == .STRING (src/ast/create.sk:140:5)');
    }

    return new Node(kind).withChildren([value]);
  };

  Node.createIf = function(kind, test, trueNode, falseNode) {
    if (kind !== NodeKind.IF && kind !== NodeKind.PREPROCESSOR_IF) {
      throw new Error('assert kind == .IF || kind == .PREPROCESSOR_IF (src/ast/create.sk:145:5)');
    }

    if (!in_NodeKind.isExpression(test.kind)) {
      throw new Error('assert test.kind.isExpression() (src/ast/create.sk:146:5)');
    }

    if (trueNode.kind !== NodeKind.BLOCK) {
      throw new Error('assert trueNode.kind == .BLOCK (src/ast/create.sk:147:5)');
    }

    if (falseNode !== null && falseNode.kind !== NodeKind.BLOCK) {
      throw new Error('assert falseNode == null || falseNode.kind == .BLOCK (src/ast/create.sk:148:5)');
    }

    return new Node(kind).withChildren([test, trueNode, falseNode]);
  };

  Node.createTry = function(tryBlock, catches, finallyBlock) {
    if (tryBlock.kind !== NodeKind.BLOCK) {
      throw new Error('assert tryBlock.kind == .BLOCK (src/ast/create.sk:153:5)');
    }

    if (!checkAllNodeKinds(catches, new NodeKindIs(NodeKind.CATCH))) {
      throw new Error('assert checkAllNodeKinds(catches, NodeKindIs(.CATCH)) (src/ast/create.sk:154:5)');
    }

    return new Node(NodeKind.TRY).withChildren([tryBlock, Node.createNodeList(catches), finallyBlock]);
  };

  Node.createCatch = function(variable, block) {
    if (variable !== null && variable.kind !== NodeKind.VARIABLE) {
      throw new Error('assert variable == null || variable.kind == .VARIABLE (src/ast/create.sk:159:5)');
    }

    if (block.kind !== NodeKind.BLOCK) {
      throw new Error('assert block.kind == .BLOCK (src/ast/create.sk:160:5)');
    }

    return new Node(NodeKind.CATCH).withChildren([variable, block]);
  };

  Node.createFor = function(setup, test, update, block) {
    if (setup !== null && !in_NodeKind.isExpression(setup.kind) && setup.kind !== NodeKind.VARIABLE_CLUSTER) {
      throw new Error('assert setup == null || setup.kind.isExpression() || setup.kind == .VARIABLE_CLUSTER (src/ast/create.sk:165:5)');
    }

    if (test !== null && !in_NodeKind.isExpression(test.kind)) {
      throw new Error('assert test == null || test.kind.isExpression() (src/ast/create.sk:166:5)');
    }

    if (update !== null && !in_NodeKind.isExpression(update.kind)) {
      throw new Error('assert update == null || update.kind.isExpression() (src/ast/create.sk:167:5)');
    }

    if (block.kind !== NodeKind.BLOCK) {
      throw new Error('assert block.kind == .BLOCK (src/ast/create.sk:168:5)');
    }

    return new Node(NodeKind.FOR).withChildren([setup, test, update, block]);
  };

  Node.createForEach = function(variable, value, block) {
    if (variable.kind !== NodeKind.VARIABLE) {
      throw new Error('assert variable.kind == .VARIABLE (src/ast/create.sk:173:5)');
    }

    if (!in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value.kind.isExpression() (src/ast/create.sk:174:5)');
    }

    if (block.kind !== NodeKind.BLOCK) {
      throw new Error('assert block.kind == .BLOCK (src/ast/create.sk:175:5)');
    }

    return new Node(NodeKind.FOR_EACH).withChildren([variable, value, block]);
  };

  Node.createWhile = function(test, block) {
    if (!in_NodeKind.isExpression(test.kind)) {
      throw new Error('assert test.kind.isExpression() (src/ast/create.sk:180:5)');
    }

    if (block.kind !== NodeKind.BLOCK) {
      throw new Error('assert block.kind == .BLOCK (src/ast/create.sk:181:5)');
    }

    return new Node(NodeKind.WHILE).withChildren([test, block]);
  };

  Node.createDoWhile = function(block, test) {
    if (test !== null && !in_NodeKind.isExpression(test.kind)) {
      throw new Error('assert test == null || test.kind.isExpression() (src/ast/create.sk:186:5)');
    }

    if (block.kind !== NodeKind.BLOCK) {
      throw new Error('assert block.kind == .BLOCK (src/ast/create.sk:187:5)');
    }

    return new Node(NodeKind.DO_WHILE).withChildren([test, block]);
  };

  Node.createReturn = function(value) {
    if (value !== null && !in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value == null || value.kind.isExpression() (src/ast/create.sk:192:5)');
    }

    return new Node(NodeKind.RETURN).withChildren([value]);
  };

  Node.createBreak = function() {
    return new Node(NodeKind.BREAK);
  };

  Node.createContinue = function() {
    return new Node(NodeKind.CONTINUE);
  };

  Node.createThrow = function(value) {
    if (!in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value.kind.isExpression() (src/ast/create.sk:205:5)');
    }

    return new Node(NodeKind.THROW).withChildren([value]);
  };

  Node.createAssert = function(kind, value) {
    if (kind !== NodeKind.ASSERT && kind !== NodeKind.ASSERT_CONST) {
      throw new Error('assert kind == .ASSERT || kind == .ASSERT_CONST (src/ast/create.sk:210:5)');
    }

    if (!in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value.kind.isExpression() (src/ast/create.sk:211:5)');
    }

    return new Node(kind).withChildren([value]);
  };

  Node.createExpression = function(value) {
    if (!in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value.kind.isExpression() (src/ast/create.sk:216:5)');
    }

    return new Node(NodeKind.EXPRESSION).withChildren([value]);
  };

  Node.createModifier = function(name, $arguments, statements) {
    if (name.kind !== NodeKind.NAME) {
      throw new Error('assert name.kind == .NAME (src/ast/create.sk:221:5)');
    }

    if ($arguments !== null && !checkAllNodeListKinds($arguments, new NodeKindIsExpression())) {
      throw new Error('assert arguments == null || checkAllNodeListKinds(arguments, NodeKindIsExpression()) (src/ast/create.sk:222:5)');
    }

    if (!checkAllNodeKinds(statements, new NodeKindIsStatement())) {
      throw new Error('assert checkAllNodeKinds(statements, NodeKindIsStatement()) (src/ast/create.sk:223:5)');
    }

    statements.unshift($arguments);
    statements.unshift(name);
    return new Node(NodeKind.MODIFIER).withChildren(statements);
  };

  Node.createSwitch = function(value, cases) {
    if (!in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value.kind.isExpression() (src/ast/create.sk:230:5)');
    }

    if (!checkAllNodeKinds(cases, new NodeKindIs(NodeKind.CASE))) {
      throw new Error('assert checkAllNodeKinds(cases, NodeKindIs(.CASE)) (src/ast/create.sk:231:5)');
    }

    return new Node(NodeKind.SWITCH).withChildren([value, Node.createNodeList(cases)]);
  };

  Node.createName = function(name) {
    return new Node(NodeKind.NAME).withContent(new StringContent(name));
  };

  Node.createType = function(type) {
    if (type === null) {
      throw new Error('assert type != null (src/ast/create.sk:240:5)');
    }

    return new Node(NodeKind.TYPE).withType(type);
  };

  Node.createNull = function() {
    return new Node(NodeKind.NULL);
  };

  Node.createThis = function() {
    return new Node(NodeKind.THIS);
  };

  Node.createHook = function(kind, test, trueNode, falseNode) {
    if (kind !== NodeKind.HOOK && kind !== NodeKind.PREPROCESSOR_HOOK) {
      throw new Error('assert kind == .HOOK || kind == .PREPROCESSOR_HOOK (src/ast/create.sk:253:5)');
    }

    if (!in_NodeKind.isExpression(test.kind)) {
      throw new Error('assert test.kind.isExpression() (src/ast/create.sk:254:5)');
    }

    if (!in_NodeKind.isExpression(trueNode.kind)) {
      throw new Error('assert trueNode.kind.isExpression() (src/ast/create.sk:255:5)');
    }

    if (!in_NodeKind.isExpression(falseNode.kind)) {
      throw new Error('assert falseNode.kind.isExpression() (src/ast/create.sk:256:5)');
    }

    return new Node(kind).withChildren([test, trueNode, falseNode]);
  };

  Node.createPreprocessorSequence = function(test, trueNodes, falseNodes) {
    if (!in_NodeKind.isExpression(test.kind)) {
      throw new Error('assert test.kind.isExpression() (src/ast/create.sk:261:5)');
    }

    if (!checkAllNodeListKinds(trueNodes, new NodeKindIsExpression())) {
      throw new Error('assert checkAllNodeListKinds(trueNodes, NodeKindIsExpression()) (src/ast/create.sk:262:5)');
    }

    if (falseNodes !== null && !checkAllNodeListKinds(falseNodes, new NodeKindIsExpression())) {
      throw new Error('assert falseNodes == null || checkAllNodeListKinds(falseNodes, NodeKindIsExpression()) (src/ast/create.sk:263:5)');
    }

    return new Node(NodeKind.PREPROCESSOR_SEQUENCE).withChildren([test, trueNodes, falseNodes]);
  };

  Node.createBool = function(value) {
    return new Node(NodeKind.BOOL).withContent(new BoolContent(value));
  };

  Node.createInt = function(value) {
    return new Node(NodeKind.INT).withContent(new IntContent(value));
  };

  Node.createFloat = function(value) {
    return new Node(NodeKind.FLOAT).withContent(new DoubleContent(value));
  };

  Node.createDouble = function(value) {
    return new Node(NodeKind.DOUBLE).withContent(new DoubleContent(value));
  };

  Node.createString = function(value) {
    return new Node(NodeKind.STRING).withContent(new StringContent(value));
  };

  Node.createList = function(values) {
    if (!checkAllNodeKinds(values, new NodeKindIsExpression())) {
      throw new Error('assert checkAllNodeKinds(values, NodeKindIsExpression()) (src/ast/create.sk:288:5)');
    }

    return new Node(NodeKind.LIST).withChildren(values);
  };

  Node.createMap = function(items) {
    if (!checkAllNodeKinds(items, new NodeKindIsExpression())) {
      throw new Error('assert checkAllNodeKinds(items, NodeKindIsExpression()) (src/ast/create.sk:293:5)');
    }

    return new Node(NodeKind.MAP).withChildren(items);
  };

  Node.createDot = function(value, name) {
    if (value !== null && !in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value == null || value.kind.isExpression() (src/ast/create.sk:298:5)');
    }

    if (name !== null && name.kind !== NodeKind.NAME) {
      throw new Error('assert name == null || name.kind == .NAME (src/ast/create.sk:299:5)');
    }

    return new Node(NodeKind.DOT).withChildren([value, name]);
  };

  Node.createDotWithKind = function(kind, value, name) {
    if (!in_NodeKind.isDot(kind)) {
      throw new Error('assert kind.isDot() (src/ast/create.sk:304:5)');
    }

    if (value !== null && !in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value == null || value.kind.isExpression() (src/ast/create.sk:305:5)');
    }

    if (name !== null && name.kind !== NodeKind.NAME && name.kind !== NodeKind.STRING) {
      throw new Error('assert name == null || name.kind == .NAME || name.kind == .STRING (src/ast/create.sk:306:5)');
    }

    return new Node(kind).withChildren([value, name]);
  };

  Node.createCall = function(value, $arguments) {
    if (!in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value.kind.isExpression() (src/ast/create.sk:311:5)');
    }

    if (!checkAllNodeKinds($arguments, new NodeKindIsExpression())) {
      throw new Error('assert checkAllNodeKinds(arguments, NodeKindIsExpression()) (src/ast/create.sk:312:5)');
    }

    $arguments.unshift(value);
    return new Node(NodeKind.CALL).withChildren($arguments);
  };

  Node.createSuperCall = function($arguments) {
    if (!checkAllNodeKinds($arguments, new NodeKindIsExpression())) {
      throw new Error('assert checkAllNodeKinds(arguments, NodeKindIsExpression()) (src/ast/create.sk:318:5)');
    }

    return new Node(NodeKind.SUPER_CALL).withChildren($arguments);
  };

  Node.createError = function() {
    return new Node(NodeKind.ERROR);
  };

  Node.createSequence = function(values) {
    if (!checkAllNodeKinds(values, new NodeKindIsExpression())) {
      throw new Error('assert checkAllNodeKinds(values, NodeKindIsExpression()) (src/ast/create.sk:330:5)');
    }

    return new Node(NodeKind.SEQUENCE).withChildren(values);
  };

  Node.createParameterize = function(type, types) {
    if (!in_NodeKind.isExpression(type.kind)) {
      throw new Error('assert type.kind.isExpression() (src/ast/create.sk:335:5)');
    }

    if (!checkAllNodeKinds(types, new NodeKindIsExpression())) {
      throw new Error('assert checkAllNodeKinds(types, NodeKindIsExpression()) (src/ast/create.sk:336:5)');
    }

    types.unshift(type);
    return new Node(NodeKind.PARAMETERIZE).withChildren(types);
  };

  Node.createCast = function(type, value) {
    if (!in_NodeKind.isExpression(type.kind)) {
      throw new Error('assert type.kind.isExpression() (src/ast/create.sk:342:5)');
    }

    if (!in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value.kind.isExpression() (src/ast/create.sk:343:5)');
    }

    return new Node(NodeKind.CAST).withChildren([type, value]);
  };

  Node.createImplicitCast = function(type, value) {
    if (!in_NodeKind.isExpression(type.kind)) {
      throw new Error('assert type.kind.isExpression() (src/ast/create.sk:348:5)');
    }

    if (!in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value.kind.isExpression() (src/ast/create.sk:349:5)');
    }

    return new Node(NodeKind.IMPLICIT_CAST).withChildren([type, value]);
  };

  Node.createQuoted = function(value) {
    if (!in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value.kind.isExpression() (src/ast/create.sk:354:5)');
    }

    return new Node(NodeKind.QUOTED).withChildren([value]);
  };

  Node.createVar = function() {
    return new Node(NodeKind.VAR);
  };

  Node.createAnnotation = function(name, $arguments) {
    if (name.kind !== NodeKind.NAME) {
      throw new Error('assert name.kind == .NAME (src/ast/create.sk:363:5)');
    }

    if ($arguments !== null && !checkAllNodeListKinds($arguments, new NodeKindIsExpression())) {
      throw new Error('assert arguments == null || checkAllNodeListKinds(arguments, NodeKindIsExpression()) (src/ast/create.sk:364:5)');
    }

    return new Node(NodeKind.ANNOTATION).withChildren([name, $arguments]);
  };

  Node.createUnary = function(kind, value) {
    if (!in_NodeKind.isUnaryOperator(kind)) {
      throw new Error('assert kind.isUnaryOperator() (src/ast/create.sk:369:5)');
    }

    if (!in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value.kind.isExpression() (src/ast/create.sk:370:5)');
    }

    return new Node(kind).withChildren([value]);
  };

  Node.createBinary = function(kind, left, right) {
    if (!in_NodeKind.isBinaryOperator(kind)) {
      throw new Error('assert kind.isBinaryOperator() (src/ast/create.sk:379:5)');
    }

    if (!in_NodeKind.isExpression(left.kind)) {
      throw new Error('assert left.kind.isExpression() (src/ast/create.sk:380:5)');
    }

    if (!in_NodeKind.isExpression(right.kind)) {
      throw new Error('assert right.kind.isExpression() (src/ast/create.sk:381:5)');
    }

    if (kind === NodeKind.ASSIGN && left.kind === NodeKind.INDEX) {
      var target = left.binaryLeft();
      var index = left.binaryRight();
      return Node.createTernary(NodeKind.ASSIGN_INDEX, target.remove(), index.remove(), right);
    }

    return new Node(kind).withChildren([left, right]);
  };

  Node.createTernary = function(kind, left, middle, right) {
    if (!in_NodeKind.isTernaryOperator(kind)) {
      throw new Error('assert kind.isTernaryOperator() (src/ast/create.sk:394:5)');
    }

    if (!in_NodeKind.isExpression(left.kind)) {
      throw new Error('assert left.kind.isExpression() (src/ast/create.sk:395:5)');
    }

    if (!in_NodeKind.isExpression(middle.kind)) {
      throw new Error('assert middle.kind.isExpression() (src/ast/create.sk:396:5)');
    }

    if (!in_NodeKind.isExpression(right.kind)) {
      throw new Error('assert right.kind.isExpression() (src/ast/create.sk:397:5)');
    }

    return new Node(kind).withChildren([left, middle, right]);
  };

  Node.prototype.blockStatements = function() {
    if (this.kind !== NodeKind.BLOCK) {
      throw new Error('assert kind == .BLOCK (src/ast/get.sk:6:5)');
    }

    if (this.children === null) {
      throw new Error('assert children != null (src/ast/get.sk:7:5)');
    }

    return this.children;
  };

  Node.prototype.blockStatement = function() {
    if (this.kind !== NodeKind.BLOCK) {
      throw new Error('assert kind == .BLOCK (src/ast/get.sk:12:5)');
    }

    if (this.children === null) {
      throw new Error('assert children != null (src/ast/get.sk:13:5)');
    }

    return this.children.length === 1 ? this.children[0] : null;
  };

  Node.prototype.fileBlock = function() {
    if (this.kind !== NodeKind.FILE) {
      throw new Error('assert kind == .FILE (src/ast/get.sk:18:5)');
    }

    if (this.children.length !== 1) {
      throw new Error('assert children.size() == 1 (src/ast/get.sk:19:5)');
    }

    return this.children[0];
  };

  Node.prototype.dotTarget = function() {
    if (!in_NodeKind.isDot(this.kind)) {
      throw new Error('assert kind.isDot() (src/ast/get.sk:24:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:25:5)');
    }

    return this.children[0];
  };

  Node.prototype.dotName = function() {
    if (!in_NodeKind.isDot(this.kind)) {
      throw new Error('assert kind.isDot() (src/ast/get.sk:30:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:31:5)');
    }

    if (this.children[1] !== null && this.children[1].kind !== NodeKind.NAME && this.children[1].kind !== NodeKind.STRING) {
      throw new Error('assert children[1] == null || children[1].kind == .NAME || children[1].kind == .STRING (src/ast/get.sk:32:5)');
    }

    return this.children[1];
  };

  Node.prototype.unaryValue = function() {
    if (!in_NodeKind.isUnaryOperator(this.kind)) {
      throw new Error('assert kind.isUnaryOperator() (src/ast/get.sk:37:5)');
    }

    if (this.children.length !== 1) {
      throw new Error('assert children.size() == 1 (src/ast/get.sk:38:5)');
    }

    return this.children[0];
  };

  Node.prototype.binaryLeft = function() {
    if (!in_NodeKind.isBinaryOperator(this.kind)) {
      throw new Error('assert kind.isBinaryOperator() (src/ast/get.sk:43:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:44:5)');
    }

    return this.children[0];
  };

  Node.prototype.binaryRight = function() {
    if (!in_NodeKind.isBinaryOperator(this.kind)) {
      throw new Error('assert kind.isBinaryOperator() (src/ast/get.sk:49:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:50:5)');
    }

    return this.children[1];
  };

  Node.prototype.ternaryLeft = function() {
    if (!in_NodeKind.isTernaryOperator(this.kind)) {
      throw new Error('assert kind.isTernaryOperator() (src/ast/get.sk:55:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:56:5)');
    }

    return this.children[0];
  };

  Node.prototype.ternaryMiddle = function() {
    if (!in_NodeKind.isTernaryOperator(this.kind)) {
      throw new Error('assert kind.isTernaryOperator() (src/ast/get.sk:61:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:62:5)');
    }

    return this.children[1];
  };

  Node.prototype.ternaryRight = function() {
    if (!in_NodeKind.isTernaryOperator(this.kind)) {
      throw new Error('assert kind.isTernaryOperator() (src/ast/get.sk:67:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:68:5)');
    }

    return this.children[2];
  };

  Node.prototype.hookTest = function() {
    if (this.kind !== NodeKind.HOOK && this.kind !== NodeKind.PREPROCESSOR_HOOK) {
      throw new Error('assert kind == .HOOK || kind == .PREPROCESSOR_HOOK (src/ast/get.sk:73:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:74:5)');
    }

    return this.children[0];
  };

  Node.prototype.hookTrue = function() {
    if (this.kind !== NodeKind.HOOK && this.kind !== NodeKind.PREPROCESSOR_HOOK) {
      throw new Error('assert kind == .HOOK || kind == .PREPROCESSOR_HOOK (src/ast/get.sk:79:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:80:5)');
    }

    return this.children[1];
  };

  Node.prototype.hookFalse = function() {
    if (this.kind !== NodeKind.HOOK && this.kind !== NodeKind.PREPROCESSOR_HOOK) {
      throw new Error('assert kind == .HOOK || kind == .PREPROCESSOR_HOOK (src/ast/get.sk:85:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:86:5)');
    }

    return this.children[2];
  };

  Node.prototype.declarationName = function() {
    if (!in_NodeKind.isNamedDeclaration(this.kind)) {
      throw new Error('assert kind.isNamedDeclaration() (src/ast/get.sk:91:5)');
    }

    if (this.children.length < 1) {
      throw new Error('assert children.size() >= 1 (src/ast/get.sk:92:5)');
    }

    if (this.children[0] !== null && this.children[0].kind !== NodeKind.NAME) {
      throw new Error('assert children[0] == null || children[0].kind == .NAME (src/ast/get.sk:93:5)');
    }

    return this.children[0];
  };

  Node.prototype.declarationBlock = function() {
    if (!in_NodeKind.isNamedBlockDeclaration(this.kind)) {
      throw new Error('assert kind.isNamedBlockDeclaration() (src/ast/get.sk:98:5)');
    }

    if (this.children.length < 2) {
      throw new Error('assert children.size() >= 2 (src/ast/get.sk:99:5)');
    }

    if (this.children[1].kind !== NodeKind.BLOCK) {
      throw new Error('assert children[1].kind == .BLOCK (src/ast/get.sk:100:5)');
    }

    return this.children[1];
  };

  Node.prototype.clusterType = function() {
    if (this.kind !== NodeKind.VARIABLE_CLUSTER) {
      throw new Error('assert kind == .VARIABLE_CLUSTER (src/ast/get.sk:105:5)');
    }

    if (this.children.length < 1) {
      throw new Error('assert children.size() >= 1 (src/ast/get.sk:106:5)');
    }

    return this.children[0];
  };

  Node.prototype.clusterVariables = function() {
    if (this.kind !== NodeKind.VARIABLE_CLUSTER) {
      throw new Error('assert kind == .VARIABLE_CLUSTER (src/ast/get.sk:111:5)');
    }

    if (this.children.length < 1) {
      throw new Error('assert children.size() >= 1 (src/ast/get.sk:112:5)');
    }

    return this.children.slice(1, this.children.length);
  };

  Node.prototype.variableType = function() {
    if (this.kind !== NodeKind.VARIABLE) {
      throw new Error('assert kind == .VARIABLE (src/ast/get.sk:117:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:118:5)');
    }

    return this.children[1];
  };

  Node.prototype.variableValue = function() {
    if (this.kind !== NodeKind.VARIABLE) {
      throw new Error('assert kind == .VARIABLE (src/ast/get.sk:123:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:124:5)');
    }

    return this.children[2];
  };

  Node.prototype.aliasValue = function() {
    if (this.kind !== NodeKind.ALIAS) {
      throw new Error('assert kind == .ALIAS (src/ast/get.sk:129:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:130:5)');
    }

    return this.children[1];
  };

  Node.prototype.usingValue = function() {
    if (this.kind !== NodeKind.USING) {
      throw new Error('assert kind == .USING (src/ast/get.sk:135:5)');
    }

    if (this.children.length !== 1) {
      throw new Error('assert children.size() == 1 (src/ast/get.sk:136:5)');
    }

    return this.children[0];
  };

  Node.prototype.defineValue = function() {
    if (this.kind !== NodeKind.PREPROCESSOR_DEFINE) {
      throw new Error('assert kind == .PREPROCESSOR_DEFINE (src/ast/get.sk:141:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:142:5)');
    }

    return this.children[1];
  };

  Node.prototype.diagnosticValue = function() {
    if (this.kind !== NodeKind.PREPROCESSOR_WARNING && this.kind !== NodeKind.PREPROCESSOR_ERROR) {
      throw new Error('assert kind == .PREPROCESSOR_WARNING || kind == .PREPROCESSOR_ERROR (src/ast/get.sk:147:5)');
    }

    if (this.children.length !== 1) {
      throw new Error('assert children.size() == 1 (src/ast/get.sk:148:5)');
    }

    return this.children[0];
  };

  Node.prototype.modifierName = function() {
    if (this.kind !== NodeKind.MODIFIER) {
      throw new Error('assert kind == .MODIFIER (src/ast/get.sk:153:5)');
    }

    if (this.children.length < 2) {
      throw new Error('assert children.size() >= 2 (src/ast/get.sk:154:5)');
    }

    if (this.children[0].kind !== NodeKind.NAME) {
      throw new Error('assert children[0].kind == .NAME (src/ast/get.sk:155:5)');
    }

    return this.children[0];
  };

  Node.prototype.modifierArguments = function() {
    if (this.kind !== NodeKind.MODIFIER) {
      throw new Error('assert kind == .MODIFIER (src/ast/get.sk:160:5)');
    }

    if (this.children.length < 2) {
      throw new Error('assert children.size() >= 2 (src/ast/get.sk:161:5)');
    }

    if (this.children[1] !== null && this.children[1].kind !== NodeKind.NODE_LIST) {
      throw new Error('assert children[1] == null || children[1].kind == .NODE_LIST (src/ast/get.sk:162:5)');
    }

    return this.children[1];
  };

  Node.prototype.annotationName = function() {
    if (this.kind !== NodeKind.MODIFIER && this.kind !== NodeKind.ANNOTATION) {
      throw new Error('assert kind == .MODIFIER || kind == .ANNOTATION (src/ast/get.sk:167:5)');
    }

    if (this.children.length < 2) {
      throw new Error('assert children.size() >= 2 (src/ast/get.sk:168:5)');
    }

    if (this.children[0].kind !== NodeKind.NAME) {
      throw new Error('assert children[0].kind == .NAME (src/ast/get.sk:169:5)');
    }

    return this.children[0];
  };

  Node.prototype.annotationArguments = function() {
    if (this.kind !== NodeKind.MODIFIER && this.kind !== NodeKind.ANNOTATION) {
      throw new Error('assert kind == .MODIFIER || kind == .ANNOTATION (src/ast/get.sk:174:5)');
    }

    if (this.children.length < 2) {
      throw new Error('assert children.size() >= 2 (src/ast/get.sk:175:5)');
    }

    if (this.children[1] !== null && this.children[1].kind !== NodeKind.NODE_LIST) {
      throw new Error('assert children[1] == null || children[1].kind == .NODE_LIST (src/ast/get.sk:176:5)');
    }

    return this.children[1];
  };

  Node.prototype.modifierStatements = function() {
    if (this.kind !== NodeKind.MODIFIER) {
      throw new Error('assert kind == .MODIFIER (src/ast/get.sk:181:5)');
    }

    if (this.children.length < 2) {
      throw new Error('assert children.size() >= 2 (src/ast/get.sk:182:5)');
    }

    return this.children.slice(2, this.children.length);
  };

  Node.prototype.sequenceValues = function() {
    if (this.kind !== NodeKind.SEQUENCE) {
      throw new Error('assert kind == .SEQUENCE (src/ast/get.sk:187:5)');
    }

    if (this.children === null) {
      throw new Error('assert children != null (src/ast/get.sk:188:5)');
    }

    return this.children;
  };

  Node.prototype.sequenceTest = function() {
    if (this.kind !== NodeKind.PREPROCESSOR_SEQUENCE) {
      throw new Error('assert kind == .PREPROCESSOR_SEQUENCE (src/ast/get.sk:193:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:194:5)');
    }

    return this.children[0];
  };

  Node.prototype.sequenceTrue = function() {
    if (this.kind !== NodeKind.PREPROCESSOR_SEQUENCE) {
      throw new Error('assert kind == .PREPROCESSOR_SEQUENCE (src/ast/get.sk:199:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:200:5)');
    }

    return this.children[1];
  };

  Node.prototype.sequenceFalse = function() {
    if (this.kind !== NodeKind.PREPROCESSOR_SEQUENCE) {
      throw new Error('assert kind == .PREPROCESSOR_SEQUENCE (src/ast/get.sk:205:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:206:5)');
    }

    return this.children[2];
  };

  Node.prototype.castType = function() {
    if (!in_NodeKind.isCast(this.kind)) {
      throw new Error('assert kind.isCast() (src/ast/get.sk:211:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:212:5)');
    }

    return this.children[0];
  };

  Node.prototype.castValue = function() {
    if (!in_NodeKind.isCast(this.kind)) {
      throw new Error('assert kind.isCast() (src/ast/get.sk:217:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:218:5)');
    }

    return this.children[1];
  };

  Node.prototype.expressionValue = function() {
    if (this.kind !== NodeKind.EXPRESSION) {
      throw new Error('assert kind == .EXPRESSION (src/ast/get.sk:223:5)');
    }

    if (this.children.length !== 1) {
      throw new Error('assert children.size() == 1 (src/ast/get.sk:224:5)');
    }

    return this.children[0];
  };

  Node.prototype.ifTest = function() {
    if (this.kind !== NodeKind.IF && this.kind !== NodeKind.PREPROCESSOR_IF) {
      throw new Error('assert kind == .IF || kind == .PREPROCESSOR_IF (src/ast/get.sk:229:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:230:5)');
    }

    return this.children[0];
  };

  Node.prototype.ifTrue = function() {
    if (this.kind !== NodeKind.IF && this.kind !== NodeKind.PREPROCESSOR_IF) {
      throw new Error('assert kind == .IF || kind == .PREPROCESSOR_IF (src/ast/get.sk:235:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:236:5)');
    }

    return this.children[1];
  };

  Node.prototype.ifFalse = function() {
    if (this.kind !== NodeKind.IF && this.kind !== NodeKind.PREPROCESSOR_IF) {
      throw new Error('assert kind == .IF || kind == .PREPROCESSOR_IF (src/ast/get.sk:241:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:242:5)');
    }

    return this.children[2];
  };

  Node.prototype.tryBlock = function() {
    if (this.kind !== NodeKind.TRY) {
      throw new Error('assert kind == .TRY (src/ast/get.sk:247:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:248:5)');
    }

    if (this.children[0].kind !== NodeKind.BLOCK) {
      throw new Error('assert children[0].kind == .BLOCK (src/ast/get.sk:249:5)');
    }

    return this.children[0];
  };

  Node.prototype.catches = function() {
    if (this.kind !== NodeKind.TRY) {
      throw new Error('assert kind == .TRY (src/ast/get.sk:254:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:255:5)');
    }

    if (this.children[1].kind !== NodeKind.NODE_LIST) {
      throw new Error('assert children[1].kind == .NODE_LIST (src/ast/get.sk:256:5)');
    }

    return this.children[1].children;
  };

  Node.prototype.finallyBlock = function() {
    if (this.kind !== NodeKind.TRY) {
      throw new Error('assert kind == .TRY (src/ast/get.sk:261:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:262:5)');
    }

    if (this.children[2] !== null && this.children[2].kind !== NodeKind.BLOCK) {
      throw new Error('assert children[2] == null || children[2].kind == .BLOCK (src/ast/get.sk:263:5)');
    }

    return this.children[2];
  };

  Node.prototype.catchVariable = function() {
    if (this.kind !== NodeKind.CATCH) {
      throw new Error('assert kind == .CATCH (src/ast/get.sk:268:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:269:5)');
    }

    if (this.children[0] !== null && this.children[0].kind !== NodeKind.VARIABLE) {
      throw new Error('assert children[0] == null || children[0].kind == .VARIABLE (src/ast/get.sk:270:5)');
    }

    return this.children[0];
  };

  Node.prototype.catchBlock = function() {
    if (this.kind !== NodeKind.CATCH) {
      throw new Error('assert kind == .CATCH (src/ast/get.sk:275:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:276:5)');
    }

    if (this.children[1].kind !== NodeKind.BLOCK) {
      throw new Error('assert children[1].kind == .BLOCK (src/ast/get.sk:277:5)');
    }

    return this.children[1];
  };

  Node.prototype.forSetup = function() {
    if (this.kind !== NodeKind.FOR) {
      throw new Error('assert kind == .FOR (src/ast/get.sk:282:5)');
    }

    if (this.children.length !== 4) {
      throw new Error('assert children.size() == 4 (src/ast/get.sk:283:5)');
    }

    return this.children[0];
  };

  Node.prototype.forTest = function() {
    if (this.kind !== NodeKind.FOR) {
      throw new Error('assert kind == .FOR (src/ast/get.sk:288:5)');
    }

    if (this.children.length !== 4) {
      throw new Error('assert children.size() == 4 (src/ast/get.sk:289:5)');
    }

    return this.children[1];
  };

  Node.prototype.forUpdate = function() {
    if (this.kind !== NodeKind.FOR) {
      throw new Error('assert kind == .FOR (src/ast/get.sk:294:5)');
    }

    if (this.children.length !== 4) {
      throw new Error('assert children.size() == 4 (src/ast/get.sk:295:5)');
    }

    return this.children[2];
  };

  Node.prototype.forBlock = function() {
    if (this.kind !== NodeKind.FOR) {
      throw new Error('assert kind == .FOR (src/ast/get.sk:300:5)');
    }

    if (this.children.length !== 4) {
      throw new Error('assert children.size() == 4 (src/ast/get.sk:301:5)');
    }

    if (this.children[3].kind !== NodeKind.BLOCK) {
      throw new Error('assert children[3].kind == .BLOCK (src/ast/get.sk:302:5)');
    }

    return this.children[3];
  };

  Node.prototype.forEachVariable = function() {
    if (this.kind !== NodeKind.FOR_EACH) {
      throw new Error('assert kind == .FOR_EACH (src/ast/get.sk:307:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:308:5)');
    }

    if (this.children[0].kind !== NodeKind.VARIABLE) {
      throw new Error('assert children[0].kind == .VARIABLE (src/ast/get.sk:309:5)');
    }

    return this.children[0];
  };

  Node.prototype.forEachValue = function() {
    if (this.kind !== NodeKind.FOR_EACH) {
      throw new Error('assert kind == .FOR_EACH (src/ast/get.sk:314:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:315:5)');
    }

    return this.children[1];
  };

  Node.prototype.forEachBlock = function() {
    if (this.kind !== NodeKind.FOR_EACH) {
      throw new Error('assert kind == .FOR_EACH (src/ast/get.sk:320:5)');
    }

    if (this.children.length !== 3) {
      throw new Error('assert children.size() == 3 (src/ast/get.sk:321:5)');
    }

    if (this.children[2].kind !== NodeKind.BLOCK) {
      throw new Error('assert children[2].kind == .BLOCK (src/ast/get.sk:322:5)');
    }

    return this.children[2];
  };

  Node.prototype.whileTest = function() {
    if (this.kind !== NodeKind.WHILE && this.kind !== NodeKind.DO_WHILE) {
      throw new Error('assert kind == .WHILE || kind == .DO_WHILE (src/ast/get.sk:327:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:328:5)');
    }

    return this.children[0];
  };

  Node.prototype.whileBlock = function() {
    if (this.kind !== NodeKind.WHILE && this.kind !== NodeKind.DO_WHILE) {
      throw new Error('assert kind == .WHILE || kind == .DO_WHILE (src/ast/get.sk:333:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:334:5)');
    }

    if (this.children[1].kind !== NodeKind.BLOCK) {
      throw new Error('assert children[1].kind == .BLOCK (src/ast/get.sk:335:5)');
    }

    return this.children[1];
  };

  Node.prototype.quotedValue = function() {
    if (this.kind !== NodeKind.QUOTED) {
      throw new Error('assert kind == .QUOTED (src/ast/get.sk:340:5)');
    }

    if (this.children.length !== 1) {
      throw new Error('assert children.size() == 1 (src/ast/get.sk:341:5)');
    }

    return this.children[0];
  };

  Node.prototype.baseTypes = function() {
    if (!in_NodeKind.isObject(this.kind) && this.kind !== NodeKind.EXTENSION) {
      throw new Error('assert kind.isObject() || kind == .EXTENSION (src/ast/get.sk:346:5)');
    }

    if (this.children.length < 3) {
      throw new Error('assert children.size() >= 3 (src/ast/get.sk:347:5)');
    }

    if (this.children[2] !== null && this.children[2].kind !== NodeKind.NODE_LIST) {
      throw new Error('assert children[2] == null || children[2].kind == .NODE_LIST (src/ast/get.sk:348:5)');
    }

    return this.children[2];
  };

  Node.prototype.objectParameters = function() {
    if (!in_NodeKind.isObject(this.kind)) {
      throw new Error('assert kind.isObject() (src/ast/get.sk:353:5)');
    }

    if (this.children.length !== 4) {
      throw new Error('assert children.size() == 4 (src/ast/get.sk:354:5)');
    }

    if (this.children[3] !== null && this.children[3].kind !== NodeKind.NODE_LIST) {
      throw new Error('assert children[3] == null || children[3].kind == .NODE_LIST (src/ast/get.sk:355:5)');
    }

    return this.children[3];
  };

  Node.prototype.functionArguments = function() {
    if (!in_NodeKind.isFunction(this.kind)) {
      throw new Error('assert kind.isFunction() (src/ast/get.sk:360:5)');
    }

    if (this.children.length !== 5) {
      throw new Error('assert children.size() == 5 (src/ast/get.sk:361:5)');
    }

    if (this.children[1].kind !== NodeKind.NODE_LIST) {
      throw new Error('assert children[1].kind == .NODE_LIST (src/ast/get.sk:362:5)');
    }

    return this.children[1];
  };

  Node.prototype.functionBlock = function() {
    if (!in_NodeKind.isFunction(this.kind)) {
      throw new Error('assert kind.isFunction() (src/ast/get.sk:367:5)');
    }

    if (this.children.length !== 5) {
      throw new Error('assert children.size() == 5 (src/ast/get.sk:368:5)');
    }

    if (this.children[2] !== null && this.children[2].kind !== NodeKind.BLOCK) {
      throw new Error('assert children[2] == null || children[2].kind == .BLOCK (src/ast/get.sk:369:5)');
    }

    return this.children[2];
  };

  Node.prototype.functionResult = function() {
    if (this.kind !== NodeKind.FUNCTION) {
      throw new Error('assert kind == .FUNCTION (src/ast/get.sk:374:5)');
    }

    if (this.children.length !== 5) {
      throw new Error('assert children.size() == 5 (src/ast/get.sk:375:5)');
    }

    return this.children[3];
  };

  Node.prototype.functionParameters = function() {
    if (this.kind !== NodeKind.FUNCTION) {
      throw new Error('assert kind == .FUNCTION (src/ast/get.sk:380:5)');
    }

    if (this.children.length !== 5) {
      throw new Error('assert children.size() == 5 (src/ast/get.sk:381:5)');
    }

    return this.children[4];
  };

  Node.prototype.superInitializer = function() {
    if (this.kind !== NodeKind.CONSTRUCTOR) {
      throw new Error('assert kind == .CONSTRUCTOR (src/ast/get.sk:386:5)');
    }

    if (this.children.length !== 5) {
      throw new Error('assert children.size() == 5 (src/ast/get.sk:387:5)');
    }

    return this.children[3];
  };

  Node.prototype.memberInitializers = function() {
    if (this.kind !== NodeKind.CONSTRUCTOR) {
      throw new Error('assert kind == .CONSTRUCTOR (src/ast/get.sk:392:5)');
    }

    if (this.children.length !== 5) {
      throw new Error('assert children.size() == 5 (src/ast/get.sk:393:5)');
    }

    return this.children[4];
  };

  Node.prototype.memberInitializerName = function() {
    if (this.kind !== NodeKind.MEMBER_INITIALIZER) {
      throw new Error('assert kind == .MEMBER_INITIALIZER (src/ast/get.sk:398:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:399:5)');
    }

    return this.children[0];
  };

  Node.prototype.memberInitializerValue = function() {
    if (this.kind !== NodeKind.MEMBER_INITIALIZER) {
      throw new Error('assert kind == .MEMBER_INITIALIZER (src/ast/get.sk:404:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:405:5)');
    }

    return this.children[1];
  };

  Node.prototype.throwValue = function() {
    if (this.kind !== NodeKind.THROW) {
      throw new Error('assert kind == .THROW (src/ast/get.sk:410:5)');
    }

    if (this.children.length !== 1) {
      throw new Error('assert children.size() == 1 (src/ast/get.sk:411:5)');
    }

    return this.children[0];
  };

  Node.prototype.assertValue = function() {
    if (!in_NodeKind.isAssert(this.kind)) {
      throw new Error('assert kind.isAssert() (src/ast/get.sk:416:5)');
    }

    if (this.children.length !== 1) {
      throw new Error('assert children.size() == 1 (src/ast/get.sk:417:5)');
    }

    return this.children[0];
  };

  Node.prototype.parameterizeValue = function() {
    if (this.kind !== NodeKind.PARAMETERIZE) {
      throw new Error('assert kind == .PARAMETERIZE (src/ast/get.sk:422:5)');
    }

    if (this.children.length < 1) {
      throw new Error('assert children.size() >= 1 (src/ast/get.sk:423:5)');
    }

    return this.children[0];
  };

  Node.prototype.parameterizeTypes = function() {
    if (this.kind !== NodeKind.PARAMETERIZE) {
      throw new Error('assert kind == .PARAMETERIZE (src/ast/get.sk:428:5)');
    }

    if (this.children.length < 1) {
      throw new Error('assert children.size() >= 1 (src/ast/get.sk:429:5)');
    }

    return this.children.slice(1, this.children.length);
  };

  Node.prototype.callValue = function() {
    if (this.kind !== NodeKind.CALL) {
      throw new Error('assert kind == .CALL (src/ast/get.sk:434:5)');
    }

    if (this.children.length < 1) {
      throw new Error('assert children.size() >= 1 (src/ast/get.sk:435:5)');
    }

    return this.children[0];
  };

  Node.prototype.callArguments = function() {
    if (this.kind !== NodeKind.CALL) {
      throw new Error('assert kind == .CALL (src/ast/get.sk:440:5)');
    }

    if (this.children.length < 1) {
      throw new Error('assert children.size() >= 1 (src/ast/get.sk:441:5)');
    }

    return this.children.slice(1, this.children.length);
  };

  Node.prototype.superCallArguments = function() {
    if (this.kind !== NodeKind.SUPER_CALL) {
      throw new Error('assert kind == .SUPER_CALL (src/ast/get.sk:446:5)');
    }

    return this.children;
  };

  Node.prototype.listValues = function() {
    if (this.kind !== NodeKind.LIST) {
      throw new Error('assert kind == .LIST (src/ast/get.sk:451:5)');
    }

    return this.children;
  };

  Node.prototype.mapItems = function() {
    if (this.kind !== NodeKind.MAP) {
      throw new Error('assert kind == .MAP (src/ast/get.sk:456:5)');
    }

    return this.children;
  };

  Node.prototype.itemKey = function() {
    if (this.kind !== NodeKind.KEY_VALUE) {
      throw new Error('assert kind == .KEY_VALUE (src/ast/get.sk:461:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:462:5)');
    }

    return this.children[0];
  };

  Node.prototype.itemValue = function() {
    if (this.kind !== NodeKind.KEY_VALUE) {
      throw new Error('assert kind == .KEY_VALUE (src/ast/get.sk:467:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:468:5)');
    }

    return this.children[1];
  };

  Node.prototype.parameterBound = function() {
    if (this.kind !== NodeKind.PARAMETER) {
      throw new Error('assert kind == .PARAMETER (src/ast/get.sk:473:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:474:5)');
    }

    return this.children[1];
  };

  Node.prototype.returnValue = function() {
    if (this.kind !== NodeKind.RETURN) {
      throw new Error('assert kind == .RETURN (src/ast/get.sk:479:5)');
    }

    if (this.children.length !== 1) {
      throw new Error('assert children.size() == 1 (src/ast/get.sk:480:5)');
    }

    return this.children[0];
  };

  Node.prototype.switchValue = function() {
    if (this.kind !== NodeKind.SWITCH) {
      throw new Error('assert kind == .SWITCH (src/ast/get.sk:485:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:486:5)');
    }

    return this.children[0];
  };

  Node.prototype.switchCases = function() {
    if (this.kind !== NodeKind.SWITCH) {
      throw new Error('assert kind == .SWITCH (src/ast/get.sk:491:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:492:5)');
    }

    if (this.children[1].kind !== NodeKind.NODE_LIST) {
      throw new Error('assert children[1].kind == .NODE_LIST (src/ast/get.sk:493:5)');
    }

    return this.children[1];
  };

  Node.prototype.caseValues = function() {
    if (this.kind !== NodeKind.CASE) {
      throw new Error('assert kind == .CASE (src/ast/get.sk:498:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:499:5)');
    }

    if (this.children[0].kind !== NodeKind.NODE_LIST) {
      throw new Error('assert children[0].kind == .NODE_LIST (src/ast/get.sk:500:5)');
    }

    return this.children[0];
  };

  Node.prototype.caseBlock = function() {
    if (this.kind !== NodeKind.CASE) {
      throw new Error('assert kind == .CASE (src/ast/get.sk:505:5)');
    }

    if (this.children.length !== 2) {
      throw new Error('assert children.size() == 2 (src/ast/get.sk:506:5)');
    }

    if (this.children[1].kind !== NodeKind.BLOCK) {
      throw new Error('assert children[1].kind == .BLOCK (src/ast/get.sk:507:5)');
    }

    return this.children[1];
  };

  Node.prototype.invertBooleanCondition = function(cache) {
    if (!in_NodeKind.isExpression(this.kind)) {
      throw new Error('assert kind.isExpression() (src/ast/logic.sk:3:5)');
    }

    switch (this.kind) {
    case 44:
      this.content = new BoolContent(!this.asBool());
      return;

    case 67:
      this.become(this.unaryValue().remove());
      return;

    case 87:
      this.kind = NodeKind.NOT_EQUAL;
      return;

    case 98:
      this.kind = NodeKind.EQUAL;
      return;

    case 96:
      this.kind = NodeKind.LOGICAL_AND;
      this.binaryLeft().invertBooleanCondition(cache);
      this.binaryRight().invertBooleanCondition(cache);
      return;

    case 95:
      this.kind = NodeKind.LOGICAL_OR;
      this.binaryLeft().invertBooleanCondition(cache);
      this.binaryRight().invertBooleanCondition(cache);
      return;

    case 93:
    case 88:
    case 94:
    case 89:
      var commonType = cache.commonImplicitType(this.binaryLeft().type, this.binaryRight().type);

      if (commonType !== null && !commonType.isReal(cache)) {
        switch (this.kind) {
        case 93:
          this.kind = NodeKind.GREATER_THAN_OR_EQUAL;
          break;

        case 88:
          this.kind = NodeKind.LESS_THAN_OR_EQUAL;
          break;

        case 94:
          this.kind = NodeKind.GREATER_THAN;
          break;

        case 89:
          this.kind = NodeKind.LESS_THAN;
          break;
        }

        return;
      }
      break;
    }

    var children = this.removeChildren();
    this.become(Node.createUnary(NodeKind.NOT, this.clone().withChildren(children)).withType(cache.boolType));
  };

  Node.prototype.blockAlwaysEndsWithReturn = function() {
    if (this.kind !== NodeKind.BLOCK) {
      throw new Error('assert kind == .BLOCK (src/ast/logic.sk:79:5)');
    }

    if (!this.hasChildren()) {
      return false;
    }

    for (var i = this.children.length - 1 | 0; i >= 0; i = i - 1 | 0) {
      var child = this.children[i];

      switch (child.kind) {
      case 26:
        return true;

      case 20:
        var trueBlock = child.ifTrue();
        var falseBlock = child.ifFalse();

        if (falseBlock !== null && trueBlock.blockAlwaysEndsWithReturn() && falseBlock.blockAlwaysEndsWithReturn()) {
          return true;
        }
        break;

      case 21:
        var catches = child.catches();
        var finallyBlock = child.finallyBlock();

        if (finallyBlock !== null && finallyBlock.blockAlwaysEndsWithReturn()) {
          return true;
        }

        if (child.tryBlock().blockAlwaysEndsWithReturn()) {
          for (var j = 0; j < catches.length; j = j + 1 | 0) {
            if (!catches[j].catchBlock().blockAlwaysEndsWithReturn()) {
              return false;
            }
          }

          return true;
        }
        break;

      case 33:
        var cases = child.switchCases().children;
        var foundDefault = false;

        for (var j = 0; j < cases.length; j = j + 1 | 0) {
          var node = cases[j];

          if (!node.caseBlock().blockAlwaysEndsWithReturn()) {
            return false;
          }

          if (!node.caseValues().hasChildren()) {
            foundDefault = true;
          }
        }

        return foundDefault;
      }
    }

    return false;
  };

  Node.prototype.isNameExpression = function() {
    return this.kind === NodeKind.NAME && (in_NodeKind.isDot(this.parent.kind) ? this !== this.parent.dotName() : in_NodeKind.isNamedDeclaration(this.parent.kind) ? this !== this.parent.declarationName() : this.parent.kind === NodeKind.MEMBER_INITIALIZER ? this !== this.parent.memberInitializerName() : true);
  };

  Node.prototype.isDeclarationName = function() {
    return this.kind === NodeKind.NAME && in_NodeKind.isNamedDeclaration(this.parent.kind) && this === this.parent.declarationName();
  };

  Node.prototype.isStorage = function() {
    return in_NodeKind.isUnaryStorageOperator(this.parent.kind) || in_NodeKind.isBinaryStorageOperator(this.parent.kind) && this === this.parent.binaryLeft();
  };

  Node.prototype.hasNoSideEffects = function() {
    switch (this.kind) {
    case 39:
    case 41:
    case 44:
    case 45:
    case 46:
    case 47:
    case 48:
    case 43:
      return true;

    case 60:
    case 61:
      return this.castValue().hasNoSideEffects();

    case 42:
      return this.hookTest().hasNoSideEffects() && this.hookTrue().hasNoSideEffects() && this.hookFalse().hasNoSideEffects();

    case 52:
      return this.dotTarget().hasNoSideEffects();

    case 62:
      return this.quotedValue().hasNoSideEffects();

    case 75:
    case 76:
      return false;

    default:
      if (in_NodeKind.isBinaryOperator(this.kind) && !in_NodeKind.isBinaryStorageOperator(this.kind)) {
        return this.binaryLeft().hasNoSideEffects() && this.binaryRight().hasNoSideEffects();
      }

      if (in_NodeKind.isUnaryOperator(this.kind) && !in_NodeKind.isUnaryStorageOperator(this.kind)) {
        return this.unaryValue().hasNoSideEffects();
      }

      return false;
    }
  };

  Node.prototype.isNumberLessThanZero = function() {
    return this.kind === NodeKind.INT && this.asInt() < 0 || in_NodeKind.isReal(this.kind) && this.asDouble() < 0;
  };

  Node.prototype.removeLibraryFiles = function() {
    if (this.kind !== NodeKind.PROGRAM) {
      throw new Error('assert kind == .PROGRAM (src/ast/logic.sk:172:5)');
    }

    for (var i = 0; i < this.children.length;) {
      var file = this.children[i];

      if (this.children[i].isLibraryFile()) {
        this.removeChildAtIndex(i);
      } else {
        i = i + 1 | 0;
      }
    }
  };

  Node.prototype.hasChildren = function() {
    return this.children !== null && this.children.length > 0;
  };

  Node.prototype.needsPreprocessor = function() {
    if (this.kind !== NodeKind.FILE) {
      throw new Error('assert kind == .FILE (src/ast/node.sk:259:5)');
    }

    return (this.flags & NodeFlags.NEEDS_PREPROCESSOR) !== 0;
  };

  Node.prototype.isLibraryFile = function() {
    if (this.kind !== NodeKind.FILE) {
      throw new Error('assert kind == .FILE (src/ast/node.sk:264:5)');
    }

    return (this.flags & NodeFlags.IS_LIBRARY_FILE) !== 0;
  };

  Node.prototype.isLastChild = function() {
    return this.parent.lastChild() === this;
  };

  Node.prototype.lastChild = function() {
    return in_List.last(this.children);
  };

  Node.prototype.indexInParent = function() {
    if (this.parent === null) {
      throw new Error('assert parent != null (src/ast/node.sk:277:5)');
    }

    return this.parent.children.indexOf(this);
  };

  Node.prototype.appendChild = function(node) {
    this.insertChild(this.children === null ? 0 : this.children.length, node);
  };

  Node.prototype.appendChildren = function(nodes) {
    this.insertChildren(this.children === null ? 0 : this.children.length, nodes);
  };

  Node.prototype.insertSiblingAfter = function(node) {
    this.parent.insertChild(this.indexInParent() + 1 | 0, node);
  };

  Node.prototype.removeChildAtIndex = function(index) {
    if (index < 0 || index >= this.children.length) {
      throw new Error('assert index >= 0 && index < children.size() (src/ast/node.sk:306:5)');
    }

    var child = this.children[index];

    if (child !== null) {
      child.parent = null;
    }

    this.children.splice(index, 1)[0];
    return child;
  };

  Node.prototype.remove = function() {
    if (this.parent !== null) {
      this.parent.removeChildAtIndex(this.indexInParent());
    }

    return this;
  };

  Node.prototype.removeChildren = function() {
    if (this.children === null) {
      return [];
    }

    var result = this.children;

    for (var i = 0; i < this.children.length; i = i + 1 | 0) {
      var child = this.children[i];

      if (child !== null) {
        child.parent = null;
      }
    }

    this.children = null;
    return result;
  };

  Node.prototype.become = function(node) {
    this.kind = node.kind;
    this.range = node.range;
    this.sibling = node.sibling;
    this.removeChildren();
    this.withChildren(node.removeChildren());
    this.type = node.type;
    this.scope = node.scope;
    this.symbol = node.symbol;
    this.content = node.content;
    this.flags = node.flags;
  };

  Node.prototype.replaceWith = function(node) {
    this.parent.replaceChild(this.indexInParent(), node);
    return this;
  };

  Node.prototype.swapWith = function(node) {
    var parentA = this.parent;
    var parentB = node.parent;
    var indexA = this.indexInParent();
    var indexB = node.indexInParent();
    parentA.children[indexA] = node;
    parentB.children[indexB] = this;
    this.parent = parentB;
    node.parent = parentA;
  };

  Node.prototype.replaceWithNodes = function(nodes) {
    var index = this.indexInParent();

    for (var i = 0; i < nodes.length; i = i + 1 | 0) {
      this.parent.insertChild((index + i | 0) + 1 | 0, nodes[i]);
    }

    this.parent.removeChildAtIndex(index);
    return this;
  };

  Node.prototype.replaceChild = function(index, node) {
    if (this.children === null) {
      throw new Error('assert children != null (src/ast/node.sk:378:5)');
    }

    if (index < 0 || index > this.children.length) {
      throw new Error('assert index >= 0 && index <= children.size() (src/ast/node.sk:379:5)');
    }

    Node.updateParent(node, this);

    var old = this.children[index];

    if (old !== null) {
      old.parent = null;
    }

    this.children[index] = node;
  };

  Node.prototype.insertChild = function(index, node) {
    if (this.children === null) {
      this.children = [];
    }

    if (index < 0 || index > this.children.length) {
      throw new Error('assert index >= 0 && index <= children.size() (src/ast/node.sk:388:5)');
    }

    Node.updateParent(node, this);
    this.children.splice(index, 0, node);
  };

  Node.prototype.insertChildren = function(index, nodes) {
    if (this.children === null) {
      this.children = [];
    }

    if (index < 0 || index > this.children.length) {
      throw new Error('assert index >= 0 && index <= children.size() (src/ast/node.sk:395:5)');
    }

    for (var i = 0; i < nodes.length; i = i + 1 | 0) {
      var node = nodes[i];
      Node.updateParent(node, this);
      this.children.splice(index, 0, node);
      index = index + 1 | 0;
    }
  };

  Node.prototype.clone = function() {
    var node = new Node(this.kind);
    node.range = this.range;
    node.type = this.type;
    node.symbol = this.symbol;
    node.content = this.content;
    node.flags = this.flags;

    if (this.children !== null) {
      node.children = [];

      for (var i = 0; i < this.children.length; i = i + 1 | 0) {
        var child = this.children[i];
        node.appendChild(child !== null ? child.clone() : null);
      }
    }

    return node;
  };

  Node.prototype.withRange = function(value) {
    this.range = value;
    return this;
  };

  Node.prototype.withType = function(value) {
    this.type = value;
    return this;
  };

  Node.prototype.withSymbol = function(value) {
    this.symbol = value;
    return this;
  };

  Node.prototype.withContent = function(value) {
    this.content = value;
    return this;
  };

  Node.prototype.withChildren = function(nodes) {
    if (this.children !== null) {
      throw new Error('assert children == null (src/ast/node.sk:442:5)');
    }

    for (var i = 0; i < nodes.length; i = i + 1 | 0) {
      Node.updateParent(nodes[i], this);
    }

    this.children = nodes;
    return this;
  };

  Node.prototype.appendToSiblingChain = function(node) {
    var last = this;

    while (last.sibling !== null) {
      last = last.sibling;
    }

    last.sibling = node;
  };

  Node.updateParent = function(node, parent) {
    if (node !== null) {
      if (node.parent !== null) {
        throw new Error('assert node.parent == null (src/ast/node.sk:460:7)');
      }

      node.parent = parent;
    }
  };

  function NodeKindIs(_0) {
    this.expected = _0;
  }

  NodeKindIs.prototype.check = function(kind) {
    return kind === this.expected;
  };

  function NodeKindIsExpression() {
  }

  NodeKindIsExpression.prototype.check = function(kind) {
    return in_NodeKind.isExpression(kind);
  };

  function NodeKindIsStatement() {
  }

  NodeKindIsStatement.prototype.check = function(kind) {
    return in_NodeKind.isStatement(kind);
  };

  var NodeKind = {
    PROGRAM: 0,
    FILE: 1,
    BLOCK: 2,
    NODE_LIST: 3,
    CASE: 4,
    CATCH: 5,
    MEMBER_INITIALIZER: 6,
    VARIABLE_CLUSTER: 7,
    NAMESPACE: 8,
    ENUM: 9,
    ENUM_FLAGS: 10,
    CLASS: 11,
    INTERFACE: 12,
    EXTENSION: 13,
    CONSTRUCTOR: 14,
    FUNCTION: 15,
    VARIABLE: 16,
    PARAMETER: 17,
    PREPROCESSOR_DEFINE: 18,
    ALIAS: 19,
    IF: 20,
    TRY: 21,
    FOR: 22,
    FOR_EACH: 23,
    WHILE: 24,
    DO_WHILE: 25,
    RETURN: 26,
    BREAK: 27,
    CONTINUE: 28,
    THROW: 29,
    ASSERT: 30,
    ASSERT_CONST: 31,
    EXPRESSION: 32,
    SWITCH: 33,
    MODIFIER: 34,
    USING: 35,
    PREPROCESSOR_WARNING: 36,
    PREPROCESSOR_ERROR: 37,
    PREPROCESSOR_IF: 38,
    NAME: 39,
    TYPE: 40,
    THIS: 41,
    HOOK: 42,
    NULL: 43,
    BOOL: 44,
    INT: 45,
    FLOAT: 46,
    DOUBLE: 47,
    STRING: 48,
    LIST: 49,
    MAP: 50,
    KEY_VALUE: 51,
    DOT: 52,
    DOT_ARROW: 53,
    DOT_COLON: 54,
    CALL: 55,
    SUPER_CALL: 56,
    ERROR: 57,
    SEQUENCE: 58,
    PARAMETERIZE: 59,
    CAST: 60,
    IMPLICIT_CAST: 61,
    QUOTED: 62,
    VAR: 63,
    ANNOTATION: 64,
    PREPROCESSOR_HOOK: 65,
    PREPROCESSOR_SEQUENCE: 66,
    NOT: 67,
    POSITIVE: 68,
    NEGATIVE: 69,
    COMPLEMENT: 70,
    PREFIX_INCREMENT: 71,
    PREFIX_DECREMENT: 72,
    POSTFIX_INCREMENT: 73,
    POSTFIX_DECREMENT: 74,
    NEW: 75,
    DELETE: 76,
    PREFIX_DEREFERENCE: 77,
    PREFIX_REFERENCE: 78,
    POSTFIX_DEREFERENCE: 79,
    POSTFIX_REFERENCE: 80,
    ADD: 81,
    BITWISE_AND: 82,
    BITWISE_OR: 83,
    BITWISE_XOR: 84,
    COMPARE: 85,
    DIVIDE: 86,
    EQUAL: 87,
    GREATER_THAN: 88,
    GREATER_THAN_OR_EQUAL: 89,
    IN: 90,
    INDEX: 91,
    IS: 92,
    LESS_THAN: 93,
    LESS_THAN_OR_EQUAL: 94,
    LOGICAL_AND: 95,
    LOGICAL_OR: 96,
    MULTIPLY: 97,
    NOT_EQUAL: 98,
    POWER: 99,
    REMAINDER: 100,
    SHIFT_LEFT: 101,
    SHIFT_RIGHT: 102,
    SUBTRACT: 103,
    ASSIGN: 104,
    ASSIGN_ADD: 105,
    ASSIGN_DIVIDE: 106,
    ASSIGN_MULTIPLY: 107,
    ASSIGN_REMAINDER: 108,
    ASSIGN_SUBTRACT: 109,
    ASSIGN_BITWISE_AND: 110,
    ASSIGN_BITWISE_OR: 111,
    ASSIGN_BITWISE_XOR: 112,
    ASSIGN_SHIFT_LEFT: 113,
    ASSIGN_SHIFT_RIGHT: 114,
    ASSIGN_INDEX: 115
  };

  var NodeFlags = {
    NEEDS_PREPROCESSOR: 1,
    IS_LIBRARY_FILE: 2
  };

  var Associativity = {
    NONE: 0,
    LEFT: 1,
    RIGHT: 2
  };

  function OperatorInfo(_0, _1, _2) {
    this.text = _0;
    this.precedence = _1;
    this.associativity = _2;
  }

  var SortTypes = {
    DO_NOT_SORT: 0,
    SORT_BY_INHERITANCE_AND_CONTAINMENT: 2
  };

  function Collector(program, sort) {
    this.typeSymbols = [];
    this.freeFunctionSymbols = [];
    this.freeVariableSymbols = [];
    this.sort = sort;

    if (program.kind !== NodeKind.PROGRAM) {
      throw new Error('assert program.kind == .PROGRAM (src/compiler/collector.sk:14:5)');
    }

    this.collectStatements(program);
    this.typeSymbols.sort(bindCompare(SymbolComparison.INSTANCE));
    this.freeFunctionSymbols.sort(bindCompare(SymbolComparison.INSTANCE));
    this.freeVariableSymbols.sort(bindCompare(SymbolComparison.INSTANCE));
    this.sortTypeSymbols();
  }

  Collector.prototype.collectStatements = function(node) {
    switch (node.kind) {
    case 0:
    case 1:
    case 34:
    case 2:
      this.collectChildStatements(node);
      break;

    case 8:
    case 11:
    case 12:
    case 13:
    case 9:
    case 10:
    case 19:
      if (node === node.symbol.node) {
        this.typeSymbols.push(node.symbol);
      }

      this.collectChildStatements(node);
      break;

    case 14:
    case 15:
      if (!in_SymbolKind.isTypeWithInstances(node.symbol.enclosingSymbol.kind)) {
        this.freeFunctionSymbols.push(node.symbol);
      }
      break;

    case 7:
      var variables = node.clusterVariables();

      for (var i = 0; i < variables.length; i = i + 1 | 0) {
        var symbol = variables[i].symbol;

        if (symbol.kind === SymbolKind.GLOBAL_VARIABLE && !symbol.isEnumValue()) {
          this.freeVariableSymbols.push(symbol);
        }
      }
      break;
    }
  };

  Collector.prototype.sortTypeSymbols = function() {
    if (this.sort === SortTypes.DO_NOT_SORT) {
      return;
    }

    for (var i = 0; i < this.typeSymbols.length; i = i + 1 | 0) {
      var j = i;

      for (; j < this.typeSymbols.length; j = j + 1 | 0) {
        var type = this.typeSymbols[j].type;
        var k = i;

        for (; k < this.typeSymbols.length; k = k + 1 | 0) {
          if (j === k) {
            continue;
          }

          if (this.typeComesBefore(this.typeSymbols[k].type, type)) {
            break;
          }
        }

        if (k === this.typeSymbols.length) {
          break;
        }
      }

      if (j < this.typeSymbols.length) {
        in_List.swap(this.typeSymbols, i, j);
      }
    }
  };

  Collector.prototype.isContainedBy = function(inner, outer) {
    if (inner.enclosingSymbol === null) {
      return false;
    }

    if (inner.enclosingSymbol === outer) {
      return true;
    }

    return this.isContainedBy(inner.enclosingSymbol, outer);
  };

  Collector.prototype.typeComesBefore = function(before, after) {
    if (after.hasBaseType(before)) {
      return true;
    }

    if (this.sort === SortTypes.SORT_BY_INHERITANCE_AND_CONTAINMENT && this.isContainedBy(after.symbol, before.symbol)) {
      return true;
    }

    return false;
  };

  Collector.prototype.collectChildStatements = function(node) {
    if (node.hasChildren()) {
      for (var i = 0; i < node.children.length; i = i + 1 | 0) {
        var child = node.children[i];

        if (child !== null) {
          this.collectStatements(child);
        }
      }
    }
  };

  var CompilerTarget = {
    NONE: 0,
    CPP: 1,
    JAVASCRIPT: 2,
    JOINED: 3,
    RUBY: 4,
    JSON_AST: 5,
    LISP_AST: 6,
    XML_AST: 7
  };

  function OverriddenDefine(_0, _1) {
    this.value = _0;
    this.range = _1;
  }

  var CompilerConfig = {
    AUTOMATIC: 0,
    ANDROID: 1,
    BROWSER: 2,
    IOS: 3,
    LINUX: 4,
    NODE: 5,
    OSX: 6,
    WINDOWS: 7
  };

  var MemoryManagement = {
    NONE: 0,
    NONE_FAST: 1,
    MARK_SWEEP: 2
  };

  function CompilerOptions() {
    this.fileAccess = null;
    this.target = CompilerTarget.NONE;
    this.config = CompilerConfig.AUTOMATIC;
    this.memoryManagement = MemoryManagement.NONE;
    this.optionalLibraries = [];
    this.overriddenDefines = Object.create(null);
    this.outputDirectory = '';
    this.outputFile = '';
    this.verbose = false;
    this.minify = false;
    this.mangle = false;
    this.sourceMap = false;
    this.removeAsserts = false;
    this.foldAllConstants = false;
    this.includeLibraries = false;
    this.inlineAllFunctions = false;
    this.globalizeAllFunctions = false;
    this.log = new Log();
  }

  CompilerOptions.prototype.overrideDefine = function(name, value) {
    this.overriddenDefines[name] = new OverriddenDefine(value, Range.EMPTY);
  };

  function CompilerResult(_0, _1, _2) {
    this.outputs = _0;
    this.program = _1;
    this.resolver = _2;
  }

  var OptionalLibrary = {
    NONE: 0,
    OS: 1,
    TERMINAL: 2,
    TIMESTAMP: 3,
    UNICODE: 4,
    UNIT: 5
  };

  function CachedLibrary(_0, _1, _2) {
    this.file = null;
    this.name = _0;
    this.contents = _1;
    this.optionalLibrary = _2;
  }

  CachedLibrary.prototype.compileAndInclude = function(compiler) {
    if (this.optionalLibrary === OptionalLibrary.NONE || compiler.options.optionalLibraries.indexOf(this.optionalLibrary) !== -1) {
      if (this.file === null) {
        this.file = compiler.addInput(new Source('<compiler>/' + this.name, this.contents));
        this.file.flags |= NodeFlags.IS_LIBRARY_FILE;
        this.file = this.file.clone();
      } else {
        compiler.addCachedInput(this.file.clone());
      }
    }
  };

  function Compiler(options) {
    this.tokenizingTime = 0;
    this.parsingTime = 0;
    this.resolvingTime = 0;
    this.callGraphTime = 0;
    this.globalizeTime = 0;
    this.symbolMotionTime = 0;
    this.functionInliningTime = 0;
    this.constantFoldingTime = 0;
    this.treeShakingTime = 0;
    this.emitTime = 0;
    this.lineCountingTime = 0;
    this.totalTime = 0;
    this._inputs = [];
    this._program = Node.createProgram([]);
    this.options = options;

    var target = options.target;
    var config = options.config;

    if (config === CompilerConfig.AUTOMATIC) {
      if (target === CompilerTarget.JAVASCRIPT) {
        config = CompilerConfig.BROWSER;
      } else if (target === CompilerTarget.CPP || target === CompilerTarget.RUBY) {
        var os = in_OperatingSystem.current();
        config = os === OperatingSystem.ANDROID ? CompilerConfig.ANDROID : os === OperatingSystem.IOS ? CompilerConfig.IOS : os === OperatingSystem.LINUX ? CompilerConfig.LINUX : os === OperatingSystem.OSX ? CompilerConfig.OSX : os === OperatingSystem.WINDOWS ? CompilerConfig.WINDOWS : CompilerConfig.AUTOMATIC;
      }

      options.config = config;
    }

    options.overrideDefine('TARGET_CPP', target === CompilerTarget.CPP);
    options.overrideDefine('TARGET_JS', target === CompilerTarget.JAVASCRIPT);
    options.overrideDefine('TARGET_RUBY', target === CompilerTarget.RUBY);
    options.overrideDefine('CONFIG_ANDROID', config === CompilerConfig.ANDROID);
    options.overrideDefine('CONFIG_BROWSER', config === CompilerConfig.BROWSER);
    options.overrideDefine('CONFIG_IOS', config === CompilerConfig.IOS);
    options.overrideDefine('CONFIG_LINUX', config === CompilerConfig.LINUX);
    options.overrideDefine('CONFIG_NODE', config === CompilerConfig.NODE);
    options.overrideDefine('CONFIG_OSX', config === CompilerConfig.OSX);
    options.overrideDefine('CONFIG_WINDOWS', config === CompilerConfig.WINDOWS);

    for (var i = 0; i < Compiler.cachedLibraries.length; i = i + 1 | 0) {
      Compiler.cachedLibraries[i].compileAndInclude(this);
    }
  }

  Compiler.prototype.addInput = function(source) {
    var log = this.options.log;
    var errorCount = log.errorCount;
    var tokenizeStart = Date.now();
    var tokens = tokenize(log, source);

    if (log.errorCount === errorCount) {
      prepareTokens(tokens);
    }

    this.tokenizingTime += Date.now() - tokenizeStart;
    this._inputs.push(source);

    if (log.errorCount === errorCount) {
      var parseStart = Date.now();
      var file = parseFile(log, tokens);
      this.parsingTime += Date.now() - parseStart;

      if (file !== null) {
        this._program.appendChild(file);
        return file;
      }
    }

    return null;
  };

  Compiler.prototype.addCachedInput = function(node) {
    if (node.kind !== NodeKind.FILE) {
      throw new Error('assert node.kind == .FILE (src/compiler/compiler.sk:224:5)');
    }

    if (node.range.isEmpty()) {
      throw new Error('assert !node.range.isEmpty() (src/compiler/compiler.sk:225:5)');
    }

    this._inputs.push(node.range.source);
    this._program.appendChild(node);
  };

  Compiler.prototype.compile = function() {
    var totalStart = Date.now();
    var outputs = [];
    var resolver = null;

    if (in_CompilerTarget.shouldRunResolver(this.options.target)) {
      var resolveStart = Date.now();
      resolver = new Resolver(this.options.log, this.options);
      resolver.run(this._program);
      this.resolvingTime += Date.now() - resolveStart;
    }

    if (!this.options.log.hasErrors()) {
      if (in_CompilerTarget.shouldRunResolver(this.options.target)) {
        var callGraphStart = Date.now();
        var graph = new CallGraph(this._program);
        this.callGraphTime += Date.now() - callGraphStart;

        var globalizeStart = Date.now();
        GlobalizePass.run(graph, resolver);
        this.globalizeTime += Date.now() - globalizeStart;

        var symbolMotionStart = Date.now();
        SymbolMotionPass.run(resolver);
        this.symbolMotionTime += Date.now() - symbolMotionStart;

        var functionInliningStart = Date.now();
        FunctionInliningPass.run(graph, this.options);
        this.functionInliningTime += Date.now() - functionInliningStart;

        if (this.options.foldAllConstants) {
          var constantFoldingStart = Date.now();
          resolver.constantFolder.foldConstants(this._program);
          this.constantFoldingTime += Date.now() - constantFoldingStart;
        }

        var treeShakingStart = Date.now();
        TreeShakingPass.run(this._program, this.options, resolver);
        this.treeShakingTime += Date.now() - treeShakingStart;
      }

      var emitter = null;

      switch (this.options.target) {
      case 0:
        break;

      case 1:
        emitter = new cpp.Emitter(resolver);
        break;

      case 2:
        emitter = new js.Emitter(resolver);
        break;

      case 3:
        emitter = new joined.Emitter(resolver);
        break;

      case 4:
        emitter = new ruby.Emitter(resolver);
        break;

      case 5:
        emitter = new json.Emitter(this.options);
        break;

      case 6:
        emitter = new lisp.Emitter(this.options);
        break;

      case 7:
        emitter = new xml.Emitter(this.options);
        break;

      default:
        throw new Error('assert false (src/compiler/compiler.sk:290:19)');
        break;
      }

      if (emitter !== null) {
        var emitStart = Date.now();
        outputs = emitter.emitProgram(this._program);
        this.emitTime += Date.now() - emitStart;
      }
    }

    this.totalTime += Date.now() - totalStart;
    return new CompilerResult(outputs, this._program, resolver);
  };

  Compiler.prototype.statistics = function(result) {
    var lineCountingStart = Date.now();
    var lineCount = 0;
    lineCount = lineCount + Compiler.totalLineCount(this._inputs) | 0;

    var builder = new StringBuilder();
    builder._buffer += 'Input line count: ' + lineCount;
    builder._buffer += '\nOutput line count: ' + Compiler.totalLineCount(result.outputs);
    this.lineCountingTime += Date.now() - lineCountingStart;

    var optimizingTime = this.callGraphTime + this.globalizeTime + this.symbolMotionTime + this.functionInliningTime + this.constantFoldingTime + this.treeShakingTime;
    builder._buffer += '\nTotal compile time: ' + formatNumber(this.totalTime + this.lineCountingTime) + 'ms';

    if (this.tokenizingTime > 0) {
      builder._buffer += '\n  Tokenizing: ' + formatNumber(this.tokenizingTime) + 'ms';
    }

    if (this.parsingTime > 0) {
      builder._buffer += '\n  Parsing: ' + formatNumber(this.parsingTime) + 'ms';
    }

    if (this.resolvingTime > 0) {
      builder._buffer += '\n  Resolving: ' + formatNumber(this.resolvingTime) + 'ms';
    }

    if (optimizingTime > 0) {
      builder._buffer += '\n  Optimizing: ' + formatNumber(optimizingTime) + 'ms';
      builder._buffer += '\n    Building call graph: ' + formatNumber(this.callGraphTime) + 'ms';
      builder._buffer += '\n    Globalize: ' + formatNumber(this.globalizeTime) + 'ms';
      builder._buffer += '\n    Symbol motion: ' + formatNumber(this.symbolMotionTime) + 'ms';
      builder._buffer += '\n    Function inlining: ' + formatNumber(this.functionInliningTime) + 'ms';
      builder._buffer += '\n    Constant folding: ' + formatNumber(this.constantFoldingTime) + 'ms';
      builder._buffer += '\n    Tree shaking: ' + formatNumber(this.treeShakingTime) + 'ms';
    }

    if (this.emitTime > 0) {
      builder._buffer += '\n  Emit: ' + formatNumber(this.emitTime) + 'ms';
    }

    if (this.lineCountingTime > 0) {
      builder._buffer += '\n  Counting lines: ' + formatNumber(this.lineCountingTime) + 'ms';
    }

    Compiler.sourceStatistics('Inputs', this._inputs, builder);
    Compiler.sourceStatistics('Outputs', result.outputs, builder);
    return builder._buffer;
  };

  Compiler.totalLineCount = function(sources) {
    var lineCount = 0;

    for (var i = 0; i < sources.length; i = i + 1 | 0) {
      lineCount = lineCount + sources[i].lineCount() | 0;
    }

    return lineCount;
  };

  Compiler.sourceStatistics = function(name, sources, builder) {
    var total = 0;

    for (var i = 0; i < sources.length; i = i + 1 | 0) {
      total = total + sources[i].contents.length | 0;
    }

    builder._buffer += '\n' + name + ': ' + sources.length + ' (' + bytesToString(total) + ' total)';

    for (var i = 0; i < sources.length; i = i + 1 | 0) {
      var source = sources[i];
      builder._buffer += '\n  ' + source.name + ': ' + bytesToString(source.contents.length);
    }
  };

  var DiagnosticKind = {
    ERROR: 0,
    WARNING: 1
  };

  function Diagnostic(_0, _1, _2) {
    this.noteRange = Range.EMPTY;
    this.noteText = '';
    this.kind = _0;
    this.range = _1;
    this.text = _2;
  }

  function Log() {
    this.diagnostics = [];
    this.warningCount = 0;
    this.errorCount = 0;
  }

  Log.prototype.hasErrors = function() {
    return this.errorCount !== 0;
  };

  Log.prototype.hasWarnings = function() {
    return this.warningCount !== 0;
  };

  Log.prototype.error = function(range, text) {
    if (range === null) {
      throw new Error('assert range != null (src/core/log.sk:57:5)');
    }

    this.diagnostics.push(new Diagnostic(DiagnosticKind.ERROR, range, text));
    this.errorCount = this.errorCount + 1 | 0;
  };

  Log.prototype.warning = function(range, text) {
    if (range === null) {
      throw new Error('assert range != null (src/core/log.sk:63:5)');
    }

    this.diagnostics.push(new Diagnostic(DiagnosticKind.WARNING, range, text));
    this.warningCount = this.warningCount + 1 | 0;
  };

  Log.prototype.note = function(range, text) {
    if (range === null) {
      throw new Error('assert range != null (src/core/log.sk:69:5)');
    }

    var last = in_List.last(this.diagnostics);
    last.noteRange = range;
    last.noteText = text;
  };

  function FormattedRange(_0, _1) {
    this.line = _0;
    this.range = _1;
  }

  function Range(_0, _1, _2) {
    this.source = _0;
    this.start = _1;
    this.end = _2;
  }

  Range.prototype.isEmpty = function() {
    return this.source === null;
  };

  Range.prototype.toString = function() {
    return this.source === null ? '' : this.source.contents.slice(this.start, this.end);
  };

  Range.prototype.locationString = function() {
    if (this.isEmpty()) {
      return '';
    }

    var location = this.source.indexToLineColumn(this.start);
    return this.source.name + ':' + (location.line + 1 | 0) + ':' + (location.column + 1 | 0);
  };

  Range.prototype.format = function(maxLength) {
    if (this.source === null) {
      throw new Error('assert source != null (src/core/range.sk:32:5)');
    }

    var start = this.source.indexToLineColumn(this.start);
    var end = this.source.indexToLineColumn(this.end);
    var line = this.source.contentsOfLine(start.line);
    var length = line.length;
    var iterator = unicode.StringIterator.INSTANCE.reset(line, 0);
    var a = iterator.countCodePointsUntil(start.column);
    var b = a + iterator.countCodePointsUntil(end.line === start.line ? end.column : length) | 0;
    var count = b + iterator.countCodePointsUntil(length) | 0;

    if (maxLength > 0 && count > maxLength) {
      var centeredWidth = math.imin(b - a | 0, maxLength / 2 | 0);
      var centeredStart = math.imax((maxLength - centeredWidth | 0) / 2 | 0, 3);
      var codePoints = in_string.codePoints(line);

      if (a < centeredStart) {
        line = in_string.fromCodePoints(codePoints.slice(0, maxLength - 3 | 0)) + '...';

        if (b > (maxLength - 3 | 0)) {
          b = maxLength - 3 | 0;
        }
      } else if ((count - a | 0) < (maxLength - centeredStart | 0)) {
        var offset = count - maxLength | 0;
        line = '...' + in_string.fromCodePoints(codePoints.slice(offset + 3 | 0, count));
        a = a - offset | 0;
        b = b - offset | 0;
      } else {
        var offset = a - centeredStart | 0;
        line = '...' + in_string.fromCodePoints(codePoints.slice(offset + 3 | 0, (offset + maxLength | 0) - 3 | 0)) + '...';
        a = a - offset | 0;
        b = b - offset | 0;

        if (b > (maxLength - 3 | 0)) {
          b = maxLength - 3 | 0;
        }
      }
    }

    return new FormattedRange(line, in_string.repeat(' ', a) + ((b - a | 0) < 2 ? '^' : in_string.repeat('~', b - a | 0)));
  };

  Range.prototype.fromStart = function(count) {
    if (count < 0 || count > (this.end - this.start | 0)) {
      throw new Error('assert count >= 0 && count <= end - start (src/core/range.sk:78:5)');
    }

    return new Range(this.source, this.start, this.start + count | 0);
  };

  Range.prototype.fromEnd = function(count) {
    if (count < 0 || count > (this.end - this.start | 0)) {
      throw new Error('assert count >= 0 && count <= end - start (src/core/range.sk:83:5)');
    }

    return new Range(this.source, this.end - count | 0, this.end);
  };

  Range.prototype.slice = function(offsetStart, offsetEnd) {
    if (offsetStart < 0 || offsetStart > offsetEnd || offsetEnd > (this.end - this.start | 0)) {
      throw new Error('assert offsetStart >= 0 && offsetStart <= offsetEnd && offsetEnd <= end - start (src/core/range.sk:88:5)');
    }

    return new Range(this.source, this.start + offsetStart | 0, this.start + offsetEnd | 0);
  };

  Range.span = function(start, end) {
    if (start.source !== end.source) {
      throw new Error('assert start.source == end.source (src/core/range.sk:93:5)');
    }

    if (start.start > end.end) {
      throw new Error('assert start.start <= end.end (src/core/range.sk:94:5)');
    }

    return new Range(start.source, start.start, end.end);
  };

  Range.inner = function(start, end) {
    if (start.source !== end.source) {
      throw new Error('assert start.source == end.source (src/core/range.sk:99:5)');
    }

    if (start.end > end.start) {
      throw new Error('assert start.end <= end.start (src/core/range.sk:100:5)');
    }

    return new Range(start.source, start.end, end.start);
  };

  Range.before = function(outer, inner) {
    if (outer.source !== inner.source) {
      throw new Error('assert outer.source == inner.source (src/core/range.sk:105:5)');
    }

    if (outer.start > inner.start) {
      throw new Error('assert outer.start <= inner.start (src/core/range.sk:106:5)');
    }

    if (outer.end < inner.end) {
      throw new Error('assert outer.end >= inner.end (src/core/range.sk:107:5)');
    }

    return new Range(outer.source, outer.start, inner.start);
  };

  Range.after = function(outer, inner) {
    if (outer.source !== inner.source) {
      throw new Error('assert outer.source == inner.source (src/core/range.sk:112:5)');
    }

    if (outer.start > inner.start) {
      throw new Error('assert outer.start <= inner.start (src/core/range.sk:113:5)');
    }

    if (outer.end < inner.end) {
      throw new Error('assert outer.end >= inner.end (src/core/range.sk:114:5)');
    }

    return new Range(outer.source, inner.end, outer.end);
  };

  Range.equal = function(left, right) {
    return left.source === right.source && left.start === right.start && left.end === right.end;
  };

  function LineColumn(_0, _1) {
    this.line = _0;
    this.column = _1;
  }

  function Source(_0, _1) {
    this.lineOffsets = null;
    this.name = _0;
    this.contents = _1;
  }

  Source.prototype.lineCount = function() {
    this.computeLineOffsets();
    return this.lineOffsets.length - 1 | 0;
  };

  Source.prototype.contentsOfLine = function(line) {
    this.computeLineOffsets();

    if (line < 0 || line >= this.lineOffsets.length) {
      return '';
    }

    var start = this.lineOffsets[line];
    var end = (line + 1 | 0) < this.lineOffsets.length ? this.lineOffsets[line + 1 | 0] - 1 | 0 : this.contents.length;
    return this.contents.slice(start, end);
  };

  Source.prototype.indexToLineColumn = function(index) {
    this.computeLineOffsets();

    var count = this.lineOffsets.length;
    var line = 0;

    while (count > 0) {
      var step = count / 2 | 0;
      var i = line + step | 0;

      if (this.lineOffsets[i] <= index) {
        line = i + 1 | 0;
        count = (count - step | 0) - 1 | 0;
      } else {
        count = step;
      }
    }

    var column = line > 0 ? index - this.lineOffsets[line - 1 | 0] | 0 : index;
    return new LineColumn(line - 1 | 0, column);
  };

  Source.prototype.computeLineOffsets = function() {
    if (this.lineOffsets === null) {
      this.lineOffsets = [0];

      for (var i = 0; i < this.contents.length; i = i + 1 | 0) {
        if (this.contents.charCodeAt(i) === 10) {
          this.lineOffsets.push(i + 1 | 0);
        }
      }
    }
  };

  function UnionFind(count) {
    this.parents = [];

    for (var i = 0; i < count; i = i + 1 | 0) {
      this.parents.push(i);
    }
  }

  UnionFind.prototype.allocate = function() {
    var index = this.parents.length;
    this.parents.push(index);
    return index;
  };

  UnionFind.prototype.union = function(left, right) {
    this.parents[this.find(left)] = this.find(right);
  };

  UnionFind.prototype.find = function(index) {
    if (index < 0 || index >= this.parents.length) {
      throw new Error('assert index >= 0 && index < parents.size() (src/core/support.sk:23:5)');
    }

    var parent = this.parents[index];

    if (parent !== index) {
      parent = this.find(parent);
      this.parents[index] = parent;
    }

    return parent;
  };

  var prettyPrint = {};

  function SplitPath(_0, _1) {
    this.directory = _0;
    this.entry = _1;
  }

  var ByteSize = {
    KB: 1024,
    MB: 1048576,
    GB: 1073741824
  };

  var trace = {};

  function StringComparison() {
  }

  StringComparison.prototype.compare = function(a, b) {
    return (a > b | 0) - (a < b | 0) | 0;
  };

  var base = {};

  base.Emitter = function(_0) {
    this.namespaceStack = [];
    this.options = null;
    this.previousKind = NodeKind.NULL;
    this.isKeyword = null;
    this.outputs = [];
    this.prepended = new StringBuilder();
    this.builder = new StringBuilder();
    this.indent = '';
    this.cache = null;
    this.resolver = _0;
  };

  base.Emitter.prototype.emitProgram = function(program) {
    this.cache = this.resolver.cache;
    this.options = this.resolver.options;
    this.isKeyword = this.createIsKeyword();
    this.visitProgram(program);
    this.prepended._buffer += this.builder._buffer;
    this.outputs.push(new Source(this.options.outputFile, this.prepended._buffer));
    return this.outputs;
  };

  base.Emitter.prototype.visitProgram = function(node) {
    this.visitCollector(new Collector(node, SortTypes.SORT_BY_INHERITANCE_AND_CONTAINMENT));
    this.adjustNamespace(null);
  };

  base.Emitter.prototype.handleSymbol = function(symbol) {
  };

  base.Emitter.prototype.visitCollector = function(collector) {
    for (var i = 0; i < collector.typeSymbols.length; i = i + 1 | 0) {
      var symbol = collector.typeSymbols[i];

      if (!symbol.isImport()) {
        this.emitTypeDeclaration(symbol);
      } else {
        this.handleSymbol(symbol);
      }
    }

    for (var i = 0; i < collector.freeFunctionSymbols.length; i = i + 1 | 0) {
      var symbol = collector.freeFunctionSymbols[i];

      if (!symbol.isImport()) {
        this.emitFunction(symbol);
      } else {
        this.handleSymbol(symbol);
      }
    }

    for (var i = 0; i < collector.freeVariableSymbols.length; i = i + 1 | 0) {
      var symbol = collector.freeVariableSymbols[i];

      if (!symbol.isImport()) {
        this.emitFreeVariable(symbol);
      } else {
        this.handleSymbol(symbol);
      }
    }
  };

  base.Emitter.prototype.enterNamespace = function(symbol) {
    this.emitExtraNewlineBefore(NodeKind.NAMESPACE);
    this.builder._buffer += this.indent + 'namespace ' + this.mangleName(symbol) + ' {\n';
    this.increaseIndent();
  };

  base.Emitter.prototype.leaveNamespace = function(symbol) {
    this.decreaseIndent();
    this.builder._buffer += this.indent + '}\n';
    this.emitExtraNewlineAfter(NodeKind.NAMESPACE);
  };

  base.Emitter.prototype.adjustNamespace = function(symbol) {
    var symbols = [];

    while (symbol !== null && symbol.kind !== SymbolKind.GLOBAL_NAMESPACE) {
      if (symbol.kind === SymbolKind.NAMESPACE) {
        symbols.unshift(symbol);
      }

      symbol = symbol.enclosingSymbol;
    }

    var n = math.imin(this.namespaceStack.length, symbols.length);
    var i = 0;

    for (i = 0; i < n; i = i + 1 | 0) {
      if (this.namespaceStack[i] !== symbols[i]) {
        break;
      }
    }

    while (this.namespaceStack.length > i) {
      this.leaveNamespace(this.namespaceStack.pop());
      this.emitExtraNewlineAfter(NodeKind.NAMESPACE);
    }

    while (this.namespaceStack.length < symbols.length) {
      var symbol = symbols[this.namespaceStack.length];
      this.emitExtraNewlineBefore(NodeKind.NAMESPACE);
      this.enterNamespace(symbol);
      this.namespaceStack.push(symbol);
    }
  };

  base.Emitter.prototype.emitTypeMembers = function(symbol) {
    var members = symbol.type.sortedMembers();

    for (var i = 0; i < members.length; i = i + 1 | 0) {
      var member = members[i].symbol;

      if (!member.isImport() && member.enclosingSymbol === symbol) {
        if (in_SymbolKind.isFunction(member.kind)) {
          this.emitFunction(member);
        } else if (in_SymbolKind.isVariable(member.kind)) {
          this.emitMemberVariable(member);
        } else {
          this.handleSymbol(member);
        }
      } else {
        this.handleSymbol(member);
      }
    }
  };

  base.Emitter.prototype.emitTypeBeforeVariable = function(symbol) {
    this.emitType(symbol.type);
    this.builder._buffer += ' ';
  };

  base.Emitter.prototype.emitMemberVariable = function(symbol) {
    this.emitVariable(symbol);
  };

  base.Emitter.prototype.emitFreeVariable = function(symbol) {
    this.emitVariable(symbol);
  };

  base.Emitter.prototype.emitFunctionArgument = function(symbol) {
    this.emitType(symbol.type);
    this.builder._buffer += ' ' + this.mangleName(symbol);
  };

  base.Emitter.prototype.emitFunctionArguments = function(symbol) {
    var $arguments = symbol.node.functionArguments();
    this.builder._buffer += '(';

    if ($arguments.hasChildren()) {
      for (var i = 0; i < $arguments.children.length; i = i + 1 | 0) {
        if (i !== 0) {
          this.builder._buffer += ', ';
        }

        this.emitFunctionArgument($arguments.children[i].symbol);
      }
    }

    this.builder._buffer += ')';
  };

  base.Emitter.prototype.forceEmitExtraNewline = function() {
    if (this.previousKind !== NodeKind.NULL) {
      this.builder._buffer += '\n';
    }

    this.previousKind = NodeKind.NULL;
  };

  base.Emitter.prototype.isFlowNodeKind = function(kind) {
    return kind === NodeKind.EXPRESSION || kind === NodeKind.VARIABLE || kind === NodeKind.VARIABLE_CLUSTER || in_NodeKind.isJump(kind) || kind === NodeKind.ASSERT;
  };

  base.Emitter.prototype.shouldEmitExtraNewlineBetween = function(before, after) {
    return !this.isFlowNodeKind(before) || !this.isFlowNodeKind(after) || before !== NodeKind.VARIABLE_CLUSTER && after === NodeKind.VARIABLE_CLUSTER;
  };

  base.Emitter.prototype.emitExtraNewlineBefore = function(kind) {
    if (this.previousKind !== NodeKind.NULL && this.shouldEmitExtraNewlineBetween(this.previousKind, kind)) {
      this.builder._buffer += '\n';
    }

    this.previousKind = NodeKind.NULL;
  };

  base.Emitter.prototype.emitExtraNewlineAfter = function(kind) {
    this.previousKind = kind;
  };

  base.Emitter.prototype.emitAfterVariable = function(node) {
    var value = node.variableValue();

    if (value !== null) {
      this.builder._buffer += ' = ';
      this.emitExpression(value, Precedence.COMMA);
    }
  };

  base.Emitter.prototype.increaseIndent = function() {
    this.previousKind = NodeKind.NULL;
    this.indent += '  ';
  };

  base.Emitter.prototype.decreaseIndent = function() {
    this.indent = this.indent.slice(2, this.indent.length);
  };

  base.Emitter.prototype.emitBlock = function(node) {
    this.builder._buffer += ' {\n';
    this.increaseIndent();
    this.emitStatements(node.blockStatements());
    this.decreaseIndent();
    this.builder._buffer += this.indent + '}';
    this.previousKind = NodeKind.NULL;
  };

  base.Emitter.prototype.emitLastBlock = function(node) {
    this.emitBlock(node);
    this.builder._buffer += '\n';
  };

  base.Emitter.prototype.emitStatements = function(nodes) {
    for (var i = 0; i < nodes.length; i = i + 1 | 0) {
      var child = nodes[i];
      var kind = child.kind;
      var emitExtraNewline = kind !== NodeKind.MODIFIER && kind !== NodeKind.USING && kind !== NodeKind.ALIAS;

      if (emitExtraNewline) {
        this.emitExtraNewlineBefore(kind);
      }

      this.emitStatement(child);

      if (emitExtraNewline) {
        this.emitExtraNewlineAfter(kind);
      }
    }
  };

  base.Emitter.prototype.emitStatement = function(node) {
    switch (node.kind) {
    case 19:
    case 35:
      break;

    case 30:
      this.emitAssert(node);
      break;

    case 27:
      this.emitBreak(node);
      break;

    case 4:
      this.emitCase(node);
      break;

    case 28:
      this.emitContinue(node);
      break;

    case 25:
      this.emitDoWhile(node);
      break;

    case 32:
      this.emitExpressionStatement(node);
      break;

    case 22:
      this.emitFor(node);
      break;

    case 23:
      this.emitForEach(node);
      break;

    case 20:
      this.emitIf(node);
      break;

    case 34:
      this.emitStatements(node.modifierStatements());
      break;

    case 26:
      this.emitReturn(node);
      break;

    case 33:
      this.emitSwitch(node);
      break;

    case 29:
      this.emitThrow(node);
      break;

    case 21:
      this.emitTry(node);
      break;

    case 16:
      this.emitVariable(node.symbol);
      break;

    case 7:
      this.emitStatements(node.clusterVariables());
      break;

    case 24:
      this.emitWhile(node);
      break;

    default:
      throw new Error('assert false (src/emitters/base.sk:265:19)');
      break;
    }
  };

  base.Emitter.prototype.endStatement = function() {
    this.builder._buffer += ';\n';
  };

  base.Emitter.prototype.emitCase = function(node) {
    var values = node.caseValues().children;
    var block = node.caseBlock();

    if (values.length !== 0) {
      for (var i = 0; i < values.length; i = i + 1 | 0) {
        if (i !== 0) {
          this.builder._buffer += '\n';
        }

        this.builder._buffer += this.indent + 'case ';
        this.emitExpression(values[i], Precedence.LOWEST);
        this.builder._buffer += ':';
      }
    } else {
      this.builder._buffer += this.indent + 'default:';
    }

    this.builder._buffer += ' {\n';
    this.increaseIndent();
    this.emitStatements(block.blockStatements());

    if (!block.blockAlwaysEndsWithReturn()) {
      this.builder._buffer += this.indent + 'break;\n';
    }

    this.decreaseIndent();
    this.builder._buffer += this.indent + '}\n';
  };

  base.Emitter.prototype.emitSwitch = function(node) {
    var cases = node.switchCases().children;
    this.builder._buffer += this.indent + 'switch (';
    this.emitExpression(node.switchValue(), Precedence.LOWEST);
    this.builder._buffer += ') {\n';
    this.increaseIndent();
    this.emitStatements(cases);
    this.decreaseIndent();
    this.builder._buffer += this.indent + '}\n';
  };

  base.Emitter.prototype.recursiveEmitIfStatement = function(node) {
    var falseBlock = node.ifFalse();
    this.builder._buffer += 'if (';
    this.emitExpression(node.ifTest(), Precedence.LOWEST);
    this.builder._buffer += ')';
    this.emitBlock(node.ifTrue());

    if (falseBlock !== null) {
      var falseStatement = falseBlock.blockStatement();

      if (falseStatement !== null && falseStatement.kind === NodeKind.IF) {
        this.builder._buffer += ' else ';
        this.recursiveEmitIfStatement(falseStatement);
      } else {
        this.builder._buffer += ' else';
        this.emitBlock(falseBlock);
      }
    }
  };

  base.Emitter.prototype.emitThrow = function(node) {
    this.builder._buffer += this.indent + 'throw ';
    this.emitExpression(node.throwValue(), Precedence.LOWEST);
    this.endStatement();
  };

  base.Emitter.prototype.emitIf = function(node) {
    this.builder._buffer += this.indent;
    this.recursiveEmitIfStatement(node);
    this.builder._buffer += '\n';
  };

  base.Emitter.prototype.emitBeforeSubsequentForVariable = function(node) {
    this.builder._buffer += ', ';
  };

  base.Emitter.prototype.useWhileForAllLoops = function() {
    return false;
  };

  base.Emitter.prototype.emitForVariables = function(nodes) {
    this.emitTypeBeforeVariable(nodes[0].symbol);

    for (var i = 0; i < nodes.length; i = i + 1 | 0) {
      var node = nodes[i];

      if (i !== 0) {
        this.emitBeforeSubsequentForVariable(node);
      }

      this.builder._buffer += this.mangleName(node.symbol);
      this.emitAfterVariable(node);
    }
  };

  base.Emitter.prototype.insertStatementBeforeLoopContinue = function(node, update) {
    if (node.hasChildren()) {
      for (var i = 0; i < node.children.length; i = i + 1 | 0) {
        var child = node.children[i];

        if (child === null) {
          continue;
        }

        if (child.kind === NodeKind.CONTINUE) {
          node.insertChild(i, update.clone());
          i = i + 1 | 0;
        } else if (!in_NodeKind.isExpression(child.kind) && !in_NodeKind.isLoop(child.kind)) {
          this.insertStatementBeforeLoopContinue(child, update);
        }
      }
    }

    if (node.kind === NodeKind.BLOCK && in_NodeKind.isLoop(node.parent.kind)) {
      node.appendChild(update.clone());
    }
  };

  base.Emitter.prototype.emitFor = function(node) {
    var setup = node.forSetup();
    var test = node.forTest();
    var update = node.forUpdate();
    var block = node.forBlock();

    if (this.useWhileForAllLoops()) {
      if (setup !== null) {
        if (setup.kind === NodeKind.VARIABLE_CLUSTER) {
          this.emitStatement(setup);
        } else {
          this.builder._buffer += this.indent;
          this.emitExpression(setup, Precedence.LOWEST);
          this.builder._buffer += '\n';
        }
      }

      if (update !== null) {
        this.insertStatementBeforeLoopContinue(block, Node.createExpression(update.replaceWith(null)));
      }

      this.emitStatement(Node.createWhile(test !== null ? test.replaceWith(null) : Node.createBool(true), block.replaceWith(null)));
    } else {
      this.builder._buffer += this.indent + 'for (';

      if (setup !== null) {
        if (setup.kind === NodeKind.VARIABLE_CLUSTER) {
          this.emitForVariables(setup.clusterVariables());
        } else {
          this.emitExpression(setup, Precedence.LOWEST);
        }
      }

      if (test !== null) {
        this.builder._buffer += '; ';
        this.emitExpression(test, Precedence.LOWEST);
      } else {
        this.builder._buffer += ';';
      }

      if (update !== null) {
        this.builder._buffer += '; ';
        this.emitExpression(update, Precedence.LOWEST);
      } else {
        this.builder._buffer += ';';
      }

      this.builder._buffer += ')';
      this.emitLastBlock(block);
    }
  };

  base.Emitter.prototype.emitForEach = function(node) {
  };

  base.Emitter.prototype.emitControlStatementParentheses = function() {
    return true;
  };

  base.Emitter.prototype.emitWhile = function(node) {
    this.builder._buffer += this.indent + 'while ' + (this.emitControlStatementParentheses() ? '(' : '');
    this.emitExpression(node.whileTest(), Precedence.LOWEST);

    if (this.emitControlStatementParentheses()) {
      this.builder._buffer += ')';
    }

    this.emitLastBlock(node.whileBlock());
  };

  base.Emitter.prototype.emitDoWhile = function(node) {
    var test = node.whileTest();
    var block = node.whileBlock();

    if (this.useWhileForAllLoops()) {
      node.kind = NodeKind.WHILE;
      test.replaceWith(Node.createBool(true)).invertBooleanCondition(this.cache);
      this.insertStatementBeforeLoopContinue(block, Node.createIf(NodeKind.IF, test, Node.createBlock([Node.createBreak()]), null));
      this.emitWhile(node);
      return;
    }

    this.builder._buffer += this.indent + 'do';
    this.emitBlock(node.whileBlock());
    this.builder._buffer += this.indent + 'while ' + (this.emitControlStatementParentheses() ? '(' : '');
    this.emitExpression(node.whileTest(), Precedence.LOWEST);

    if (this.emitControlStatementParentheses()) {
      this.builder._buffer += ')';
    }

    this.endStatement();
  };

  base.Emitter.prototype.emitReturn = function(node) {
    var value = node.returnValue();

    if (value !== null) {
      this.builder._buffer += this.indent + 'return ';
      this.emitExpression(value, Precedence.LOWEST);
    } else {
      this.builder._buffer += this.indent + 'return';
    }

    this.endStatement();
  };

  base.Emitter.prototype.emitBreak = function(node) {
    this.builder._buffer += this.indent + 'break';
    this.endStatement();
  };

  base.Emitter.prototype.emitContinue = function(node) {
    this.builder._buffer += this.indent + 'continue';
    this.endStatement();
  };

  base.Emitter.prototype.emitExpressionStatement = function(node) {
    this.builder._buffer += this.indent;
    this.emitExpression(node.expressionValue(), Precedence.LOWEST);
    this.endStatement();
  };

  base.Emitter.prototype.emitExpression = function(node, precedence) {
    var kind = node.kind;

    switch (kind) {
    case 39:
      this.emitName(node);
      break;

    case 40:
      this.emitType(node.type);
      break;

    case 41:
      this.emitThis();
      break;

    case 42:
      this.emitHook(node, precedence);
      break;

    case 43:
      this.emitNull();
      break;

    case 44:
      this.emitBool(node);
      break;

    case 45:
      this.emitInt(node, precedence);
      break;

    case 46:
    case 47:
      this.emitReal(node);
      break;

    case 48:
      this.emitString(node);
      break;

    case 52:
    case 53:
    case 54:
      this.emitDot(node);
      break;

    case 55:
      this.emitCall(node, precedence);
      break;

    case 58:
      this.emitSequence(node, precedence);
      break;

    case 91:
      this.emitIndex(node, precedence);
      break;

    case 115:
      this.emitTernary(node, precedence);
      break;

    case 59:
      this.emitParameterize(node);
      break;

    case 60:
    case 61:
      this.emitCast(node, precedence);
      break;

    case 49:
      this.emitList(node, precedence);
      break;

    case 51:
      this.emitKeyValue(node);
      break;

    case 50:
      this.emitMap(node, precedence);
      break;

    case 56:
      this.emitSuperCall(node);
      break;

    case 62:
      this.emitExpression(node.quotedValue(), precedence);
      break;

    case 63:
      this.builder._buffer += 'var';
      break;

    default:
      if (in_NodeKind.isUnaryOperator(kind)) {
        this.emitUnary(node, precedence);
      } else if (in_NodeKind.isBinaryOperator(kind)) {
        this.emitBinary(node, precedence);
      } else {
        throw new Error('assert false (src/emitters/base.sk:542:16)');
      }
      break;
    }
  };

  base.Emitter.prototype.emitCommaSeparatedExpressions = function(nodes) {
    for (var i = 0; i < nodes.length; i = i + 1 | 0) {
      if (i !== 0) {
        this.builder._buffer += ', ';
      }

      this.emitExpression(nodes[i], Precedence.COMMA);
    }
  };

  base.Emitter.prototype.emitSequence = function(node, precedence) {
    var values = node.sequenceValues();

    if (values.length <= 1) {
      throw new Error('assert values.size() > 1 (src/emitters/base.sk:556:7)');
    }

    if (Precedence.COMMA <= precedence) {
      this.builder._buffer += '(';
    }

    this.emitCommaSeparatedExpressions(values);

    if (Precedence.COMMA <= precedence) {
      this.builder._buffer += ')';
    }
  };

  base.Emitter.prototype.hasUnaryStorageOperators = function() {
    return true;
  };

  base.Emitter.prototype.shouldEmitSpaceForUnaryOperator = function(node) {
    var value = node.unaryValue();
    var kind = node.kind;
    var valueKind = value.kind;

    if (kind === NodeKind.NEW || kind === NodeKind.DELETE || kind === NodeKind.POSITIVE && (valueKind === NodeKind.POSITIVE || valueKind === NodeKind.PREFIX_INCREMENT) || kind === NodeKind.NEGATIVE && (valueKind === NodeKind.NEGATIVE || valueKind === NodeKind.PREFIX_DECREMENT)) {
      return true;
    }

    return false;
  };

  base.Emitter.prototype.emitUnary = function(node, precedence) {
    var value = node.unaryValue();
    var kind = node.kind;

    if (in_NodeKind.isUnaryStorageOperator(kind) && !this.hasUnaryStorageOperators()) {
      if (Precedence.ASSIGN < precedence) {
        this.builder._buffer += '(';
      }

      this.emitExpression(value, Precedence.ASSIGN);
      this.builder._buffer += kind === NodeKind.PREFIX_INCREMENT || kind === NodeKind.POSTFIX_INCREMENT ? ' += 1' : ' -= 1';

      if (Precedence.ASSIGN < precedence) {
        this.builder._buffer += ')';
      }

      return;
    }

    if (kind === NodeKind.NEGATIVE && value.isNumberLessThanZero()) {
      value.content = value.kind === NodeKind.INT ? new IntContent(-value.asInt() | 0) : new DoubleContent(-value.asDouble());
      this.emitExpression(value, precedence);
      return;
    }

    var info = operatorInfo[kind];

    if (info.precedence < precedence) {
      this.builder._buffer += '(';
    }

    var isPostfix = info.precedence === Precedence.UNARY_POSTFIX;

    if (!isPostfix) {
      this.builder._buffer += info.text;

      if (this.shouldEmitSpaceForUnaryOperator(node)) {
        this.builder._buffer += ' ';
      }
    }

    this.emitExpression(value, info.precedence);

    if (isPostfix) {
      if (this.shouldEmitSpaceForUnaryOperator(node)) {
        this.builder._buffer += ' ';
      }

      this.builder._buffer += info.text;
    }

    if (info.precedence < precedence) {
      this.builder._buffer += ')';
    }
  };

  base.Emitter.prototype.emitBinary = function(node, precedence) {
    var info = operatorInfo[node.kind];

    if (info.precedence < precedence) {
      this.builder._buffer += '(';
    }

    this.emitExpression(node.binaryLeft(), in_Precedence.incrementIfRightAssociative(info.precedence, info.associativity));
    this.builder._buffer += ' ' + info.text + ' ';
    this.emitExpression(node.binaryRight(), in_Precedence.incrementIfLeftAssociative(info.precedence, info.associativity));

    if (info.precedence < precedence) {
      this.builder._buffer += ')';
    }
  };

  base.Emitter.prototype.emitIndex = function(node, precedence) {
    this.emitExpression(node.binaryLeft(), Precedence.MEMBER);
    this.builder._buffer += '[';
    this.emitExpression(node.binaryRight(), Precedence.LOWEST);
    this.builder._buffer += ']';
  };

  base.Emitter.prototype.emitTernary = function(node, precedence) {
    if (Precedence.ASSIGN < precedence) {
      this.builder._buffer += '(';
    }

    this.emitExpression(node.ternaryLeft(), Precedence.MEMBER);
    this.builder._buffer += '[';
    this.emitExpression(node.ternaryMiddle(), Precedence.LOWEST);
    this.builder._buffer += '] = ';
    this.emitExpression(node.ternaryRight(), Precedence.ASSIGN);

    if (Precedence.ASSIGN < precedence) {
      this.builder._buffer += ')';
    }
  };

  base.Emitter.prototype.emitParameterize = function(node) {
    this.emitExpression(node.parameterizeValue(), Precedence.MEMBER);
    this.builder._buffer += '<';
    this.emitCommaSeparatedExpressions(node.parameterizeTypes());
    this.builder._buffer += '>';
  };

  base.Emitter.prototype.emitDot = function(node) {
    var dotName = node.dotName();
    this.emitExpression(node.dotTarget(), Precedence.MEMBER);
    this.builder._buffer += '.';
    this.builder._buffer += node.symbol !== null ? this.mangleName(node.symbol) : dotName.asString();
  };

  base.Emitter.prototype.emitCall = function(node, precedence) {
    var value = node.callValue();

    if (value.kind === NodeKind.TYPE) {
      this.builder._buffer += 'new ';
    }

    this.emitExpression(value, Precedence.UNARY_POSTFIX);
    this.builder._buffer += '(';
    this.emitCommaSeparatedExpressions(node.callArguments());
    this.builder._buffer += ')';
  };

  base.Emitter.prototype.emitParenthesizedCast = function(type, node, precedence) {
    if (Precedence.UNARY_PREFIX < precedence) {
      this.builder._buffer += '(';
    }

    this.builder._buffer += '(';
    this.emitNormalType(type);
    this.builder._buffer += ')';
    this.emitExpression(node, Precedence.UNARY_PREFIX);

    if (Precedence.UNARY_PREFIX < precedence) {
      this.builder._buffer += ')';
    }
  };

  base.Emitter.prototype.shouldEmitCast = function(node) {
    return node.kind === NodeKind.CAST;
  };

  base.Emitter.prototype.emitCast = function(node, precedence) {
    if (this.shouldEmitCast(node)) {
      this.emitParenthesizedCast(node.castType().type, node.castValue(), precedence);
    } else {
      this.emitExpression(node.castValue(), precedence);
    }
  };

  base.Emitter.prototype.emitList = function(node, precedence) {
    this.builder._buffer += '[';
    this.emitCommaSeparatedExpressions(node.listValues());
    this.builder._buffer += ']';
  };

  base.Emitter.prototype.emitKeyValue = function(node) {
    this.emitExpression(node.itemKey(), Precedence.COMMA);
    this.builder._buffer += ': ';
    this.emitExpression(node.itemValue(), Precedence.COMMA);
  };

  base.Emitter.prototype.emitMap = function(node, precedence) {
    var items = node.mapItems();
    var space = items.length > 0 ? ' ' : '';
    this.builder._buffer += '{' + space;
    this.emitCommaSeparatedExpressions(items);
    this.builder._buffer += space + '}';
  };

  base.Emitter.prototype.emitSuperCall = function(node) {
    this.builder._buffer += 'super(';
    this.emitCommaSeparatedExpressions(node.superCallArguments());
    this.builder._buffer += ')';
  };

  base.Emitter.prototype.emitName = function(node) {
    var symbol = node.symbol;
    this.builder._buffer += symbol !== null ? in_SymbolKind.isInstance(symbol.kind) ? this.mangleName(symbol) : this.fullName(symbol) : node.asString();
  };

  base.Emitter.prototype.emitThis = function() {
    this.builder._buffer += 'this';
  };

  base.Emitter.prototype.hookNeedsExplicitCast = function(node) {
    return false;
  };

  base.Emitter.prototype.emitHook = function(node, precedence) {
    var trueValue = node.hookTrue();

    if (Precedence.ASSIGN < precedence) {
      this.builder._buffer += '(';
    }

    this.emitExpression(node.hookTest(), Precedence.LOGICAL_OR);
    this.builder._buffer += ' ? ';

    if (this.hookNeedsExplicitCast(trueValue)) {
      this.emitParenthesizedCast(node.type, trueValue, precedence);
    } else {
      this.emitExpression(trueValue, Precedence.ASSIGN);
    }

    this.builder._buffer += ' : ';
    this.emitExpression(node.hookFalse(), Precedence.ASSIGN);

    if (Precedence.ASSIGN < precedence) {
      this.builder._buffer += ')';
    }
  };

  base.Emitter.prototype.emitNull = function() {
    this.builder._buffer += 'null';
  };

  base.Emitter.prototype.emitBool = function(node) {
    this.builder._buffer += node.asBool();
  };

  base.Emitter.prototype.emitInt = function(node, precedence) {
    if (node.type !== null && node.type.isEnum() && node.symbol !== null) {
      this.emitName(node);
    } else {
      this.builder._buffer += node.asInt();
    }
  };

  base.Emitter.prototype.emitReal = function(node) {
    this.builder._buffer += node.asDouble();
  };

  base.Emitter.prototype.emitString = function(node) {
    this.builder._buffer += quoteString(node.asString(), 34);
  };

  base.Emitter.prototype.emitNormalType = function(type) {
    this.emitType(type);
  };

  base.Emitter.prototype.emitType = function(type) {
    if (type.isFunction()) {
      throw new Error('assert !type.isFunction() (src/emitters/base.sk:769:7)');
    }

    if (type.isQuoted()) {
      this.emitExpression(type.symbol.node, Precedence.LOWEST);
    } else {
      this.builder._buffer += this.fullName(type.symbol);

      if (type.isParameterized()) {
        this.builder._buffer += '<';

        for (var i = 0; i < type.substitutions.length; i = i + 1 | 0) {
          if (i !== 0) {
            this.builder._buffer += ', ';
          }

          this.emitNormalType(type.substitutions[i]);
        }

        this.builder._buffer += '>';
      }
    }
  };

  base.Emitter.prototype.mangleName = function(symbol) {
    if (symbol.emitAs !== null) {
      return symbol.emitAs.value;
    }

    if (symbol.kind === SymbolKind.CONSTRUCTOR_FUNCTION) {
      return this.mangleName(symbol.enclosingSymbol);
    }

    if (symbol.name in this.isKeyword && !symbol.isImport()) {
      return '_' + symbol.name + '_';
    }

    return symbol.name;
  };

  base.Emitter.prototype.useDoubleColonForEnclosingSymbols = function(symbol) {
    return false;
  };

  base.Emitter.prototype.fullName = function(symbol) {
    var name = this.mangleName(symbol);

    if (symbol.enclosingSymbol !== null && symbol.enclosingSymbol.kind !== SymbolKind.GLOBAL_NAMESPACE && !in_SymbolKind.isParameter(symbol.kind)) {
      return this.fullName(symbol.enclosingSymbol) + (this.useDoubleColonForEnclosingSymbols(symbol.enclosingSymbol) ? '::' : '.') + name;
    }

    return name;
  };

  var cpp = {};

  cpp.Pass = {
    NONE: 0,
    FORWARD_DECLARE_TYPES: 1,
    FORWARD_DECLARE_CODE: 2,
    IMPLEMENT_CODE: 3
  };

  cpp.CppEmitType = {
    BARE: 0,
    NORMAL: 1,
    DECLARATION: 2
  };

  cpp.Emitter = function(_0) {
    base.Emitter.call(this, _0);
    this.includes = Object.create(null);
    this.usedAssert = false;
    this.usedMath = false;
    this.isMarkSweep = false;
    this.pass = cpp.Pass.NONE;
  };

  $extends(cpp.Emitter, base.Emitter);

  cpp.Emitter.prototype.visitProgram = function(node) {
    var collector = new Collector(node, SortTypes.SORT_BY_INHERITANCE_AND_CONTAINMENT);
    this.isMarkSweep = this.options.memoryManagement === MemoryManagement.MARK_SWEEP;
    this.pass = cpp.Pass.FORWARD_DECLARE_TYPES;
    this.visitCollector(collector);
    this.adjustNamespace(null);
    this.forceEmitExtraNewline();
    this.pass = cpp.Pass.FORWARD_DECLARE_CODE;
    this.visitCollector(collector);
    this.adjustNamespace(null);
    this.forceEmitExtraNewline();
    this.pass = cpp.Pass.IMPLEMENT_CODE;
    this.visitCollector(collector);
    this.adjustNamespace(null);
    this.emitEntryPoint();
    this.wrapEmittedCode();
  };

  cpp.Emitter.prototype.emitEntryPoint = function() {
    var entryPointSymbol = this.resolver.entryPointSymbol;

    if (entryPointSymbol !== null) {
      var type = entryPointSymbol.type;
      var hasArguments = type.argumentTypes().length > 0;
      var hasReturnValue = type.resultType() === this.cache.intType;
      this.emitExtraNewlineBefore(NodeKind.NULL);
      this.builder._buffer += this.indent + 'int main(' + (hasArguments ? 'int argc, char **argv' : '') + ') {\n';
      this.increaseIndent();

      if (hasArguments) {
        if (!('<string>' in this.includes)) {
          throw new Error('assert "<string>" in includes (src/emitters/cpp.sk:61:11)');
        }

        var listType = 'List<' + this.mangleName(this.cache.stringType.symbol) + '>';
        this.builder._buffer += this.indent + (this.isMarkSweep ? 'gc::Root<' + listType + '> ' : listType + ' *') + 'args = new ' + listType + '();\n';
        this.builder._buffer += this.indent + 'args->_data.insert(args->_data.begin(), argv + 1, argv + argc);\n';
      }

      this.builder._buffer += this.indent + (hasReturnValue ? 'return ' : '') + this.fullName(entryPointSymbol) + '(' + (hasArguments ? 'args' : '') + ');\n';
      this.decreaseIndent();
      this.builder._buffer += this.indent + '}\n';
    }
  };

  cpp.Emitter.prototype.wrapEmittedCode = function() {
    var useFastHack = this.options.memoryManagement === MemoryManagement.NONE_FAST;

    if (this.usedAssert) {
      this.includes['<cassert>'] = true;
    }

    if (useFastHack) {
      this.includes['<cassert>'] = true;
      this.includes['<new>'] = true;
      this.includes[this.options.config === CompilerConfig.WINDOWS ? '<windows.h>' : '<sys/mman.h>'] = true;
    }

    if (this.isMarkSweep) {
      this.includes['<stack>'] = true;
      this.includes['<type_traits>'] = true;
      this.includes['<unordered_map>'] = true;
      this.includes['<unordered_set>'] = true;
      this.includes['<vector>'] = true;
    }

    if (this.usedMath) {
      this.includes['<cmath>'] = true;
    }

    var headers = Object.keys(this.includes);
    headers.sort(bindCompare(StringComparison.INSTANCE));

    if (headers.length !== 0) {
      for (var i = 0; i < headers.length; i = i + 1 | 0) {
        var name = headers[i];
        var size = name.length;
        this.prepended._buffer += '#include ' + (size === 0 || name.charCodeAt(0) !== 60 || name.charCodeAt(size - 1 | 0) !== 62 ? '"' + name + '"' : name) + '\n';
      }

      this.prepended._buffer += '\n';
    }

    if (this.isMarkSweep) {
      this.prepended._buffer += "namespace gc {\n  struct GC;\n\n  struct Object {\n    Object(); // Adds this object to the global linked list of objects\n    virtual ~Object() {}\n\n  private:\n    friend GC;\n    Object *__gc_next = nullptr; // GC space overhead is one pointer per object\n    virtual void __gc_mark() = 0; // Recursively marks all child objects\n    Object(const Object &); // Prevent copying\n    Object &operator = (const Object &); // Prevent copying\n  };\n\n  struct UntypedRoot {\n    ~UntypedRoot();\n\n  protected:\n    friend GC;\n    UntypedRoot &operator = (const UntypedRoot &root) { _object = root._object; return *this; }\n    UntypedRoot(const UntypedRoot &root) : UntypedRoot(root._object) {}\n    UntypedRoot() : _previous(this), _next(this), _object() {} // Only used for the first root\n    UntypedRoot(Object *object); // Adds this root to the circular doubly-linked list of roots\n    UntypedRoot *_previous;\n    UntypedRoot *_next;\n    Object *_object;\n  };\n\n  template <typename T>\n  struct Root : UntypedRoot {\n    Root(T *object = nullptr) : UntypedRoot(object) {}\n    operator T * () const { return dynamic_cast<T *>(_object); }\n    T *operator -> () const { return dynamic_cast<T *>(_object); }\n    Root<T> &operator = (T *value) { _object = value; return *this; }\n  };\n\n  void collect();\n  void mark(Object *object);\n\n  template <typename T>\n  using VoidIfNotObject = typename std::enable_if<!std::is_base_of<Object, typename std::remove_pointer<T>::type>::value, void>::type;\n\n  template <typename T>\n  inline VoidIfNotObject<T> mark(const T &value) {} // Don't mark anything that's not an object\n\n  template <typename T>\n  inline void mark(const std::vector<T> &values) {\n    for (const auto &value : values) {\n      gc::mark(value);\n    }\n  }\n\n  template <typename K, typename V>\n  inline void mark(const std::unordered_map<K, V> &values) {\n    for (const auto &value : values) {\n      gc::mark(value.second);\n    }\n  }\n}\n";
      this.prepended._buffer += '\n';
      this.builder._buffer += '\n';
      this.builder._buffer += "namespace gc {\n  static std::unordered_set<Object *> marked;\n  static std::stack<Object *> stack;\n  static Object *latest;\n\n  struct GC {\n    // The first root is the start of a doubly-linked list of roots. It's returned as\n    // a static local variable to avoid trouble from C++ initialization order. Roots\n    // are global variables and initialization order of global variables is undefined.\n    static UntypedRoot *start() {\n      static UntypedRoot start;\n      return &start;\n    }\n\n    // Marking must be done with an explicit stack to avoid call stack overflow\n    static void mark() {\n      for (auto end = start(), root = end->_next; root != end; root = root->_next) {\n        gc::mark(root->_object);\n      }\n      while (!stack.empty()) {\n        auto object = stack.top();\n        stack.pop();\n        object->__gc_mark();\n      }\n    }\n\n    // Sweeping removes unmarked objects from the linked list and deletes them\n    static void sweep() {\n      for (Object *previous = nullptr, *current = latest, *next; current; current = next) {\n        next = current->__gc_next;\n        if (!marked.count(current)) {\n          (previous ? previous->__gc_next : latest) = next;\n          delete current;\n        } else {\n          previous = current;\n        }\n      }\n      marked.clear();\n    }\n  };\n\n  UntypedRoot::UntypedRoot(Object *object) : _previous(GC::start()), _next(_previous->_next), _object(object) {\n    _previous->_next = this;\n    _next->_previous = this;\n  }\n\n  UntypedRoot::~UntypedRoot() {\n    _previous->_next = _next;\n    _next->_previous = _previous;\n  }\n\n  Object::Object() : __gc_next(latest) {\n    latest = this;\n  }\n\n  void collect() {\n    GC::mark();\n    GC::sweep();\n  }\n\n  void mark(Object *object) {\n    if (object && !marked.count(object)) {\n      marked.insert(object);\n      stack.push(object);\n    }\n  }\n}\n";
    }

    if (useFastHack) {
      this.builder._buffer += '\n';
      this.builder._buffer += 'static void *_fast_next_;\nstatic size_t _fast_available_;\n\nstatic void *_fast_allocate_(size_t size) {\n  enum {\n    CHUNK_SIZE = 1 << 20,\n    ALIGN = 8,\n  };\n  size = (size + ALIGN - 1) & ~(ALIGN - 1);\n  if (_fast_available_ < size) {\n    size_t chunk = (size + CHUNK_SIZE - 1) & ~(CHUNK_SIZE - 1);\n    assert(size <= chunk);\n    #if _WIN32\n      _fast_next_ = VirtualAlloc(nullptr, chunk, MEM_COMMIT, PAGE_READWRITE);\n      assert(_fast_next_ != nullptr);\n    #else\n      _fast_next_ = mmap(nullptr, chunk, PROT_READ | PROT_WRITE, MAP_ANON | MAP_PRIVATE, -1, 0);\n      assert(_fast_next_ != MAP_FAILED);\n    #endif\n    _fast_available_ = chunk;\n  }\n  void *data = _fast_next_;\n  _fast_next_ = (char *)_fast_next_ + size;\n  _fast_available_ -= size;\n  return data;\n}\n\nvoid *operator new (size_t size) { return _fast_allocate_(size); }\nvoid *operator new [] (size_t size) { return _fast_allocate_(size); }\nvoid operator delete (void *data) throw() {}\nvoid operator delete [] (void *data) throw() {}\n\n// Overriding malloc() and free() is really hard on Windows for some reason\n#if !_WIN32\n  extern "C" void *malloc(size_t size) { return _fast_allocate_(size); }\n  extern "C" void free(void *data) {}\n#endif\n';
    }
  };

  cpp.Emitter.prototype.handleSymbol = function(symbol) {
    if (symbol.neededIncludes !== null) {
      for (var i = 0; i < symbol.neededIncludes.length; i = i + 1 | 0) {
        this.includes[symbol.neededIncludes[i]] = true;
      }
    }
  };

  cpp.Emitter.prototype.shouldEmitExtraNewlineBetween = function(before, after) {
    if (this.pass === cpp.Pass.FORWARD_DECLARE_TYPES) {
      return before === NodeKind.NAMESPACE || after === NodeKind.NAMESPACE || in_NodeKind.isEnum(before) || in_NodeKind.isEnum(after);
    }

    return base.Emitter.prototype.shouldEmitExtraNewlineBetween.call(this, before, after) && (this.pass !== cpp.Pass.FORWARD_DECLARE_CODE || !in_NodeKind.isFunction(before) || !in_NodeKind.isFunction(after));
  };

  cpp.Emitter.prototype.emitTypeParameters = function(symbol) {
    if (this.pass === cpp.Pass.IMPLEMENT_CODE && symbol.enclosingSymbol.hasParameters()) {
      this.emitTypeParameters(symbol.enclosingSymbol);
    }

    if (symbol.hasParameters()) {
      this.builder._buffer += this.indent + 'template <';

      for (var i = 0; i < symbol.parameters.length; i = i + 1 | 0) {
        if (i !== 0) {
          this.builder._buffer += ', ';
        }

        this.builder._buffer += 'typename ' + this.mangleName(symbol.parameters[i]);
      }

      this.builder._buffer += '>\n';
    }
  };

  cpp.Emitter.prototype.emitEnumValues = function(symbol) {
    var members = symbol.type.sortedMembers();
    var isEnumFlags = symbol.kind === SymbolKind.ENUM_FLAGS;
    var isFirst = true;
    var previous = -1;

    for (var i = 0; i < members.length; i = i + 1 | 0) {
      var member = members[i].symbol;
      this.handleSymbol(member);

      if (member.isEnumValue()) {
        if (isFirst) {
          isFirst = false;
        } else {
          this.builder._buffer += ',\n';
        }

        var value = member.constant.asInt();
        this.builder._buffer += this.indent + this.mangleName(member);

        if (isEnumFlags || value !== (previous + 1 | 0)) {
          this.builder._buffer += ' = ' + value;
        }

        previous = value;
      }
    }

    if (!isFirst) {
      this.builder._buffer += '\n';
    }
  };

  cpp.Emitter.prototype.emitTypeDeclaration = function(symbol) {
    var needsMark = this.isMarkSweep && symbol.kind === SymbolKind.CLASS;
    this.handleSymbol(symbol);

    if (in_SymbolKind.isObject(symbol.kind)) {
      if (this.pass !== cpp.Pass.IMPLEMENT_CODE) {
        this.adjustNamespace(symbol);
        this.emitExtraNewlineBefore(symbol.node.kind);
        this.emitTypeParameters(symbol);
        this.builder._buffer += this.indent + 'struct ' + this.mangleName(symbol);

        if (this.pass === cpp.Pass.FORWARD_DECLARE_CODE) {
          var needsObject = this.isMarkSweep && (symbol.kind === SymbolKind.INTERFACE || symbol.type.baseClass() === null);

          if (needsObject) {
            this.builder._buffer += ' : virtual gc::Object';
          }

          if (symbol.type.hasRelevantTypes()) {
            var types = symbol.type.relevantTypes;

            if (!needsObject) {
              this.builder._buffer += ' : ';
            }

            for (var i = 0; i < types.length; i = i + 1 | 0) {
              if (i !== 0 || needsObject) {
                this.builder._buffer += ', ';
              }

              this.emitCppType(types[i], cpp.CppEmitType.BARE);
            }
          }

          this.builder._buffer += ' {\n';
          this.increaseIndent();
          this.emitTypeMembers(symbol);

          if (needsMark) {
            this.emitMarkFunction(symbol);
          }

          this.decreaseIndent();
          this.builder._buffer += this.indent + '}';
        }

        this.builder._buffer += ';\n';
        this.emitExtraNewlineAfter(symbol.node.kind);
      } else {
        this.emitTypeMembers(symbol);

        if (needsMark) {
          this.emitMarkFunction(symbol);
        }
      }
    } else if (symbol.kind === SymbolKind.ENUM) {
      if (this.pass === cpp.Pass.FORWARD_DECLARE_TYPES) {
        this.adjustNamespace(symbol);
        this.emitExtraNewlineBefore(NodeKind.ENUM);
        this.builder._buffer += this.indent + 'enum struct ' + this.mangleName(symbol) + ' {\n';
        this.increaseIndent();
        this.emitEnumValues(symbol);
        this.decreaseIndent();
        this.builder._buffer += this.indent + '};\n';
        this.emitExtraNewlineAfter(NodeKind.ENUM);
      }
    } else if (symbol.kind === SymbolKind.ENUM_FLAGS) {
      if (this.pass === cpp.Pass.FORWARD_DECLARE_TYPES) {
        this.adjustNamespace(symbol);
        this.emitExtraNewlineBefore(NodeKind.ENUM_FLAGS);
        this.builder._buffer += this.indent + 'namespace ' + this.mangleName(symbol) + ' {\n';
        this.increaseIndent();
        this.builder._buffer += this.indent + 'enum {\n';
        this.increaseIndent();
        this.emitEnumValues(symbol);
        this.decreaseIndent();
        this.builder._buffer += this.indent + '};\n';
        this.decreaseIndent();
        this.builder._buffer += this.indent + '}\n';
        this.emitExtraNewlineAfter(NodeKind.ENUM_FLAGS);
      }
    }
  };

  cpp.Emitter.prototype.emitMarkFunction = function(symbol) {
    if (this.isMarkSweep && symbol.kind === SymbolKind.CLASS) {
      if (this.pass === cpp.Pass.FORWARD_DECLARE_CODE) {
        this.emitExtraNewlineBefore(NodeKind.FUNCTION);
        this.builder._buffer += this.indent + 'virtual void __gc_mark();\n';
        this.emitExtraNewlineAfter(NodeKind.FUNCTION);
      } else if (this.pass === cpp.Pass.IMPLEMENT_CODE) {
        this.emitExtraNewlineBefore(NodeKind.FUNCTION);
        this.emitTypeParameters(symbol);
        this.builder._buffer += this.indent + 'void ';
        this.emitEnclosingSymbolPrefix(symbol);
        this.builder._buffer += '__gc_mark() {\n';
        this.increaseIndent();

        var baseClass = symbol.type.baseClass();

        if (baseClass !== null) {
          this.builder._buffer += this.indent + this.mangleName(baseClass.symbol) + '::__gc_mark();\n';
        }

        var members = symbol.type.sortedMembers();

        for (var i = 0; i < members.length; i = i + 1 | 0) {
          var member = members[i].symbol;

          if (member.kind === SymbolKind.INSTANCE_VARIABLE && member.enclosingSymbol === symbol && !member.type.isPrimitive() && !member.type.isEnum()) {
            this.builder._buffer += this.indent + 'gc::mark(' + this.mangleName(member) + ');\n';
          }
        }

        this.decreaseIndent();
        this.builder._buffer += this.indent + '}\n';
        this.emitExtraNewlineAfter(NodeKind.FUNCTION);
      }
    }
  };

  cpp.Emitter.prototype.emitEnclosingSymbolPrefix = function(enclosingSymbol) {
    if (enclosingSymbol !== null && enclosingSymbol.kind !== SymbolKind.GLOBAL_NAMESPACE) {
      this.builder._buffer += this.fullName(enclosingSymbol);

      if (enclosingSymbol.hasParameters()) {
        this.builder._buffer += '<';

        for (var i = 0; i < enclosingSymbol.parameters.length; i = i + 1 | 0) {
          if (i !== 0) {
            this.builder._buffer += ', ';
          }

          this.builder._buffer += this.mangleName(enclosingSymbol.parameters[i]);
        }

        this.builder._buffer += '>';
      }

      this.builder._buffer += '::';
    }
  };

  cpp.Emitter.prototype.emitFunction = function(symbol) {
    this.handleSymbol(symbol);

    if (this.pass !== cpp.Pass.FORWARD_DECLARE_TYPES) {
      var node = symbol.node;
      var block = node.functionBlock();

      if (block !== null || this.pass === cpp.Pass.FORWARD_DECLARE_CODE) {
        this.adjustNamespace(this.pass === cpp.Pass.FORWARD_DECLARE_CODE ? symbol : null);
        this.emitExtraNewlineBefore(node.kind);
        this.emitTypeParameters(symbol);
        this.builder._buffer += this.indent;

        if (symbol.isExternC() && (this.pass === cpp.Pass.FORWARD_DECLARE_CODE || this.pass === cpp.Pass.IMPLEMENT_CODE)) {
          this.builder._buffer += 'extern "C" ';
        }

        if (this.pass === cpp.Pass.FORWARD_DECLARE_CODE) {
          if (symbol.isStatic()) {
            this.builder._buffer += 'static ';
          }

          if (symbol.isVirtual()) {
            this.builder._buffer += 'virtual ';
          }
        }

        if (symbol.kind !== SymbolKind.CONSTRUCTOR_FUNCTION) {
          this.emitCppType(symbol.type.resultType(), cpp.CppEmitType.DECLARATION);
        }

        if (this.pass === cpp.Pass.IMPLEMENT_CODE) {
          this.emitEnclosingSymbolPrefix(symbol.enclosingSymbol);
        }

        this.builder._buffer += this.mangleName(symbol);
        this.emitFunctionArguments(symbol);

        if (block === null) {
          this.builder._buffer += ' = 0;';
        } else if (this.pass === cpp.Pass.FORWARD_DECLARE_CODE) {
          this.builder._buffer += ';';
        } else {
          if (symbol.kind === SymbolKind.CONSTRUCTOR_FUNCTION) {
            var superInitializer = node.superInitializer();
            var memberInitializers = node.memberInitializers();
            var superCallArguments = superInitializer !== null ? superInitializer.superCallArguments() : null;
            var hasSuperInitializer = superInitializer !== null && superCallArguments.length > 0;
            var hasMemberInitializers = memberInitializers !== null && memberInitializers.hasChildren();

            if (hasSuperInitializer || hasMemberInitializers) {
              this.builder._buffer += ' : ';

              if (hasSuperInitializer) {
                this.builder._buffer += this.fullName(superInitializer.symbol.enclosingSymbol) + '(';
                this.emitCommaSeparatedExpressions(superInitializer.superCallArguments());
                this.builder._buffer += ')';

                if (hasMemberInitializers) {
                  this.builder._buffer += ', ';
                }
              }

              if (hasMemberInitializers) {
                for (var i = 0; i < memberInitializers.children.length; i = i + 1 | 0) {
                  var initializer = memberInitializers.children[i];
                  var value = initializer.memberInitializerValue();

                  if (i !== 0) {
                    this.builder._buffer += ', ';
                  }

                  this.builder._buffer += this.mangleName(initializer.symbol) + '(';

                  if (value.kind !== NodeKind.ERROR) {
                    this.emitExpression(value, Precedence.LOWEST);
                  }

                  this.builder._buffer += ')';
                }
              }
            }
          }

          this.emitBlock(block);
        }

        this.builder._buffer += '\n';
        this.emitExtraNewlineAfter(node.kind);
      }
    }
  };

  cpp.Emitter.prototype.shouldEmitSpaceForUnaryOperator = function(node) {
    return in_NodeKind.isUnaryTypeOperator(node.kind) ? true : base.Emitter.prototype.shouldEmitSpaceForUnaryOperator.call(this, node);
  };

  cpp.Emitter.prototype.emitTypeBeforeVariable = function(symbol) {
    if (this.isMarkSweep && symbol.kind === SymbolKind.GLOBAL_VARIABLE && symbol.type.isReference()) {
      this.builder._buffer += 'gc::Root<';
      this.emitCppType(symbol.type, cpp.CppEmitType.BARE);
      this.builder._buffer += '> ';
    } else {
      this.emitCppType(symbol.type, cpp.CppEmitType.DECLARATION);
    }
  };

  cpp.Emitter.prototype.emitFreeVariable = function(symbol) {
    if (in_SymbolKind.isNamespace(symbol.enclosingSymbol.kind)) {
      this.emitVariable(symbol);
    }
  };

  cpp.Emitter.prototype.emitVariable = function(symbol) {
    this.handleSymbol(symbol);

    if (this.pass !== cpp.Pass.FORWARD_DECLARE_TYPES && (this.pass === cpp.Pass.FORWARD_DECLARE_CODE || symbol.kind !== SymbolKind.INSTANCE_VARIABLE)) {
      this.adjustNamespace(this.pass === cpp.Pass.FORWARD_DECLARE_CODE ? symbol : null);
      this.emitExtraNewlineBefore(symbol.node.kind);
      this.builder._buffer += this.indent;

      if (symbol.isExternC() && (this.pass === cpp.Pass.FORWARD_DECLARE_CODE || this.pass === cpp.Pass.IMPLEMENT_CODE)) {
        this.builder._buffer += 'extern "C" ';
      } else if (this.pass === cpp.Pass.FORWARD_DECLARE_CODE && in_SymbolKind.isGlobal(symbol.kind)) {
        this.builder._buffer += symbol.isStatic() ? 'static ' : 'extern ';
      }

      this.emitTypeBeforeVariable(symbol);

      if (this.pass === cpp.Pass.FORWARD_DECLARE_CODE) {
        this.builder._buffer += this.mangleName(symbol);
      } else {
        this.builder._buffer += this.fullName(symbol);
        this.emitAfterVariable(symbol.node);
      }

      this.builder._buffer += ';\n';
      this.emitExtraNewlineAfter(symbol.node.kind);
    }
  };

  cpp.Emitter.prototype.emitFunctionArgument = function(symbol) {
    var useConstReference = symbol.name === 'this' && symbol.type.isString(this.cache);

    if (useConstReference) {
      this.builder._buffer += 'const ';
    }

    this.emitCppType(symbol.type, cpp.CppEmitType.DECLARATION);

    if (useConstReference) {
      this.builder._buffer += '&';
    }

    this.builder._buffer += this.mangleName(symbol);
    this.emitAfterVariable(symbol.node);
  };

  cpp.Emitter.prototype.emitTry = function(node) {
    var catches = node.catches();
    var finallyBlock = node.finallyBlock();
    this.builder._buffer += this.indent + 'try';
    this.emitBlock(node.tryBlock());

    for (var i = 0; i < catches.length; i = i + 1 | 0) {
      var catchNode = catches[i];
      var variable = catchNode.catchVariable();
      this.builder._buffer += ' catch (';

      if (variable !== null) {
        this.emitCppType(variable.symbol.type, cpp.CppEmitType.DECLARATION);
        this.builder._buffer += this.mangleName(variable.symbol);
      } else {
        this.builder._buffer += '...';
      }

      this.builder._buffer += ')';
      this.emitBlock(catchNode.catchBlock());
    }

    if (finallyBlock !== null) {
      this.builder._buffer += ' finally';
      this.emitBlock(finallyBlock);
    }

    this.builder._buffer += '\n';
  };

  cpp.Emitter.prototype.emitBeforeSubsequentForVariable = function(node) {
    var type = node.symbol.type;
    this.builder._buffer += type.isReference() || type.isQuoted() && type.symbol.node.kind === NodeKind.POSTFIX_DEREFERENCE ? ', *' : type.isQuoted() && type.symbol.node.kind === NodeKind.POSTFIX_REFERENCE ? ', &' : ', ';
  };

  cpp.Emitter.prototype.emitForEach = function(node) {
    var symbol = node.forEachVariable().symbol;
    this.builder._buffer += this.indent + 'for (';
    this.emitTypeBeforeVariable(symbol);
    this.builder._buffer += this.mangleName(symbol);
    this.builder._buffer += ' : ';
    this.emitExpression(node.forEachValue(), Precedence.LOWEST);
    this.builder._buffer += ')';
    this.emitBlock(node.forEachBlock());
    this.builder._buffer += '\n';
  };

  cpp.Emitter.prototype.emitAssert = function(node) {
    this.builder._buffer += this.indent + 'assert(';
    this.emitExpression(node.assertValue(), Precedence.LOWEST);
    this.builder._buffer += ');\n';
    this.usedAssert = true;
  };

  cpp.Emitter.prototype.emitBinary = function(node, precedence) {
    if (node.parent.kind === NodeKind.LOGICAL_OR && node.kind === NodeKind.LOGICAL_AND || node.parent.kind === NodeKind.BITWISE_OR && node.kind === NodeKind.BITWISE_AND) {
      precedence = Precedence.MEMBER;
    }

    base.Emitter.prototype.emitBinary.call(this, node, precedence);
  };

  cpp.Emitter.prototype.emitNull = function() {
    this.builder._buffer += 'nullptr';
  };

  cpp.Emitter.prototype.emitReal = function(node) {
    var value = node.asDouble();

    if (value === math.INFINITY) {
      this.usedMath = true;
      this.builder._buffer += 'INFINITY';
    } else if (value === -math.INFINITY) {
      this.usedMath = true;
      this.builder._buffer += '-INFINITY';
    } else if (value !== value) {
      this.usedMath = true;
      this.builder._buffer += 'NAN';
    } else {
      this.builder._buffer += doubleToStringWithDot(value) + (node.kind === NodeKind.FLOAT ? 'f' : '');
    }
  };

  cpp.Emitter.needsWrappedStringConstructor = function(node) {
    var parent = node.parent;

    switch (parent.kind) {
    case 55:
      return node === parent.callValue();

    case 42:
      return parent.hookTrue() === node && parent.hookFalse().kind === NodeKind.STRING;

    case 81:
      return parent.binaryLeft() === node && parent.binaryRight().kind === NodeKind.STRING;

    case 104:
    case 105:
    case 16:
    case 6:
    case 26:
      return false;

    default:
      return true;
    }
  };

  cpp.Emitter.prototype.emitString = function(node) {
    var content = node.asString();
    var needsLength = content.indexOf('\0') !== -1;
    var needsWrap = needsLength || cpp.Emitter.needsWrappedStringConstructor(node);

    if (needsWrap) {
      this.handleSymbol(this.cache.stringType.symbol);
      this.builder._buffer += this.mangleName(this.cache.stringType.symbol) + '(';
    }

    base.Emitter.prototype.emitString.call(this, node);

    if (needsWrap) {
      if (needsLength) {
        this.builder._buffer += ', ' + content.length;
      }

      this.builder._buffer += ')';
    }
  };

  cpp.Emitter.prototype.emitDot = function(node) {
    var target = node.dotTarget();
    var dotName = node.dotName();

    if (target !== null) {
      this.emitExpression(target, Precedence.MEMBER);
    }

    if (dotName.kind === NodeKind.QUOTED) {
      dotName = dotName.quotedValue();
    }

    this.builder._buffer += node.kind === NodeKind.DOT_COLON ? '::' : node.kind === NodeKind.DOT_ARROW || target !== null && target.type.isReference() ? '->' : '.';
    this.builder._buffer += node.symbol !== null ? this.mangleName(node.symbol) : dotName.asString();
  };

  cpp.Emitter.prototype.emitCall = function(node, precedence) {
    var value = node.callValue();
    var isNew = value.kind === NodeKind.TYPE;
    var wrap = isNew && precedence === Precedence.MEMBER;

    if (wrap) {
      this.builder._buffer += '(';
    }

    if (isNew) {
      this.builder._buffer += 'new ';
      this.emitCppType(value.type, cpp.CppEmitType.BARE);
    } else {
      this.emitExpression(value, Precedence.UNARY_POSTFIX);
    }

    if (!isNew && value.type !== null && value.type.isParameterized()) {
      var substitutions = value.type.substitutions;
      this.builder._buffer += '<';

      for (var i = 0; i < substitutions.length; i = i + 1 | 0) {
        if (i !== 0) {
          this.builder._buffer += ', ';
        }

        this.emitCppType(substitutions[i], cpp.CppEmitType.NORMAL);
      }

      this.builder._buffer += '>';
    }

    this.builder._buffer += '(';
    this.emitCommaSeparatedExpressions(node.callArguments());
    this.builder._buffer += ')';

    if (wrap) {
      this.builder._buffer += ')';
    }
  };

  cpp.Emitter.prototype.emitParenthesizedCast = function(type, node, precedence) {
    if (this.options.config === CompilerConfig.WINDOWS && type.isBool(this.cache)) {
      if (Precedence.UNARY_PREFIX < precedence) {
        this.builder._buffer += '(';
      }

      this.builder._buffer += '!!';

      if (node.type.isPrimitive()) {
        this.emitExpression(node, Precedence.UNARY_PREFIX);
      } else {
        this.builder._buffer += 'static_cast<int>(';
        this.emitExpression(node, Precedence.UNARY_PREFIX);
        this.builder._buffer += ')';
      }

      if (Precedence.UNARY_PREFIX < precedence) {
        this.builder._buffer += ')';
      }
    } else {
      this.builder._buffer += 'static_cast<';
      this.emitNormalType(type);
      this.builder._buffer += '>(';
      this.emitExpression(node, Precedence.LOWEST);
      this.builder._buffer += ')';
    }
  };

  cpp.Emitter.prototype.shouldEmitCast = function(node) {
    if (node.type.isInt(this.cache) && node.castValue().type.isRegularEnum()) {
      return true;
    }

    if (node.type.isReference() && node.parent.kind === NodeKind.HOOK && node.castValue().kind !== NodeKind.NULL && node === node.parent.hookTrue()) {
      return true;
    }

    return base.Emitter.prototype.shouldEmitCast.call(this, node);
  };

  cpp.Emitter.prototype.emitInt = function(node, precedence) {
    if (node.type.isEnum() && node.symbol !== null) {
      this.emitName(node);
    } else if (node.type.isRegularEnum()) {
      if (Precedence.UNARY_PREFIX < precedence) {
        this.builder._buffer += '(';
      }

      this.builder._buffer += '(';
      this.emitNormalType(node.type);
      this.builder._buffer += ')';
      this.builder._buffer += node.asInt();

      if (Precedence.UNARY_PREFIX < precedence) {
        this.builder._buffer += ')';
      }
    } else {
      this.builder._buffer += node.asInt();
    }
  };

  cpp.Emitter.prototype.emitList = function(node, precedence) {
    var values = node.listValues();
    var wrap = values.length > 0 || precedence === Precedence.MEMBER;

    if (wrap) {
      this.builder._buffer += '(';
    }

    this.builder._buffer += 'new ';
    this.emitCppType(node.type, cpp.CppEmitType.BARE);
    this.builder._buffer += '()';

    if (wrap) {
      this.builder._buffer += ')';
    }

    if (values.length !== 0) {
      this.builder._buffer += '->literal({ ';
      this.emitCommaSeparatedExpressions(values);
      this.builder._buffer += ' })';
    }
  };

  cpp.Emitter.prototype.emitSuperCall = function(node) {
    this.builder._buffer += this.fullName(node.symbol);
    this.builder._buffer += '(';
    this.emitCommaSeparatedExpressions(node.superCallArguments());
    this.builder._buffer += ')';
  };

  cpp.Emitter.prototype.hookNeedsExplicitCast = function(node) {
    return this.isMarkSweep && node.type.isReference();
  };

  cpp.Emitter.prototype.emitNormalType = function(type) {
    this.emitCppType(type, cpp.CppEmitType.NORMAL);
  };

  cpp.Emitter.prototype.emitCppType = function(type, mode) {
    if (type.isEnumFlags()) {
      this.builder._buffer += 'int';
    } else {
      this.emitType(type);
    }

    if (type.isReference() && mode !== cpp.CppEmitType.BARE) {
      this.builder._buffer += ' *';
    } else if (mode === cpp.CppEmitType.DECLARATION && (!type.isQuoted() || !in_NodeKind.isUnaryTypeOperator(type.symbol.node.kind))) {
      this.builder._buffer += ' ';
    }
  };

  cpp.Emitter.prototype.useDoubleColonForEnclosingSymbols = function(symbol) {
    return true;
  };

  cpp.Emitter.prototype.mangleName = function(symbol) {
    if (symbol.name === 'main' && symbol.fullName() === 'main') {
      return '_main_';
    }

    return base.Emitter.prototype.mangleName.call(this, symbol);
  };

  cpp.Emitter.prototype.createIsKeyword = function() {
    var result = in_StringMap.literal('alignas alignof and and_eq asm auto bitand bitor bool break case catch char char16_t char32_t class compl const const_cast constexpr continue decltype default delete do double dynamic_cast else enum explicit export extern false float for friend goto if INFINITY inline int long mutable namespace NAN new noexcept not not_eq NULL nullptr operator or or_eq private protected public register reinterpret_cast return short signed sizeof static static_assert static_cast struct switch template this thread_local throw true try typedef typeid typename union unsigned using virtual void volatile wchar_t while xor xor_eq'.split(' '), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    if (this.options.config === CompilerConfig.WINDOWS) {
      result['CONST'] = 0;
      result['DELETE'] = 0;
      result['ERROR'] = 0;
      result['EXTERN_C'] = 0;
      result['FALSE'] = 0;
      result['IN'] = 0;
      result['INTERFACE'] = 0;
      result['OUT'] = 0;
      result['PURE'] = 0;
      result['THIS'] = 0;
      result['TRUE'] = 0;
    }

    return result;
  };

  var joined = {};

  joined.Emitter = function(_0) {
    this.resolver = _0;
  };

  joined.Emitter.prototype.emitProgram = function(program) {
    if (!this.resolver.options.includeLibraries) {
      program.removeLibraryFiles();
    }

    var builder = new StringBuilder();

    for (var i = 0; i < program.children.length; i = i + 1 | 0) {
      var file = program.children[i];
      var input = file.range.source;
      var contents = input.contents;
      var substitutions = in_StringMap.getOrDefault(this.resolver.sourceSubstitutions, input.name, null);

      if (substitutions !== null) {
        substitutions.sort(bindCompare(SourceSubstitutionComparison.INSTANCE));

        for (var j = substitutions.length - 1 | 0; j >= 0; j = j - 1 | 0) {
          var substitution = substitutions[j];
          contents = contents.slice(0, substitution.range.start) + quoteString(substitution.content, 34) + contents.slice(substitution.range.end, contents.length);
        }
      }

      builder._buffer += contents;

      if (contents !== '' && contents.charCodeAt(contents.length - 1 | 0) !== 10) {
        builder._buffer += '\n';
      }
    }

    return [new Source(this.resolver.options.outputFile, builder._buffer)];
  };

  var json = {};

  json.Emitter = function(_0) {
    this.options = _0;
  };

  json.Emitter.prototype.emitProgram = function(program) {
    var outputs = [];

    if (!this.options.includeLibraries) {
      program.removeLibraryFiles();
    }

    if (this.options.outputDirectory === '') {
      outputs.push(new Source(this.options.outputFile, json.dump(program)));
    } else {
      for (var i = 0; i < program.children.length; i = i + 1 | 0) {
        var file = program.children[i];
        outputs.push(new Source(joinPath(this.options.outputDirectory, file.range.source.name + '.json'), json.dump(file)));
      }
    }

    return outputs;
  };

  json.DumpVisitor = function() {
    this.builder = new StringBuilder();
    this.indent = '';
  };

  json.DumpVisitor.prototype.visit = function(node) {
    if (node === null) {
      this.builder._buffer += 'null';
      return;
    }

    var outer = this.indent;
    this.indent += '  ';
    this.builder._buffer += '{\n' + this.indent + '"kind": ' + simpleQuote(in_NodeKind.prettyPrint(node.kind));

    if (node.content !== null) {
      this.builder._buffer += ',\n' + this.indent + '"content": ';

      switch (node.content.type()) {
      case 1:
        this.builder._buffer += node.asInt();
        break;

      case 0:
        this.builder._buffer += node.asBool();
        break;

      case 2:
        this.builder._buffer += node.asDouble();
        break;

      case 3:
        this.builder._buffer += quoteString(node.asString(), 34);
        break;
      }
    }

    if (node.hasChildren()) {
      this.builder._buffer += ',\n' + this.indent + '"children": [';

      var inner = this.indent;
      this.indent += '  ';

      for (var i = 0; i < node.children.length; i = i + 1 | 0) {
        if (i !== 0) {
          this.builder._buffer += ',';
        }

        this.builder._buffer += '\n' + this.indent;
        this.visit(node.children[i]);
      }

      this.indent = inner;
      this.builder._buffer += '\n' + this.indent + ']';
    }

    this.indent = outer;
    this.builder._buffer += '\n' + this.indent + '}';
  };

  var lisp = {};

  lisp.Emitter = function(_0) {
    this.options = _0;
  };

  lisp.Emitter.prototype.emitProgram = function(program) {
    var outputs = [];

    if (!this.options.includeLibraries) {
      program.removeLibraryFiles();
    }

    if (this.options.outputDirectory === '') {
      outputs.push(new Source(this.options.outputFile, lisp.dump(program)));
    } else {
      for (var i = 0; i < program.children.length; i = i + 1 | 0) {
        var file = program.children[i];
        outputs.push(new Source(joinPath(this.options.outputDirectory, file.range.source.name + '.lisp'), lisp.dump(file)));
      }
    }

    return outputs;
  };

  lisp.DumpVisitor = function() {
    this.builder = new StringBuilder();
    this.indent = '';
  };

  lisp.DumpVisitor.prototype.visit = function(node) {
    if (node === null) {
      this.builder._buffer += 'nil';
      return;
    }

    this.builder._buffer += '(' + in_NodeKind.prettyPrint(node.kind);

    if (node.content !== null) {
      switch (node.content.type()) {
      case 1:
        this.builder._buffer += ' ' + node.asInt();
        break;

      case 0:
        this.builder._buffer += ' ' + node.asBool();
        break;

      case 2:
        this.builder._buffer += ' ' + node.asDouble();
        break;

      case 3:
        this.builder._buffer += ' ' + quoteString(node.asString(), 34);
        break;
      }
    }

    if (node.hasChildren()) {
      var old = this.indent;
      this.indent += '  ';

      for (var i = 0; i < node.children.length; i = i + 1 | 0) {
        this.builder._buffer += '\n' + this.indent;
        this.visit(node.children[i]);
      }

      this.indent = old;
    }

    this.builder._buffer += ')';
  };

  var ruby = {};

  ruby.Emitter = function(_0) {
    base.Emitter.call(this, _0);
    this.elseIf = null;
    this.skipEnd = null;
    this.needsStaticVariable = false;
    this.needsEnumValue = false;
    this.needsSortHelper = false;
  };

  $extends(ruby.Emitter, base.Emitter);

  ruby.Emitter.prototype.visitProgram = function(node) {
    base.Emitter.prototype.visitProgram.call(this, node);
    this.emitHelperFunctions();
    this.emitEntryPoint();
  };

  ruby.Emitter.prototype.emitHelperFunctions = function() {
    if (this.needsStaticVariable) {
      this.prepended._buffer += 'def static_variable(symbol)\n  class_eval("\n    @@#{symbol} = nil\n    def self.#{symbol}\n      @@#{symbol}\n    end\n    def self.#{symbol}=(value)\n      @@#{symbol} = value\n    end\n  ")\nend\n\n';
    }

    if (this.needsEnumValue) {
      this.prepended._buffer += 'def enum_value(symbol, value)\n  class_eval("\n    @@#{symbol} = value\n    def self.#{symbol}\n      @@#{symbol}\n    end\n  ")\nend\n\n';
    }

    if (this.needsSortHelper) {
      this.prepended._buffer += 'def sort_helper(array, comparison)\n  array.sort! { |a, b| comparison.compare(a, b) }\nend\n\n';
    }
  };

  ruby.Emitter.prototype.emitEntryPoint = function() {
    var entryPointSymbol = this.resolver.entryPointSymbol;

    if (entryPointSymbol !== null) {
      var type = entryPointSymbol.type;
      var hasArguments = type.argumentTypes().length > 0;
      var hasReturnValue = type.resultType() === this.cache.intType;
      this.emitExtraNewlineBefore(NodeKind.NULL);
      this.builder._buffer += this.indent;

      if (hasReturnValue) {
        this.builder._buffer += 'exit ';
      }

      this.builder._buffer += this.fullName(entryPointSymbol) + '(' + (hasArguments ? 'ARGV' : '') + ')\n';
    }
  };

  ruby.Emitter.prototype.emitTypeDeclaration = function(symbol) {
    if (symbol.kind === SymbolKind.INTERFACE) {
      return;
    } else if (symbol.kind === SymbolKind.CLASS) {
      this.adjustNamespace(symbol);
      this.emitExtraNewlineBefore(symbol.node.kind);
      this.builder._buffer += this.indent + 'class ' + this.mangleName(symbol);

      if (symbol.type.isClass()) {
        var base = symbol.type.baseClass();

        if (base !== null) {
          this.builder._buffer += ' < ' + this.fullName(base.symbol);
        }
      }

      this.builder._buffer += '\n';
      this.increaseIndent();
      this.emitTypeMembers(symbol);
      this.decreaseIndent();
      this.builder._buffer += this.indent + 'end\n';
      this.emitExtraNewlineAfter(symbol.node.kind);
    } else if (in_SymbolKind.isEnum(symbol.kind)) {
      this.adjustNamespace(symbol);
      this.emitExtraNewlineBefore(NodeKind.ENUM);
      this.enterNamespace(symbol);

      var members = symbol.type.sortedMembers();

      for (var i = 0; i < members.length; i = i + 1 | 0) {
        var member = members[i].symbol;

        if (member.isEnumValue()) {
          this.builder._buffer += this.indent + 'enum_value :' + this.mangleName(member) + ', ' + member.constant.asInt() + '\n';
          this.needsEnumValue = true;
        }
      }

      this.leaveNamespace(symbol);
      this.emitExtraNewlineAfter(NodeKind.ENUM);
    } else {
      if (symbol.kind !== SymbolKind.ALIAS && symbol.kind !== SymbolKind.NAMESPACE) {
        throw new Error('assert symbol.kind == .ALIAS || symbol.kind == .NAMESPACE (src/emitters/ruby.sk:114:9)');
      }
    }
  };

  ruby.Emitter.prototype.emitBlock = function(node) {
    var needsEnd = node !== this.skipEnd;

    if (in_NodeKind.isLoop(node.parent.kind)) {
      this.builder._buffer += ' do';
    }

    this.builder._buffer += '\n';
    this.increaseIndent();
    this.emitStatements(node.blockStatements());
    this.decreaseIndent();

    if (needsEnd) {
      this.builder._buffer += this.indent + 'end\n';
    }
  };

  ruby.Emitter.prototype.emitLastBlock = function(node) {
    this.emitBlock(node);
  };

  ruby.Emitter.prototype.emitControlStatementParentheses = function() {
    return false;
  };

  ruby.Emitter.prototype.emitFunction = function(symbol) {
    var node = symbol.node;
    var block = node.functionBlock();

    if (block === null) {
      return;
    }

    this.adjustNamespace(symbol);
    this.emitExtraNewlineBefore(node.kind);
    this.builder._buffer += this.indent + 'def ';

    if (symbol.kind === SymbolKind.GLOBAL_FUNCTION && symbol.enclosingSymbol.kind !== SymbolKind.GLOBAL_NAMESPACE) {
      this.builder._buffer += 'self.';
    }

    this.builder._buffer += this.mangleName(symbol);

    if (node.functionArguments().hasChildren()) {
      this.emitFunctionArguments(symbol);
    }

    this.builder._buffer += '\n';
    this.increaseIndent();

    if (node.kind === NodeKind.CONSTRUCTOR) {
      var superInitializer = node.superInitializer();
      var memberInitializers = node.memberInitializers();

      if (superInitializer !== null) {
        this.builder._buffer += this.indent;
        this.emitExpression(superInitializer, Precedence.LOWEST);
        this.builder._buffer += '\n';
      }

      if (memberInitializers !== null) {
        for (var i = 0, n = memberInitializers.children.length; i < n; i = i + 1 | 0) {
          var child = memberInitializers.children[i];
          var name = child.memberInitializerName();
          var value = child.memberInitializerValue();

          if (value.kind !== NodeKind.ERROR) {
            this.builder._buffer += this.indent;
            this.emitExpression(name, Precedence.LOWEST);
            this.builder._buffer += ' = ';
            this.emitExpression(value, Precedence.LOWEST);
            this.builder._buffer += '\n';
          }
        }
      }
    }

    this.emitStatements(block.blockStatements());
    this.decreaseIndent();
    this.builder._buffer += this.indent + 'end\n';
    this.emitExtraNewlineAfter(node.kind);
  };

  ruby.Emitter.prototype.emitFunctionArgument = function(symbol) {
    this.builder._buffer += this.mangleName(symbol);
  };

  ruby.Emitter.prototype.emitMemberVariable = function(symbol) {
    var node = symbol.node;
    this.adjustNamespace(symbol);
    this.emitExtraNewlineBefore(node.kind);
    this.builder._buffer += this.indent;

    if (symbol.kind === SymbolKind.INSTANCE_VARIABLE) {
      this.builder._buffer += 'attr_accessor :';
    } else {
      this.builder._buffer += 'static_variable :';
      this.needsStaticVariable = true;
    }

    this.builder._buffer += this.mangleName(symbol);
    this.builder._buffer += '\n';
    this.emitExtraNewlineAfter(node.kind);
  };

  ruby.Emitter.prototype.emitFreeVariable = function(symbol) {
    var kind = symbol.enclosingSymbol.kind;

    if (kind === SymbolKind.NAMESPACE || in_SymbolKind.isEnum(kind)) {
      this.emitMemberVariable(symbol);
    }

    this.adjustNamespace(null);
    this.emitVariable(symbol);
  };

  ruby.Emitter.prototype.emitVariable = function(symbol) {
    var node = symbol.node;
    var value = node.variableValue();
    this.emitExtraNewlineBefore(node.kind);
    this.builder._buffer += this.indent;
    this.builder._buffer += this.fullName(symbol);
    this.builder._buffer += ' = ';

    if (value !== null) {
      this.emitExpression(value, Precedence.LOWEST);
    } else {
      this.builder._buffer += 'nil';
    }

    this.builder._buffer += '\n';
    this.emitExtraNewlineAfter(node.kind);
  };

  ruby.Emitter.prototype.emitIf = function(node) {
    var trueBlock = node.ifTrue();
    var falseBlock = node.ifFalse();
    this.builder._buffer += this.indent + (node === this.elseIf ? 'elsif ' : 'if ');
    this.emitExpression(node.ifTest(), Precedence.LOWEST);

    if (falseBlock === null) {
      this.emitBlock(trueBlock);
    } else {
      this.skipEnd = trueBlock;
      this.emitBlock(trueBlock);

      var falseStatement = falseBlock.blockStatement();

      if (falseStatement !== null && falseStatement.kind === NodeKind.IF) {
        this.elseIf = falseStatement;
        this.emitIf(falseStatement);
      } else {
        this.builder._buffer += this.indent + 'else';
        this.emitBlock(falseBlock);
      }
    }
  };

  ruby.Emitter.prototype.emitThrow = function(node) {
    this.builder._buffer += this.indent + 'raise ';
    this.emitExpression(node.throwValue(), Precedence.LOWEST);
    this.builder._buffer += '\n';
  };

  ruby.Emitter.prototype.emitTry = function(node) {
    var tryBlock = node.tryBlock();
    var catches = node.catches();
    var finallyBlock = node.finallyBlock();
    this.builder._buffer += this.indent + 'begin';
    this.skipEnd = tryBlock;
    this.emitBlock(tryBlock);

    for (var i = 0; i < catches.length; i = i + 1 | 0) {
      var catchNode = catches[i];
      var variable = catchNode.catchVariable();
      var catchBlock = catchNode.catchBlock();
      this.builder._buffer += this.indent + 'rescue';

      if (variable !== null) {
        this.builder._buffer += ' ' + this.fullName(variable.symbol.type.symbol) + ' => ' + this.mangleName(variable.symbol);
      }

      this.skipEnd = (i + 1 | 0) < catches.length || finallyBlock !== null ? catchBlock : null;
      this.emitBlock(catchBlock);
    }

    if (finallyBlock !== null) {
      this.builder._buffer += this.indent + 'ensure';
      this.emitBlock(finallyBlock);
    }
  };

  ruby.Emitter.prototype.endStatement = function() {
    this.builder._buffer += '\n';
  };

  ruby.Emitter.prototype.hasUnaryStorageOperators = function() {
    return false;
  };

  ruby.Emitter.prototype.useWhileForAllLoops = function() {
    return true;
  };

  ruby.Emitter.prototype.emitContinue = function(node) {
    this.builder._buffer += this.indent + 'next\n';
  };

  ruby.Emitter.prototype.emitSwitch = function(node) {
    var cases = node.switchCases().children;
    this.builder._buffer += this.indent + 'case ';
    this.emitExpression(node.switchValue(), Precedence.LOWEST);
    this.builder._buffer += '\n';
    this.previousKind = NodeKind.NULL;
    this.emitStatements(cases);
    this.builder._buffer += this.indent + 'end\n';
  };

  ruby.Emitter.prototype.emitCase = function(node) {
    var values = node.caseValues().children;
    var block = node.caseBlock();
    this.builder._buffer += this.indent;

    if (values.length !== 0) {
      this.builder._buffer += 'when ';
      this.emitCommaSeparatedExpressions(values);
    } else {
      this.builder._buffer += 'else';
    }

    this.builder._buffer += '\n';
    this.increaseIndent();
    this.emitStatements(block.blockStatements());
    this.decreaseIndent();
  };

  ruby.Emitter.prototype.emitAssert = function(node) {
    var value = node.assertValue();
    var text = node.range + ' (' + node.range.locationString() + ')';
    this.builder._buffer += this.indent + 'raise ' + quoteString(text, 39);

    if (!value.isFalse()) {
      this.builder._buffer += ' unless ';
      this.emitExpression(value, Precedence.LOWEST);
    }

    this.builder._buffer += '\n';
  };

  ruby.Emitter.prototype.emitCast = function(node, precedence) {
    var value = node.castValue();
    var valueType = value.type;
    var type = node.type;

    if (type.isReal(this.cache) && valueType.isInteger(this.cache)) {
      if (value.kind === NodeKind.INT) {
        node.become(Node.createDouble(value.asInt()));
      } else {
        node.become(Node.createCall(Node.createName('Float'), [value.replaceWith(null)]));
      }

      value = node;
    } else if (this.shouldEmitCast(node)) {
      if (type.isNumeric(this.cache)) {
        if (type.isInt(this.cache) && valueType.isReal(this.cache)) {
          node.become(Node.createDot(value.replaceWith(null), Node.createName('truncate')));
          value = node;
        } else if (valueType.isBool(this.cache)) {
          node.become(Node.createHook(NodeKind.HOOK, value.replaceWith(null), Node.createInt(1), Node.createInt(0)));
          value = node;
        }
      } else if (type.isBool(this.cache)) {
        if (valueType.isNumeric(this.cache)) {
          node.become(Node.createBinary(NodeKind.NOT_EQUAL, value.replaceWith(null), Node.createInt(0)));
          value = node;
        }
      }
    }

    this.emitExpression(value, precedence);
  };

  ruby.Emitter.prototype.emitReal = function(node) {
    var value = node.asDouble();

    if (value === math.INFINITY) {
      this.builder._buffer += 'Float::INFINITY';
    } else if (value === -math.INFINITY) {
      this.builder._buffer += '-Float::INFINITY';
    } else if (value !== value) {
      this.builder._buffer += 'Float::NAN';
    } else {
      this.builder._buffer += doubleToStringWithDot(value);
    }
  };

  ruby.Emitter.prototype.emitString = function(node) {
    var text = node.asString();
    var escaped = '';
    var start = 0;
    var i = 0;
    this.builder._buffer += '"';

    for (i = 0; i < text.length; i = i + 1 | 0) {
      var c = text.charCodeAt(i);

      if (c === 34) {
        escaped = '\\"';
      } else if (c === 35) {
        escaped = '\\#';
      } else if (c === 10) {
        escaped = '\\n';
      } else if (c === 13) {
        escaped = '\\r';
      } else if (c === 9) {
        escaped = '\\t';
      } else if (c === 0) {
        escaped = '\\0';
      } else if (c === 92) {
        escaped = '\\\\';
      } else if (c < 32) {
        escaped = '\\x' + HEX[c >> 4] + HEX[c & 15];
      } else {
        continue;
      }

      this.builder._buffer += text.slice(start, i);
      this.builder._buffer += escaped;
      start = i + 1 | 0;
    }

    this.builder._buffer += text.slice(start, i);
    this.builder._buffer += '"';
  };

  ruby.Emitter.prototype.emitSequence = function(node, precedence) {
    var values = node.sequenceValues();

    if (values.length <= 1) {
      throw new Error('assert values.size() > 1 (src/emitters/ruby.sk:404:7)');
    }

    var isSequence = node.parent.kind !== NodeKind.EXPRESSION;
    var separator = isSequence ? '; ' : '\n' + this.indent;

    if (isSequence) {
      this.builder._buffer += '(';
    }

    for (var i = 0; i < values.length; i = i + 1 | 0) {
      if (i > 0) {
        this.builder._buffer += separator;
      }

      this.emitExpression(values[i], Precedence.LOWEST);
    }

    if (isSequence) {
      this.builder._buffer += ')';
    }
  };

  ruby.Emitter.prototype.emitUnary = function(node, precedence) {
    if (node.kind === NodeKind.NEW) {
      var value = node.unaryValue();

      if (value.kind === NodeKind.CALL) {
        var target = value.callValue().remove();
        this.emitExpression(Node.createCall(Node.createDot(target, Node.createName('new')), value.removeChildren()), precedence);
        return;
      }
    }

    base.Emitter.prototype.emitUnary.call(this, node, precedence);
  };

  ruby.Emitter.prototype.emitName = function(node) {
    if (node.symbol !== null) {
      if (node.symbol.kind === SymbolKind.INSTANCE_VARIABLE) {
        this.builder._buffer += '@';
      }
    } else if (node.asString() === 'sort_helper') {
      this.needsSortHelper = true;
    }

    base.Emitter.prototype.emitName.call(this, node);
  };

  ruby.Emitter.prototype.emitThis = function() {
    this.builder._buffer += 'self';
  };

  ruby.Emitter.prototype.emitNull = function() {
    this.builder._buffer += 'nil';
  };

  ruby.Emitter.prototype.emitType = function(type) {
    this.builder._buffer += this.fullName(type.symbol);
  };

  ruby.Emitter.prototype.emitBinary = function(node, precedence) {
    if ((node.kind === NodeKind.EQUAL || node.kind === NodeKind.NOT_EQUAL) && (node.parent.kind === NodeKind.EQUAL || node.parent.kind === NodeKind.NOT_EQUAL)) {
      precedence = Precedence.MEMBER;
    }

    base.Emitter.prototype.emitBinary.call(this, node, precedence);
  };

  ruby.Emitter.prototype.emitKeyValue = function(node) {
    this.emitExpression(node.itemKey(), Precedence.COMMA);
    this.builder._buffer += ' => ';
    this.emitExpression(node.itemValue(), Precedence.COMMA);
  };

  ruby.Emitter.prototype.emitCall = function(node, precedence) {
    var value = node.callValue();
    var $arguments = node.callArguments();

    if (value.kind === NodeKind.TYPE && (value.type.isIntMap(this.cache) || value.type.isIntMap(this.cache))) {
      this.builder._buffer += '{}';
      return;
    }

    this.emitExpression(value, Precedence.UNARY_POSTFIX);

    if (value.kind === NodeKind.TYPE) {
      this.builder._buffer += '.new';
    }

    if ($arguments.length > 0) {
      this.builder._buffer += '(';
      this.emitCommaSeparatedExpressions($arguments);
      this.builder._buffer += ')';
    }
  };

  ruby.Emitter.prototype.enterNamespace = function(symbol) {
    this.emitExtraNewlineBefore(NodeKind.NAMESPACE);
    this.builder._buffer += this.indent + 'module ' + this.mangleName(symbol) + '\n';
    this.increaseIndent();
  };

  ruby.Emitter.prototype.leaveNamespace = function(symbol) {
    this.decreaseIndent();
    this.builder._buffer += this.indent + 'end\n';
    this.emitExtraNewlineAfter(NodeKind.NAMESPACE);
  };

  ruby.Emitter.prototype.useDoubleColonForEnclosingSymbols = function(symbol) {
    return symbol.kind === SymbolKind.NAMESPACE;
  };

  ruby.Emitter.prototype.mangleName = function(symbol) {
    if (symbol.emitAs !== null) {
      return symbol.emitAs.value;
    }

    if (symbol.kind === SymbolKind.CONSTRUCTOR_FUNCTION) {
      return 'initialize';
    }

    if (symbol.kind === SymbolKind.GLOBAL_VARIABLE && symbol.enclosingSymbol.kind === SymbolKind.GLOBAL_NAMESPACE) {
      return '$' + symbol.name;
    }

    var name = symbol.name;

    if (symbol.name in this.isKeyword && !symbol.isImport()) {
      name += '_';
    }

    var c = name.charCodeAt(0);
    var isUpperCase = c >= 65 && c <= 90;
    var shouldBeUpperCase = in_SymbolKind.isType(symbol.kind);

    if (shouldBeUpperCase && !isUpperCase) {
      return 'X_' + name;
    }

    if (!shouldBeUpperCase && isUpperCase) {
      return '_' + name;
    }

    return name;
  };

  ruby.Emitter.prototype.createIsKeyword = function() {
    return in_StringMap.literal('Symbol Float Integer __FILE__ __LINE__ alias and BEGIN begin break case class def do else elsif END end ensure false for if in module next nil not or redo rescue retry return self super then true undef unless until when while yield'.split(' '), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  };

  var xml = {};

  xml.Emitter = function(_0) {
    this.options = _0;
  };

  xml.Emitter.prototype.emitProgram = function(program) {
    var outputs = [];

    if (!this.options.includeLibraries) {
      program.removeLibraryFiles();
    }

    if (this.options.outputDirectory === '') {
      outputs.push(new Source(this.options.outputFile, xml.dump(program)));
    } else {
      for (var i = 0; i < program.children.length; i = i + 1 | 0) {
        var file = program.children[i];
        outputs.push(new Source(joinPath(this.options.outputDirectory, file.range.source.name + '.xml'), xml.dump(file)));
      }
    }

    return outputs;
  };

  xml.DumpVisitor = function() {
    this.builder = new StringBuilder();
    this.indent = '';
  };

  xml.DumpVisitor.prototype.visit = function(node) {
    if (node === null) {
      this.builder._buffer += '<null/>';
      return;
    }

    this.builder._buffer += '<' + in_NodeKind.prettyPrint(node.kind);

    if (node.content !== null) {
      this.builder._buffer += ' content=';

      switch (node.content.type()) {
      case 1:
        this.builder._buffer += simpleQuote(node.asInt().toString());
        break;

      case 0:
        this.builder._buffer += simpleQuote(node.asBool().toString());
        break;

      case 2:
        this.builder._buffer += simpleQuote(node.asDouble().toString());
        break;

      case 3:
        this.builder._buffer += quoteString(node.asString(), 34);
        break;
      }
    }

    if (node.hasChildren()) {
      this.builder._buffer += '>';

      var inner = this.indent;
      this.indent += '  ';

      for (var i = 0; i < node.children.length; i = i + 1 | 0) {
        this.builder._buffer += '\n' + this.indent;
        this.visit(node.children[i]);
      }

      this.indent = inner;
      this.builder._buffer += '\n' + this.indent + '</' + in_NodeKind.prettyPrint(node.kind) + '>';
    } else {
      this.builder._buffer += '/>';
    }
  };

  var js = {};

  js.ClusterState = {
    NONE: 0,
    VAR_CHAIN: 1,
    COMPOUND_NAME: 2
  };

  js.AfterToken = {
    AFTER_KEYWORD: 0,
    AFTER_PARENTHESIS: 1
  };

  js.BracesMode = {
    MUST_KEEP_BRACES: 0,
    CAN_OMIT_BRACES: 1
  };

  js.Emitter = function(_0) {
    this.newline = '\n';
    this.space = ' ';
    this.indent = '';
    this.builder = new StringBuilder();
    this.currentLine = 0;
    this.currentColumn = 0;
    this.needsSemicolon = false;
    this.previousKind = NodeKind.NULL;
    this.currentSource = null;
    this.patcher = null;
    this.options = null;
    this.generator = new SourceMapGenerator();
    this.toStringTarget = null;
    this.resolver = _0;
  };

  js.Emitter.prototype.patchProgram = function(program) {
    this.options = this.resolver.options;

    if (this.options.minify) {
      this.newline = '';
      this.space = '';
    }

    this.patcher = new js.Patcher(this.resolver);
    this.patcher.run(program);
  };

  js.Emitter.prototype.emitProgram = function(program) {
    this.patchProgram(program);

    var collector = new Collector(program, SortTypes.SORT_BY_INHERITANCE_AND_CONTAINMENT);
    this.currentSource = new Source(this.options.outputFile, '');
    this.emit(this.indent + this.minifySpaces('(function() {' + this.newline));
    this.increaseIndent();

    if (this.patcher.needMathImul) {
      this.emitExtraNewlineBefore(NodeKind.VARIABLE);
      this.emit(this.indent + 'var ' + this.patcher.imul + this.minifySpaces(' = Math.imul || function(a, b) {' + this.newline));
      this.increaseIndent();
      this.emit(this.indent + 'var ' + this.minifySpaces('ah = a >>> 16, al = a & 65535, bh = b >>> 16, bl = b & 65535;' + this.newline));
      this.emit(this.indent + 'return ' + this.minifySpaces('al * bl + (ah * bl + al * bh << 16) | 0'));
      this.emitSemicolonAfterStatement();
      this.decreaseIndent();
      this.emit(this.indent + '};' + this.newline);
      this.emitExtraNewlineAfter(NodeKind.VARIABLE);
      this.needsSemicolon = false;
    }

    if (this.patcher.needExtends) {
      var derived = this.options.mangle ? 'd' : 'derived';
      var base = this.options.mangle ? 'b' : 'base';
      this.emitExtraNewlineBefore(NodeKind.FUNCTION);
      this.emit(this.indent + 'function ' + this.minifySpaces(this.patcher.$extends + '(' + derived + ', ' + base + ') {' + this.newline));
      this.increaseIndent();
      this.emit(this.indent + derived + this.minifySpaces('.prototype = Object.create(' + base + '.prototype);' + this.newline));
      this.emit(this.indent + derived + this.minifySpaces('.prototype.constructor = ' + derived));
      this.emitSemicolonAfterStatement();
      this.decreaseIndent();
      this.emit(this.indent + '}' + this.newline);
      this.emitExtraNewlineAfter(NodeKind.FUNCTION);
      this.needsSemicolon = false;
    }

    for (var i = 0; i < collector.typeSymbols.length; i = i + 1 | 0) {
      var symbol = collector.typeSymbols[i];
      var type = symbol.type;

      if (symbol.kind === SymbolKind.ALIAS) {
        continue;
      }

      if (type.isNamespace()) {
        if (!symbol.isImport()) {
          this.maybeEmitMinifedNewline();
          this.emitNode(symbol.node);
        }

        continue;
      }

      if (!symbol.isImport()) {
        if (type.isEnum()) {
          this.emitNode(symbol.node);
        } else {
          var $constructor = type.$constructor();

          if ($constructor !== null) {
            this.emitNode($constructor.symbol.node);
          }
        }
      }

      var members = type.sortedMembers();

      for (var j = 0; j < members.length; j = j + 1 | 0) {
        var member = members[j].symbol;

        if (member.enclosingSymbol === symbol && member.node !== null) {
          if (in_SymbolKind.isFunction(member.kind) && member.kind !== SymbolKind.CONSTRUCTOR_FUNCTION) {
            this.emitNode(member.node);
          }
        }
      }
    }

    for (var i = 0; i < collector.freeFunctionSymbols.length; i = i + 1 | 0) {
      this.emitNode(collector.freeFunctionSymbols[i].node);
    }

    var variables = [];

    for (var i = 0; i < collector.freeVariableSymbols.length; i = i + 1 | 0) {
      var variable = collector.freeVariableSymbols[i].node;

      if (this.options.minify) {
        variables.push(variable);
      } else {
        this.emitVariables([variable]);
      }
    }

    this.emitVariables(variables);

    var entryPointSymbol = this.resolver.entryPointSymbol;

    if (entryPointSymbol !== null) {
      var type = entryPointSymbol.type;
      var callText = js.Emitter.fullName(entryPointSymbol) + (type.argumentTypes().length !== 0 ? '(process.argv.slice(2))' : '()');
      this.emitSemicolonIfNeeded();
      this.emitExtraNewlineBefore(NodeKind.EXPRESSION);
      this.addMapping(entryPointSymbol.node);
      this.emit(this.indent + (type.resultType() === this.resolver.cache.intType ? 'process.exit(' + callText + ')' : callText));
      this.emitSemicolonAfterStatement();
      this.emitExtraNewlineAfter(NodeKind.EXPRESSION);
    }

    this.decreaseIndent();
    this.emit(this.indent + '}());\n');

    if (this.options.sourceMap) {
      this.emit('/');

      var name = this.options.outputFile + '.map';
      this.emit('/# sourceMappingURL=' + splitPath(name).entry + '\n');
      this.currentSource.contents = this.builder._buffer;
      return [this.currentSource, new Source(name, this.generator.toString())];
    }

    this.currentSource.contents = this.builder._buffer;
    return [this.currentSource];
  };

  js.Emitter.prototype.emitExtraNewlineBefore = function(kind) {
    if (!this.options.minify && this.previousKind !== NodeKind.NULL && this.shouldEmitExtraNewlineBetween(this.previousKind, kind)) {
      this.emit(this.newline);
    }

    this.previousKind = NodeKind.NULL;
  };

  js.Emitter.prototype.emitExtraNewlineAfter = function(kind) {
    this.previousKind = kind;
  };

  js.Emitter.prototype.isFlowNodeKind = function(kind) {
    return kind === NodeKind.EXPRESSION || kind === NodeKind.VARIABLE || kind === NodeKind.VARIABLE_CLUSTER || in_NodeKind.isJump(kind);
  };

  js.Emitter.prototype.shouldEmitExtraNewlineBetween = function(before, after) {
    return !this.isFlowNodeKind(before) || !this.isFlowNodeKind(after) || before !== NodeKind.VARIABLE_CLUSTER && after === NodeKind.VARIABLE_CLUSTER;
  };

  js.Emitter.prototype.addMapping = function(node) {
    if (this.options.sourceMap) {
      var range = node.range;

      if (range.source !== null) {
        var location = range.source.indexToLineColumn(range.start);
        this.generator.addMapping(range.source, location.line, location.column, this.currentLine, this.currentColumn);
      }
    }
  };

  js.Emitter.prototype.increaseIndent = function() {
    if (!this.options.minify) {
      this.previousKind = NodeKind.NULL;
      this.indent += '  ';
    }
  };

  js.Emitter.prototype.decreaseIndent = function() {
    if (!this.options.minify) {
      this.indent = this.indent.slice(2, this.indent.length);
    }
  };

  js.Emitter.prototype.emit = function(text) {
    if (this.options.minify || this.options.sourceMap) {
      for (var i = 0; i < text.length; i = i + 1 | 0) {
        var c = text.charCodeAt(i);

        if (c === 10) {
          this.currentColumn = 0;
          this.currentLine = this.currentLine + 1 | 0;
        } else {
          this.currentColumn = this.currentColumn + 1 | 0;
        }
      }
    }

    this.builder._buffer += text;
  };

  js.Emitter.prototype.minifySpaces = function(text) {
    return in_string.replaceAll(text, ' ', this.space);
  };

  js.Emitter.prototype.maybeEmitMinifedNewline = function() {
    if (this.newline === '' && this.currentColumn > 1024) {
      this.emit('\n');
    }
  };

  js.Emitter.prototype.emitSemicolonAfterStatement = function() {
    if (!this.options.minify) {
      this.emit(';\n');
    } else {
      this.needsSemicolon = true;
    }
  };

  js.Emitter.prototype.emitSemicolonIfNeeded = function() {
    if (this.needsSemicolon) {
      this.emit(';');
      this.needsSemicolon = false;
    }
  };

  js.Emitter.prototype.emitStatements = function(nodes) {
    for (var i = 0; i < nodes.length; i = i + 1 | 0) {
      var node = nodes[i];
      var kind = node.kind;
      this.emitSemicolonIfNeeded();
      this.maybeEmitMinifedNewline();

      if (kind !== NodeKind.MODIFIER) {
        this.emitExtraNewlineBefore(kind);
      }

      this.emitNode(node);

      if (kind !== NodeKind.MODIFIER) {
        this.emitExtraNewlineAfter(kind);
      }
    }
  };

  js.Emitter.prototype.emitCommaSeparatedNodes = function(nodes) {
    for (var i = 0; i < nodes.length; i = i + 1 | 0) {
      if (i !== 0) {
        this.emit(',' + this.space);
      }

      this.emitNode(nodes[i]);
    }
  };

  js.Emitter.prototype.emitCommaSeparatedExpressions = function(nodes) {
    for (var i = 0; i < nodes.length; i = i + 1 | 0) {
      if (i !== 0) {
        this.emit(',' + this.space);
        this.maybeEmitMinifedNewline();
      }

      this.emitExpression(nodes[i], Precedence.COMMA);
    }
  };

  js.Emitter.prototype.emitArgumentVariables = function(nodes) {
    this.emit('(');
    this.emitCommaSeparatedNodes(nodes);
    this.emit(')');
  };

  js.Emitter.prototype.recursiveEmitIfStatement = function(node) {
    var trueBlock = node.ifTrue();
    var falseBlock = node.ifFalse();
    var trueStatement = trueBlock.blockStatement();
    this.emit('if' + this.space + '(');
    this.emitExpression(node.ifTest(), Precedence.LOWEST);
    this.emit(')');
    this.emitBlock(trueBlock, js.AfterToken.AFTER_PARENTHESIS, falseBlock !== null && trueStatement !== null && trueStatement.kind === NodeKind.IF ? js.BracesMode.MUST_KEEP_BRACES : js.BracesMode.CAN_OMIT_BRACES);

    if (falseBlock !== null) {
      this.emitSemicolonIfNeeded();
      this.maybeEmitMinifedNewline();
      this.emit(this.space + 'else');

      var falseStatement = falseBlock.blockStatement();

      if (falseStatement !== null && falseStatement.kind === NodeKind.IF) {
        this.emit(' ');
        this.addMapping(falseStatement);
        this.recursiveEmitIfStatement(falseStatement);
      } else {
        this.emitBlock(falseBlock, js.AfterToken.AFTER_KEYWORD, js.BracesMode.CAN_OMIT_BRACES);
      }
    }
  };

  js.Emitter.prototype.emitNode = function(node) {
    this.addMapping(node);

    switch (node.kind) {
    case 30:
      this.emitAssert(node);
      break;

    case 27:
      this.emitBreak(node);
      break;

    case 4:
      this.emitCase(node);
      break;

    case 14:
    case 15:
      this.emitFunction(node);
      break;

    case 28:
      this.emitContinue(node);
      break;

    case 25:
      this.emitDoWhile(node);
      break;

    case 9:
    case 10:
      this.emitEnum(node);
      break;

    case 32:
      this.emitExpressionStatement(node);
      break;

    case 22:
      this.emitFor(node);
      break;

    case 23:
      this.emitForEach(node);
      break;

    case 20:
      this.emitIf(node);
      break;

    case 34:
      this.emitModifier(node);
      break;

    case 8:
      this.emitNamespace(node);
      break;

    case 17:
    case 19:
    case 35:
      break;

    case 26:
      this.emitReturn(node);
      break;

    case 33:
      this.emitSwitch(node);
      break;

    case 29:
      this.emitThrow(node);
      break;

    case 21:
      this.emitTry(node);
      break;

    case 16:
      this.emitVariable(node);
      break;

    case 7:
      this.emitVariables(node.clusterVariables());
      break;

    case 24:
      this.emitWhile(node);
      break;

    default:
      throw new Error('assert false (src/js/emitter.sk:345:19)');
      break;
    }
  };

  js.Emitter.prototype.emitBlock = function(node, after, mode) {
    var shouldMinify = mode === js.BracesMode.CAN_OMIT_BRACES && this.options.minify;
    this.addMapping(node);

    if (shouldMinify && !node.hasChildren()) {
      this.emit(';');
    } else if (shouldMinify && node.children.length === 1) {
      if (after === js.AfterToken.AFTER_KEYWORD) {
        this.emit(' ');
      }

      this.emitNode(node.children[0]);
    } else {
      this.emit(this.space + '{' + this.newline);

      if (node.hasChildren()) {
        this.increaseIndent();
        this.emitStatements(node.children);
        this.decreaseIndent();
      }

      this.emit(this.indent + '}');
      this.needsSemicolon = false;
    }
  };

  js.Emitter.prototype.emitCase = function(node) {
    var values = node.caseValues().children;
    var block = node.caseBlock();
    this.emitSemicolonIfNeeded();

    for (var i = 0; i < values.length; i = i + 1 | 0) {
      this.emit(this.indent + 'case ');
      this.emitExpression(values[i], Precedence.LOWEST);
      this.emit(':' + this.newline);
      this.maybeEmitMinifedNewline();
    }

    if (values.length === 0) {
      this.emit(this.indent + 'default:' + this.newline);
    }

    this.increaseIndent();

    if (block.hasChildren()) {
      this.emitStatements(block.children);
    }

    if (!block.blockAlwaysEndsWithReturn() && (!this.options.minify || !node.isLastChild())) {
      this.emitSemicolonIfNeeded();
      this.emit(this.indent + 'break');
      this.emitSemicolonAfterStatement();
    }

    this.decreaseIndent();
  };

  js.Emitter.prototype.emitVariables = function(variables) {
    var state = js.ClusterState.NONE;

    for (var i = 0; i < variables.length; i = i + 1 | 0) {
      var variable = variables[i];
      var symbol = variable.symbol;
      var isCompoundName = symbol !== null && (js.Emitter.hasCompoundName(symbol) || symbol.isExport());

      if (symbol !== null && (in_SymbolKind.isInstance(symbol.kind) || symbol.isImport()) || isCompoundName && variable.variableValue() === null) {
        continue;
      }

      this.emitSemicolonIfNeeded();
      this.emitExtraNewlineBefore(NodeKind.VARIABLE);

      if (isCompoundName) {
        if (state !== js.ClusterState.NONE) {
          this.emit(';' + this.newline);
        }

        state = js.ClusterState.COMPOUND_NAME;
        this.emit(this.indent);
      } else if (state !== js.ClusterState.VAR_CHAIN) {
        if (state === js.ClusterState.COMPOUND_NAME) {
          this.emit(';' + this.newline);
        }

        this.emit(this.indent + 'var ');
        state = js.ClusterState.VAR_CHAIN;
      } else {
        this.emit(',' + this.space);
        this.maybeEmitMinifedNewline();
      }

      this.emitNode(variable);
    }

    if (state !== js.ClusterState.NONE) {
      this.emitSemicolonAfterStatement();
      this.emitExtraNewlineAfter(NodeKind.VARIABLE);
    }
  };

  js.Emitter.prototype.emitNamespace = function(node) {
    var symbol = node.symbol;

    if (this.options.mangle && !symbol.isImportOrExport()) {
      return;
    }

    this.emitSemicolonIfNeeded();
    this.emitExtraNewlineBefore(node.kind);
    this.emit(this.indent);

    if (!js.Emitter.hasCompoundName(symbol) && !symbol.isExport()) {
      this.emit('var ');
    }

    this.emit(js.Emitter.fullName(symbol) + this.space + '=' + this.space + '{}');
    this.emitSemicolonAfterStatement();
    this.emitExtraNewlineAfter(node.kind);
  };

  js.Emitter.prototype.emitEnum = function(node) {
    var symbol = node.symbol;
    var block = node.declarationBlock();

    if (this.options.foldAllConstants && !symbol.isImportOrExport()) {
      return;
    }

    this.emitSemicolonIfNeeded();
    this.emitExtraNewlineBefore(node.kind);
    this.emit(this.indent);

    if (!js.Emitter.hasCompoundName(symbol) && !symbol.isExport()) {
      this.emit('var ');
    }

    if (this.options.mangle && !symbol.isImportOrExport()) {
      for (var i = 0; i < block.children.length; i = i + 1 | 0) {
        var child = block.children[i].symbol;

        if (i !== 0) {
          this.emit(',' + this.space);
        }

        this.emit(js.Emitter.mangleName(child) + this.space + '=' + this.space + child.constant.asInt());
      }
    } else {
      this.emit(js.Emitter.fullName(symbol) + this.space + '=' + this.space + '{' + this.newline);
      this.increaseIndent();

      for (var i = 0; i < block.children.length; i = i + 1 | 0) {
        var child = block.children[i].symbol;
        this.emit(this.indent + js.Emitter.mangleName(child) + ':' + this.space + child.constant.asInt());

        if (i !== (block.children.length - 1 | 0)) {
          this.emit(',' + this.newline);
          this.maybeEmitMinifedNewline();
        } else {
          this.emit(this.newline);
        }
      }

      this.decreaseIndent();
      this.emit(this.indent + '}');
    }

    this.emitSemicolonAfterStatement();
    this.emitExtraNewlineAfter(node.kind);
  };

  js.Emitter.prototype.emitFunction = function(node) {
    var block = node.functionBlock();
    var symbol = node.symbol;

    if (block === null) {
      return;
    }

    var useFunctionStatement = !js.Emitter.hasCompoundName(symbol) && !symbol.isExport();
    this.emitSemicolonIfNeeded();
    this.emitExtraNewlineBefore(node.kind);
    this.emit(useFunctionStatement ? this.indent + 'function ' + js.Emitter.fullName(symbol) : this.indent + js.Emitter.fullName(symbol) + this.space + '=' + this.space + 'function');
    this.emitArgumentVariables(node.functionArguments().children);
    this.emitBlock(block, js.AfterToken.AFTER_PARENTHESIS, js.BracesMode.MUST_KEEP_BRACES);

    if (useFunctionStatement) {
      this.emit(this.newline);
    } else {
      this.emitSemicolonAfterStatement();
    }

    this.emitExtraNewlineAfter(node.kind);

    if (node.kind === NodeKind.CONSTRUCTOR) {
      var type = symbol.enclosingSymbol.type;

      if (type.isClass() && type.baseClass() !== null) {
        this.emitSemicolonIfNeeded();
        this.emitExtraNewlineBefore(NodeKind.EXPRESSION);
        this.emit(this.indent + this.patcher.$extends + '(' + js.Emitter.fullName(type.symbol) + ',' + this.space + js.Emitter.fullName(type.baseClass().symbol) + ')');
        this.emitSemicolonAfterStatement();
        this.emitExtraNewlineAfter(NodeKind.EXPRESSION);
      }
    }
  };

  js.Emitter.prototype.emitVariable = function(node) {
    var value = node.variableValue();
    this.emit(node.symbol === null ? node.declarationName().asString() : js.Emitter.fullName(node.symbol));

    if (value !== null) {
      this.emit(this.space + '=' + this.space);
      this.emitExpression(value, Precedence.COMMA);
    }
  };

  js.Emitter.prototype.emitIf = function(node) {
    this.emit(this.indent);
    this.recursiveEmitIfStatement(node);
    this.emit(this.newline);
  };

  js.Emitter.prototype.emitThrow = function(node) {
    this.emit(this.indent + 'throw');
    this.emitExpressionAfterKeyword(node.throwValue());
    this.emitSemicolonAfterStatement();
  };

  js.Emitter.prototype.emitTry = function(node) {
    var catches = node.catches();
    var finallyBlock = node.finallyBlock();
    this.emit(this.indent + 'try');
    this.emitBlock(node.tryBlock(), js.AfterToken.AFTER_KEYWORD, js.BracesMode.MUST_KEEP_BRACES);

    for (var i = 0; i < catches.length; i = i + 1 | 0) {
      var catchNode = catches[i];
      this.emit(this.space + 'catch' + this.space + '(' + js.Emitter.mangleName(catchNode.catchVariable().symbol) + ')');
      this.emitBlock(catchNode.catchBlock(), js.AfterToken.AFTER_PARENTHESIS, js.BracesMode.MUST_KEEP_BRACES);
    }

    if (finallyBlock !== null) {
      this.emit(this.space + 'finally');
      this.emitBlock(finallyBlock, js.AfterToken.AFTER_KEYWORD, js.BracesMode.MUST_KEEP_BRACES);
    }

    this.emit(this.newline);
  };

  js.Emitter.prototype.emitFor = function(node) {
    var setup = node.forSetup();
    var test = node.forTest();
    var update = node.forUpdate();
    this.emit(this.indent + 'for' + this.space + '(');

    if (setup !== null) {
      if (setup.kind === NodeKind.VARIABLE_CLUSTER) {
        this.emit('var ');
        this.emitCommaSeparatedNodes(setup.clusterVariables());
      } else {
        this.emitExpression(setup, Precedence.LOWEST);
      }
    }

    if (test !== null) {
      this.emit(';' + this.space);
      this.emitExpression(test, Precedence.LOWEST);
    } else {
      this.emit(';');
    }

    if (update !== null) {
      this.emit(';' + this.space);
      this.emitExpression(update, Precedence.LOWEST);
    } else {
      this.emit(';');
    }

    this.emit(')');
    this.emitBlock(node.forBlock(), js.AfterToken.AFTER_PARENTHESIS, js.BracesMode.CAN_OMIT_BRACES);
    this.emit(this.newline);
  };

  js.Emitter.prototype.emitForEach = function(node) {
    var variable = node.forEachVariable();
    var value = node.forEachValue();
    this.emit(this.indent + 'for' + this.space + '(var ');
    this.emitNode(variable);
    this.emit(' in ');
    this.emitExpression(value, Precedence.LOWEST);
    this.emit(')');
    this.emitBlock(node.forEachBlock(), js.AfterToken.AFTER_PARENTHESIS, js.BracesMode.CAN_OMIT_BRACES);
    this.emit(this.newline);
  };

  js.Emitter.prototype.emitWhile = function(node) {
    this.emit(this.indent + 'while' + this.space + '(');
    this.emitExpression(node.whileTest(), Precedence.LOWEST);
    this.emit(')');
    this.emitBlock(node.whileBlock(), js.AfterToken.AFTER_PARENTHESIS, js.BracesMode.CAN_OMIT_BRACES);
    this.emit(this.newline);
  };

  js.Emitter.prototype.emitDoWhile = function(node) {
    this.emit(this.indent + 'do');
    this.emitBlock(node.whileBlock(), js.AfterToken.AFTER_KEYWORD, js.BracesMode.CAN_OMIT_BRACES);
    this.emitSemicolonIfNeeded();
    this.emit(this.space + 'while' + this.space + '(');
    this.emitExpression(node.whileTest(), Precedence.LOWEST);
    this.emit(')');
    this.emitSemicolonAfterStatement();
  };

  js.Emitter.prototype.emitExpressionAfterKeyword = function(node) {
    this.emit(node.kind === NodeKind.MAP || node.kind === NodeKind.LIST ? this.space : ' ');
    this.emitExpression(node, Precedence.LOWEST);
  };

  js.Emitter.prototype.emitReturn = function(node) {
    var value = node.returnValue();
    this.emit(this.indent);
    this.emit('return');

    if (value !== null) {
      this.emitExpressionAfterKeyword(value);
    }

    this.emitSemicolonAfterStatement();
  };

  js.Emitter.prototype.emitBreak = function(node) {
    this.emit(this.indent + 'break');
    this.emitSemicolonAfterStatement();
  };

  js.Emitter.prototype.emitContinue = function(node) {
    this.emit(this.indent + 'continue');
    this.emitSemicolonAfterStatement();
  };

  js.Emitter.prototype.emitAssert = function(node) {
    var value = node.assertValue();
    value.invertBooleanCondition(this.resolver.cache);

    if (!value.isFalse()) {
      var couldBeFalse = !value.isTrue();

      if (couldBeFalse) {
        this.emit(this.indent + 'if' + this.space + '(');
        this.emitExpression(value, Precedence.LOWEST);
        this.emit(')');

        if (!this.options.minify) {
          this.emit(' {\n');
          this.increaseIndent();
        }
      }

      var text = node.range + ' (' + node.range.locationString() + ')';
      this.emit(this.indent + 'throw new Error(' + this.quoteStringJS(text) + ')');
      this.emitSemicolonAfterStatement();

      if (couldBeFalse && !this.options.minify) {
        this.decreaseIndent();
        this.emit(this.indent + '}\n');
      }
    }
  };

  js.Emitter.prototype.emitExpressionStatement = function(node) {
    this.emit(this.indent);
    this.emitExpression(node.expressionValue(), Precedence.LOWEST);
    this.emitSemicolonAfterStatement();
  };

  js.Emitter.prototype.emitSwitch = function(node) {
    this.emit(this.indent + 'switch' + this.space + '(');
    this.emitExpression(node.switchValue(), Precedence.LOWEST);
    this.emit(')' + this.space + '{' + this.newline);
    this.emitStatements(node.switchCases().children);
    this.emit(this.indent + '}' + this.newline);
    this.needsSemicolon = false;
  };

  js.Emitter.prototype.emitModifier = function(node) {
    this.emitStatements(node.modifierStatements());
  };

  js.Emitter.prototype.emitExpression = function(node, precedence) {
    this.addMapping(node);

    var kind = node.kind;

    switch (kind) {
    case 39:
      this.emit(node.symbol === null ? node.asString() : js.Emitter.fullName(node.symbol));
      break;

    case 40:
      this.emitType(node.type, precedence);
      break;

    case 41:
      this.emit('this');
      break;

    case 42:
      this.emitHook(node, precedence);
      break;

    case 43:
      this.emit('null');
      break;

    case 44:
      this.emitBool(node);
      break;

    case 45:
      this.emitInt(node);
      break;

    case 46:
    case 47:
      this.emitDouble(node);
      break;

    case 48:
      this.emit(this.quoteStringJS(node.asString()));
      break;

    case 49:
      this.emitList(node);
      break;

    case 51:
      this.emitKeyValue(node);
      break;

    case 50:
      this.emitMap(node);
      break;

    case 52:
    case 53:
    case 54:
      this.emitDot(node);
      break;

    case 55:
      this.emitCall(node);
      break;

    case 56:
      this.emitSuperCall(node);
      break;

    case 58:
      this.emitSequence(node, precedence);
      break;

    case 62:
      this.emitExpression(node.quotedValue(), precedence);
      break;

    case 91:
      this.emitIndex(node, precedence);
      break;

    case 115:
      this.emitTernary(node, precedence);
      break;

    case 60:
    case 61:
      this.emitExpression(node.castValue(), precedence);
      break;

    default:
      if (in_NodeKind.isUnaryOperator(kind)) {
        this.emitUnary(node, precedence);
      } else if (in_NodeKind.isBinaryOperator(kind)) {
        this.emitBinary(node, precedence);
      } else {
        throw new Error('assert false (src/js/emitter.sk:722:16)');
      }
      break;
    }
  };

  js.Emitter.prototype.emitType = function(type, precedence) {
    if (type.isQuoted()) {
      this.emitExpression(type.symbol.node, precedence);
    } else {
      this.emit(js.Emitter.fullName(type.symbol));
    }
  };

  js.Emitter.prototype.emitHook = function(node, precedence) {
    if (Precedence.ASSIGN < precedence) {
      this.emit('(');
    }

    this.emitExpression(node.hookTest(), Precedence.LOGICAL_OR);
    this.emit(this.space + '?' + this.space);
    this.emitExpression(node.hookTrue(), Precedence.ASSIGN);
    this.emit(this.space + ':' + this.space);
    this.emitExpression(node.hookFalse(), Precedence.ASSIGN);

    if (Precedence.ASSIGN < precedence) {
      this.emit(')');
    }
  };

  js.Emitter.prototype.emitBool = function(node) {
    if (this.options.mangle) {
      this.emit(node.asBool() ? '!0' : '!1');
    } else {
      this.emit(node.asBool() ? 'true' : 'false');
    }
  };

  js.Emitter.prototype.emitInt = function(node) {
    var wrap = node.parent.kind === NodeKind.DOT && node !== this.toStringTarget;

    if (wrap) {
      this.emit('(');
    }

    this.emit(node.asInt().toString());

    if (wrap) {
      this.emit(')');
    }
  };

  js.Emitter.prototype.emitDouble = function(node) {
    var wrap = node.parent.kind === NodeKind.DOT && node !== this.toStringTarget;
    var value = node.asDouble();

    if (wrap) {
      this.emit('(');
    }

    if (value === math.INFINITY) {
      this.emit('Infinity');
    } else if (value === -math.INFINITY) {
      this.emit('-Infinity');
    } else if (value !== value) {
      this.emit('NaN');
    } else {
      this.emit(doubleToStringWithoutDotZero(value));
    }

    if (wrap) {
      this.emit(')');
    }
  };

  js.Emitter.prototype.emitList = function(node) {
    this.emit('[');
    this.emitCommaSeparatedExpressions(node.listValues());
    this.emit(']');
  };

  js.Emitter.isDigits = function(text) {
    var found = false;

    for (var n = text.length, i = n !== 0 && text.charCodeAt(0) === 45 ? 1 : 0; i < n; i = i + 1 | 0) {
      var c = text.charCodeAt(i);

      if (c >= 48 && c <= 57) {
        found = true;
      } else {
        return false;
      }
    }

    return found;
  };

  js.Emitter.prototype.emitKeyValue = function(node) {
    var key = node.itemKey();

    if (this.options.minify && key.kind === NodeKind.STRING) {
      var value = key.asString();

      if (js.Emitter.isValidIdentifier(value) || js.Emitter.isDigits(value) && parseIntLiteral(value, 10).toString() === value) {
        this.emit(value);
      } else {
        this.emitExpression(key, Precedence.COMMA);
      }
    } else {
      this.emitExpression(key, Precedence.COMMA);
    }

    this.emit(':' + this.space);
    this.emitExpression(node.itemValue(), Precedence.COMMA);
  };

  js.Emitter.prototype.emitMap = function(node) {
    var items = node.mapItems();
    var padding = items.length !== 0 ? this.space : '';
    this.emit('{' + padding);
    this.emitCommaSeparatedExpressions(items);
    this.emit(padding + '}');
  };

  js.Emitter.prototype.emitDot = function(node) {
    this.emitExpression(node.dotTarget(), Precedence.MEMBER);
    this.emit('.');

    var name = node.dotName();
    this.emit(name.symbol === null ? name.asString() : in_SymbolKind.isInstance(name.symbol.kind) ? js.Emitter.mangleName(name.symbol) : js.Emitter.fullName(name.symbol));
  };

  js.Emitter.prototype.emitCall = function(node) {
    var value = node.callValue();

    if (value.kind === NodeKind.TYPE) {
      this.emit('new ');
    }

    this.emitExpression(value, Precedence.UNARY_POSTFIX);
    this.emit('(');
    this.emitCommaSeparatedExpressions(node.callArguments());
    this.emit(')');
  };

  js.Emitter.prototype.emitSuperCall = function(node) {
    var $arguments = node.superCallArguments();
    this.emit(js.Emitter.fullName(node.symbol));
    this.emit('.call(this');

    for (var i = 0; i < $arguments.length; i = i + 1 | 0) {
      this.emit(',' + this.space);
      this.emitExpression($arguments[i], Precedence.COMMA);
    }

    this.emit(')');
  };

  js.Emitter.prototype.emitSequence = function(node, precedence) {
    if (Precedence.COMMA <= precedence) {
      this.emit('(');
    }

    this.emitCommaSeparatedExpressions(node.sequenceValues());

    if (Precedence.COMMA <= precedence) {
      this.emit(')');
    }
  };

  js.Emitter.prototype.isRightChildOfBinaryExpression = function(node, kind) {
    if (!in_NodeKind.isBinaryOperator(kind)) {
      throw new Error('assert kind.isBinaryOperator() (src/js/emitter.sk:851:7)');
    }

    while (in_NodeKind.isBinaryOperator(node.parent.kind)) {
      if (node.parent.binaryRight() === node) {
        return node.parent.kind === kind;
      }

      node = node.parent;
    }

    return false;
  };

  js.Emitter.prototype.emitUnary = function(node, precedence) {
    var value = node.unaryValue();
    var info = operatorInfo[node.kind];

    if (info.precedence < precedence) {
      this.emit('(');
    }

    var isPostfix = info.precedence === Precedence.UNARY_POSTFIX;

    if (!isPostfix) {
      var kind = node.kind;
      var valueKind = value.kind;

      if (this.options.minify && (kind === NodeKind.POSITIVE && this.isRightChildOfBinaryExpression(node, NodeKind.ADD) || kind === NodeKind.NEGATIVE && this.isRightChildOfBinaryExpression(node, NodeKind.SUBTRACT))) {
        this.emit(' ');
      }

      this.emit(info.text);

      if (kind === NodeKind.NEW || kind === NodeKind.DELETE || kind === NodeKind.POSITIVE && (valueKind === NodeKind.POSITIVE || valueKind === NodeKind.PREFIX_INCREMENT) || kind === NodeKind.NEGATIVE && (valueKind === NodeKind.NEGATIVE || valueKind === NodeKind.PREFIX_DECREMENT || value.isNumberLessThanZero())) {
        this.emit(' ');
      }
    }

    this.emitExpression(value, info.precedence);

    if (isPostfix) {
      this.emit(info.text);
    }

    if (info.precedence < precedence) {
      this.emit(')');
    }
  };

  js.Emitter.prototype.isToStringCall = function(node) {
    if (node.kind === NodeKind.CALL) {
      var value = node.callValue();
      return value.kind === NodeKind.DOT && value.symbol !== null && value.symbol.name === 'toString' && node.callArguments().length === 0;
    }

    return false;
  };

  js.Emitter.prototype.emitBinary = function(node, precedence) {
    var kind = node.kind;
    var left = node.binaryLeft();
    var right = node.binaryRight();
    var info = operatorInfo[kind];

    if (info.precedence < precedence) {
      this.emit('(');
    }

    if ((kind === NodeKind.ADD || kind === NodeKind.ASSIGN_ADD) && left.type !== null && left.type.isString(this.resolver.cache) && this.isToStringCall(right)) {
      right = right.callValue().dotTarget();
    } else if (kind === NodeKind.ADD && right.type !== null && right.type.isString(this.resolver.cache) && this.isToStringCall(left)) {
      left = left.callValue().dotTarget();
    }

    this.toStringTarget = left;
    this.emitExpression(left, in_Precedence.incrementIfRightAssociative(info.precedence, info.associativity));
    this.emit(kind === NodeKind.IN ? ' in ' : kind === NodeKind.IS ? ' instanceof ' : this.space + (kind === NodeKind.EQUAL ? '===' : kind === NodeKind.NOT_EQUAL ? '!==' : info.text) + this.space);

    if (this.space === '' && (kind === NodeKind.ADD && (right.kind === NodeKind.POSITIVE || right.kind === NodeKind.PREFIX_INCREMENT) || kind === NodeKind.SUBTRACT && (right.kind === NodeKind.NEGATIVE || right.kind === NodeKind.PREFIX_DECREMENT || right.isNumberLessThanZero()))) {
      this.emit(' ');
    }

    this.toStringTarget = right;
    this.emitExpression(right, in_Precedence.incrementIfLeftAssociative(info.precedence, info.associativity));

    if (info.precedence < precedence) {
      this.emit(')');
    }
  };

  js.Emitter.prototype.isIdentifierString = function(node) {
    if (node.kind === NodeKind.STRING) {
      var value = node.asString();

      for (var i = 0; i < value.length; i = i + 1 | 0) {
        var c = value.charCodeAt(i);

        if ((c < 65 || c > 90) && (c < 97 || c > 122) && c !== 95 && c !== 36 && (i === 0 || c < 48 || c > 57)) {
          return false;
        }
      }

      return value.length > 0 && !(value in js.Emitter.isKeyword);
    }

    return false;
  };

  js.Emitter.prototype.emitIndexProperty = function(node) {
    if (this.options.mangle && this.isIdentifierString(node)) {
      this.emit('.' + node.asString());
    } else {
      this.emit('[');
      this.emitExpression(node, Precedence.LOWEST);
      this.emit(']');
    }
  };

  js.Emitter.prototype.emitIndex = function(node, precedence) {
    this.emitExpression(node.binaryLeft(), Precedence.MEMBER);
    this.emitIndexProperty(node.binaryRight());
  };

  js.Emitter.prototype.emitTernary = function(node, precedence) {
    if (Precedence.ASSIGN < precedence) {
      this.emit('(');
    }

    this.emitExpression(node.ternaryLeft(), Precedence.MEMBER);
    this.emitIndexProperty(node.ternaryMiddle());
    this.emit(this.space + '=' + this.space);
    this.emitExpression(node.ternaryRight(), Precedence.ASSIGN);

    if (Precedence.ASSIGN < precedence) {
      this.emit(')');
    }
  };

  js.Emitter.prototype.quoteStringJS = function(text) {
    var doubleCount = 0;
    var singleCount = 0;

    for (var i = 0; i < text.length; i = i + 1 | 0) {
      var c = text.charCodeAt(i);

      if (c === 34) {
        doubleCount = doubleCount + 1 | 0;
      } else if (c === 39) {
        singleCount = singleCount + 1 | 0;
      }
    }

    return quoteString(text, singleCount > doubleCount ? 34 : 39);
  };

  js.Emitter.hasCompoundName = function(symbol) {
    var enclosingSymbol = symbol.enclosingSymbol;
    return enclosingSymbol !== null && enclosingSymbol.kind !== SymbolKind.GLOBAL_NAMESPACE && (symbol.kind !== SymbolKind.CONSTRUCTOR_FUNCTION || js.Emitter.hasCompoundName(enclosingSymbol));
  };

  js.Emitter.mangleName = function(symbol) {
    if (symbol.emitAs !== null) {
      return symbol.emitAs.value;
    }

    if (symbol.kind === SymbolKind.CONSTRUCTOR_FUNCTION) {
      return js.Emitter.mangleName(symbol.enclosingSymbol);
    }

    if (symbol.isImportOrExport()) {
      return symbol.name;
    }

    if (symbol.name in js.Emitter.isKeyword) {
      return '$' + symbol.name;
    }

    return symbol.name;
  };

  js.Emitter.fullName = function(symbol) {
    var enclosingSymbol = symbol.enclosingSymbol;

    if (enclosingSymbol !== null && enclosingSymbol.kind !== SymbolKind.GLOBAL_NAMESPACE) {
      var enclosingName = js.Emitter.fullName(enclosingSymbol);

      if (symbol.kind === SymbolKind.CONSTRUCTOR_FUNCTION) {
        return enclosingName;
      }

      if (in_SymbolKind.isInstance(symbol.kind)) {
        enclosingName += '.prototype';
      }

      return enclosingName + '.' + js.Emitter.mangleName(symbol);
    }

    return js.Emitter.mangleName(symbol);
  };

  js.Emitter.isValidIdentifier = function(text) {
    for (var i = 0; i < text.length; i = i + 1 | 0) {
      var c = text.charCodeAt(i);

      if ((c < 65 || c > 90) && (c < 97 || c > 122) && c !== 95 && c !== 36 && (i === 0 || c < 48 || c > 57)) {
        return false;
      }
    }

    return text !== '';
  };

  js.BooleanSwap = {
    SWAP: 0,
    NO_SWAP: 1
  };

  js.ExtractGroupsMode = {
    ALL_SYMBOLS: 0,
    ONLY_LOCAL_VARIABLES: 1,
    ONLY_INSTANCE_VARIABLES: 2
  };

  js.SymbolGroup = function(_0, _1) {
    this.group = _0;
    this.count = _1;
  };

  js.SymbolGroupComparison = function() {
  };

  js.SymbolGroupComparison.prototype.compare = function(left, right) {
    var difference = right.count - left.count | 0;

    if (difference === 0) {
      difference = right.group.length - left.group.length | 0;

      for (var i = 0; difference === 0 && i < left.group.length; i = i + 1 | 0) {
        difference = left.group[i].uniqueID - right.group[i].uniqueID | 0;
      }
    }

    return difference;
  };

  js.Patcher = function(_0) {
    this.imul = '$imul';
    this.$extends = '$extends';
    this.needExtends = false;
    this.needMathImul = false;
    this.nextTempID = 0;
    this.createdThisAlias = false;
    this.currentFunction = null;
    this.nextSymbolName = 0;
    this.options = null;
    this.localVariableUnionFind = null;
    this.cache = null;
    this.reservedNames = in_StringMap.clone(js.Emitter.isKeyword);
    this.symbolCounts = Object.create(null);
    this.namingGroupIndexForSymbol = Object.create(null);
    this.resolver = _0;
  };

  js.Patcher.prototype.run = function(program) {
    if (program.kind !== NodeKind.PROGRAM) {
      throw new Error('assert program.kind == .PROGRAM (src/js/patcher.sk:57:7)');
    }

    var allSymbols = this.resolver.allSymbols;
    this.options = this.resolver.options;
    this.cache = this.resolver.cache;

    if (this.options.mangle) {
      this.localVariableUnionFind = new UnionFind(allSymbols.length);

      for (var i = 0; i < allSymbols.length; i = i + 1 | 0) {
        this.namingGroupIndexForSymbol[allSymbols[i].uniqueID] = i;
      }

      this.imul = '$i';
      this.$extends = '$e';
    }

    this.patchNode(program);

    if (this.options.mangle) {
      var namingGroupsUnionFind = new UnionFind(allSymbols.length);
      var order = [];
      this.aliasLocalVariables(namingGroupsUnionFind, order);
      this.aliasUnrelatedProperties(namingGroupsUnionFind, order);

      for (var i = 0; i < allSymbols.length; i = i + 1 | 0) {
        var symbol = allSymbols[i];

        if (symbol.overriddenMember !== null) {
          var overridden = symbol.overriddenMember.symbol;
          var index = this.namingGroupIndexForSymbol[symbol.uniqueID];
          namingGroupsUnionFind.union(index, this.namingGroupIndexForSymbol[overridden.uniqueID]);

          if (overridden.identicalMembers !== null) {
            for (var j = 0; j < overridden.identicalMembers.length; j = j + 1 | 0) {
              namingGroupsUnionFind.union(index, this.namingGroupIndexForSymbol[overridden.identicalMembers[j].symbol.uniqueID]);
            }
          }
        }
      }

      var members = in_StringMap.values(this.cache.globalType.members);

      for (var i = 0; i < members.length; i = i + 1 | 0) {
        var member = members[i];

        if (!this.canRename(member.symbol)) {
          this.reservedNames[member.symbol.name] = 0;
        }
      }

      var namingGroups = this.extractGroups(namingGroupsUnionFind, js.ExtractGroupsMode.ALL_SYMBOLS);
      var sortedGroups = [];

      for (var i = 0; i < namingGroups.length; i = i + 1 | 0) {
        var group = namingGroups[i];
        var count = 0;

        for (var j = 0; j < group.length; j = j + 1 | 0) {
          var symbol = group[j];

          if (this.canRename(symbol)) {
            count = count + in_IntMap.getOrDefault(this.symbolCounts, symbol.uniqueID, 0) | 0;
          }
        }

        sortedGroups.push(new js.SymbolGroup(group, count));
      }

      sortedGroups.sort(bindCompare(js.SymbolGroupComparison.INSTANCE));

      for (var i = 0; i < sortedGroups.length; i = i + 1 | 0) {
        var group = sortedGroups[i].group;
        var name = '';

        for (var j = 0; j < group.length; j = j + 1 | 0) {
          var symbol = group[j];

          if (this.canRename(symbol)) {
            if (name === '') {
              name = this.generateSymbolName();
            }

            if (symbol.kind !== SymbolKind.INSTANCE_FUNCTION) {
              symbol.enclosingSymbol = this.cache.globalType.symbol;
            }

            symbol.name = name;
          }
        }
      }
    }
  };

  js.Patcher.prototype.aliasLocalVariables = function(unionFind, order) {
    this.zipTogetherInOrder(unionFind, order, this.extractGroups(this.localVariableUnionFind, js.ExtractGroupsMode.ONLY_LOCAL_VARIABLES));
  };

  js.Patcher.prototype.aliasUnrelatedProperties = function(unionFind, order) {
    var allSymbols = this.resolver.allSymbols;
    var relatedTypesUnionFind = new UnionFind(allSymbols.length);

    for (var i = 0; i < allSymbols.length; i = i + 1 | 0) {
      var symbol = allSymbols[i];

      if (in_SymbolKind.isType(symbol.kind)) {
        if (symbol.type.hasRelevantTypes()) {
          var types = symbol.type.relevantTypes;

          for (var j = 0; j < types.length; j = j + 1 | 0) {
            relatedTypesUnionFind.union(i, this.namingGroupIndexForSymbol[types[j].symbol.uniqueID]);
          }
        }

        var members = in_StringMap.values(symbol.type.members);

        for (var j = 0; j < members.length; j = j + 1 | 0) {
          var index = in_IntMap.getOrDefault(this.namingGroupIndexForSymbol, members[j].symbol.uniqueID, -1);

          if (index !== -1) {
            relatedTypesUnionFind.union(i, index);
          }
        }
      }
    }

    this.zipTogetherInOrder(unionFind, order, this.extractGroups(relatedTypesUnionFind, js.ExtractGroupsMode.ONLY_INSTANCE_VARIABLES));
  };

  js.Patcher.prototype.zipTogetherInOrder = function(unionFind, order, groups) {
    for (var i = 0; i < groups.length; i = i + 1 | 0) {
      var group = groups[i];

      for (var j = 0; j < group.length; j = j + 1 | 0) {
        var symbol = group[j];
        var index = this.namingGroupIndexForSymbol[symbol.uniqueID];

        if (order.length <= j) {
          order.push(index);
        }

        unionFind.union(index, order[j]);
      }
    }
  };

  js.Patcher.prototype.extractGroups = function(unionFind, mode) {
    var labelToGroup = Object.create(null);
    var allSymbols = this.resolver.allSymbols;

    for (var i = 0; i < allSymbols.length; i = i + 1 | 0) {
      var symbol = allSymbols[i];

      if (mode === js.ExtractGroupsMode.ONLY_LOCAL_VARIABLES && symbol.kind !== SymbolKind.LOCAL_VARIABLE || mode === js.ExtractGroupsMode.ONLY_INSTANCE_VARIABLES && symbol.kind !== SymbolKind.INSTANCE_VARIABLE) {
        continue;
      }

      var label = unionFind.find(this.namingGroupIndexForSymbol[symbol.uniqueID]);
      var group = in_IntMap.getOrDefault(labelToGroup, label, null);

      if (group === null) {
        group = [];
        labelToGroup[label] = group;
      }

      group.push(symbol);
    }

    var groups = in_IntMap.values(labelToGroup);

    for (var i = 0; i < groups.length; i = i + 1 | 0) {
      var group = groups[i];

      if (group.length > 1) {
        group.sort(bindCompare(SymbolComparison.INSTANCE));
      }
    }

    return groups;
  };

  js.Patcher.prototype.shouldRemoveConstant = function(symbol) {
    return this.options.foldAllConstants && symbol.isConst() && !symbol.isExport();
  };

  js.Patcher.prototype.canRename = function(symbol) {
    if (!symbol.isImportOrExport() && symbol.kind !== SymbolKind.CONSTRUCTOR_FUNCTION && !this.shouldRemoveConstant(symbol)) {
      if (symbol.overriddenMember !== null) {
        return this.canRename(symbol.overriddenMember.symbol);
      }

      return true;
    }

    return false;
  };

  js.Patcher.prototype.trackSymbolCount = function(node) {
    var symbol = node.symbol;

    if (symbol !== null && node.kind !== NodeKind.TYPE && !node.isDeclarationName()) {
      this.symbolCounts[symbol.uniqueID] = in_IntMap.getOrDefault(this.symbolCounts, symbol.uniqueID, 0) + 1 | 0;
    }
  };

  js.Patcher.prototype.patchNode = function(node) {
    this.trackSymbolCount(node);

    switch (node.kind) {
    case 14:
      this.patchConstructor(node);
      this.setCurrentFunction(node.symbol);
      break;

    case 15:
      this.setCurrentFunction(node.symbol);
      break;

    case 60:
      this.patchCast(node);
      break;

    case 11:
      this.patchClass(node);
      break;

    case 39:
      this.patchName(node);
      break;

    case 21:
      this.patchTry(node);
      break;

    case 49:
      this.mangleStringList(node);
      break;

    case 81:
    case 103:
    case 97:
    case 86:
    case 100:
      this.patchBinaryArithmetic(node);
      break;

    case 68:
    case 69:
    case 71:
    case 72:
    case 74:
    case 73:
      this.patchUnary(node);
      break;

    case 105:
    case 109:
    case 107:
    case 106:
    case 108:
      this.patchAssign(node);
      break;
    }

    if (node.hasChildren()) {
      var children = node.children;

      for (var i = 0; i < children.length; i = i + 1 | 0) {
        var child = children[i];

        if (child !== null) {
          this.patchNode(child);
        }
      }
    }

    if (in_NodeKind.isFunction(node.kind)) {
      this.setCurrentFunction(null);
    } else if (this.options.mangle) {
      switch (node.kind) {
      case 16:
        this.unionVariableWithFunction(node.symbol);
        break;

      case 20:
        this.peepholeMangleIf(node);
        break;

      case 22:
        this.peepholeMangleFor(node);
        break;

      case 89:
      case 94:
        this.peepholeMangleBinaryRelational(node);
        break;

      case 24:
      case 25:
        this.peepholeMangleBoolean(node.whileTest(), js.BooleanSwap.NO_SWAP);
        break;

      case 2:
        this.peepholeMangleBlock(node);
        break;

      case 42:
        this.peepholeMangleHook(node);
        break;

      case 96:
        this.peepholeMangleLogicalOr(node);
        break;
      }
    }
  };

  js.Patcher.prototype.isIntegerType = function(node) {
    return node.type !== null && node.type.isInteger(this.cache);
  };

  js.Patcher.prototype.peepholeMangleBinaryRelational = function(node) {
    if (node.kind !== NodeKind.GREATER_THAN_OR_EQUAL && node.kind !== NodeKind.LESS_THAN_OR_EQUAL) {
      throw new Error('assert node.kind == .GREATER_THAN_OR_EQUAL || node.kind == .LESS_THAN_OR_EQUAL (src/js/patcher.sk:317:7)');
    }

    var left = node.binaryLeft();
    var right = node.binaryRight();

    if (this.isIntegerType(left) && this.isIntegerType(right)) {
      if (left.kind === NodeKind.INT) {
        var value = left.asInt();

        if (node.kind === NodeKind.GREATER_THAN_OR_EQUAL && canIncrement(value)) {
          left.content = new IntContent(value + 1 | 0);
          node.kind = NodeKind.GREATER_THAN;
        } else if (node.kind === NodeKind.LESS_THAN_OR_EQUAL && canDecrement(value)) {
          left.content = new IntContent(value - 1 | 0);
          node.kind = NodeKind.LESS_THAN;
        }
      } else if (right.kind === NodeKind.INT) {
        var value = right.asInt();

        if (node.kind === NodeKind.GREATER_THAN_OR_EQUAL && canDecrement(value)) {
          right.content = new IntContent(value - 1 | 0);
          node.kind = NodeKind.GREATER_THAN;
        } else if (node.kind === NodeKind.LESS_THAN_OR_EQUAL && canIncrement(value)) {
          right.content = new IntContent(value + 1 | 0);
          node.kind = NodeKind.LESS_THAN;
        }
      }
    }
  };

  js.Patcher.prototype.isFalsy = function(node) {
    var kind = node.kind;

    if (kind === NodeKind.NULL) {
      return true;
    } else if (kind === NodeKind.INT) {
      return node.asInt() === 0;
    } else if (in_NodeKind.isReal(kind)) {
      return node.asDouble() === 0 || isNaN(node.asDouble());
    } else if (kind === NodeKind.STRING) {
      return node.asString() === '';
    } else if (in_NodeKind.isCast(kind)) {
      return this.isFalsy(node.castValue());
    } else {
      return false;
    }
  };

  js.Patcher.prototype.peepholeMangleBoolean = function(node, canSwap) {
    var kind = node.kind;

    if (kind === NodeKind.EQUAL || kind === NodeKind.NOT_EQUAL) {
      var left = node.binaryLeft();
      var right = node.binaryRight();
      var replacement = this.isFalsy(right) ? left : this.isFalsy(left) ? right : null;

      if (replacement !== null) {
        if (left.type !== null && !left.type.isReal(this.cache) && right.type !== null && !right.type.isReal(this.cache)) {
          replacement.replaceWith(null);
          node.become(kind === NodeKind.EQUAL ? Node.createUnary(NodeKind.NOT, replacement) : replacement);
        }
      } else if (this.isIntegerType(left) && this.isIntegerType(right) && (kind === NodeKind.NOT_EQUAL || kind === NodeKind.EQUAL && canSwap === js.BooleanSwap.SWAP)) {
        if (right.kind === NodeKind.INT && right.asInt() === -1) {
          node.become(Node.createUnary(NodeKind.COMPLEMENT, left.replaceWith(null)));
        } else if (left.kind === NodeKind.INT && left.asInt() === -1) {
          node.become(Node.createUnary(NodeKind.COMPLEMENT, right.replaceWith(null)));
        } else {
          node.kind = NodeKind.BITWISE_XOR;
        }

        return kind === NodeKind.EQUAL ? js.BooleanSwap.SWAP : js.BooleanSwap.NO_SWAP;
      }
    } else if (kind === NodeKind.LOGICAL_AND || kind === NodeKind.LOGICAL_OR) {
      this.peepholeMangleBoolean(node.binaryLeft(), js.BooleanSwap.NO_SWAP);
      this.peepholeMangleBoolean(node.binaryRight(), js.BooleanSwap.NO_SWAP);
    }

    if (node.kind === NodeKind.NOT && canSwap === js.BooleanSwap.SWAP) {
      node.become(node.unaryValue().replaceWith(null));
      return js.BooleanSwap.SWAP;
    }

    return js.BooleanSwap.NO_SWAP;
  };

  js.Patcher.prototype.peepholeMangleIf = function(node) {
    var test = node.ifTest();
    var trueBlock = node.ifTrue();
    var falseBlock = node.ifFalse();
    var trueStatement = trueBlock.blockStatement();
    var swapped = this.peepholeMangleBoolean(test, falseBlock !== null || trueStatement !== null && trueStatement.kind === NodeKind.EXPRESSION ? js.BooleanSwap.SWAP : js.BooleanSwap.NO_SWAP);

    if (falseBlock !== null) {
      var falseStatement = falseBlock.blockStatement();

      if (swapped === js.BooleanSwap.SWAP) {
        var block = trueBlock;
        trueBlock = falseBlock;
        falseBlock = block;

        var statement = trueStatement;
        trueStatement = falseStatement;
        falseStatement = statement;
        trueBlock.swapWith(falseBlock);
      }

      if (trueStatement !== null && falseStatement !== null) {
        if (trueStatement.kind === NodeKind.EXPRESSION && falseStatement.kind === NodeKind.EXPRESSION) {
          var hook = Node.createHook(NodeKind.HOOK, test.replaceWith(null), trueStatement.expressionValue().replaceWith(null), falseStatement.expressionValue().replaceWith(null));
          this.peepholeMangleHook(hook);
          node.become(Node.createExpression(hook));
        } else if (trueStatement.kind === NodeKind.RETURN && falseStatement.kind === NodeKind.RETURN) {
          var trueValue = trueStatement.returnValue();
          var falseValue = falseStatement.returnValue();

          if (trueValue !== null && falseValue !== null) {
            var hook = Node.createHook(NodeKind.HOOK, test.replaceWith(null), trueValue.replaceWith(null), falseValue.replaceWith(null));
            this.peepholeMangleHook(hook);
            node.become(Node.createReturn(hook));
          }
        }
      }
    } else if (trueStatement !== null && trueStatement.kind === NodeKind.EXPRESSION) {
      var value = trueStatement.expressionValue().replaceWith(null);
      node.become(Node.createExpression(Node.createBinary(swapped === js.BooleanSwap.SWAP ? NodeKind.LOGICAL_OR : NodeKind.LOGICAL_AND, test.replaceWith(null), value)));
    }
  };

  js.Patcher.prototype.peepholeMangleFor = function(node) {
    var test = node.forTest();

    if (test !== null) {
      this.peepholeMangleBoolean(test, js.BooleanSwap.NO_SWAP);
    }
  };

  js.Patcher.prototype.isJumpImplied = function(node, kind) {
    if (node.kind !== NodeKind.BLOCK) {
      throw new Error('assert node.kind == .BLOCK (src/js/patcher.sk:483:7)');
    }

    if (kind !== NodeKind.RETURN && kind !== NodeKind.CONTINUE) {
      throw new Error('assert kind == .RETURN || kind == .CONTINUE (src/js/patcher.sk:484:7)');
    }

    var parent = node.parent;
    var parentKind = parent.kind;

    if (kind === NodeKind.RETURN && parentKind === NodeKind.FUNCTION || kind === NodeKind.CONTINUE && in_NodeKind.isLoop(parentKind)) {
      return true;
    }

    if (parentKind === NodeKind.IF && parent.isLastChild()) {
      return this.isJumpImplied(parent.parent, kind);
    }

    return false;
  };

  js.Patcher.prototype.peepholeMangleBlock = function(node) {
    if (!node.hasChildren()) {
      return;
    }

    for (var i = 0; i < node.children.length; i = i + 1 | 0) {
      var child = node.children[i];
      var kind = child.kind;

      if (kind === NodeKind.VARIABLE_CLUSTER) {
        while ((i + 1 | 0) < node.children.length) {
          var next = node.children[i + 1 | 0];

          if (next.kind !== NodeKind.VARIABLE_CLUSTER) {
            break;
          }

          var variables = next.remove().clusterVariables();

          for (var j = 0; j < variables.length; j = j + 1 | 0) {
            child.appendChild(variables[j].replaceWith(null));
          }
        }
      } else if (kind === NodeKind.FOR && i !== 0) {
        var previous = node.children[i - 1 | 0];
        var setup = child.forSetup();

        if (setup !== null && previous.kind === NodeKind.VARIABLE_CLUSTER && setup.kind === NodeKind.VARIABLE_CLUSTER) {
          var variables = previous.clusterVariables();

          for (var j = 0; j < variables.length; j = j + 1 | 0) {
            variables[j].replaceWith(null);
          }

          setup.insertChildren(1, variables);
          previous.remove();
          i = i - 1 | 0;
        }
      } else if (kind === NodeKind.EXPRESSION) {
        while ((i + 1 | 0) < node.children.length) {
          var next = node.children[i + 1 | 0];

          if (next.kind !== NodeKind.EXPRESSION) {
            break;
          }

          var combined = Node.createExpression(this.joinExpressions(child.expressionValue().replaceWith(null), next.remove().expressionValue().replaceWith(null)));
          child.replaceWith(combined);
          child = combined;
        }

        var value = child.expressionValue();

        if (value.kind === NodeKind.SEQUENCE) {
          this.peepholeMangleSequence(value);
        }
      } else if (kind === NodeKind.IF && child.ifFalse() === null) {
        var trueBlock = child.ifTrue();

        if (trueBlock.hasChildren()) {
          var statement = trueBlock.lastChild();

          if ((statement.kind === NodeKind.RETURN && statement.returnValue() === null || statement.kind === NodeKind.CONTINUE) && this.isJumpImplied(node, statement.kind)) {
            var block = null;
            statement.remove();

            if (!trueBlock.hasChildren()) {
              child.ifTest().invertBooleanCondition(this.cache);
              block = trueBlock;
            } else if (!child.isLastChild()) {
              block = Node.createBlock([]);
              child.replaceChild(2, block);

              if (block !== child.ifFalse()) {
                throw new Error('assert block == child.ifFalse() (src/js/patcher.sk:570:17)');
              }
            } else {
              this.peepholeMangleIf(child);
              return;
            }

            while ((i + 1 | 0) < node.children.length) {
              block.appendChild(node.children[i + 1 | 0].remove());
            }

            this.peepholeMangleBlock(block);
            this.peepholeMangleIf(child);

            if (child.kind === NodeKind.EXPRESSION && i !== 0) {
              var previous = node.children[i - 1 | 0];

              if (previous.kind === NodeKind.EXPRESSION) {
                previous.replaceWith(Node.createExpression(this.joinExpressions(previous.expressionValue().replaceWith(null), child.remove().expressionValue().replaceWith(null))));
              }
            }

            return;
          }
        }
      } else if (kind === NodeKind.RETURN && child.returnValue() !== null) {
        while (i !== 0) {
          var previous = node.children[i - 1 | 0];

          if (previous.kind === NodeKind.IF && previous.ifFalse() === null) {
            var statement = previous.ifTrue().blockStatement();

            if (statement !== null && statement.kind === NodeKind.RETURN && statement.returnValue() !== null) {
              var hook = Node.createHook(NodeKind.HOOK, previous.ifTest().replaceWith(null), statement.returnValue().replaceWith(null), child.returnValue().replaceWith(null));
              this.peepholeMangleHook(hook);
              child.remove();
              child = Node.createReturn(hook);
              previous.replaceWith(child);
            } else {
              break;
            }
          } else if (previous.kind === NodeKind.EXPRESSION) {
            var combined = Node.createReturn(this.joinExpressions(previous.remove().expressionValue().replaceWith(null), child.returnValue().replaceWith(null)));
            child.replaceWith(combined);
            child = combined;
          } else {
            break;
          }

          i = i - 1 | 0;
        }
      }
    }
  };

  js.Patcher.prototype.assignSourceIfNoSideEffects = function(node) {
    if (node.kind === NodeKind.ASSIGN && node.binaryLeft().hasNoSideEffects()) {
      var right = node.binaryRight();
      return right.hasNoSideEffects() ? right : null;
    }

    if (node.kind === NodeKind.ASSIGN_INDEX && node.ternaryLeft().hasNoSideEffects() && node.ternaryMiddle().hasNoSideEffects()) {
      var right = node.ternaryRight();
      return right.hasNoSideEffects() ? right : null;
    }

    return null;
  };

  js.Patcher.prototype.peepholeMangleSequence = function(node) {
    if (node.kind !== NodeKind.SEQUENCE) {
      throw new Error('assert node.kind == .SEQUENCE (src/js/patcher.sk:645:7)');
    }

    for (var i = node.children.length - 1 | 0; i > 0; i = i - 1 | 0) {
      var current = node.children[i];
      var currentRight = this.assignSourceIfNoSideEffects(current);

      if (currentRight !== null) {
        while (i !== 0) {
          var previous = node.children[i - 1 | 0];
          var previousRight = this.assignSourceIfNoSideEffects(previous);

          if (previousRight === null || !this.looksTheSame(previousRight, currentRight)) {
            break;
          }

          previousRight.replaceWith(current.remove());
          current = previous;
          i = i - 1 | 0;
        }
      }
    }
  };

  js.Patcher.prototype.joinExpressions = function(left, right) {
    var sequence = Node.createSequence(left.kind === NodeKind.SEQUENCE ? left.removeChildren() : [left]);
    sequence.appendChildren(right.kind === NodeKind.SEQUENCE ? right.removeChildren() : [right]);
    return sequence;
  };

  js.Patcher.prototype.looksTheSame = function(left, right) {
    if (left.kind === right.kind) {
      switch (left.kind) {
      case 43:
      case 41:
        return true;

      case 45:
        return left.asInt() === right.asInt();

      case 44:
        return left.asBool() === right.asBool();

      case 46:
      case 47:
        return left.asDouble() === right.asDouble();

      case 48:
        return left.asString() === right.asString();

      case 39:
        return left.symbol !== null && left.symbol === right.symbol || left.asString() === right.asString();

      case 52:
        return left.symbol === right.symbol && this.looksTheSame(left.dotTarget(), right.dotTarget()) && this.looksTheSame(left.dotName(), right.dotName());
      }
    }

    if (left.kind === NodeKind.IMPLICIT_CAST) {
      return this.looksTheSame(left.castValue(), right);
    }

    if (right.kind === NodeKind.IMPLICIT_CAST) {
      return this.looksTheSame(left, right.castValue());
    }

    return false;
  };

  js.Patcher.prototype.peepholeMangleHook = function(node) {
    var test = node.hookTest();
    var trueValue = node.hookTrue();
    var falseValue = node.hookFalse();
    var swapped = this.peepholeMangleBoolean(test, js.BooleanSwap.SWAP);

    if (swapped === js.BooleanSwap.SWAP) {
      var temp = trueValue;
      trueValue = falseValue;
      falseValue = temp;
      trueValue.swapWith(falseValue);
    }

    if (this.looksTheSame(test, trueValue) && test.hasNoSideEffects()) {
      node.become(Node.createBinary(NodeKind.LOGICAL_OR, test.replaceWith(null), falseValue.replaceWith(null)));
      return;
    }

    if (this.looksTheSame(test, falseValue) && test.hasNoSideEffects()) {
      node.become(Node.createBinary(NodeKind.LOGICAL_AND, test.replaceWith(null), trueValue.replaceWith(null)));
      return;
    }

    if (this.looksTheSame(trueValue, falseValue)) {
      node.become(test.hasNoSideEffects() ? trueValue.replaceWith(null) : Node.createSequence([test.replaceWith(null), trueValue.replaceWith(null)]));
      return;
    }

    if (falseValue.kind === NodeKind.HOOK) {
      var falseTest = falseValue.hookTest();
      var falseTrueValue = falseValue.hookTrue();
      var falseFalseValue = falseValue.hookFalse();

      if (this.looksTheSame(trueValue, falseTrueValue)) {
        var or = Node.createBinary(NodeKind.LOGICAL_OR, Node.createNull(), falseTest.replaceWith(null));
        or.binaryLeft().replaceWith(test.replaceWith(or));
        falseValue.replaceWith(falseFalseValue.replaceWith(null));
        this.peepholeMangleHook(node);
        return;
      }
    }

    if (trueValue.kind === falseValue.kind && in_NodeKind.isBinaryOperator(trueValue.kind)) {
      var trueLeft = trueValue.binaryLeft();
      var trueRight = trueValue.binaryRight();
      var falseLeft = falseValue.binaryLeft();
      var falseRight = falseValue.binaryRight();

      if (this.looksTheSame(trueLeft, falseLeft)) {
        var hook = Node.createHook(NodeKind.HOOK, test.replaceWith(null), trueRight.replaceWith(null), falseRight.replaceWith(null));
        this.peepholeMangleHook(hook);
        node.become(Node.createBinary(trueValue.kind, trueLeft.replaceWith(null), hook));
      } else if (this.looksTheSame(trueRight, falseRight) && !in_NodeKind.isBinaryStorageOperator(trueValue.kind)) {
        var hook = Node.createHook(NodeKind.HOOK, test.replaceWith(null), trueLeft.replaceWith(null), falseLeft.replaceWith(null));
        this.peepholeMangleHook(hook);
        node.become(Node.createBinary(trueValue.kind, hook, trueRight.replaceWith(null)));
      }
    }
  };

  js.Patcher.prototype.peepholeMangleLogicalOr = function(node) {
    var parent = node.parent;
    var parentKind = parent.kind === NodeKind.QUOTED ? parent.parent.kind : parent.kind;

    if ((this.alwaysConvertsOperandsToInt(parentKind) || parentKind === NodeKind.NOT) && this.isFalsy(node.binaryRight())) {
      node.become(node.binaryLeft().replaceWith(null));
    }
  };

  js.Patcher.prototype.patchClass = function(node) {
    if (!node.symbol.isImport() && node.symbol.type.baseClass() !== null) {
      this.needExtends = true;
    }
  };

  js.Patcher.prototype.patchName = function(node) {
    if (node.symbol !== null && in_SymbolKind.isInstance(node.symbol.kind) && node.isNameExpression()) {
      node.become(Node.createDot(Node.createThis(), node.clone()).withType(node.type));
    }
  };

  js.Patcher.recursivelyReplaceCatchVariable = function(node, oldSymbol, newSymbol) {
    if (node.symbol === oldSymbol) {
      node.symbol = newSymbol;
    }

    if (node.hasChildren()) {
      for (var i = 0; i < node.children.length; i = i + 1 | 0) {
        var child = node.children[i];

        if (child !== null) {
          js.Patcher.recursivelyReplaceCatchVariable(child, oldSymbol, newSymbol);
        }
      }
    }
  };

  js.Patcher.prototype.patchTry = function(node) {
    var catches = node.catches();

    if (catches.length !== 0) {
      var name = this.options.minify ? '$x' : '$exception';
      var symbol = this.createLocalVariable(name);
      var block = null;

      for (var i = catches.length - 1 | 0; i >= 0; i = i - 1 | 0) {
        var catchNode = catches[i];
        var variable = catchNode.catchVariable();
        var catchBlock = catchNode.catchBlock().replaceWith(null);

        if (variable !== null) {
          js.Patcher.recursivelyReplaceCatchVariable(catchBlock, variable.symbol, symbol);
          block = variable.symbol.type.isDynamic() ? catchBlock : Node.createBlock([Node.createIf(NodeKind.IF, Node.createBinary(NodeKind.IS, Node.createName(name).withSymbol(symbol), Node.createType(variable.symbol.type)), catchBlock, block)]);
        } else {
          block = catchBlock;
        }
      }

      node.replaceChild(1, Node.createNodeList([Node.createCatch(Node.createVariable(Node.createName(name), null, null).withSymbol(symbol), block)]));
    }
  };

  js.Patcher.prototype.mangleStringList = function(node) {
    var values = node.listValues();
    var count = values.length;
    var overhead = $imul(count, 2) - ".split('.')".length | 0;

    if (overhead <= 0) {
      return;
    }

    var strings = [];

    for (var i = 0; i < count; i = i + 1 | 0) {
      var value = values[i];

      if (value.kind === NodeKind.STRING) {
        strings.push(value.asString());
      } else {
        return;
      }
    }

    var delimeters = ' ;,{}';

    for (var i = 0; i < delimeters.length; i = i + 1 | 0) {
      var delimeter = delimeters[i];
      var j = 0;

      for (; j < count; j = j + 1 | 0) {
        if (strings[j].indexOf(delimeter) !== -1) {
          break;
        }
      }

      if (j === count) {
        node.become(Node.createCall(Node.createDot(Node.createString(strings.join(delimeter)), Node.createName('split')), [Node.createString(delimeter)]));
        return;
      }
    }
  };

  js.Patcher.prototype.unionVariableWithFunction = function(symbol) {
    if (symbol.kind === SymbolKind.LOCAL_VARIABLE !== (this.currentFunction !== null)) {
      throw new Error('assert (symbol.kind == .LOCAL_VARIABLE) == (currentFunction != null) (src/js/patcher.sk:865:7)');
    }

    if (this.currentFunction !== null) {
      var left = this.namingGroupIndexForSymbol[this.currentFunction.uniqueID];
      var right = this.namingGroupIndexForSymbol[symbol.uniqueID];
      this.localVariableUnionFind.union(left, right);
    }
  };

  js.Patcher.prototype.patchBinaryArithmetic = function(node) {
    if (node.type.isInt(this.cache) && (node.kind === NodeKind.MULTIPLY || !this.alwaysConvertsOperandsToInt(node.parent.kind))) {
      node.become(this.createBinaryInt(node.kind, node.binaryLeft().replaceWith(null), node.binaryRight().replaceWith(null)).withRange(node.range));
    }
  };

  js.Patcher.prototype.patchAssign = function(node) {
    if (node.type.isInt(this.cache)) {
      var left = node.binaryLeft();
      var right = node.binaryRight();
      var kind = node.kind === NodeKind.ASSIGN_ADD ? NodeKind.ADD : node.kind === NodeKind.ASSIGN_SUBTRACT ? NodeKind.SUBTRACT : node.kind === NodeKind.ASSIGN_MULTIPLY ? NodeKind.MULTIPLY : node.kind === NodeKind.ASSIGN_DIVIDE ? NodeKind.DIVIDE : NodeKind.REMAINDER;
      this.createBinaryIntAssignment(node, kind, left.replaceWith(null), right.replaceWith(null));
    }
  };

  js.Patcher.prototype.patchUnary = function(node) {
    if (node.type.isInt(this.cache)) {
      var value = node.unaryValue();

      if (in_NodeKind.isUnaryStorageOperator(node.kind)) {
        var isIncrement = node.kind === NodeKind.PREFIX_INCREMENT || node.kind === NodeKind.POSTFIX_INCREMENT;
        this.createBinaryIntAssignment(node, isIncrement ? NodeKind.ADD : NodeKind.SUBTRACT, value.replaceWith(null), Node.createInt(1));
      } else if (!this.alwaysConvertsOperandsToInt(node.parent.kind)) {
        if (node.kind !== NodeKind.POSITIVE && node.kind !== NodeKind.NEGATIVE) {
          throw new Error('assert node.kind == .POSITIVE || node.kind == .NEGATIVE (src/js/patcher.sk:903:11)');
        }

        if (value.kind === NodeKind.INT) {
          var constant = value.asInt();
          node.become(Node.createInt(node.kind === NodeKind.NEGATIVE ? -constant | 0 : constant).withType(this.cache.intType));
        } else {
          node.become(Node.createBinary(NodeKind.BITWISE_OR, Node.createUnary(node.kind, value.replaceWith(null)).withType(this.cache.intType), Node.createInt(0).withType(this.cache.intType)).withType(this.cache.intType));
        }
      }
    }
  };

  js.Patcher.prototype.patchCast = function(node) {
    var value = node.castValue();

    if (node.type.isBool(this.cache) && !value.type.isBool(this.cache)) {
      value = Node.createUnary(NodeKind.NOT, value.replaceWith(null)).withRange(node.range).withType(node.type);
      node.become(Node.createUnary(NodeKind.NOT, value).withRange(node.range).withType(node.type));
    } else if (this.isIntegerType(node) && !this.isIntegerType(value) && !this.alwaysConvertsOperandsToInt(node.parent.kind)) {
      node.become(Node.createBinary(NodeKind.BITWISE_OR, value.replaceWith(null), Node.createInt(0)).withRange(node.range).withType(node.type));
    } else if (node.type.isReal(this.cache) && !value.type.isNumeric(this.cache)) {
      node.become(Node.createUnary(NodeKind.POSITIVE, value.replaceWith(null)).withRange(node.range).withType(node.type));
    }
  };

  js.Patcher.prototype.patchConstructor = function(node) {
    var block = node.functionBlock();

    if (block === null) {
      return;
    }

    var superInitializer = node.superInitializer();
    var memberInitializers = node.memberInitializers();
    var index = 0;

    if (superInitializer !== null) {
      block.insertChild(index, Node.createExpression(superInitializer.replaceWith(null)));
      index = index + 1 | 0;
    }

    if (memberInitializers !== null) {
      for (var i = 0, n = memberInitializers.children.length; i < n; i = i + 1 | 0) {
        var child = memberInitializers.children[i];
        var name = child.memberInitializerName();
        var value = child.memberInitializerValue();

        if (value.kind !== NodeKind.ERROR && !this.shouldRemoveConstant(child.symbol)) {
          block.insertChild(index, Node.createExpression(Node.createBinary(NodeKind.ASSIGN, name.replaceWith(null), value.replaceWith(null))));
          index = index + 1 | 0;
        }
      }
    }
  };

  js.Patcher.prototype.createBinaryInt = function(kind, left, right) {
    if (kind === NodeKind.MULTIPLY) {
      this.needMathImul = true;
      return Node.createCall(Node.createName(this.imul), [left, right]).withType(this.cache.intType);
    }

    return Node.createBinary(NodeKind.BITWISE_OR, Node.createBinary(kind, left, right).withType(this.cache.intType), Node.createInt(0).withType(this.cache.intType)).withType(this.cache.intType);
  };

  js.Patcher.isSimpleNameAccess = function(node) {
    return node.kind === NodeKind.NAME || node.kind === NodeKind.THIS || node.kind === NodeKind.DOT && js.Patcher.isSimpleNameAccess(node.dotTarget());
  };

  js.Patcher.prototype.createBinaryIntAssignment = function(target, kind, left, right) {
    if (js.Patcher.isSimpleNameAccess(left)) {
      target.become(Node.createBinary(NodeKind.ASSIGN, left.clone(), this.createBinaryInt(kind, left, right)).withRange(target.range));
      return;
    }

    if (left.kind !== NodeKind.DOT) {
      throw new Error('assert left.kind == .DOT (src/js/patcher.sk:992:7)');
    }

    var current = target;
    var parent = current.parent;

    while (parent.kind !== NodeKind.BLOCK) {
      current = parent;
      parent = parent.parent;
    }

    var name = '$temp' + this.nextTempID;
    this.nextTempID = this.nextTempID + 1 | 0;

    var symbol = this.createLocalVariable(name);
    var reference = Node.createName(name).withSymbol(symbol);
    var property = Node.createDot(reference, left.dotName().replaceWith(null));
    symbol.node = Node.createVariable(reference.clone(), Node.createType(this.cache.intType), null).withSymbol(symbol);
    parent.insertChild(parent.children.indexOf(current), Node.createVariableCluster(Node.createType(this.cache.intType), [symbol.node]));
    target.become(Node.createSequence([Node.createBinary(NodeKind.ASSIGN, reference.clone(), left.dotTarget().replaceWith(null)), Node.createBinary(NodeKind.ASSIGN, property.clone(), this.createBinaryInt(kind, property, right))]).withRange(target.range));
  };

  js.Patcher.prototype.createLocalVariable = function(name) {
    var symbol = this.resolver.createSymbol(name, SymbolKind.LOCAL_VARIABLE);

    if (this.options.mangle) {
      this.namingGroupIndexForSymbol[symbol.uniqueID] = this.localVariableUnionFind.allocate();
      this.unionVariableWithFunction(symbol);
    }

    return symbol;
  };

  js.Patcher.prototype.alwaysConvertsOperandsToInt = function(kind) {
    switch (kind) {
    case 110:
    case 111:
    case 112:
    case 113:
    case 114:
    case 82:
    case 83:
    case 84:
    case 70:
    case 101:
    case 102:
      return true;

    default:
      return false;
    }
  };

  js.Patcher.prototype.setCurrentFunction = function(symbol) {
    this.currentFunction = symbol;
    this.createdThisAlias = false;
  };

  js.Patcher.numberToName = function(number) {
    var WRAP = 52;
    var name = '';

    if (number >= WRAP) {
      name = js.Patcher.numberToName((number / WRAP | 0) - 1 | 0);
      number = number % WRAP | 0;
    }

    name += String.fromCharCode(number + (number < 26 ? 97 : 65 - 26 | 0) | 0);
    return name;
  };

  js.Patcher.prototype.generateSymbolName = function() {
    var name = '';

    do {
      name = js.Patcher.numberToName(this.nextSymbolName);
      this.nextSymbolName = this.nextSymbolName + 1 | 0;
    } while (name in this.reservedNames);

    return name;
  };

  function SourceMapping(_0, _1, _2, _3, _4) {
    this.sourceIndex = _0;
    this.originalLine = _1;
    this.originalColumn = _2;
    this.generatedLine = _3;
    this.generatedColumn = _4;
  }

  function SourceMappingComparison() {
  }

  SourceMappingComparison.prototype.compare = function(left, right) {
    var delta = left.generatedLine - right.generatedLine | 0;
    return delta !== 0 ? delta : left.generatedColumn - right.generatedColumn | 0;
  };

  function SourceMapGenerator() {
    this.mappings = [];
    this.sources = [];
  }

  SourceMapGenerator.prototype.addMapping = function(source, originalLine, originalColumn, generatedLine, generatedColumn) {
    var sourceIndex = this.sources.indexOf(source);

    if (sourceIndex === -1) {
      sourceIndex = this.sources.length;
      this.sources.push(source);
    }

    this.mappings.push(new SourceMapping(sourceIndex, originalLine, originalColumn, generatedLine, generatedColumn));
  };

  SourceMapGenerator.prototype.toString = function() {
    var sourceNames = [];
    var sourceContents = [];

    for (var i = 0; i < this.sources.length; i = i + 1 | 0) {
      var source = this.sources[i];
      sourceNames.push(quoteString(source.name, 34));
      sourceContents.push(quoteString(source.contents, 34));
    }

    var builder = new StringBuilder();
    builder._buffer += '{"version":3,"sources":[';
    builder._buffer += sourceNames.join(',');
    builder._buffer += '],"sourcesContent":[';
    builder._buffer += sourceContents.join(',');
    builder._buffer += '],"names":[],"mappings":"';
    this.mappings.sort(bindCompare(SourceMappingComparison.INSTANCE));

    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 0;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousSourceIndex = 0;

    for (var i = 0; i < this.mappings.length; i = i + 1 | 0) {
      var mapping = this.mappings[i];
      var generatedLine = mapping.generatedLine;

      if (previousGeneratedLine === generatedLine) {
        if (previousGeneratedColumn === mapping.generatedColumn && (previousGeneratedLine !== 0 || previousGeneratedColumn !== 0)) {
          continue;
        }

        builder._buffer += ',';
      } else {
        previousGeneratedColumn = 0;

        while (previousGeneratedLine < generatedLine) {
          builder._buffer += ';';
          previousGeneratedLine = previousGeneratedLine + 1 | 0;
        }
      }

      builder._buffer += SourceMapGenerator.encodeVLQ(mapping.generatedColumn - previousGeneratedColumn | 0);
      previousGeneratedColumn = mapping.generatedColumn;
      builder._buffer += SourceMapGenerator.encodeVLQ(mapping.sourceIndex - previousSourceIndex | 0);
      previousSourceIndex = mapping.sourceIndex;
      builder._buffer += SourceMapGenerator.encodeVLQ(mapping.originalLine - previousOriginalLine | 0);
      previousOriginalLine = mapping.originalLine;
      builder._buffer += SourceMapGenerator.encodeVLQ(mapping.originalColumn - previousOriginalColumn | 0);
      previousOriginalColumn = mapping.originalColumn;
    }

    builder._buffer += '"}\n';
    return builder._buffer;
  };

  SourceMapGenerator.encodeVLQ = function(value) {
    var vlq = value < 0 ? -value << 1 | 1 : value << 1;
    var encoded = '';

    do {
      var digit = vlq & 31;
      vlq >>= 5;

      if (vlq !== 0) {
        digit |= 32;
      }

      encoded += SourceMapGenerator.BASE64[digit];
    } while (vlq !== 0);

    return encoded;
  };

  var TokenKind = {
    ALIAS: 0,
    ANNOTATION: 1,
    ARROW: 2,
    ASSERT: 3,
    ASSIGN: 4,
    ASSIGN_BITWISE_AND: 5,
    ASSIGN_BITWISE_OR: 6,
    ASSIGN_BITWISE_XOR: 7,
    ASSIGN_DIVIDE: 8,
    ASSIGN_MINUS: 9,
    ASSIGN_MULTIPLY: 10,
    ASSIGN_PLUS: 11,
    ASSIGN_REMAINDER: 12,
    ASSIGN_SHIFT_LEFT: 13,
    ASSIGN_SHIFT_RIGHT: 14,
    BITWISE_AND: 15,
    BITWISE_OR: 16,
    BITWISE_XOR: 17,
    BREAK: 18,
    CASE: 19,
    CATCH: 20,
    CHARACTER: 21,
    CLASS: 22,
    COLON: 23,
    COMMA: 24,
    CONST: 25,
    CONTINUE: 26,
    DECREMENT: 27,
    DEFAULT: 28,
    DELETE: 29,
    DIVIDE: 30,
    DO: 31,
    DOT: 32,
    DOUBLE: 33,
    DOUBLE_COLON: 34,
    ELSE: 35,
    END_OF_FILE: 36,
    ENUM: 37,
    EQUAL: 38,
    ERROR: 39,
    EXPORT: 40,
    FALSE: 41,
    FINAL: 42,
    FINALLY: 43,
    FLOAT: 44,
    FOR: 45,
    GREATER_THAN: 46,
    GREATER_THAN_OR_EQUAL: 47,
    IDENTIFIER: 48,
    IF: 49,
    IMPORT: 50,
    IN: 51,
    INCREMENT: 52,
    INLINE: 53,
    INTERFACE: 54,
    INT_BINARY: 55,
    INT_DECIMAL: 56,
    INT_HEX: 57,
    INT_OCTAL: 58,
    INVALID_PREPROCESSOR_DIRECTIVE: 59,
    IS: 60,
    LEFT_BRACE: 61,
    LEFT_BRACKET: 62,
    LEFT_PARENTHESIS: 63,
    LESS_THAN: 64,
    LESS_THAN_OR_EQUAL: 65,
    LOGICAL_AND: 66,
    LOGICAL_OR: 67,
    MINUS: 68,
    MULTIPLY: 69,
    NAMESPACE: 70,
    NEW: 71,
    NEWLINE: 72,
    NOT: 73,
    NOT_EQUAL: 74,
    NULL: 75,
    OVERRIDE: 76,
    PLUS: 77,
    POWER: 78,
    PREPROCESSOR_DEFINE: 79,
    PREPROCESSOR_ELIF: 80,
    PREPROCESSOR_ELSE: 81,
    PREPROCESSOR_ENDIF: 82,
    PREPROCESSOR_ERROR: 83,
    PREPROCESSOR_IF: 84,
    PREPROCESSOR_WARNING: 85,
    PRIVATE: 86,
    PROTECTED: 87,
    PUBLIC: 88,
    PURE: 89,
    QUESTION_MARK: 90,
    REMAINDER: 91,
    RETURN: 92,
    RIGHT_BRACE: 93,
    RIGHT_BRACKET: 94,
    RIGHT_PARENTHESIS: 95,
    SEMICOLON: 96,
    SHIFT_LEFT: 97,
    SHIFT_RIGHT: 98,
    STATIC: 99,
    STRING: 100,
    SUPER: 101,
    SWITCH: 102,
    THIS: 103,
    THROW: 104,
    TICK: 105,
    TILDE: 106,
    TRUE: 107,
    TRY: 108,
    USING: 109,
    VAR: 110,
    VIRTUAL: 111,
    WHILE: 112,
    WHITESPACE: 113,
    YY_INVALID_ACTION: 114,
    START_PARAMETER_LIST: 115,
    END_PARAMETER_LIST: 116
  };

  function Token(_0, _1) {
    this.range = _0;
    this.kind = _1;
  }

  Token.prototype.firstCodeUnit = function() {
    if (this.kind === TokenKind.END_OF_FILE) {
      return 0;
    }

    if (this.range.start >= this.range.source.contents.length) {
      throw new Error('assert range.start < range.source.contents.size() (src/lexer/token.sk:7:5)');
    }

    return this.range.source.contents.charCodeAt(this.range.start);
  };

  Token.prototype.text = function() {
    return this.range.toString();
  };

  var Precedence = {
    LOWEST: 0,
    COMMA: 1,
    ASSIGN: 2,
    LOGICAL_OR: 3,
    LOGICAL_AND: 4,
    BITWISE_OR: 5,
    BITWISE_XOR: 6,
    BITWISE_AND: 7,
    EQUAL: 8,
    COMPARE: 9,
    SHIFT: 10,
    ADD: 11,
    MULTIPLY: 12,
    UNARY_PREFIX: 13,
    UNARY_POSTFIX: 14,
    MEMBER: 15
  };

  var StatementHint = {
    NORMAL: 0,
    IN_IF: 1,
    IN_ENUM: 2,
    IN_OBJECT: 3,
    IN_SWITCH: 4
  };

  var ListMode = {
    NORMAL: 0,
    KEY_VALUE: 1
  };

  function ParserContext(_0, _1) {
    this.inNonVoidFunction = false;
    this.needsPreprocessor = false;
    this.index = 0;
    this.previousSyntaxError = null;
    this.log = _0;
    this.tokens = _1;
  }

  ParserContext.prototype.current = function() {
    return this.tokens[this.index];
  };

  ParserContext.prototype.next = function() {
    var token = this.current();

    if ((this.index + 1 | 0) < this.tokens.length) {
      this.index = this.index + 1 | 0;
    }

    return token;
  };

  ParserContext.prototype.spanSince = function(range) {
    var previous = this.tokens[this.index > 0 ? this.index - 1 | 0 : 0];
    return previous.range.end < range.start ? range : Range.span(range, previous.range);
  };

  ParserContext.prototype.peek = function(kind) {
    return this.current().kind === kind;
  };

  ParserContext.prototype.eat = function(kind) {
    if (this.peek(kind)) {
      this.next();
      return true;
    }

    return false;
  };

  ParserContext.prototype.undo = function() {
    if (this.index <= 0) {
      throw new Error('assert index > 0 (src/parser/pratt.sk:47:5)');
    }

    this.index = this.index - 1 | 0;
  };

  ParserContext.prototype.expect = function(kind) {
    if (!this.eat(kind)) {
      var token = this.current();

      if (this.previousSyntaxError !== token) {
        var range = token.range;

        if (kind === TokenKind.NEWLINE && this.index > 0) {
          var end = this.tokens[this.index - 1 | 0].range.end;
          var source = range.source;

          if (source.indexToLineColumn(range.end).line !== source.indexToLineColumn(end).line) {
            range = new Range(source, end, end);
          }
        }

        syntaxErrorExpectedToken(this.log, range, token.kind, kind);
        this.previousSyntaxError = token;
      }

      return false;
    }

    return true;
  };

  ParserContext.prototype.unexpectedToken = function() {
    var token = this.current();

    if (this.previousSyntaxError !== token) {
      syntaxErrorUnexpectedToken(this.log, token);
      this.previousSyntaxError = token;
    }
  };

  function Parselet(_0) {
    this.prefix = null;
    this.infix = null;
    this.precedence = _0;
  }

  function ListParselet() {
  }

  ListParselet.prototype.parse = function(context) {
    var token = context.current();
    var values = parseWrappedCommaSeparatedList(context, TokenKind.LEFT_BRACKET, TokenKind.RIGHT_BRACKET, ListMode.NORMAL);
    return Node.createList(values).withRange(context.spanSince(token.range));
  };

  function MapParselet() {
  }

  MapParselet.prototype.parse = function(context) {
    var token = context.current();
    var values = parseWrappedCommaSeparatedList(context, TokenKind.LEFT_BRACE, TokenKind.RIGHT_BRACE, ListMode.KEY_VALUE);
    return Node.createMap(values).withRange(context.spanSince(token.range));
  };

  function ParenthesisParselet() {
  }

  ParenthesisParselet.prototype.parse = function(context) {
    var token = context.current();
    var type = parseGroup(context);

    if (looksLikeType(type) && pratt.hasPrefixParselet(context)) {
      var value = pratt.parse(context, Precedence.UNARY_PREFIX);
      return Node.createCast(type, value).withRange(context.spanSince(token.range));
    }

    return type;
  };

  function DotPrefixParselet(_0) {
    this.kind = _0;
  }

  DotPrefixParselet.prototype.parse = function(context) {
    var token = context.next();
    var name = parseNameOrString(context);
    return Node.createDotWithKind(this.kind, null, name).withRange(context.spanSince(token.range));
  };

  function NewParselet() {
  }

  NewParselet.prototype.parse = function(context) {
    var token = context.next();
    var left = parseType(context);
    var $arguments = parseWrappedCommaSeparatedList(context, TokenKind.LEFT_PARENTHESIS, TokenKind.RIGHT_PARENTHESIS, ListMode.NORMAL);
    return Node.createUnary(NodeKind.NEW, Node.createCall(left, $arguments).withRange(context.spanSince(left.range))).withRange(context.spanSince(token.range));
  };

  function QuotedParselet() {
  }

  QuotedParselet.prototype.parse = function(context) {
    var token = context.next();
    var value = pratt.parse(context, Precedence.LOWEST);

    if (value === null || !context.expect(TokenKind.TICK)) {
      return errorExpressionSinceToken(context, token);
    }

    return Node.createQuoted(value).withRange(context.spanSince(token.range));
  };

  function SuperParselet() {
  }

  SuperParselet.prototype.parse = function(context) {
    return parseSuperCall(context);
  };

  function IfParselet() {
  }

  IfParselet.parseExpression = function(context) {
    expectEndOfLine(context);

    var node = pratt.parse(context, Precedence.LOWEST);
    expectEndOfLine(context);
    return node;
  };

  IfParselet.prototype.parse = function(context) {
    context.needsPreprocessor = true;

    var token = context.next();
    var value = pratt.parse(context, Precedence.COMMA);
    var trueNode = IfParselet.parseExpression(context);
    var falseNode = null;

    if (context.peek(TokenKind.PREPROCESSOR_ELIF)) {
      falseNode = this.parse(context);
    } else {
      if (!context.expect(TokenKind.PREPROCESSOR_ELSE)) {
        return errorExpressionSinceToken(context, token);
      }

      falseNode = IfParselet.parseExpression(context);

      if (!context.expect(TokenKind.PREPROCESSOR_ENDIF)) {
        return errorExpressionSinceToken(context, token);
      }
    }

    return Node.createHook(NodeKind.PREPROCESSOR_HOOK, value, trueNode, falseNode).withRange(context.spanSince(token.range));
  };

  function AnnotationParselet() {
  }

  AnnotationParselet.prototype.parse = function(context) {
    var token = context.next();
    var name = createNameFromToken(token);
    var $arguments = null;

    if (context.peek(TokenKind.LEFT_PARENTHESIS)) {
      var parenthesis = context.current();
      var values = parseWrappedCommaSeparatedList(context, TokenKind.LEFT_PARENTHESIS, TokenKind.RIGHT_PARENTHESIS, ListMode.NORMAL);
      $arguments = Node.createNodeList(values).withRange(context.spanSince(parenthesis.range));
    }

    return Node.createAnnotation(name, $arguments).withRange(context.spanSince(token.range));
  };

  function HookParselet() {
  }

  HookParselet.prototype.parse = function(context, left) {
    context.next();

    var middle = pratt.parse(context, Precedence.ASSIGN - 1 | 0);
    var right = context.expect(TokenKind.COLON) ? pratt.parse(context, Precedence.ASSIGN - 1 | 0) : Node.createError().withRange(context.current().range);
    return Node.createHook(NodeKind.HOOK, left, middle, right).withRange(context.spanSince(left.range));
  };

  function SequenceParselet() {
  }

  SequenceParselet.prototype.parse = function(context, left) {
    var values = [left];

    while (context.eat(TokenKind.COMMA)) {
      values.push(pratt.parse(context, Precedence.COMMA));
    }

    return Node.createSequence(values).withRange(context.spanSince(left.range));
  };

  function DotInfixParselet(_0) {
    this.kind = _0;
  }

  DotInfixParselet.prototype.parse = function(context, left) {
    context.next();

    var name = parseNameOrString(context);
    return Node.createDotWithKind(this.kind, left, name).withRange(context.spanSince(left.range));
  };

  function CallParselet() {
  }

  CallParselet.prototype.parse = function(context, left) {
    var $arguments = parseWrappedCommaSeparatedList(context, TokenKind.LEFT_PARENTHESIS, TokenKind.RIGHT_PARENTHESIS, ListMode.NORMAL);
    return Node.createCall(left, $arguments).withRange(context.spanSince(left.range));
  };

  function IndexParselet() {
  }

  IndexParselet.prototype.parse = function(context, left) {
    context.next();

    var index = pratt.parse(context, Precedence.LOWEST);
    scanForToken(context, TokenKind.RIGHT_BRACKET);
    return Node.createBinary(NodeKind.INDEX, left, index).withRange(context.spanSince(left.range));
  };

  function ParameterizeParselet() {
  }

  ParameterizeParselet.prototype.parse = function(context, left) {
    var token = context.next();
    var substitutions = parseTypeList(context, TokenKind.END_PARAMETER_LIST);

    if (!context.expect(TokenKind.END_PARAMETER_LIST)) {
      scanForToken(context, TokenKind.END_PARAMETER_LIST);
      return errorExpressionSinceToken(context, token);
    }

    return Node.createParameterize(left, substitutions).withRange(context.spanSince(left.range));
  };

  function BinaryInfixOrUnaryPostfix(_0, _1, _2) {
    this.binary = _0;
    this.unary = _1;
    this.precedence = _2;
  }

  BinaryInfixOrUnaryPostfix.prototype.parse = function(context, left) {
    context.next();

    if (!pratt.hasPrefixParselet(context)) {
      return Node.createUnary(this.unary, left).withRange(context.spanSince(left.range));
    }

    var right = pratt.parse(context, this.precedence);
    return right !== null ? Node.createBinary(this.binary, left, right).withRange(context.spanSince(left.range)) : null;
  };

  function Pratt() {
    this.table = Object.create(null);
  }

  Pratt.prototype.parselet = function(kind, precedence) {
    var parselet = in_IntMap.getOrDefault(this.table, kind, null);

    if (parselet === null) {
      var created = new Parselet(precedence);
      parselet = created;
      this.table[kind] = created;
    } else if (precedence > parselet.precedence) {
      parselet.precedence = precedence;
    }

    return parselet;
  };

  Pratt.prototype.parse = function(context, precedence) {
    var token = context.current();
    var parselet = in_IntMap.getOrDefault(this.table, token.kind, null);

    if (parselet === null || parselet.prefix === null) {
      context.unexpectedToken();
      return Node.createError().withRange(context.spanSince(token.range));
    }

    var node = this.resume(context, precedence, parselet.prefix.parse(context));

    if (node === null) {
      throw new Error('assert node != null (src/parser/pratt.sk:128:5)');
    }

    if (node.range.isEmpty()) {
      throw new Error('assert !node.range.isEmpty() (src/parser/pratt.sk:129:5)');
    }

    return node;
  };

  Pratt.prototype.resume = function(context, precedence, left) {
    if (left === null) {
      throw new Error('assert left != null (src/parser/pratt.sk:134:5)');
    }

    while (left.kind !== NodeKind.ERROR) {
      var kind = context.current().kind;
      var parselet = in_IntMap.getOrDefault(this.table, kind, null);

      if (parselet === null || parselet.infix === null || parselet.precedence <= precedence) {
        break;
      }

      left = parselet.infix.parse(context, left);

      if (left === null) {
        throw new Error('assert left != null (src/parser/pratt.sk:142:7)');
      }

      if (left.range.isEmpty()) {
        throw new Error('assert !left.range.isEmpty() (src/parser/pratt.sk:143:7)');
      }
    }

    return left;
  };

  Pratt.prototype.hasPrefixParselet = function(context) {
    var parselet = in_IntMap.getOrDefault(this.table, context.current().kind, null);
    return parselet !== null && parselet.prefix !== null;
  };

  Pratt.prototype.literal = function(kind, callback) {
    this.parselet(kind, Precedence.LOWEST).prefix = new LiteralParselet(callback);
  };

  Pratt.prototype.prefix = function(kind, precedence, callback) {
    this.parselet(kind, Precedence.LOWEST).prefix = new DefaultPrefixParselet(callback, precedence, this);
  };

  Pratt.prototype.postfix = function(kind, precedence, callback) {
    this.parselet(kind, precedence).infix = new PostfixParselet(callback);
  };

  Pratt.prototype.infix = function(kind, precedence, callback) {
    this.parselet(kind, precedence).infix = new DefaultInfixParselet(callback, precedence, this);
  };

  Pratt.prototype.infixRight = function(kind, precedence, callback) {
    this.parselet(kind, precedence).infix = new DefaultInfixParselet(callback, precedence - 1 | 0, this);
  };

  function DoubleLiteral() {
  }

  DoubleLiteral.prototype.parse = function(context, token) {
    return Node.createDouble(parseDoubleLiteral(token.text())).withRange(token.range);
  };

  function VarLiteral() {
  }

  VarLiteral.prototype.parse = function(context, token) {
    return Node.createVar().withRange(token.range);
  };

  function NameLiteral() {
  }

  NameLiteral.prototype.parse = function(context, token) {
    return createNameFromToken(token);
  };

  function TokenLiteral(_0) {
    this.kind = _0;
  }

  TokenLiteral.prototype.parse = function(context, token) {
    return new Node(this.kind).withRange(token.range);
  };

  function BoolLiteral(_0) {
    this.value = _0;
  }

  BoolLiteral.prototype.parse = function(context, token) {
    return Node.createBool(this.value).withRange(token.range);
  };

  function IntLiteral(_0) {
    this.base = _0;
  }

  IntLiteral.prototype.parse = function(context, token) {
    var value = parseIntLiteral(token.text(), this.base);

    if (this.base === 10 && value !== 0 && token.firstCodeUnit() === 48) {
      syntaxWarningOctal(context.log, token.range);
    }

    return Node.createInt(value).withRange(token.range);
  };

  function StringLiteral() {
  }

  StringLiteral.prototype.parse = function(context, token) {
    return parseStringToken(context, token);
  };

  function FloatLiteral() {
  }

  FloatLiteral.prototype.parse = function(context, token) {
    var range = token.range;
    return Node.createFloat(parseDoubleLiteral(range.source.contents.slice(range.start, range.end - 1 | 0))).withRange(range);
  };

  function CharacterLiteral() {
  }

  CharacterLiteral.prototype.parse = function(context, token) {
    var result = parseStringLiteral(context.log, token.range, token.text());

    if (result !== null && result.value.length !== 1) {
      syntaxErrorInvalidCharacter(context.log, token.range, token.text());
      result = null;
    }

    return Node.createInt(result !== null ? result.value.charCodeAt(0) : 0).withRange(token.range);
  };

  function LiteralParselet(_0) {
    this.callback = _0;
  }

  LiteralParselet.prototype.parse = function(context) {
    return this.callback.parse(context, context.next());
  };

  function UnaryPrefix(_0) {
    this.kind = _0;
  }

  UnaryPrefix.prototype.parse = function(context, token, value) {
    return Node.createUnary(this.kind, value).withRange(Range.span(token.range, value.range));
  };

  function DefaultPrefixParselet(_0, _1, _2) {
    this.callback = _0;
    this.precedence = _1;
    this.pratt = _2;
  }

  DefaultPrefixParselet.prototype.parse = function(context) {
    var token = context.next();
    var value = this.pratt.parse(context, this.precedence);
    return value !== null ? this.callback.parse(context, token, value) : null;
  };

  function UnaryPostfix(_0) {
    this.kind = _0;
  }

  UnaryPostfix.prototype.parse = function(context, value, token) {
    return Node.createUnary(this.kind, value).withRange(Range.span(value.range, token.range));
  };

  function PostfixParselet(_0) {
    this.callback = _0;
  }

  PostfixParselet.prototype.parse = function(context, left) {
    return this.callback.parse(context, left, context.next());
  };

  function BinaryInfix(_0) {
    this.kind = _0;
  }

  BinaryInfix.prototype.parse = function(context, left, token, right) {
    return Node.createBinary(this.kind, left, right).withRange(Range.span(left.range, right.range));
  };

  function DefaultInfixParselet(_0, _1, _2) {
    this.callback = _0;
    this.precedence = _1;
    this.pratt = _2;
  }

  DefaultInfixParselet.prototype.parse = function(context, left) {
    var token = context.next();
    var right = this.pratt.parse(context, this.precedence);
    return right !== null ? this.callback.parse(context, left, token, right) : null;
  };

  function CallInfo(_0) {
    this.callSites = [];
    this.symbol = _0;
  }

  function CallGraph(program) {
    this.callInfo = [];
    this.symbolToInfoIndex = Object.create(null);

    if (program.kind !== NodeKind.PROGRAM) {
      throw new Error('assert program.kind == .PROGRAM (src/resolver/callgraph.sk:11:5)');
    }

    this.visit(program);
  }

  CallGraph.prototype.visit = function(node) {
    if (node.hasChildren()) {
      var children = node.children;

      for (var i = 0, n = children.length; i < n; i = i + 1 | 0) {
        var child = children[i];

        if (child !== null) {
          this.visit(child);
        }
      }
    }

    if (node.kind === NodeKind.CALL) {
      var value = node.callValue();

      if (value.symbol !== null && in_SymbolKind.isFunction(value.symbol.kind)) {
        if (value.kind !== NodeKind.NAME && value.kind !== NodeKind.DOT) {
          throw new Error('assert value.kind == .NAME || value.kind == .DOT (src/resolver/callgraph.sk:29:9)');
        }

        this.recordCallSite(value.symbol, node);
      }
    } else if (node.kind === NodeKind.FUNCTION) {
      this.recordCallSite(node.symbol, null);
    }
  };

  CallGraph.prototype.recordCallSite = function(symbol, node) {
    var index = in_IntMap.getOrDefault(this.symbolToInfoIndex, symbol.uniqueID, -1);
    var info = index < 0 ? new CallInfo(symbol) : this.callInfo[index];

    if (index < 0) {
      this.symbolToInfoIndex[symbol.uniqueID] = this.callInfo.length;
      this.callInfo.push(info);
    }

    if (node !== null) {
      info.callSites.push(node);
    }
  };

  function ConstantFolder(_0, _1) {
    this.cache = _0;
    this.options = _1;
  }

  ConstantFolder.prototype.flatten = function(node, content) {
    node.removeChildren();

    switch (content.type()) {
    case 0:
      node.kind = NodeKind.BOOL;
      break;

    case 1:
      node.kind = NodeKind.INT;
      break;

    case 2:
      node.kind = node.type === this.cache.floatType ? NodeKind.FLOAT : NodeKind.DOUBLE;
      break;

    case 3:
      node.kind = NodeKind.STRING;
      break;
    }

    node.content = content;
  };

  ConstantFolder.prototype.flattenBool = function(node, value) {
    if (!node.type.isIgnored(this.cache) && !node.type.isBool(this.cache)) {
      throw new Error('assert node.type.isIgnored(cache) || node.type.isBool(cache) (src/resolver/constantfolding.sk:20:5)');
    }

    this.flatten(node, new BoolContent(value));
  };

  ConstantFolder.prototype.flattenInt = function(node, value) {
    if (!node.type.isIgnored(this.cache) && !node.type.isInteger(this.cache)) {
      throw new Error('assert node.type.isIgnored(cache) || node.type.isInteger(cache) (src/resolver/constantfolding.sk:26:5)');
    }

    this.flatten(node, new IntContent(value));
  };

  ConstantFolder.prototype.flattenReal = function(node, value) {
    if (!node.type.isIgnored(this.cache) && !node.type.isReal(this.cache)) {
      throw new Error('assert node.type.isIgnored(cache) || node.type.isReal(cache) (src/resolver/constantfolding.sk:32:5)');
    }

    this.flatten(node, new DoubleContent(value));
  };

  ConstantFolder.prototype.flattenString = function(node, value) {
    if (!node.type.isIgnored(this.cache) && !node.type.isString(this.cache)) {
      throw new Error('assert node.type.isIgnored(cache) || node.type.isString(cache) (src/resolver/constantfolding.sk:38:5)');
    }

    this.flatten(node, new StringContent(value));
  };

  ConstantFolder.blockContainsVariableCluster = function(node) {
    if (node.kind !== NodeKind.BLOCK) {
      throw new Error('assert node.kind == .BLOCK (src/resolver/constantfolding.sk:43:5)');
    }

    if (node.hasChildren()) {
      var children = node.children;

      for (var i = 0, n = children.length; i < n; i = i + 1 | 0) {
        if (children[i].kind === NodeKind.VARIABLE_CLUSTER) {
          return true;
        }
      }
    }

    return false;
  };

  ConstantFolder.prototype.foldConstants = function(node) {
    var kind = node.kind;

    if (kind === NodeKind.ADD && node.type.isString(this.cache)) {
      this.rotateStringConcatenation(node);
    }

    if (node.hasChildren()) {
      var children = node.children;

      for (var i = 0, n = children.length; i < n; i = i + 1 | 0) {
        var child = children[i];

        if (child !== null) {
          this.foldConstants(child);
        }
      }
    }

    switch (kind) {
    case 2:
      this.foldBlock(node);
      break;

    case 55:
      this.foldCall(node);
      break;

    case 60:
    case 61:
      this.foldCast(node);
      break;

    case 42:
      this.foldHook(node);
      break;

    case 52:
      this.foldDot(node);
      break;

    case 39:
      this.foldName(node);
      break;

    case 58:
      this.foldSequence(node);
      break;

    case 7:
      this.foldVariableCluster(node);
      break;

    default:
      if (in_NodeKind.isUnaryOperator(kind)) {
        this.foldUnaryOperator(node, kind);
      } else if (in_NodeKind.isBinaryOperator(kind)) {
        this.foldBinaryOperator(node, kind);
      }
      break;
    }
  };

  ConstantFolder.prototype.rotateStringConcatenation = function(node) {
    var left = node.binaryLeft();
    var right = node.binaryRight();

    if (!left.type.isString(this.cache) && !left.type.isIgnored(this.cache)) {
      throw new Error('assert left.type.isString(cache) || left.type.isIgnored(cache) (src/resolver/constantfolding.sk:94:5)');
    }

    if (!right.type.isString(this.cache) && !right.type.isIgnored(this.cache)) {
      throw new Error('assert right.type.isString(cache) || right.type.isIgnored(cache) (src/resolver/constantfolding.sk:95:5)');
    }

    if (right.kind === NodeKind.ADD) {
      var rightLeft = right.binaryLeft();
      var rightRight = right.binaryRight();

      if (!rightLeft.type.isString(this.cache) && !rightLeft.type.isIgnored(this.cache)) {
        throw new Error('assert rightLeft.type.isString(cache) || rightLeft.type.isIgnored(cache) (src/resolver/constantfolding.sk:100:7)');
      }

      if (!rightRight.type.isString(this.cache) && !rightRight.type.isIgnored(this.cache)) {
        throw new Error('assert rightRight.type.isString(cache) || rightRight.type.isIgnored(cache) (src/resolver/constantfolding.sk:101:7)');
      }

      left.swapWith(right);
      left.swapWith(rightRight);
      left.swapWith(rightLeft);
    }
  };

  ConstantFolder.prototype.foldStringConcatenation = function(node) {
    var left = node.binaryLeft();
    var right = node.binaryRight();

    if (!left.type.isString(this.cache) && !left.type.isIgnored(this.cache)) {
      throw new Error('assert left.type.isString(cache) || left.type.isIgnored(cache) (src/resolver/constantfolding.sk:111:5)');
    }

    if (!right.type.isString(this.cache) && !right.type.isIgnored(this.cache)) {
      throw new Error('assert right.type.isString(cache) || right.type.isIgnored(cache) (src/resolver/constantfolding.sk:112:5)');
    }

    if (right.kind === NodeKind.STRING) {
      if (left.kind === NodeKind.STRING) {
        this.flattenString(node, left.asString() + right.asString());
      } else if (left.kind === NodeKind.ADD) {
        var leftLeft = left.binaryLeft();
        var leftRight = left.binaryRight();

        if (!leftLeft.type.isString(this.cache) && !leftLeft.type.isIgnored(this.cache)) {
          throw new Error('assert leftLeft.type.isString(cache) || leftLeft.type.isIgnored(cache) (src/resolver/constantfolding.sk:123:9)');
        }

        if (!leftRight.type.isString(this.cache) && !leftRight.type.isIgnored(this.cache)) {
          throw new Error('assert leftRight.type.isString(cache) || leftRight.type.isIgnored(cache) (src/resolver/constantfolding.sk:124:9)');
        }

        if (leftRight.kind === NodeKind.STRING) {
          this.flattenString(leftRight, leftRight.asString() + right.asString());
          node.become(left.remove());
        }
      }
    }
  };

  ConstantFolder.prototype.foldFor = function(node) {
    var test = node.forTest();

    if (test !== null && test.isFalse()) {
      var setup = node.forSetup();

      if (setup === null || setup.hasNoSideEffects()) {
        node.remove();
        return -1;
      } else if (setup.kind === NodeKind.VARIABLE_CLUSTER) {
        if (in_CompilerTarget.hasNoNestedScopes(this.options.target)) {
          node.replaceWith(setup.remove());
        } else {
          var update = node.forUpdate();
          var block = node.forBlock();

          if (update !== null) {
            update.replaceWith(null);
          }

          block.removeChildren();
          block.children = [];
        }
      } else {
        node.replaceWith(Node.createExpression(setup.remove()));
      }
    }

    return 0;
  };

  ConstantFolder.prototype.foldTry = function(node) {
    var tryBlock = node.tryBlock();
    var catches = node.catches();
    var finallyBlock = node.finallyBlock();

    if (tryBlock.blockStatements().length === 0) {
      node.remove();
      return -1;
    }

    for (var i = catches.length - 1 | 0; i >= 0; i = i - 1 | 0) {
      var catchNode = catches[i];

      if (catchNode.catchBlock().blockStatements().length !== 0) {
        break;
      }

      catchNode.remove();
    }

    if (finallyBlock !== null && finallyBlock.blockStatements().length === 0) {
      finallyBlock.replaceWith(null);
    }

    if (node.catches().length === 0 && node.finallyBlock() === null) {
      if (in_CompilerTarget.hasNoNestedScopes(this.options.target) || !ConstantFolder.blockContainsVariableCluster(tryBlock)) {
        var replacements = tryBlock.removeChildren();
        node.replaceWithNodes(replacements);
        return replacements.length - 1 | 0;
      } else {
        node.replaceWith(Node.createIf(NodeKind.IF, Node.createBool(true), tryBlock.replaceWith(null), null));
      }
    }

    return 0;
  };

  ConstantFolder.prototype.foldIf = function(node) {
    var test = node.ifTest();
    var trueBlock = node.ifTrue();
    var falseBlock = node.ifFalse();

    if (falseBlock !== null && !falseBlock.hasChildren()) {
      falseBlock.replaceWith(null);
      falseBlock = null;
    }

    if (test.isTrue()) {
      if (falseBlock !== null) {
        falseBlock.replaceWith(null);
      }

      if (in_CompilerTarget.hasNoNestedScopes(this.options.target) || !ConstantFolder.blockContainsVariableCluster(trueBlock)) {
        var replacements = trueBlock.removeChildren();
        node.replaceWithNodes(replacements);
        return replacements.length - 1 | 0;
      }
    } else if (test.isFalse()) {
      if (falseBlock === null) {
        node.remove();
        return -1;
      }

      if (in_CompilerTarget.hasNoNestedScopes(this.options.target) || !ConstantFolder.blockContainsVariableCluster(falseBlock)) {
        var replacements = falseBlock.removeChildren();
        node.replaceWithNodes(replacements);
        return replacements.length - 1 | 0;
      }

      test.replaceWith(Node.createBool(true).withType(test.type));
      trueBlock.replaceWith(falseBlock.replaceWith(null));
    } else if (!trueBlock.hasChildren()) {
      if (falseBlock !== null && falseBlock.hasChildren()) {
        test.invertBooleanCondition(this.cache);
        trueBlock.swapWith(falseBlock);
        trueBlock.replaceWith(null);
      } else if (test.hasNoSideEffects()) {
        node.remove();
        return -1;
      } else {
        node.become(Node.createExpression(test.remove()));
      }
    }

    return 0;
  };

  ConstantFolder.prototype.foldSwitch = function(node) {
    var cases = node.switchCases();
    var hasDefaultCase = false;

    if (cases.hasChildren()) {
      var last = cases.lastChild();

      if (!last.caseValues().hasChildren()) {
        hasDefaultCase = true;

        if (!last.caseBlock().hasChildren()) {
          hasDefaultCase = false;
          last.remove();
        }
      }

      if (!hasDefaultCase) {
        for (var i = cases.children.length - 1 | 0; i >= 0; i = i - 1 | 0) {
          var statement = cases.children[i];

          if (!statement.caseBlock().hasChildren()) {
            statement.remove();
          }
        }
      }
    }

    if (!cases.hasChildren()) {
      var value = node.switchValue();
      node.replaceWith(Node.createExpression(value.remove()).withRange(node.range));
      return -1;
    }

    return 0;
  };

  ConstantFolder.prototype.foldVariableCluster = function(node) {
    var variables = node.clusterVariables();

    for (var i = 0; i < variables.length; i = i + 1 | 0) {
      var variable = variables[i];

      if (variable.symbol.isConst()) {
        variable.remove();
      }
    }
  };

  ConstantFolder.prototype.foldBlock = function(node) {
    var children = node.children;

    for (var i = 0; i < children.length; i = i + 1 | 0) {
      var child = children[i];
      var kind = child.kind;

      if (in_NodeKind.isJump(kind)) {
        for (var j = children.length - 1 | 0; j > i; j = j - 1 | 0) {
          node.removeChildAtIndex(j);
        }

        break;
      }

      if (kind === NodeKind.EXPRESSION && child.expressionValue().hasNoSideEffects() || kind === NodeKind.WHILE && child.whileTest().isFalse()) {
        node.removeChildAtIndex(i);
        i = i - 1 | 0;
      } else if (kind === NodeKind.FOR) {
        i = i + this.foldFor(child) | 0;
      } else if (kind === NodeKind.TRY) {
        i = i + this.foldTry(child) | 0;
      } else if (kind === NodeKind.IF) {
        i = i + this.foldIf(child) | 0;
      } else if (kind === NodeKind.SWITCH) {
        i = i + this.foldSwitch(child) | 0;
      }
    }
  };

  ConstantFolder.prototype.foldDot = function(node) {
    if (node.symbol !== null && node.symbol.constant !== null) {
      if (node.dotTarget().hasNoSideEffects()) {
        this.flatten(node, node.symbol.constant);
      } else {
        this.flatten(node.dotName(), node.symbol.constant);
        node.kind = NodeKind.SEQUENCE;
      }
    }
  };

  ConstantFolder.prototype.foldName = function(node) {
    if (node.symbol !== null && node.symbol.constant !== null && node.isNameExpression()) {
      this.flatten(node, node.symbol.constant);
    }
  };

  ConstantFolder.prototype.foldCall = function(node) {
    if (node.kind === NodeKind.CALL) {
      var value = node.callValue();

      if (value.kind === NodeKind.DOT) {
        var target = value.dotTarget();
        var name = value.dotName();

        if (target !== null && in_NodeKind.isConstant(target.kind) && name !== null && name.kind === NodeKind.NAME && name.asString() === 'toString') {
          var text = '';

          switch (target.kind) {
          case 44:
            text = target.asBool().toString();
            break;

          case 45:
            text = target.asInt().toString();
            break;

          case 46:
          case 47:
            text = doubleToStringWithoutDotZero(target.asDouble());
            break;

          case 48:
            text = target.asString();
            break;

          default:
            return;
          }

          this.flattenString(node, text);
        }
      }
    }
  };

  ConstantFolder.prototype.foldCast = function(node) {
    var type = node.castType().type;
    var value = node.castValue();
    var valueKind = value.kind;

    if (valueKind === NodeKind.BOOL) {
      if (type.isBool(this.cache)) {
        this.flattenBool(node, value.asBool());
      } else if (type.isInteger(this.cache)) {
        this.flattenInt(node, value.asBool() | 0);
      } else if (type.isReal(this.cache)) {
        this.flattenReal(node, +value.asBool());
      }
    } else if (valueKind === NodeKind.INT) {
      if (type.isBool(this.cache)) {
        this.flattenBool(node, !!value.asInt());
      } else if (type.isInteger(this.cache)) {
        this.flattenInt(node, value.asInt());
      } else if (type.isReal(this.cache)) {
        this.flattenReal(node, value.asInt());
      }
    } else if (in_NodeKind.isReal(valueKind)) {
      if (type.isBool(this.cache)) {
        this.flattenBool(node, !!value.asDouble());
      } else if (type.isInteger(this.cache)) {
        this.flattenInt(node, value.asDouble() | 0);
      } else if (type.isReal(this.cache)) {
        this.flattenReal(node, value.asDouble());
      }
    }
  };

  ConstantFolder.prototype.foldUnaryOperator = function(node, kind) {
    var value = node.unaryValue();
    var valueKind = value.kind;

    if (valueKind === NodeKind.BOOL) {
      if (kind === NodeKind.NOT) {
        this.flattenBool(node, !value.asBool());
      }
    } else if (valueKind === NodeKind.INT) {
      if (kind === NodeKind.POSITIVE) {
        this.flattenInt(node, +value.asInt() | 0);
      } else if (kind === NodeKind.NEGATIVE) {
        this.flattenInt(node, -value.asInt() | 0);
      } else if (kind === NodeKind.COMPLEMENT) {
        this.flattenInt(node, ~value.asInt());
      }
    } else if (in_NodeKind.isReal(valueKind)) {
      if (kind === NodeKind.POSITIVE) {
        this.flattenReal(node, +value.asDouble());
      } else if (kind === NodeKind.NEGATIVE) {
        this.flattenReal(node, -value.asDouble());
      }
    } else if (kind === NodeKind.NOT && !value.type.isIgnored(this.cache)) {
      switch (valueKind) {
      case 67:
      case 87:
      case 98:
      case 96:
      case 95:
      case 93:
      case 88:
      case 94:
      case 89:
        value.invertBooleanCondition(this.cache);
        node.become(value);
        break;
      }
    }
  };

  ConstantFolder.prototype.foldConstantAddOrSubtract = function(node, variable, constant, delta) {
    var isAdd = node.kind === NodeKind.ADD;
    var needsContentUpdate = delta !== 0;
    var isRightConstant = constant === node.binaryRight();
    var shouldNegateConstant = !isAdd && isRightConstant;
    var value = constant.asInt();

    if (shouldNegateConstant) {
      value = -value | 0;
    }

    value = value + delta | 0;

    if (value === 0) {
      node.become(variable.remove());
      return;
    }

    if (variable.kind === NodeKind.ADD || variable.kind === NodeKind.SUBTRACT) {
      var left = variable.binaryLeft();
      var right = variable.binaryRight();

      if (!left.type.isInt(this.cache) && !left.type.isIgnored(this.cache)) {
        throw new Error('assert left.type.isInt(cache) || left.type.isIgnored(cache) (src/resolver/constantfolding.sk:497:7)');
      }

      if (!right.type.isInt(this.cache) && !right.type.isIgnored(this.cache)) {
        throw new Error('assert right.type.isInt(cache) || right.type.isIgnored(cache) (src/resolver/constantfolding.sk:498:7)');
      }

      var isLeftConstant = left.kind === NodeKind.INT;

      if (isLeftConstant || right.kind === NodeKind.INT) {
        this.foldConstantAddOrSubtract(variable, isLeftConstant ? right : left, isLeftConstant ? left : right, value);
        node.become(variable);
        return;
      }
    }

    if (shouldNegateConstant) {
      value = -value | 0;
    }

    if (value < 0) {
      if (isRightConstant) {
        node.kind = isAdd ? NodeKind.SUBTRACT : NodeKind.ADD;
        value = -value | 0;
        needsContentUpdate = true;
      } else if (isAdd) {
        node.kind = NodeKind.SUBTRACT;
        value = -value | 0;
        variable.swapWith(constant);
        needsContentUpdate = true;
      }
    }

    if (needsContentUpdate) {
      constant.content = new IntContent(value);
    }

    this.foldAddOrSubtract(node);
  };

  ConstantFolder.prototype.foldAddOrSubtract = function(node) {
    var isAdd = node.kind === NodeKind.ADD;
    var left = node.binaryLeft();
    var right = node.binaryRight();

    if (left.kind === NodeKind.NEGATIVE && isAdd) {
      left.become(left.unaryValue().replaceWith(null));
      left.swapWith(right);
      node.kind = NodeKind.SUBTRACT;
    } else if (right.kind === NodeKind.NEGATIVE) {
      right.become(right.unaryValue().replaceWith(null));
      node.kind = isAdd ? NodeKind.SUBTRACT : NodeKind.ADD;
    }
  };

  ConstantFolder.prototype.foldConstantMultiply = function(node, variable, constant) {
    if (node.binaryLeft() === constant) {
      variable.swapWith(constant);
    }

    var value = constant.asInt();

    if (value === 0) {
      if (variable.hasNoSideEffects()) {
        node.become(constant.remove());
      }

      return;
    }

    if (value === 1) {
      node.become(variable.remove());
      return;
    }

    var shift = logBase2(value);

    if (shift !== -1) {
      constant.content = new IntContent(shift);
      node.kind = NodeKind.SHIFT_LEFT;
    }
  };

  ConstantFolder.prototype.foldBinaryOperatorWithConstant = function(node, left, right) {
    switch (node.kind) {
    case 95:
      if (left.isFalse() || right.isTrue()) {
        node.become(left.remove());
      } else if (left.isTrue()) {
        node.become(right.remove());
      }
      break;

    case 96:
      if (left.isTrue() || right.isFalse()) {
        node.become(left.remove());
      } else if (left.isFalse()) {
        node.become(right.remove());
      }
      break;

    case 81:
    case 103:
      if (left.kind === NodeKind.INT) {
        this.foldConstantAddOrSubtract(node, right, left, 0);
      } else if (right.kind === NodeKind.INT) {
        this.foldConstantAddOrSubtract(node, left, right, 0);
      } else {
        this.foldAddOrSubtract(node);
      }
      break;

    case 97:
      if (left.kind === NodeKind.INT) {
        this.foldConstantMultiply(node, right, left);
      } else if (right.kind === NodeKind.INT) {
        this.foldConstantMultiply(node, left, right);
      }
      break;
    }
  };

  ConstantFolder.prototype.foldBinaryOperator = function(node, kind) {
    if (kind === NodeKind.ADD && node.type.isString(this.cache)) {
      this.foldStringConcatenation(node);
      return;
    }

    var left = node.binaryLeft();
    var right = node.binaryRight();

    if (left.kind !== right.kind) {
      this.foldBinaryOperatorWithConstant(node, left, right);
      return;
    }

    if (left.kind === NodeKind.STRING) {
      switch (kind) {
      case 87:
        this.flattenBool(node, left.asString() === right.asString());
        break;

      case 98:
        this.flattenBool(node, left.asString() !== right.asString());
        break;

      case 93:
        this.flattenBool(node, left.asString() < right.asString());
        break;

      case 88:
        this.flattenBool(node, left.asString() > right.asString());
        break;

      case 94:
        this.flattenBool(node, left.asString() <= right.asString());
        break;

      case 89:
        this.flattenBool(node, left.asString() >= right.asString());
        break;
      }
    } else if (left.kind === NodeKind.BOOL) {
      switch (kind) {
      case 95:
        this.flattenBool(node, left.asBool() && right.asBool());
        break;

      case 96:
        this.flattenBool(node, left.asBool() || right.asBool());
        break;

      case 87:
        this.flattenBool(node, left.asBool() === right.asBool());
        break;

      case 98:
        this.flattenBool(node, left.asBool() !== right.asBool());
        break;
      }
    } else if (left.kind === NodeKind.INT) {
      switch (kind) {
      case 81:
        this.flattenInt(node, left.asInt() + right.asInt() | 0);
        break;

      case 103:
        this.flattenInt(node, left.asInt() - right.asInt() | 0);
        break;

      case 97:
        this.flattenInt(node, $imul(left.asInt(), right.asInt()));
        break;

      case 86:
        this.flattenInt(node, left.asInt() / right.asInt() | 0);
        break;

      case 100:
        this.flattenInt(node, left.asInt() % right.asInt() | 0);
        break;

      case 101:
        this.flattenInt(node, left.asInt() << right.asInt());
        break;

      case 102:
        this.flattenInt(node, left.asInt() >> right.asInt());
        break;

      case 82:
        this.flattenInt(node, left.asInt() & right.asInt());
        break;

      case 83:
        this.flattenInt(node, left.asInt() | right.asInt());
        break;

      case 84:
        this.flattenInt(node, left.asInt() ^ right.asInt());
        break;

      case 87:
        this.flattenBool(node, left.asInt() === right.asInt());
        break;

      case 98:
        this.flattenBool(node, left.asInt() !== right.asInt());
        break;

      case 93:
        this.flattenBool(node, left.asInt() < right.asInt());
        break;

      case 88:
        this.flattenBool(node, left.asInt() > right.asInt());
        break;

      case 94:
        this.flattenBool(node, left.asInt() <= right.asInt());
        break;

      case 89:
        this.flattenBool(node, left.asInt() >= right.asInt());
        break;
      }
    } else if (in_NodeKind.isReal(left.kind)) {
      switch (kind) {
      case 81:
        this.flattenReal(node, left.asDouble() + right.asDouble());
        break;

      case 103:
        this.flattenReal(node, left.asDouble() - right.asDouble());
        break;

      case 97:
        this.flattenReal(node, left.asDouble() * right.asDouble());
        break;

      case 86:
        this.flattenReal(node, left.asDouble() / right.asDouble());
        break;

      case 87:
        this.flattenBool(node, left.asDouble() === right.asDouble());
        break;

      case 98:
        this.flattenBool(node, left.asDouble() !== right.asDouble());
        break;

      case 93:
        this.flattenBool(node, left.asDouble() < right.asDouble());
        break;

      case 88:
        this.flattenBool(node, left.asDouble() > right.asDouble());
        break;

      case 94:
        this.flattenBool(node, left.asDouble() <= right.asDouble());
        break;

      case 89:
        this.flattenBool(node, left.asDouble() >= right.asDouble());
        break;
      }
    }
  };

  ConstantFolder.prototype.foldHook = function(node) {
    var test = node.hookTest();

    if (test.isTrue()) {
      node.become(node.hookTrue().remove());
    } else if (test.isFalse()) {
      node.become(node.hookFalse().remove());
    }
  };

  ConstantFolder.prototype.foldSequence = function(node) {
    var i = 0;

    while ((i + 1 | 0) < node.children.length) {
      if (node.children[i].hasNoSideEffects()) {
        node.removeChildAtIndex(i);
      } else {
        i = i + 1 | 0;
      }
    }

    if (node.children.length === 1) {
      node.become(node.children[0].remove());
    } else {
      var last = node.children[i];

      if (last.hasNoSideEffects() && node.parent.kind === NodeKind.EXPRESSION) {
        last.remove();
      }
    }
  };

  var FunctionInliningPass = {};

  function InliningInfo(_0, _1, _2, _3, _4) {
    this.shouldInline = true;
    this.bodyCalls = [];
    this.symbol = _0;
    this.inlineValue = _1;
    this.callSites = _2;
    this.$arguments = _3;
    this.unusedArguments = _4;
  }

  function InliningGraph(graph, options) {
    this.inliningInfo = [];
    this.symbolToInfoIndex = Object.create(null);

    for (var i = 0; i < graph.callInfo.length; i = i + 1 | 0) {
      var info = InliningGraph.createInliningInfo(graph.callInfo[i], options);

      if (info !== null) {
        this.symbolToInfoIndex[info.symbol.uniqueID] = this.inliningInfo.length;
        this.inliningInfo.push(info);
      }
    }

    for (var i = 0; i < this.inliningInfo.length; i = i + 1 | 0) {
      var info = this.inliningInfo[i];
      var callSites = graph.callInfo[graph.symbolToInfoIndex[info.symbol.uniqueID]].callSites;

      for (var j = 0; j < callSites.length; j = j + 1 | 0) {
        var callSite = callSites[j];

        for (var node = callSite.parent; node !== null; node = node.parent) {
          if (node.kind === NodeKind.FUNCTION && node.symbol.kind === SymbolKind.GLOBAL_FUNCTION) {
            var index = in_IntMap.getOrDefault(this.symbolToInfoIndex, node.symbol.uniqueID, -1);

            if (index >= 0) {
              var other = this.inliningInfo[index];
              other.bodyCalls.push(info);
            }
          }
        }
      }
    }

    for (var i = 0; i < this.inliningInfo.length; i = i + 1 | 0) {
      var info = this.inliningInfo[i];
      info.shouldInline = !InliningGraph.containsInfiniteExpansion(info, []);
    }
  }

  InliningGraph.containsInfiniteExpansion = function(info, symbols) {
    if (symbols.indexOf(info.symbol) !== -1) {
      return true;
    }

    symbols.push(info.symbol);

    for (var i = 0; i < info.bodyCalls.length; i = i + 1 | 0) {
      if (InliningGraph.containsInfiniteExpansion(info.bodyCalls[i], symbols)) {
        return true;
      }
    }

    symbols.pop();
    return false;
  };

  InliningGraph.createInliningInfo = function(info, options) {
    var symbol = info.symbol;

    if (symbol.kind === SymbolKind.GLOBAL_FUNCTION && (symbol.isInline() || options.inlineAllFunctions)) {
      var block = symbol.node.functionBlock();

      if (block === null) {
        return null;
      }

      if (!block.hasChildren()) {
        if (options.foldAllConstants) {
          var $arguments = [];
          var argumentVariables = symbol.node.functionArguments().children;

          for (var i = 0; i < argumentVariables.length; i = i + 1 | 0) {
            $arguments.push(argumentVariables[i].symbol);
          }

          return new InliningInfo(symbol, Node.createNull().withType(symbol.type.resultType()), info.callSites, $arguments, $arguments);
        }

        return null;
      }

      var first = block.children[0];
      var inlineValue = null;

      if (first.kind === NodeKind.RETURN) {
        inlineValue = first.returnValue();
      } else if (first.kind === NodeKind.EXPRESSION && block.children.length === 1) {
        inlineValue = first.expressionValue();
      }

      if (inlineValue !== null) {
        var argumentVariables = symbol.node.functionArguments().children;
        var argumentCounts = Object.create(null);

        for (var i = 0; i < argumentVariables.length; i = i + 1 | 0) {
          argumentCounts[argumentVariables[i].symbol.uniqueID] = 0;
        }

        if (InliningGraph.recursivelyCountArgumentUses(inlineValue, argumentCounts)) {
          var unusedArguments = [];
          var $arguments = [];
          var isSimpleSubstitution = true;

          for (var i = 0; i < argumentVariables.length; i = i + 1 | 0) {
            var argument = argumentVariables[i].symbol;
            var count = argumentCounts[argument.uniqueID];

            if (count === 0) {
              unusedArguments.push(argument);
            } else if (count !== 1) {
              isSimpleSubstitution = false;
              break;
            }

            $arguments.push(argument);
          }

          if (isSimpleSubstitution) {
            return new InliningInfo(symbol, inlineValue, info.callSites, $arguments, unusedArguments);
          }
        }
      }
    }

    return null;
  };

  InliningGraph.recursivelyCountArgumentUses = function(node, argumentCounts) {
    if (node.hasChildren()) {
      for (var i = 0; i < node.children.length; i = i + 1 | 0) {
        var child = node.children[i];

        if (child !== null && !InliningGraph.recursivelyCountArgumentUses(child, argumentCounts)) {
          return false;
        }
      }
    }

    var symbol = node.symbol;

    if (symbol !== null) {
      var count = in_IntMap.getOrDefault(argumentCounts, symbol.uniqueID, -1);

      if (count >= 0) {
        argumentCounts[symbol.uniqueID] = count + 1 | 0;

        if (node.isStorage()) {
          return false;
        }
      }
    }

    return true;
  };

  var GlobalizePass = {};

  function Member(_0) {
    this.type = null;
    this.dependency = null;
    this.parameterizedType = null;
    this.symbol = _0;
  }

  function MemberComparison() {
  }

  MemberComparison.prototype.compare = function(left, right) {
    return left.symbol.uniqueID - right.symbol.uniqueID | 0;
  };

  function MemberRangeComparison() {
  }

  MemberRangeComparison.prototype.compare = function(left, right) {
    return left.symbol.node.range.start - right.symbol.node.range.start | 0;
  };

  var MatchKind = {
    NONE: 0,
    INEXACT: 1,
    EXACT: 2
  };

  var CastKind = {
    IMPLICIT_CAST: 0,
    EXPLICIT_CAST: 1
  };

  var AllowDeclaration = {
    ALLOW_TOP_LEVEL: 0,
    ALLOW_TOP_OR_OBJECT_LEVEL: 1
  };

  var PreprocessorResult = {
    FALSE: 0,
    ERROR: 2
  };

  var LogErrors = {
    SILENT_ERRORS: 0,
    LOG_ERRORS: 1
  };

  function ResolveContext() {
    this.scope = null;
    this.loop = null;
    this.switchValue = null;
    this.symbolForThis = null;
    this.functionSymbol = null;
  }

  ResolveContext.prototype.inPureFunction = function() {
    return this.functionSymbol !== null && this.functionSymbol.isPure();
  };

  ResolveContext.fromNode = function(node) {
    var context = new ResolveContext();

    while (node !== null) {
      if (context.scope === null) {
        context.scope = node.scope;
      }

      if (context.loop === null && in_NodeKind.isLoop(node.kind)) {
        context.loop = node;
      }

      if (context.switchValue === null && node.kind === NodeKind.SWITCH) {
        context.switchValue = node.switchValue();
      }

      if (context.symbolForThis === null && node.symbol !== null && in_SymbolKind.isTypeWithInstances(node.symbol.kind)) {
        context.symbolForThis = node.symbol;
      }

      if (context.functionSymbol === null && in_NodeKind.isFunction(node.kind)) {
        context.functionSymbol = node.symbol;
      }

      node = node.parent;
    }

    return context;
  };

  function SourceSubstitution(_0, _1) {
    this.range = _0;
    this.content = _1;
  }

  function SourceSubstitutionComparison() {
  }

  SourceSubstitutionComparison.prototype.compare = function(a, b) {
    return a.range.start - b.range.start | 0;
  };

  function Resolver(_0, _1) {
    this.sourceSubstitutions = Object.create(null);
    this.defines = Object.create(null);
    this.context = new ResolveContext();
    this.constantFolder = null;
    this.parsedDeclarations = [];
    this.parsedBlocks = [];
    this.typeContext = null;
    this.resultType = null;
    this.entryPointSymbol = null;
    this.allSymbols = [];
    this.cache = new TypeCache();
    this.log = _0;
    this.options = _1;
  }

  Resolver.prototype.run = function(program) {
    if (program.kind !== NodeKind.PROGRAM) {
      throw new Error('assert program.kind == .PROGRAM (src/resolver/resolver.sk:84:5)');
    }

    var globalScope = new Scope(null);
    this.cache.insertGlobals(globalScope);
    this.constantFolder = new ConstantFolder(this.cache, this.options);
    this.runPreprocessor(program, globalScope);
    this.prepareNode(program, globalScope);
    this.cache.linkGlobals(globalScope);
    this.resolve(program, null);
  };

  Resolver.prototype.findPreprocessorNodes = function(node, nodes, globalScope) {
    var kind = node.kind;

    if (kind === NodeKind.PREPROCESSOR_IF) {
      nodes.push(node);
    } else if (kind === NodeKind.PREPROCESSOR_DEFINE) {
      var declarationName = node.declarationName();
      var symbol = this.createSymbol(declarationName.asString(), SymbolKind.DEFINE);
      symbol.flags |= SymbolFlag.CONST;
      symbol.type = this.cache.errorType;
      symbol.enclosingSymbol = this.cache.globalType.symbol;
      symbol.node = node;
      node.symbol = symbol;
      nodes.push(node);
      this.parsedDeclarations.push(node);

      var existing = globalScope.findLocal(symbol.name);

      if (existing !== null) {
        semanticErrorDuplicateSymbol(this.log, declarationName.range, symbol.name, existing.symbol.nameRange());
      } else {
        globalScope.insert(new Member(symbol));
      }
    } else if (node.hasChildren()) {
      for (var i = 0; i < node.children.length; i = i + 1 | 0) {
        var child = node.children[i];

        if (child !== null) {
          this.findPreprocessorNodes(child, nodes, globalScope);
        }
      }
    }
  };

  Resolver.prototype.runPreprocessor = function(program, globalScope) {
    if (program.kind !== NodeKind.PROGRAM) {
      throw new Error('assert program.kind == .PROGRAM (src/resolver/resolver.sk:130:5)');
    }

    var workList = [];

    for (var i = 0; i < program.children.length; i = i + 1 | 0) {
      var file = program.children[i];

      if (file.kind !== NodeKind.FILE) {
        throw new Error('assert file.kind == .FILE (src/resolver/resolver.sk:136:7)');
      }

      if (file.needsPreprocessor()) {
        this.findPreprocessorNodes(file, workList, globalScope);
      }
    }

    var done = false;

    do {
      done = true;

      for (var i = 0; i < workList.length; i = i + 1 | 0) {
        var node = workList[i];

        if (node.kind === NodeKind.PREPROCESSOR_DEFINE) {
          var result = this.evaluatePreprocessorValue(node.defineValue(), LogErrors.SILENT_ERRORS);

          if (result !== PreprocessorResult.ERROR) {
            var symbol = node.symbol;
            var value = !!result;

            if (symbol.name in this.options.overriddenDefines) {
              value = this.options.overriddenDefines[symbol.name].value;
              delete this.options.overriddenDefines[symbol.name];
            }

            symbol.constant = new BoolContent(value);
            this.defines[symbol.name] = value;
            workList.splice(i, 1)[0];
            i = i - 1 | 0;
            done = false;
          }
        } else {
          if (node.kind !== NodeKind.PREPROCESSOR_IF) {
            throw new Error('assert node.kind == .PREPROCESSOR_IF (src/resolver/resolver.sk:164:11)');
          }

          var result = this.evaluatePreprocessorValue(node.ifTest(), LogErrors.SILENT_ERRORS);

          if (result !== PreprocessorResult.ERROR) {
            var branch = result !== PreprocessorResult.FALSE ? node.ifTrue() : node.ifFalse();

            if (branch !== null) {
              this.findPreprocessorNodes(branch, workList, globalScope);
              node.replaceWithNodes(branch.removeChildren());
            } else {
              node.remove();
            }

            workList.splice(i, 1)[0];
            i = i - 1 | 0;
            done = false;
          }
        }
      }
    } while (!done);

    for (var i = 0; i < workList.length; i = i + 1 | 0) {
      var node = workList[i];
      this.evaluatePreprocessorValue(node.kind === NodeKind.PREPROCESSOR_DEFINE ? node.defineValue() : node.ifTest(), LogErrors.LOG_ERRORS);
    }

    var keys = Object.keys(this.options.overriddenDefines);

    for (var i = 0; i < keys.length; i = i + 1 | 0) {
      var key = keys[i];
      semanticErrorPreprocessorInvalidOverriddenDefine(this.log, this.options.overriddenDefines[key].range, key);
    }
  };

  Resolver.prototype.evaluatePreprocessorValue = function(node, mode) {
    switch (node.kind) {
    case 44:
      return node.asBool() | 0;

    case 39:
      var name = node.asString();

      if (name in this.defines) {
        return this.defines[name] | 0;
      } else if (mode === LogErrors.LOG_ERRORS) {
        semanticErrorPreprocessorInvalidSymbol(this.log, node.range, name);
      }
      break;

    case 67:
      var value = this.evaluatePreprocessorValue(node.unaryValue(), mode);
      return value === PreprocessorResult.ERROR ? PreprocessorResult.ERROR : 1 - value | 0;

    case 96:
    case 95:
      var left = this.evaluatePreprocessorValue(node.binaryLeft(), mode);
      var right = this.evaluatePreprocessorValue(node.binaryRight(), mode);
      return left !== PreprocessorResult.ERROR && right !== PreprocessorResult.ERROR ? node.kind === NodeKind.LOGICAL_OR ? left | right : left & right : PreprocessorResult.ERROR;

    case 57:
      break;

    default:
      if (mode === LogErrors.LOG_ERRORS) {
        semanticErrorPreprocessorInvalidValue(this.log, node.range);
      }
      break;
    }

    return PreprocessorResult.ERROR;
  };

  Resolver.prototype.prepareNode = function(node, scope) {
    this.setupScopesAndSymbols(node, scope);
    this.accumulateSymbolFlags();
    this.setSymbolKindsAndMergeSiblings();
    this.processUsingStatements();
    this.parsedDeclarations = [];
    this.parsedBlocks = [];
  };

  Resolver.prototype.setupBlock = function(node, scope) {
    if (!in_NodeKind.isNamedBlockDeclaration(node.parent.kind) && !in_NodeKind.isLoop(node.parent.kind)) {
      scope = new Scope(scope);
    }

    node.scope = scope;
    this.parsedBlocks.push(node);

    if (node.parent.kind === NodeKind.FILE) {
      scope.type = this.cache.globalType;
    } else {
      var parentSymbol = node.parent.symbol;

      if (parentSymbol !== null && parentSymbol.type !== null) {
        scope.type = parentSymbol.type;
      }
    }

    return scope;
  };

  Resolver.prototype.setupNamedDeclaration = function(node, scope) {
    var declarationName = node.declarationName();

    if (declarationName !== null && node.symbol === null) {
      var name = declarationName.asString();
      var member = scope.findLocal(name);
      var symbol = null;

      if (member !== null) {
        symbol = member.symbol;
        symbol.node.appendToSiblingChain(node);
      } else {
        symbol = this.createSymbol(name, SymbolKind.OTHER);
        symbol.node = node;

        if (scope.type !== null) {
          symbol.enclosingSymbol = scope.type.symbol;
        }

        scope.insert(new Member(symbol));
      }

      this.parsedDeclarations.push(node);
      declarationName.symbol = symbol;
      node.symbol = symbol;

      if (symbol.type === null && in_NodeKind.isNamedBlockDeclaration(node.kind)) {
        symbol.type = new Type(symbol);
      }
    }
  };

  Resolver.prototype.setupScopesAndSymbols = function(node, scope) {
    var kind = node.kind;

    if (kind === NodeKind.PROGRAM) {
      node.scope = scope;
    } else if (kind === NodeKind.BLOCK) {
      scope = this.setupBlock(node, scope);
    }

    if (in_NodeKind.isNamedDeclaration(kind)) {
      this.setupNamedDeclaration(node, scope);
    }

    if (in_NodeKind.isNamedBlockDeclaration(kind) || in_NodeKind.isFunction(kind) || in_NodeKind.isLoop(kind)) {
      scope = new Scope(scope);
      node.scope = scope;
    }

    if (node.hasChildren() && !in_NodeKind.isExpression(node.kind)) {
      var children = node.children;

      for (var i = 0, n = children.length; i < n; i = i + 1 | 0) {
        var child = children[i];

        if (child !== null) {
          this.setupScopesAndSymbols(child, scope);
        }
      }
    }
  };

  Resolver.prototype.symbolFlagsForNode = function(node) {
    var flags = 0;
    var parent = node.parent;

    if (parent.kind === NodeKind.VARIABLE_CLUSTER) {
      parent = parent.parent;
    }

    while (parent !== null && parent.kind === NodeKind.MODIFIER) {
      var modifierName = parent.modifierName();
      var name = modifierName.asString();

      if (node.kind === NodeKind.EXTENSION) {
        semanticErrorUnexpectedModifier(this.log, modifierName.range, name, 'on an extension block');
      } else {
        var flag = in_StringMap.getOrDefault(Resolver.nameToSymbolFlag, name, 0);

        if (flag === 0) {
          flag = SymbolFlag.HAS_ANNOTATIONS;
        } else if ((flags & flag) !== 0) {
          semanticWarningDuplicateModifier(this.log, modifierName.range, name);
        }

        flags |= flag;
      }

      parent = parent.parent;
    }

    if (parent !== null && parent.kind === NodeKind.BLOCK && parent.parent.kind === NodeKind.EXTENSION) {
      flags |= SymbolFlag.FROM_EXTENSION;
    }

    return flags;
  };

  Resolver.prototype.accumulateSymbolFlags = function() {
    for (var i = 0; i < this.parsedDeclarations.length; i = i + 1 | 0) {
      var node = this.parsedDeclarations[i];
      node.symbol.flags |= this.symbolFlagsForNode(node);
    }
  };

  Resolver.prototype.checkParentsForLocalVariable = function(node) {
    for (node = node.parent; node !== null; node = node.parent) {
      if (in_NodeKind.isFunction(node.kind)) {
        return true;
      }
    }

    return false;
  };

  Resolver.prototype.setSymbolKindsAndMergeSiblings = function() {
    for (var i = 0; i < this.parsedDeclarations.length; i = i + 1 | 0) {
      var node = this.parsedDeclarations[i];
      var symbol = node.symbol;

      if (symbol.node !== node) {
        continue;
      }

      var declarationName = node.declarationName();
      var kind = node.kind;

      for (var sibling = node.sibling; sibling !== null; sibling = sibling.sibling) {
        if (sibling.kind === NodeKind.EXTENSION && in_NodeKind.isNamedBlockDeclaration(kind)) {
          continue;
        }

        if (sibling.kind !== NodeKind.EXTENSION && in_NodeKind.isNamedBlockDeclaration(sibling.kind)) {
          if (kind === NodeKind.EXTENSION || kind === NodeKind.NAMESPACE && sibling.kind === NodeKind.NAMESPACE) {
            kind = sibling.kind;
            continue;
          }
        }

        var siblingName = sibling.declarationName();
        semanticErrorDuplicateSymbol(this.log, siblingName.range, siblingName.asString(), declarationName.range);
      }

      var previous = node;

      for (var sibling = node.sibling; sibling !== null; sibling = sibling.sibling) {
        if (sibling.kind === NodeKind.VARIABLE || in_NodeKind.isFunction(sibling.kind)) {
          var disconnected = this.createSymbol(symbol.name, SymbolKind.OTHER);
          sibling.symbol = disconnected;
          disconnected.enclosingSymbol = symbol.enclosingSymbol;
          disconnected.node = sibling;
          previous.sibling = sibling.sibling;
        } else {
          previous = sibling;
        }
      }

      switch (kind) {
      case 8:
        symbol.kind = SymbolKind.NAMESPACE;
        break;

      case 9:
        symbol.kind = SymbolKind.ENUM;
        break;

      case 10:
        symbol.kind = SymbolKind.ENUM_FLAGS;
        break;

      case 11:
        symbol.kind = SymbolKind.CLASS;
        break;

      case 12:
        symbol.kind = SymbolKind.INTERFACE;
        break;

      case 15:
        symbol.kind = SymbolKind.GLOBAL_FUNCTION;
        break;

      case 14:
        symbol.kind = SymbolKind.CONSTRUCTOR_FUNCTION;
        break;

      case 16:
        symbol.kind = SymbolKind.GLOBAL_VARIABLE;
        break;

      case 17:
        symbol.kind = symbol.enclosingSymbol !== null ? SymbolKind.OBJECT_PARAMETER : SymbolKind.FUNCTION_PARAMETER;
        break;

      case 19:
        symbol.kind = SymbolKind.ALIAS;
        break;

      case 13:
        semanticErrorExtensionMissingTarget(this.log, declarationName.range, declarationName.asString());
        break;

      case 18:
        break;

      default:
        throw new Error('assert false (src/resolver/resolver.sk:462:19)');
        break;
      }
    }

    for (var i = 0; i < this.parsedDeclarations.length; i = i + 1 | 0) {
      var node = this.parsedDeclarations[i];
      var symbol = node.symbol;

      if (!symbol.isStatic() && (symbol.isObjectMember() || symbol.isEnumMember() && symbol.isFromExtension())) {
        if (symbol.kind === SymbolKind.GLOBAL_FUNCTION) {
          symbol.kind = SymbolKind.INSTANCE_FUNCTION;
        } else if (symbol.kind === SymbolKind.GLOBAL_VARIABLE) {
          symbol.kind = SymbolKind.INSTANCE_VARIABLE;
        }
      } else if (symbol.kind === SymbolKind.GLOBAL_VARIABLE && this.checkParentsForLocalVariable(node)) {
        symbol.kind = SymbolKind.LOCAL_VARIABLE;
      }
    }
  };

  Resolver.prototype.processUsingStatements = function() {
    for (var i = 0; i < this.parsedBlocks.length; i = i + 1 | 0) {
      var block = this.parsedBlocks[i];

      if (!block.hasChildren()) {
        continue;
      }

      var insertedSymbols = null;

      for (var j = 0; j < block.children.length; j = j + 1 | 0) {
        var statement = block.children[j];

        if (statement.kind !== NodeKind.USING) {
          continue;
        }

        var value = statement.usingValue();
        this.resolveGlobalUsingValue(value);

        if (value.type.isIgnored(this.cache)) {
          continue;
        }

        var symbol = value.type.symbol;

        if (symbol === null) {
          continue;
        }

        if (!in_SymbolKind.isNamespace(symbol.kind)) {
          semanticErrorBadUsing(this.log, value.range);
          continue;
        }

        if (insertedSymbols === null) {
          insertedSymbols = [];
        }

        var members = symbol.type.sortedMembers();

        for (var k = 0; k < members.length; k = k + 1 | 0) {
          var member = members[k];
          var memberSymbol = member.symbol;

          if (memberSymbol.kind === SymbolKind.NAMESPACE) {
            continue;
          }

          var current = block.scope.findLocal(memberSymbol.name);

          if (current === null) {
            insertedSymbols.push(memberSymbol);
            block.scope.insertLocal(member);
            continue;
          }

          var currentSymbol = current.symbol;

          if (!(insertedSymbols.indexOf(currentSymbol) !== -1)) {
            continue;
          }

          if (currentSymbol.kind !== SymbolKind.AMBIGUOUS) {
            if (memberSymbol !== currentSymbol) {
              var collision = this.createSymbol(memberSymbol.name, SymbolKind.AMBIGUOUS);
              collision.identicalMembers = [current, member];
              block.scope.locals[memberSymbol.name] = new Member(collision);
              insertedSymbols.push(collision);
            }
          } else if (!(currentSymbol.identicalMembers.indexOf(member) !== -1)) {
            currentSymbol.identicalMembers.push(member);
          }
        }
      }
    }
  };

  Resolver.prototype.resolveGlobalUsingValue = function(node) {
    node.type = this.cache.errorType;

    var member = null;

    if (node.kind === NodeKind.NAME) {
      var name = node.asString();
      member = this.cache.globalType.findMember(name);

      if (member === null) {
        semanticErrorUndeclaredSymbol(this.log, node.range, name);
        return;
      }
    } else if (node.kind === NodeKind.DOT) {
      var target = node.dotTarget();
      this.resolveGlobalUsingValue(target);

      var targetType = target.type;
      var dotName = node.dotName();

      if (targetType === null || dotName === null) {
        return;
      }

      var name = dotName.asString();
      member = targetType.findMember(name);

      if (member === null) {
        semanticErrorUnknownMemberSymbol(this.log, dotName.range, name, targetType);
        return;
      }
    } else {
      semanticErrorUnexpectedNode(this.log, node.range, node.kind);
      return;
    }

    if (!in_SymbolKind.isType(member.symbol.kind)) {
      semanticErrorBadUsingValue(this.log, node.range);
      return;
    }

    node.become(Node.createType(member.symbol.type).withRange(node.range).withSymbol(member.symbol));

    if (node.type === null) {
      throw new Error('assert node.type != null (src/resolver/resolver.sk:619:5)');
    }
  };

  Resolver.prototype.resolve = function(node, expectedType) {
    if (node.type !== null) {
      return;
    }

    node.type = this.cache.errorType;

    if (this.context.scope === null && node.kind !== NodeKind.PROGRAM) {
      throw new Error('assert context.scope != null || node.kind == .PROGRAM (src/resolver/resolver.sk:630:5)');
    }

    var oldScope = this.context.scope;
    var oldType = this.typeContext;
    var kind = node.kind;

    if (node.scope !== null) {
      this.context.scope = node.scope;
    }

    this.typeContext = expectedType;

    switch (kind) {
    case 2:
      this.resolveBlock(node);
      break;

    case 4:
      this.resolveCase(node);
      break;

    case 1:
      this.resolveFile(node);
      break;

    case 3:
      this.resolveChildren(node);
      break;

    case 0:
      this.resolveProgram(node);
      break;

    case 35:
      break;

    case 11:
    case 12:
      this.resolveObject(node);
      break;

    case 9:
    case 10:
      this.resolveEnum(node);
      break;

    case 8:
      this.resolveNamespace(node);
      break;

    case 19:
      this.resolveAlias(node);
      break;

    case 14:
    case 15:
      this.resolveFunction(node);
      break;

    case 13:
      this.resolveExtension(node);
      break;

    case 17:
      this.resolveParameter(node);
      break;

    case 18:
      this.resolveDefine(node);
      break;

    case 16:
      this.resolveVariable(node);
      break;

    case 7:
      this.resolveVariableCluster(node);
      break;

    case 30:
    case 31:
      this.resolveAssert(node);
      break;

    case 27:
      this.resolveBreak(node);
      break;

    case 28:
      this.resolveContinue(node);
      break;

    case 25:
      this.resolveWhile(node);
      break;

    case 32:
      this.resolveExpression(node);
      break;

    case 22:
      this.resolveFor(node);
      break;

    case 23:
      this.resolveForEach(node);
      break;

    case 20:
      this.resolveIf(node);
      break;

    case 34:
      this.resolveModifier(node);
      break;

    case 38:
      break;

    case 36:
    case 37:
      this.resolvePreprocessorDiagnostic(node);
      break;

    case 26:
      this.resolveReturn(node);
      break;

    case 33:
      this.resolveSwitch(node);
      break;

    case 29:
      this.resolveThrow(node);
      break;

    case 21:
      this.resolveTry(node);
      break;

    case 24:
      this.resolveWhile(node);
      break;

    case 64:
      this.resolveAnnotation(node);
      break;

    case 44:
      node.type = this.cache.boolType;
      break;

    case 55:
      this.resolveCall(node);
      break;

    case 60:
      this.resolveCast(node);
      break;

    case 52:
    case 53:
    case 54:
      this.resolveDot(node);
      break;

    case 47:
      node.type = this.cache.doubleType;
      break;

    case 57:
      break;

    case 46:
      node.type = this.cache.floatType;
      break;

    case 42:
      this.resolveHook(node);
      break;

    case 45:
      this.resolveInt(node);
      break;

    case 51:
      this.resolveKeyValue(node);
      break;

    case 49:
      this.resolveList(node);
      break;

    case 50:
      this.resolveMap(node);
      break;

    case 39:
      this.resolveName(node);
      break;

    case 43:
      node.type = this.cache.nullType;
      break;

    case 59:
      this.resolveParameterize(node);
      break;

    case 65:
      this.resolvePreprocessorHook(node);
      break;

    case 62:
      this.resolveQuoted(node);
      break;

    case 58:
      this.resolveSequence(node);
      break;

    case 48:
      node.type = this.cache.stringType;
      break;

    case 56:
      this.resolveSuperCall(node);
      break;

    case 41:
      this.resolveThis(node);
      break;

    case 63:
      this.resolveVar(node);
      break;

    default:
      if (in_NodeKind.isUnaryOperator(kind)) {
        this.resolveUnary(node);
      } else if (in_NodeKind.isBinaryOperator(kind)) {
        this.resolveBinary(node);
      } else if (in_NodeKind.isTernaryOperator(kind)) {
        this.resolveTernary(node);
      } else {
        throw new Error('assert false (src/resolver/resolver.sk:705:14)');
      }
      break;
    }

    this.context.scope = oldScope;
    this.typeContext = oldType;

    if (node.type === null) {
      throw new Error('assert node.type != null (src/resolver/resolver.sk:711:5)');
    }
  };

  Resolver.prototype.checkAccess = function(symbol, range) {
    if (symbol !== null && symbol.isPrivateOrProtected()) {
      var enclosingSymbol = symbol.enclosingSymbol;
      var isPrivate = symbol.isPrivate();
      var hasAccess = false;

      if (isPrivate) {
        if (this.context.symbolForThis !== null) {
          hasAccess = this.context.symbolForThis === enclosingSymbol;
        }
      } else if (this.context.symbolForThis !== null) {
        hasAccess = this.context.symbolForThis.type.hasBaseSymbol(enclosingSymbol);
      }

      if (!hasAccess) {
        semanticErrorAccessViolation(this.log, range, isPrivate ? 'private' : 'protected', symbol.fullName());
      }
    }
  };

  Resolver.prototype.checkPureInsideFunction = function(node) {
    var symbol = node.symbol;

    if (this.context.inPureFunction() && (symbol.kind === SymbolKind.GLOBAL_VARIABLE && !symbol.isConst() || in_SymbolKind.isFunction(symbol.kind) && !symbol.isPure())) {
      semanticErrorPurityViolation(this.log, node.range);
    }
  };

  Resolver.prototype.checkIsParameterized = function(node) {
    if (!node.type.isIgnored(this.cache) && node.type.hasParameters() && !node.type.isParameterized()) {
      semanticErrorUnparameterizedType(this.log, node.range, node.type);
      node.type = this.cache.errorType;
    }
  };

  Resolver.prototype.checkIsType = function(node) {
    if (node.kind === NodeKind.QUOTED) {
      var symbol = this.createSymbol('<quoted>', SymbolKind.QUOTED_TYPE);
      symbol.node = node.quotedValue().remove();
      symbol.type = new Type(symbol);
      node.kind = NodeKind.TYPE;
      node.type = symbol.type;
    } else if (!node.type.isIgnored(this.cache) && node.kind !== NodeKind.TYPE) {
      semanticErrorUnexpectedExpression(this.log, node.range, node.type);
      node.type = this.cache.errorType;
    }
  };

  Resolver.prototype.checkIsInstance = function(node) {
    if (!node.type.isIgnored(this.cache) && node.kind === NodeKind.TYPE) {
      semanticErrorUnexpectedType(this.log, node.range, node.type);
      node.type = this.cache.errorType;
    }
  };

  Resolver.prototype.checkIsValidFunctionReturnType = function(node) {
    if (!node.type.isVoid(this.cache)) {
      this.checkIsValidVariableType(node);
    }
  };

  Resolver.prototype.checkIsValidVariableType = function(node) {
    if (node.type.isVoid(this.cache) || node.type.isNamespace()) {
      semanticErrorBadType(this.log, node.range, node.type);
      node.type = this.cache.errorType;
    }
  };

  Resolver.prototype.checkUnusedExpression = function(node) {
    var kind = node.kind;

    if (kind === NodeKind.HOOK) {
      this.checkUnusedExpression(node.hookTrue());
      this.checkUnusedExpression(node.hookFalse());
    } else if (kind === NodeKind.SEQUENCE) {
      if (node.hasChildren()) {
        this.checkUnusedExpression(node.lastChild());
      }
    } else if (!node.range.isEmpty() && !node.type.isIgnored(this.cache) && !in_NodeKind.isCall(kind) && !in_NodeKind.isUnaryStorageOperator(kind) && !in_NodeKind.isBinaryStorageOperator(kind)) {
      semanticWarningUnusedExpression(this.log, node.range);
    }
  };

  Resolver.prototype.checkStorage = function(node) {
    if (node.type.isIgnored(this.cache)) {
      return;
    }

    if (!in_NodeKind.isStorage(node.kind)) {
      semanticErrorBadStorage(this.log, node.range);
      return;
    }

    if (node.symbol.isConst()) {
      semanticErrorStorageToProtectedSymbol(this.log, node.range, 'const');
    } else if (node.symbol.isFinal()) {
      semanticErrorStorageToProtectedSymbol(this.log, node.range, 'final');
    }
  };

  Resolver.prototype.checkStorageOperator = function(node) {
    var parent = node.parent;

    while (parent.kind === NodeKind.SEQUENCE) {
      parent = parent.parent;
    }

    if (parent.kind !== NodeKind.EXPRESSION && parent.kind !== NodeKind.FOR) {
      semanticErrorNestedStorageOperator(this.log, node.range);
    }
  };

  Resolver.prototype.checkConversion = function(to, node, kind) {
    var from = node.type;

    if (from === null) {
      throw new Error('assert from != null (src/resolver/resolver.sk:830:5)');
    }

    if (to === null) {
      throw new Error('assert to != null (src/resolver/resolver.sk:831:5)');
    }

    if (from.isIgnored(this.cache) || to.isIgnored(this.cache)) {
      return;
    }

    if (from.isVoid(this.cache) && to.isVoid(this.cache)) {
      semanticErrorUnexpectedExpression(this.log, node.range, to);
      node.type = this.cache.errorType;
      return;
    }

    if (from === to) {
      if (node.symbol !== null && in_SymbolKind.isFunction(node.symbol.kind) && !in_NodeKind.isCall(node.kind) && node.parent.kind !== NodeKind.CALL) {
        semanticErrorMustCallFunctionReference(this.log, node.range);
        node.type = this.cache.errorType;
      }

      return;
    }

    if (to.isEnumFlags() && node.kind === NodeKind.INT && node.asInt() === 0) {
      from = to;
    }

    if (kind === CastKind.IMPLICIT_CAST && !this.cache.canImplicitlyConvert(from, to) || kind === CastKind.EXPLICIT_CAST && !this.cache.canExplicitlyConvert(from, to)) {
      semanticErrorIncompatibleTypes(this.log, node.range, from, to, this.cache.canExplicitlyConvert(from, to));
      node.type = this.cache.errorType;
      return;
    }

    if (kind === CastKind.IMPLICIT_CAST) {
      if (node.kind === NodeKind.TYPE) {
        return;
      }

      var value = new Node(NodeKind.NULL);
      value.become(node);
      node.become(Node.createImplicitCast(Node.createType(to), value).withType(to).withRange(node.range));
    }
  };

  Resolver.prototype.unexpectedStatement = function(node) {
    if (!node.range.isEmpty()) {
      semanticErrorUnexpectedStatement(this.log, node.range);
    }
  };

  Resolver.prototype.checkDeclarationLocation = function(node, allowDeclaration) {
    if (node.parent === null) {
      throw new Error('assert node.parent != null (src/resolver/resolver.sk:894:5)');
    }

    var parent = null;

    for (parent = node.parent; parent !== null; parent = parent.parent) {
      if (parent.symbol !== null && parent.symbol.hasLocationError()) {
        break;
      }

      var kind = parent.kind;

      if (kind !== NodeKind.PROGRAM && kind !== NodeKind.FILE && kind !== NodeKind.MODIFIER && kind !== NodeKind.BLOCK && kind !== NodeKind.NAMESPACE && kind !== NodeKind.EXTENSION && (allowDeclaration !== AllowDeclaration.ALLOW_TOP_OR_OBJECT_LEVEL || !in_NodeKind.isObject(kind))) {
        this.unexpectedStatement(node);
        break;
      }
    }

    if (parent !== null) {
      node.symbol.flags |= SymbolFlag.HAS_LOCATION_ERROR;
    }
  };

  Resolver.prototype.checkStatementLocation = function(node) {
    if (node.parent === null) {
      throw new Error('assert node.parent != null (src/resolver/resolver.sk:916:5)');
    }

    for (var parent = node.parent; parent !== null; parent = parent.parent) {
      var kind = parent.kind;

      if (kind === NodeKind.FILE) {
        this.unexpectedStatement(node);
        break;
      }

      if (kind === NodeKind.BLOCK) {
        var parentKind = parent.parent.kind;

        if (!in_NodeKind.isNamedBlockDeclaration(parentKind) && parentKind !== NodeKind.FILE) {
          break;
        }
      }
    }
  };

  Resolver.prototype.checkAccessToThis = function(range) {
    if (this.context.functionSymbol !== null && in_SymbolKind.isInstance(this.context.functionSymbol.kind)) {
      return true;
    }

    if (this.context.symbolForThis !== null) {
      semanticErrorStaticThis(this.log, range, 'this');
    } else {
      semanticErrorUnexpectedThis(this.log, range, 'this');
    }

    return false;
  };

  Resolver.prototype.checkAccessToInstanceSymbol = function(node) {
    var symbol = node.symbol;
    var enclosingSymbol = symbol.enclosingSymbol;
    var functionSymbol = this.context.functionSymbol;

    if (!in_SymbolKind.isInstance(symbol.kind) && symbol.kind !== SymbolKind.OBJECT_PARAMETER) {
      return true;
    }

    if (functionSymbol !== null && in_SymbolKind.isInstance(functionSymbol.kind) && (functionSymbol.enclosingSymbol === enclosingSymbol || functionSymbol.enclosingSymbol.type.hasBaseSymbol(enclosingSymbol))) {
      return true;
    }

    if (this.context.symbolForThis === null) {
      semanticErrorUnexpectedThis(this.log, node.range, symbol.name);
      return false;
    }

    if (symbol.kind === SymbolKind.OBJECT_PARAMETER && this.context.symbolForThis === enclosingSymbol) {
      for (var parent = node.parent; !in_NodeKind.isNamedBlockDeclaration(parent.kind); parent = parent.parent) {
        if (parent.kind === NodeKind.NODE_LIST && (in_NodeKind.isObject(parent.parent.kind) || parent.parent.kind === NodeKind.EXTENSION) && parent.parent.symbol === enclosingSymbol && (parent === enclosingSymbol.node.objectParameters() || parent === parent.parent.baseTypes())) {
          return true;
        }

        if ((parent.kind === NodeKind.VARIABLE || in_NodeKind.isFunction(parent.kind)) && in_SymbolKind.isInstance(parent.symbol.kind)) {
          return true;
        }
      }
    }

    semanticErrorStaticThis(this.log, node.range, symbol.name);
    return false;
  };

  Resolver.prototype.collectAndResolveBaseTypes = function(symbol) {
    var baseTypes = [];

    for (var node = symbol.node; node !== null; node = node.sibling) {
      var isObject = in_NodeKind.isObject(node.kind);

      if (isObject || node.kind === NodeKind.EXTENSION) {
        var types = node.baseTypes();

        if (types !== null && types.hasChildren()) {
          var index = 0;

          for (var i = 0; i < types.children.length; i = i + 1 | 0) {
            var baseType = types.children[i];
            this.resolveAsParameterizedType(baseType);

            if (isObject) {
              baseTypes.splice(index, 0, baseType);
              index = index + 1 | 0;
            } else if (symbol.type.isClass() && baseType.type.isClass()) {
              semanticErrorBaseClassInExtension(this.log, baseType.range);
            } else {
              baseTypes.push(baseType);
            }
          }
        }
      }
    }

    return baseTypes;
  };

  Resolver.prototype.checkNoBaseTypes = function(symbol, what) {
    var baseTypes = this.collectAndResolveBaseTypes(symbol);

    for (var i = 0; i < baseTypes.length; i = i + 1 | 0) {
      semanticErrorUnexpectedBaseType(this.log, baseTypes[i].range, what);
    }
  };

  Resolver.prototype.createDefaultValue = function(type, range) {
    if (type.isReference()) {
      return Node.createNull().withType(type);
    }

    if (type.isBool(this.cache)) {
      return Node.createBool(false).withType(type);
    }

    if (type.isInt(this.cache)) {
      return Node.createInt(0).withType(type);
    }

    if (type.isFloat(this.cache)) {
      return Node.createFloat(0).withType(type);
    }

    if (type.isDouble(this.cache)) {
      return Node.createDouble(0).withType(type);
    }

    if (type.isString(this.cache)) {
      return Node.createString('').withType(type);
    }

    if (type.isEnum()) {
      return Node.createInt(0).withType(type);
    }

    if (!type.isIgnored(this.cache)) {
      semanticErrorNoDefaultValue(this.log, range, type);
    }

    return Node.createError().withType(this.cache.errorType);
  };

  Resolver.prototype.needsTypeContext = function(node) {
    return node.kind === NodeKind.LIST || node.kind === NodeKind.MAP || node.kind === NodeKind.DOT && node.dotTarget() === null || node.kind === NodeKind.COMPLEMENT && this.needsTypeContext(node.unaryValue()) || node.kind === NodeKind.HOOK && this.needsTypeContext(node.hookTrue()) && this.needsTypeContext(node.hookFalse());
  };

  Resolver.prototype.addAutoGeneratedMember = function(type, name) {
    var symbol = this.createSymbol(name, SymbolKind.AUTOMATIC);
    symbol.enclosingSymbol = type.symbol;
    type.addMember(new Member(symbol));
  };

  Resolver.prototype.forbidBlockDeclarationModifiers = function(symbol, where) {
    this.unexpectedModifierIfPresent(symbol, SymbolFlag.CONST, where);
    this.unexpectedModifierIfPresent(symbol, SymbolFlag.FINAL, where);
    this.unexpectedModifierIfPresent(symbol, SymbolFlag.INLINE, where);
    this.unexpectedModifierIfPresent(symbol, SymbolFlag.OVERRIDE, where);
    this.unexpectedModifierIfPresent(symbol, SymbolFlag.PURE, where);
    this.unexpectedModifierIfPresent(symbol, SymbolFlag.STATIC, where);
    this.unexpectedModifierIfPresent(symbol, SymbolFlag.VIRTUAL, where);
    this.forbidImportAndExportTogether(symbol);
  };

  Resolver.prototype.initializeNamespace = function(symbol) {
    if (!symbol.type.isNamespace()) {
      throw new Error('assert symbol.type.isNamespace() (src/resolver/resolver.sk:1063:5)');
    }

    this.forbidBlockDeclarationModifiers(symbol, 'on a namespace declaration');
    this.checkNoBaseTypes(symbol, 'A namespace');
  };

  Resolver.prototype.initializeEnum = function(symbol) {
    if (!symbol.type.isEnum()) {
      throw new Error('assert symbol.type.isEnum() (src/resolver/resolver.sk:1069:5)');
    }

    this.forbidBlockDeclarationModifiers(symbol, 'on an enum declaration');
    this.checkNoBaseTypes(symbol, 'An enum');

    if (symbol.type.findMember('toString') === null && !symbol.isImport()) {
      this.addAutoGeneratedMember(symbol.type, 'toString');
    }
  };

  Resolver.prototype.resolveBaseTypes = function(symbol) {
    var type = symbol.type;
    var baseTypes = this.collectAndResolveBaseTypes(symbol);
    var unmergedMembers = Object.create(null);
    var baseTypeSymbols = [];

    if (type.relevantTypes !== null) {
      throw new Error('assert type.relevantTypes == null (src/resolver/resolver.sk:1084:5)');
    }

    type.relevantTypes = [];

    for (var i = 0; i < baseTypes.length; i = i + 1 | 0) {
      var base = baseTypes[i];
      var baseType = base.type;

      if (baseType.isIgnored(this.cache)) {
        continue;
      }

      if (symbol.kind === SymbolKind.CLASS && baseType.isClass() && !baseType.isPrimitive()) {
        if (baseTypes.indexOf(base) !== 0) {
          semanticErrorClassBaseNotFirst(this.log, base.range, baseType);
          continue;
        }
      } else if (!baseType.isInterface()) {
        semanticErrorBadBaseType(this.log, base.range, baseType);
        continue;
      }

      if (baseTypeSymbols.indexOf(baseType.symbol) !== -1) {
        semanticErrorDuplicateBaseType(this.log, base.range, baseType);
        continue;
      }

      if (baseType.hasBaseType(type)) {
        throw new Error('assert !baseType.hasBaseType(type) (src/resolver/resolver.sk:1116:7)');
      }

      baseTypeSymbols.push(baseType.symbol);
      type.relevantTypes.push(baseType);

      var members = baseType.sortedMembers();

      for (var j = 0; j < members.length; j = j + 1 | 0) {
        var member = members[j];
        var memberSymbol = member.symbol;
        var unmerged = in_StringMap.getOrDefault(unmergedMembers, memberSymbol.name, null);

        if (memberSymbol.kind === SymbolKind.OBJECT_PARAMETER) {
          continue;
        }

        if (unmerged === null) {
          unmergedMembers[memberSymbol.name] = member;
        } else if (unmerged.symbol.enclosingSymbol !== memberSymbol) {
          var combined = this.createSymbol(memberSymbol.name, SymbolKind.UNMERGED);
          combined.enclosingSymbol = symbol;
          combined.identicalMembers = [unmerged, member];
          unmergedMembers[memberSymbol.name] = new Member(combined);
        } else {
          if (unmerged.symbol.kind !== SymbolKind.UNMERGED) {
            throw new Error('assert unmerged.symbol.kind == .UNMERGED (src/resolver/resolver.sk:1149:11)');
          }

          unmerged.symbol.identicalMembers.push(member);
        }
      }
    }

    var baseMembers = in_StringMap.values(unmergedMembers);

    for (var i = 0; i < baseMembers.length; i = i + 1 | 0) {
      var member = baseMembers[i];
      var memberSymbol = member.symbol;
      var existing = type.findMember(memberSymbol.name);

      if (existing !== null) {
        if (existing.symbol.overriddenMember !== null) {
          throw new Error('assert existing.symbol.overriddenMember == null (src/resolver/resolver.sk:1165:9)');
        }

        existing.symbol.overriddenMember = member;
        this.insertOperatorOverloads(symbol, memberSymbol, existing.symbol);
      } else if (memberSymbol.name !== 'new') {
        type.addMember(member);

        if (memberSymbol.kind === SymbolKind.UNMERGED) {
          for (var j = 0; j < memberSymbol.identicalMembers.length; j = j + 1 | 0) {
            this.insertOperatorOverloads(symbol, memberSymbol.identicalMembers[j].symbol, memberSymbol);
          }
        } else {
          this.insertOperatorOverloads(symbol, memberSymbol, memberSymbol);
        }
      }
    }
  };

  Resolver.prototype.insertOperatorOverloads = function(target, proxy, source) {
    var kinds = proxy.operatorOverloadKinds;

    if (kinds !== null) {
      for (var i = 0; i < kinds.length; i = i + 1 | 0) {
        var kind = kinds[i];
        var overloads = target.operatorOverloadsForKind(kind);

        if (!(overloads.indexOf(source) !== -1)) {
          overloads.push(source);
          source.registerOperatorOverload(kind);
        }
      }
    }
  };

  Resolver.prototype.resolveTypeParameters = function(symbol, node) {
    if (node !== null && node.hasChildren()) {
      symbol.parameters = [];
      this.resolveNodes(node.children);

      for (var i = 0; i < node.children.length; i = i + 1 | 0) {
        symbol.parameters.push(node.children[i].symbol);
      }

      symbol.sortParametersByDependencies();
    }
  };

  Resolver.prototype.initializeObject = function(symbol) {
    if (!symbol.type.isObject()) {
      throw new Error('assert symbol.type.isObject() (src/resolver/resolver.sk:1215:5)');
    }

    this.forbidBlockDeclarationModifiers(symbol, 'on an object declaration');

    var node = symbol.node;
    var type = symbol.type;
    this.resolveTypeParameters(symbol, node.objectParameters());

    if (!type.isInterface() && type.$constructor() === null && !symbol.isImport()) {
      this.addAutoGeneratedMember(type, 'new');
    }

    this.resolveBaseTypes(symbol);
  };

  Resolver.prototype.createFunctionType = function(symbol, resultType, argumentTypes) {
    if (symbol.hasParameters()) {
      symbol.type = new Type(symbol);
      argumentTypes.unshift(resultType);
      symbol.type.relevantTypes = argumentTypes;
    } else {
      symbol.type = this.cache.functionType(resultType, argumentTypes);
    }
  };

  Resolver.prototype.initializeFunction = function(symbol) {
    var enclosingSymbol = symbol.enclosingSymbol;

    if (enclosingSymbol !== null && in_SymbolKind.isTypeWithInstances(enclosingSymbol.kind) && (this.context.symbolForThis === null || this.context.symbolForThis !== enclosingSymbol)) {
      throw new Error('assert enclosingSymbol == null || !enclosingSymbol.kind.isTypeWithInstances() ||\n      context.symbolForThis != null && context.symbolForThis == enclosingSymbol (src/resolver/resolver.sk:1246:5)');
    }

    this.unexpectedModifierIfPresent(symbol, SymbolFlag.CONST, 'on a function declaration');
    this.unexpectedModifierIfPresent(symbol, SymbolFlag.FINAL, 'on a function declaration');
    this.checkMemberSymbol(symbol);

    var node = symbol.node;
    var resultType = null;

    if (node.kind === NodeKind.FUNCTION) {
      var result = node.functionResult();
      this.resolveTypeParameters(symbol, node.functionParameters());
      this.resolveAsParameterizedType(result);
      this.checkIsValidFunctionReturnType(result);
      resultType = result.type;
    } else {
      if (node.kind !== NodeKind.CONSTRUCTOR) {
        throw new Error('assert node.kind == .CONSTRUCTOR (src/resolver/resolver.sk:1267:7)');
      }

      resultType = this.cache.ensureTypeIsParameterized(enclosingSymbol.type);

      var members = enclosingSymbol.type.sortedMembers();

      for (var i = 0; i < members.length; i = i + 1 | 0) {
        var memberSymbol = members[i].symbol;
        var isImport = memberSymbol.isImport() || enclosingSymbol.isImport() && !memberSymbol.isFromExtension();

        if (!isImport && Resolver.isAbstractFunction(memberSymbol)) {
          enclosingSymbol.reasonForAbstract = memberSymbol;
          enclosingSymbol.flags |= SymbolFlag.ABSTRACT;
          break;
        }
      }

      this.unexpectedModifierIfPresent(symbol, SymbolFlag.STATIC, 'on a constructor');
      this.unexpectedModifierIfPresent(symbol, SymbolFlag.VIRTUAL, 'on a constructor');
      this.unexpectedModifierIfPresent(symbol, SymbolFlag.OVERRIDE, 'on a constructor');

      if (enclosingSymbol.isImport() && !symbol.isImport()) {
        if (node.superInitializer() !== null || node.memberInitializers() !== null) {
          semanticErrorStaticConstructorInitializerList(this.log, Resolver.initializerListRange(node));
        }

        node.become(Node.createFunction(node.declarationName().replaceWith(null), node.functionArguments().replaceWith(null), node.functionBlock().replaceWith(null), Node.createType(resultType), null).withSymbol(symbol).withRange(node.range));
        symbol.kind = SymbolKind.GLOBAL_FUNCTION;
        symbol.flags |= SymbolFlag.STATIC;
      }
    }

    var $arguments = node.functionArguments();
    this.resolve($arguments, null);
    symbol.type = this.cache.errorType;

    if (!resultType.isError(this.cache)) {
      var argumentTypes = [];

      for (var i = 0; i < $arguments.children.length; i = i + 1 | 0) {
        var type = $arguments.children[i].symbol.type;

        if (type.isError(this.cache)) {
          return;
        }

        argumentTypes.push(type);
      }

      this.createFunctionType(symbol, resultType, argumentTypes);
    }

    var overriddenMember = symbol.overriddenMember;

    if (!symbol.isImport() && enclosingSymbol !== null && enclosingSymbol.isImport()) {
      this.unexpectedModifierIfPresent(symbol, SymbolFlag.VIRTUAL, 'on a non-imported method for an imported type');
      this.unexpectedModifierIfPresent(symbol, SymbolFlag.OVERRIDE, 'on a non-imported method for an imported type');
    } else if (overriddenMember !== null && symbol.kind !== SymbolKind.CONSTRUCTOR_FUNCTION) {
      this.initializeMember(overriddenMember);

      var base = overriddenMember.type;
      var derived = symbol.type;

      if (!base.isIgnored(this.cache) && !derived.isIgnored(this.cache)) {
        var overriddenSymbol = overriddenMember.symbol;
        var declarationRange = node.declarationName().range;
        var overriddenDeclarationRange = overriddenSymbol.node !== null ? overriddenSymbol.nameRange() : Range.EMPTY;

        if (!base.isFunction() || !in_SymbolKind.isInstance(overriddenSymbol.kind) || !in_SymbolKind.isInstance(symbol.kind)) {
          semanticErrorBadOverride(this.log, declarationRange, symbol.name, overriddenSymbol.enclosingSymbol.type, overriddenDeclarationRange);
        } else if (base !== derived) {
          semanticErrorOverrideDifferentTypes(this.log, declarationRange, symbol.name, base, derived, overriddenDeclarationRange);
        } else if (!symbol.isOverride()) {
          semanticErrorModifierMissingOverride(this.log, declarationRange, symbol.name, overriddenDeclarationRange);
        } else if (!overriddenSymbol.isVirtual()) {
          semanticErrorCannotOverrideNonVirtual(this.log, declarationRange, symbol.name, overriddenDeclarationRange);
        } else if (symbol.isPure() !== overriddenSymbol.isPure()) {
          semanticErrorOverridePurityMismatch(this.log, declarationRange, symbol.name, overriddenDeclarationRange);
        } else {
          this.redundantModifierIfPresent(symbol, SymbolFlag.VIRTUAL, 'on an overriding function');
        }
      }

      symbol.flags |= SymbolFlag.VIRTUAL;
    } else if (!symbol.isObjectMember()) {
      this.unexpectedModifierIfPresent(symbol, SymbolFlag.VIRTUAL, 'outside an object declaration');
      this.unexpectedModifierIfPresent(symbol, SymbolFlag.OVERRIDE, 'outside an object declaration');
    } else {
      if (!in_SymbolKind.isInstance(symbol.kind)) {
        this.unexpectedModifierIfPresent(symbol, SymbolFlag.VIRTUAL, 'on a non-instance function');
      }

      if (symbol.isOverride()) {
        symbol.flags |= SymbolFlag.VIRTUAL;
      }

      this.unexpectedModifierIfPresent(symbol, SymbolFlag.OVERRIDE, "on a function that doesn't override anything");
    }
  };

  Resolver.prototype.initializeVariable = function(symbol) {
    this.unexpectedModifierIfPresent(symbol, SymbolFlag.INLINE, 'on a variable declaration');
    this.unexpectedModifierIfPresent(symbol, SymbolFlag.OVERRIDE, 'on a variable declaration');
    this.unexpectedModifierIfPresent(symbol, SymbolFlag.PURE, 'on a variable declaration');
    this.unexpectedModifierIfPresent(symbol, SymbolFlag.VIRTUAL, 'on a variable declaration');
    this.checkMemberSymbol(symbol);

    if (symbol.isConst()) {
      this.redundantModifierIfPresent(symbol, SymbolFlag.FINAL, 'on a const variable declaration');
    }

    var node = symbol.node;
    var variableType = node.variableType();

    if (variableType === null) {
      if (node.parent.kind === NodeKind.VARIABLE_CLUSTER) {
        variableType = node.parent.clusterType().clone();
      } else {
        if (!symbol.isEnumValue()) {
          throw new Error('assert symbol.isEnumValue() (src/resolver/resolver.sk:1416:9)');
        }

        var enclosingSymbol = symbol.enclosingSymbol;
        var type = enclosingSymbol.type;
        variableType = Node.createType(type).withSymbol(enclosingSymbol);
        symbol.flags |= SymbolFlag.CONST | SymbolFlag.STATIC | enclosingSymbol.flags & (SymbolFlag.IMPORT | SymbolFlag.EXPORT);

        var variableValue = node.variableValue();

        if (variableValue !== null) {
          this.resolveAsParameterizedExpressionWithTypeContext(variableValue, type);
          this.checkConversion(this.cache.intType, variableValue, CastKind.IMPLICIT_CAST);
          this.constantFolder.foldConstants(variableValue);

          if (variableValue.kind === NodeKind.INT) {
            symbol.constant = variableValue.content;
          } else {
            variableType = Node.createType(this.cache.errorType);

            if (!variableValue.type.isIgnored(this.cache)) {
              semanticErrorBadIntegerConstant(this.log, variableValue.range, variableValue.type);
            }
          }
        } else {
          var index = node.parent.children.indexOf(node);

          if (index > 0) {
            var previous = node.parent.children[index - 1 | 0].symbol;
            this.initializeSymbol(previous);

            if (!previous.type.isIgnored(this.cache)) {
              var constant = previous.constant.asInt();
              var value = type.isEnumFlags() ? constant * 2 : constant + 1;

              if (value === (value | 0)) {
                symbol.constant = new IntContent(value | 0);
              } else {
                semanticErrorEnumValueOutOfRange(this.log, node.range, symbol.name);
                variableType = Node.createType(this.cache.errorType);
              }
            } else {
              variableType = Node.createType(this.cache.errorType);
            }
          } else {
            symbol.constant = new IntContent(type.isEnumFlags() ? 1 : 0);
          }
        }
      }

      if (variableType === null) {
        throw new Error('assert variableType != null (src/resolver/resolver.sk:1467:7)');
      }

      node.replaceChild(1, variableType);
    }

    if (variableType.kind === NodeKind.VAR) {
      var value = node.variableValue();

      if (value === null) {
        semanticErrorVarMissingValue(this.log, node.declarationName().range);
        symbol.type = this.cache.errorType;
      } else {
        this.resolveAsParameterizedExpression(value);

        var type = value.type;

        if (type.isNull(this.cache) || type.isVoid(this.cache)) {
          semanticErrorVarBadType(this.log, node.declarationName().range, type);
          symbol.type = this.cache.errorType;
        } else {
          symbol.type = type;
        }
      }
    } else {
      this.resolveAsParameterizedType(variableType);
      this.checkIsValidVariableType(variableType);
      symbol.type = variableType.type;

      if (node.parent.kind === NodeKind.VARIABLE_CLUSTER && node.parent.clusterType().type === null) {
        node.parent.replaceChild(0, variableType.clone());
      }
    }

    var overriddenMember = symbol.overriddenMember;

    if (overriddenMember !== null) {
      this.initializeMember(overriddenMember);

      var base = overriddenMember.type;
      var derived = symbol.type;

      if (!base.isIgnored(this.cache) && !derived.isIgnored(this.cache)) {
        semanticErrorBadOverride(this.log, node.declarationName().range, symbol.name, overriddenMember.symbol.enclosingSymbol.type, overriddenMember.symbol.nameRange());
      }
    }

    if (symbol.isConst() && !symbol.isEnumValue()) {
      var value = node.variableValue();

      if (value === null) {
        semanticErrorConstMissingValue(this.log, node.declarationName().range);
      } else {
        this.resolveAsParameterizedExpressionWithConversion(value, symbol.type, CastKind.IMPLICIT_CAST);
        this.constantFolder.foldConstants(value);

        if (in_NodeKind.isConstant(value.kind)) {
          symbol.constant = value.content;
        } else if (!value.type.isIgnored(this.cache) && !symbol.type.isIgnored(this.cache)) {
          semanticErrorNonConstantConstValue(this.log, value.range);
          value.type = this.cache.errorType;
        }
      }
    }
  };

  Resolver.prototype.initializeParameter = function(symbol) {
    var type = new Type(symbol);
    var bound = symbol.node.parameterBound();
    symbol.type = type;

    if (bound !== null) {
      this.resolveAsParameterizedType(bound);

      var boundType = bound.type;

      if (boundType.isIgnored(this.cache)) {
        symbol.type = this.cache.errorType;
      } else if (!boundType.isInterface()) {
        semanticErrorBadTypeParameterBound(this.log, bound.range, boundType);
      } else {
        if (type.relevantTypes !== null) {
          throw new Error('assert type.relevantTypes == null (src/resolver/resolver.sk:1558:9)');
        }

        type.relevantTypes = [boundType];
        type.copyMembersFrom(boundType);
      }
    }
  };

  Resolver.prototype.initializeAlias = function(symbol) {
    this.forbidBlockDeclarationModifiers(symbol, 'on an alias declaration');

    var value = symbol.node.aliasValue();
    this.resolveAsType(value);
    symbol.type = value.type;
  };

  Resolver.prototype.initializeDefine = function(symbol) {
    symbol.type = this.cache.boolType;
  };

  Resolver.prototype.initializeDeclaration = function(symbol) {
    if (symbol.isUninitialized()) {
      var isAutomatic = symbol.kind === SymbolKind.AUTOMATIC;
      symbol.flags |= SymbolFlag.INITIALIZING;

      if (isAutomatic) {
        if (symbol.name === 'new') {
          this.generateDefaultConstructor(symbol);
        } else if (symbol.name === 'toString') {
          this.generateDefaultToString(symbol);
        } else {
          throw new Error('assert false (src/resolver/resolver.sk:1591:14)');
        }

        if (symbol.node === null) {
          symbol.type = this.cache.errorType;
          symbol.flags = symbol.flags & ~SymbolFlag.INITIALIZING | SymbolFlag.INITIALIZED;
          return;
        }
      }

      var oldContext = this.context;
      var oldTypeContext = this.typeContext;
      var oldResultType = this.resultType;
      this.context = ResolveContext.fromNode(symbol.node);
      this.typeContext = null;
      this.resultType = null;

      switch (symbol.kind) {
      case 11:
        this.initializeNamespace(symbol);
        break;

      case 12:
      case 13:
        this.initializeEnum(symbol);
        break;

      case 14:
      case 15:
        this.initializeObject(symbol);
        break;

      case 16:
      case 17:
      case 18:
        this.initializeFunction(symbol);
        break;

      case 20:
      case 21:
      case 22:
        this.initializeVariable(symbol);
        break;

      case 8:
      case 9:
        this.initializeParameter(symbol);
        break;

      case 7:
        this.initializeAlias(symbol);
        break;

      case 1:
        this.initializeDefine(symbol);
        break;

      case 0:
        break;

      default:
        throw new Error('assert false (src/resolver/resolver.sk:1619:19)');
        break;
      }

      this.typeContext = oldTypeContext;
      this.resultType = oldResultType;

      if (symbol.type === null) {
        throw new Error('assert symbol.type != null (src/resolver/resolver.sk:1625:7)');
      }

      if (!symbol.isInitializing()) {
        throw new Error('assert symbol.isInitializing() (src/resolver/resolver.sk:1626:7)');
      }

      if (symbol.isInitialized()) {
        throw new Error('assert !symbol.isInitialized() (src/resolver/resolver.sk:1627:7)');
      }

      symbol.flags = symbol.flags & ~SymbolFlag.INITIALIZING | SymbolFlag.INITIALIZED;

      if (isAutomatic) {
        this.resolve(symbol.node, null);
      }

      this.context = oldContext;
      this.checkAnnotations(symbol);
    }
  };

  Resolver.prototype.initializePotentiallyDuplicatedMember = function(member, range) {
    var symbol = member.symbol;

    if (symbol.kind === SymbolKind.AMBIGUOUS) {
      var names = [];

      for (var i = 0; i < symbol.identicalMembers.length; i = i + 1 | 0) {
        names.push(symbol.identicalMembers[i].symbol.fullName());
      }

      semanticErrorAmbiguousSymbol(this.log, range, symbol.name, names);
      member.type = this.cache.errorType;
      symbol.type = this.cache.errorType;
      return;
    }

    this.initializeMember(member);
  };

  Resolver.prototype.initializeMember = function(member) {
    if (member.type !== null) {
      return;
    }

    if (trace.GENERICS) {
      trace.log('initializeMember ' + member.symbol.fullName() + (member.parameterizedType !== null ? ' on ' + member.parameterizedType : ''));
      trace.indent();
    }

    if (member.dependency !== null) {
      if (member.dependency.symbol !== member.symbol) {
        throw new Error('assert member.dependency.symbol == member.symbol (src/resolver/resolver.sk:1679:7)');
      }

      this.initializeMember(member.dependency);
      member.type = member.dependency.type;
    } else {
      var memberSymbol = member.symbol;
      this.initializeSymbol(memberSymbol);
      member.type = memberSymbol.type;

      if (memberSymbol.kind === SymbolKind.FORWARDED) {
        if (member.type !== memberSymbol.overriddenMember.type) {
          throw new Error('assert member.type == memberSymbol.overriddenMember.type (src/resolver/resolver.sk:1691:9)');
        }

        member.symbol = memberSymbol.overriddenMember.symbol;
      }
    }

    var parameterizedType = member.parameterizedType;

    if (parameterizedType !== null && parameterizedType.isParameterized()) {
      member.type = this.cache.substitute(member.type, parameterizedType.symbol.parameters, parameterizedType.substitutions);
    }

    if (trace.GENERICS) {
      trace.dedent();
    }
  };

  Resolver.prototype.checkAnnotations = function(symbol) {
    if (in_SymbolKind.isTypeWithInstances(symbol.kind)) {
      var members = symbol.type.sortedMembers();

      for (var i = 0; i < members.length; i = i + 1 | 0) {
        var member = members[i];

        if (member.symbol.kind === SymbolKind.INSTANCE_FUNCTION && member.symbol.hasAnnotations()) {
          this.initializeMember(member);
        }
      }
    }

    if (!symbol.hasAnnotations()) {
      return;
    }

    var node = symbol.node.parent;

    if (node.kind === NodeKind.VARIABLE_CLUSTER) {
      node = node.parent;
    }

    for (; node.kind === NodeKind.MODIFIER; node = node.parent) {
      var modifierName = node.modifierName();
      var name = modifierName.asString();

      if (name.charCodeAt(0) === 64) {
        if (name in Resolver.operatorAnnotationMap) {
          this.registerOperatorOverload(symbol, node, Resolver.operatorAnnotationMap[name]);
        } else if (name === '@NeedsInclude') {
          this.registerNeedsInclude(symbol, node);
        } else if (name === '@EmitAs') {
          this.registerEmitAs(symbol, node);
        } else if (name === '@EntryPoint') {
          this.registerEntryPoint(symbol, node);
        } else if (name === '@ExternC') {
          this.registerExternC(symbol, node);
        } else {
          semanticErrorUnknownAnnotation(this.log, modifierName.range, name);
        }
      }
    }
  };

  Resolver.prototype.registerEmitAs = function(symbol, node) {
    var content = this.requireSingleStringLiteral(node);

    if (content !== null) {
      if (symbol.emitAs !== null) {
        semanticErrorDuplicateEmitAs(this.log, Range.span(node.modifierName().range, node.modifierArguments().range));
      } else {
        symbol.emitAs = content;
      }
    }
  };

  Resolver.prototype.registerEntryPoint = function(symbol, node) {
    if (symbol.kind !== SymbolKind.GLOBAL_FUNCTION) {
      semanticErrorNonGlobalEntryPoint(this.log, node.modifierName().range);
      return;
    }

    this.forbidAnnotationArguments(node);
    symbol.flags |= SymbolFlag.ENTRY_POINT;
  };

  Resolver.prototype.registerExternC = function(symbol, node) {
    if (symbol.kind !== SymbolKind.GLOBAL_FUNCTION && symbol.kind !== SymbolKind.GLOBAL_VARIABLE || symbol.enclosingSymbol !== this.cache.globalType.symbol) {
      semanticErrorNonTopLevelExternC(this.log, node.modifierName().range);
      return;
    }

    this.forbidAnnotationArguments(node);
    symbol.flags |= SymbolFlag.EXTERN_C;
  };

  Resolver.prototype.requireSingleStringLiteral = function(node) {
    var $arguments = node.annotationArguments();

    if ($arguments === null || $arguments.children.length !== 1) {
      var annotationName = node.annotationName();
      var range = $arguments === null ? annotationName.range : $arguments.range;
      semanticErrorUnexpectedAnnotationArgumentCount(this.log, range, annotationName.asString(), 1);
      return null;
    }

    var value = $arguments.children[0];
    this.resolveAsParameterizedExpressionWithConversion(value, this.cache.stringType, CastKind.IMPLICIT_CAST);
    this.constantFolder.foldConstants(value);

    if (value.type.isError(this.cache)) {
      return null;
    }

    if (value.kind !== NodeKind.STRING) {
      semanticErrorNonConstantAnnotationString(this.log, value.range);
      return null;
    }

    return new StringContent(value.asString());
  };

  Resolver.prototype.registerNeedsInclude = function(symbol, node) {
    var content = this.requireSingleStringLiteral(node);

    if (content !== null) {
      symbol.addNeededInclude(content.value);
    }
  };

  Resolver.prototype.forbidAnnotationArguments = function(node) {
    var $arguments = node.annotationArguments();

    if ($arguments !== null) {
      semanticErrorUnexpectedAnnotationArgumentCount(this.log, $arguments.range, node.annotationName().asString(), 0);
    }
  };

  Resolver.prototype.registerOperatorOverload = function(symbol, node, kind) {
    if (symbol.kind !== SymbolKind.INSTANCE_FUNCTION) {
      semanticErrorOperatorOnNonInstanceFunction(this.log, node.modifierName().range);
      return;
    }

    var functionArguments = symbol.node.functionArguments();
    var argumentCount = functionArguments.children.length;
    var expectedCount = in_NodeKind.isUnaryOperator(kind) ? 0 : in_NodeKind.isBinaryOperator(kind) ? 1 : 2;

    if (argumentCount !== expectedCount) {
      semanticErrorOperatorArgumentCount(this.log, functionArguments.range, expectedCount, argumentCount, node.modifierName().asString());
      return;
    }

    this.forbidAnnotationArguments(node);

    if (symbol.type.isIgnored(this.cache)) {
      return;
    }

    if (!symbol.type.isFunction()) {
      throw new Error('assert symbol.type.isFunction() (src/resolver/resolver.sk:1857:5)');
    }

    symbol.registerOperatorOverload(kind);
    symbol.enclosingSymbol.operatorOverloadsForKind(kind).push(symbol);
  };

  Resolver.prototype.createSymbol = function(name, kind) {
    var symbol = new Symbol(name, kind);
    this.allSymbols.push(symbol);
    return symbol;
  };

  Resolver.prototype.findModifierName = function(symbol, flag) {
    var node = symbol.node.parent;

    if (node.kind === NodeKind.VARIABLE_CLUSTER) {
      node = node.parent;
    }

    while (node !== null && node.kind === NodeKind.MODIFIER) {
      var modifierName = node.modifierName();

      if (Resolver.nameToSymbolFlag[modifierName.asString()] === flag) {
        return modifierName;
      }

      node = node.parent;
    }

    return null;
  };

  Resolver.prototype.checkMemberSymbol = function(symbol) {
    this.forbidImportAndExportTogether(symbol);

    var enclosingSymbol = symbol.enclosingSymbol;

    if (enclosingSymbol !== null) {
      if (!in_SymbolKind.isTypeWithInstances(enclosingSymbol.kind)) {
        this.unexpectedModifierIfPresent(symbol, SymbolFlag.STATIC, 'outside an object declaration');
      }

      if (!symbol.isFromExtension()) {
        if (enclosingSymbol.isImport()) {
          this.redundantModifierIfPresent(symbol, SymbolFlag.IMPORT, 'inside an imported type');
          symbol.flags |= SymbolFlag.IMPORT;
        }

        if (enclosingSymbol.isExport()) {
          this.redundantModifierIfPresent(symbol, SymbolFlag.EXPORT, 'inside an exported type');
          symbol.flags |= SymbolFlag.EXPORT;
        }
      }

      if (enclosingSymbol.kind !== SymbolKind.GLOBAL_NAMESPACE) {
        if (symbol.isImport() && !enclosingSymbol.isImport()) {
          this.unexpectedModifierIfPresent(symbol, SymbolFlag.IMPORT, 'inside a non-imported type');
        }

        if (symbol.isExport() && !enclosingSymbol.isExport() && !in_SymbolKind.isInstance(symbol.kind)) {
          this.unexpectedModifierIfPresent(symbol, SymbolFlag.EXPORT, 'inside a non-exported type');
        }
      }
    }
  };

  Resolver.prototype.forbidImportAndExportTogether = function(symbol) {
    if (symbol.isImport()) {
      this.unexpectedModifierIfPresent(symbol, SymbolFlag.EXPORT, 'on an imported declaration');
    } else if (symbol.enclosingSymbol !== null && symbol.enclosingSymbol.isImport()) {
      this.unexpectedModifierIfPresent(symbol, SymbolFlag.EXPORT, 'inside an imported type');
    }
  };

  Resolver.prototype.redundantModifierIfPresent = function(symbol, flag, where) {
    if ((symbol.flags & flag) !== 0) {
      var modifierName = this.findModifierName(symbol, flag);

      if (modifierName !== null) {
        semanticErrorRedundantModifier(this.log, modifierName.range, modifierName.asString(), where);
      }
    }
  };

  Resolver.prototype.unexpectedModifierIfPresent = function(symbol, flag, where) {
    if ((symbol.flags & flag) !== 0) {
      var modifierName = this.findModifierName(symbol, flag);

      if (modifierName !== null) {
        semanticErrorUnexpectedModifier(this.log, modifierName.range, modifierName.asString(), where);
      }
    }

    symbol.flags &= ~flag;
  };

  Resolver.prototype.maybeInlineConstant = function(node) {
    var symbol = node.symbol;

    if (symbol !== null && (symbol.kind === SymbolKind.DEFINE || symbol.kind === SymbolKind.GLOBAL_VARIABLE && symbol.isConst() && this.context.inPureFunction() && !symbol.isEnumValue())) {
      this.constantFolder.flatten(node, symbol.constant);
    }
  };

  Resolver.prototype.generateDefaultConstructor = function(symbol) {
    var enclosingSymbol = symbol.enclosingSymbol;
    var members = enclosingSymbol.type.sortedMembers();
    var $arguments = [];
    var superArguments = null;
    var memberInitializers = [];
    var isPure = true;
    var baseClass = enclosingSymbol.type.isClass() ? enclosingSymbol.type.baseClass() : null;

    if (baseClass !== null) {
      var $constructor = baseClass.$constructor();

      if ($constructor !== null) {
        this.initializeMember($constructor);
        isPure = $constructor.symbol.isPure();

        if ($constructor.type.isFunction()) {
          var argumentTypes = $constructor.type.argumentTypes();
          superArguments = [];

          for (var i = 0; i < argumentTypes.length; i = i + 1 | 0) {
            var name = '_' + $arguments.length;
            var argument = Node.createVariable(Node.createName(name), Node.createType(argumentTypes[i]), null);
            argument.symbol = this.createSymbol(name, SymbolKind.LOCAL_VARIABLE);
            argument.symbol.node = argument;
            $arguments.push(argument);
            superArguments.push(Node.createName(name));
          }
        } else {
          if (!$constructor.type.isIgnored(this.cache)) {
            throw new Error('assert constructor.type.isIgnored(cache) (src/resolver/resolver.sk:2012:11)');
          }

          return;
        }
      }
    }

    var uninitializedMembers = [];

    for (var i = 0; i < members.length; i = i + 1 | 0) {
      var member = members[i];
      var memberSymbol = member.symbol;

      if (memberSymbol.kind === SymbolKind.INSTANCE_VARIABLE && memberSymbol.enclosingSymbol === enclosingSymbol) {
        var value = memberSymbol.node.variableValue();
        this.initializeMember(member);

        if (value === null) {
          uninitializedMembers.push(member);
        } else {
          this.resolveAsParameterizedExpressionWithConversion(value, memberSymbol.type, CastKind.IMPLICIT_CAST);

          if (!this.isPureValue(value)) {
            isPure = false;
          }
        }
      }
    }

    uninitializedMembers.sort(bindCompare(MemberRangeComparison.INSTANCE));

    for (var i = 0; i < uninitializedMembers.length; i = i + 1 | 0) {
      var member = uninitializedMembers[i];
      var name = '_' + $arguments.length;
      var argument = Node.createVariable(Node.createName(name), Node.createType(member.type), null);
      argument.symbol = this.createSymbol(name, SymbolKind.LOCAL_VARIABLE);
      argument.symbol.node = argument;
      $arguments.push(argument);
      memberInitializers.push(Node.createMemberInitializer(Node.createName(member.symbol.name), Node.createName(name)));
    }

    symbol.kind = SymbolKind.CONSTRUCTOR_FUNCTION;
    symbol.node = Node.createConstructor(Node.createName(symbol.name), Node.createNodeList($arguments), Node.createBlock([]), superArguments !== null ? Node.createSuperCall(superArguments) : null, memberInitializers !== null ? Node.createNodeList(memberInitializers) : null);
    enclosingSymbol.node.declarationBlock().appendChild(symbol.node);

    if (enclosingSymbol.node.scope === null) {
      throw new Error('assert enclosingSymbol.node.scope != null (src/resolver/resolver.sk:2075:5)');
    }

    var scope = new Scope(enclosingSymbol.node.scope);
    symbol.node.symbol = symbol;
    symbol.node.scope = scope;

    for (var i = 0; i < $arguments.length; i = i + 1 | 0) {
      scope.insert(new Member($arguments[i].symbol));
    }

    if (isPure) {
      symbol.flags |= SymbolFlag.PURE;
    }
  };

  Resolver.prototype.generateDefaultToString = function(symbol) {
    if (!symbol.isEnumMember()) {
      throw new Error('assert symbol.isEnumMember() (src/resolver/resolver.sk:2090:5)');
    }

    var enclosingSymbol = symbol.enclosingSymbol;
    var enclosingNode = enclosingSymbol.node;
    var members = enclosingSymbol.type.sortedMembers();
    var fields = [];

    for (var i = 0; i < members.length; i = i + 1 | 0) {
      var field = members[i].symbol;

      if (field.kind === SymbolKind.GLOBAL_VARIABLE && !field.isFromExtension()) {
        fields.push(field);
      }
    }

    var fieldsSize = fields.length;
    var values = Object.create(null);
    var problem = false;
    var lowest = 0;

    for (var i = 0; i < fieldsSize; i = i + 1 | 0) {
      var field = fields[i];
      this.initializeSymbol(field);

      if (field.type.isIgnored(this.cache)) {
        problem = true;
        break;
      }

      var value = field.constant.asInt();
      var other = in_IntMap.getOrDefault(values, value, null);

      if (other !== null) {
        semanticErrorBadEnumToString(this.log, enclosingNode.declarationName().range, enclosingSymbol.name, field.name, other.name, value);
        problem = true;
        break;
      }

      if (i === 0 || value < lowest) {
        lowest = value;
      }

      values[value] = field;
    }

    var block = Node.createBlock([]);
    var extension = Node.createExtension(Node.createName(enclosingSymbol.name), null, block).withSymbol(enclosingSymbol);
    enclosingNode.insertSiblingAfter(extension);
    enclosingNode.appendToSiblingChain(extension);

    var statement = null;

    if (problem || fieldsSize === 0) {
      statement = Node.createReturn(Node.createString(''));
    } else {
      var consecutive = this.extractConsecutiveRange(values, lowest, fieldsSize);

      if (consecutive !== null) {
        var stringListType = this.cache.parameterizeListType(this.cache.stringType);
        var array = this.createSymbol('_toString_', SymbolKind.GLOBAL_VARIABLE);
        array.enclosingSymbol = enclosingSymbol;
        array.flags = SymbolFlag.FROM_EXTENSION | SymbolFlag.STATIC;
        array.node = Node.createVariable(Node.createName(array.name), null, Node.createList(consecutive));
        array.node.symbol = array;
        block.appendChild(Node.createVariableCluster(Node.createType(stringListType), [array.node]));
        enclosingSymbol.type.addMember(new Member(array));
        symbol.flags |= SymbolFlag.INLINE;

        var index = Node.createThis();
        statement = Node.createReturn(Node.createBinary(NodeKind.INDEX, Node.createName(array.name), lowest !== 0 ? Node.createBinary(NodeKind.SUBTRACT, index, Node.createInt(lowest)) : index));
      } else {
        var cases = [];

        for (var i = 0; i < fieldsSize; i = i + 1 | 0) {
          var field = fields[i];
          cases.push(Node.createCase([Node.createDot(null, Node.createName(field.name))], Node.createBlock([Node.createReturn(Node.createString(field.name))])));
        }

        cases.push(Node.createCase([], Node.createBlock([Node.createReturn(Node.createString(''))])));
        statement = Node.createSwitch(Node.createThis(), cases);
      }
    }

    this.prepareNode(extension, enclosingNode.parent.scope);
    this.resolve(extension, null);
    symbol.kind = SymbolKind.INSTANCE_FUNCTION;
    symbol.flags |= SymbolFlag.FROM_EXTENSION;
    symbol.node = Node.createFunction(Node.createName(symbol.name), Node.createNodeList([]), Node.createBlock([statement]), Node.createType(this.cache.stringType), null).withSymbol(symbol);
    block.appendChild(symbol.node);
  };

  Resolver.prototype.extractConsecutiveRange = function(values, lowest, count) {
    var consecutive = [];

    for (var i = 0; i < count; i = i + 1 | 0) {
      var value = in_IntMap.getOrDefault(values, lowest + i | 0, null);

      if (value === null) {
        return null;
      }

      consecutive.push(Node.createString(value.name));
    }

    return consecutive;
  };

  Resolver.prototype.initializeSymbol = function(symbol) {
    if (symbol.kind === SymbolKind.UNMERGED) {
      if (symbol.type === null) {
        this.initializeUnmergedSymbol(symbol);
      } else {
        this.log.warning(Range.EMPTY, 'not merging unmerged symbol ' + symbol.fullName() + ' of type ' + symbol.type);
      }

      return;
    }

    if (symbol.isUninitialized()) {
      if (symbol.node === null && symbol.kind !== SymbolKind.AUTOMATIC) {
        throw new Error('assert symbol.node != null || symbol.kind == .AUTOMATIC (src/resolver/resolver.sk:2223:7)');
      }

      symbol.canonicalizeSiblingChain();
      this.initializeDeclaration(symbol);

      if (symbol.isInitializing()) {
        throw new Error('assert !symbol.isInitializing() (src/resolver/resolver.sk:2226:7)');
      }

      if (!symbol.isInitialized()) {
        throw new Error('assert symbol.isInitialized() (src/resolver/resolver.sk:2227:7)');
      }

      if (symbol.type === null) {
        throw new Error('assert symbol.type != null (src/resolver/resolver.sk:2228:7)');
      }

      if (symbol.isEntryPoint()) {
        this.validateEntryPoint(symbol);
      }
    } else if (symbol.isInitializing()) {
      semanticErrorCyclicDeclaration(this.log, (symbol.kind === SymbolKind.AUTOMATIC ? symbol.enclosingSymbol.node : symbol.node).declarationName().range, symbol.name);
      symbol.type = this.cache.errorType;
    }
  };

  Resolver.prototype.initializeUnmergedSymbol = function(symbol) {
    var range = symbol.enclosingSymbol.nameRange();
    var types = [];
    var first = null;
    var isPure = false;
    var isImpure = false;
    var isAbstract = true;
    var areSameSymbolAndType = true;
    var hasNonVirtualMethod = false;
    var hasInstanceSymbol = false;

    for (var i = 0; i < symbol.identicalMembers.length; i = i + 1 | 0) {
      var member = symbol.identicalMembers[i];
      var memberSymbol = member.symbol;
      this.initializeMember(member);

      var memberKind = memberSymbol.kind;

      if (first === null) {
        first = member;
      } else if (memberSymbol !== first.symbol || member.type !== first.type) {
        areSameSymbolAndType = false;
      }

      if (memberKind === SymbolKind.UNMERGED) {
        symbol.type = this.cache.errorType;
        return;
      }

      if (!Resolver.isAbstractFunction(memberSymbol)) {
        isAbstract = false;
      }

      if (in_SymbolKind.isInstance(memberKind)) {
        hasInstanceSymbol = true;
      }

      if (memberKind !== SymbolKind.INSTANCE_FUNCTION && memberKind !== SymbolKind.MERGED_INSTANCE_FUNCTION || !memberSymbol.isVirtual()) {
        hasNonVirtualMethod = true;
      }

      var type = member.type;

      if (!(types.indexOf(type) !== -1)) {
        types.push(type);
      }

      if (memberSymbol.isPure()) {
        isPure = true;
      } else {
        isImpure = true;
      }
    }

    if (areSameSymbolAndType) {
      symbol.kind = SymbolKind.FORWARDED;
      symbol.overriddenMember = symbol.identicalMembers[0];
      symbol.type = types[0];
    } else if (hasNonVirtualMethod) {
      symbol.type = this.cache.errorType;

      if (hasInstanceSymbol) {
        semanticErrorCannotMerge(this.log, range, symbol.fullName(), Resolver.fullNamesForMembers(symbol.identicalMembers));
      } else {
        symbol.kind = SymbolKind.AMBIGUOUS;
      }
    } else if (types.length !== 1) {
      semanticErrorAmbiguousMergedType(this.log, range, symbol.fullName(), types);
      symbol.type = this.cache.errorType;
    } else {
      symbol.kind = SymbolKind.MERGED_INSTANCE_FUNCTION;
      symbol.flags |= SymbolFlag.VIRTUAL | (isAbstract ? SymbolFlag.ABSTRACT : 0);
      symbol.type = types[0];

      if (isPure && isImpure) {
        semanticErrorAmbiguousPurity(this.log, range, symbol.fullName());
      }
    }
  };

  Resolver.prototype.validateEntryPoint = function(symbol) {
    var modifierName = symbol.node.declarationName();

    if (this.entryPointSymbol !== null) {
      semanticErrorDuplicateEntryPoint(this.log, modifierName.range, this.entryPointSymbol.nameRange());
      return;
    }

    this.entryPointSymbol = symbol;

    if (symbol.isImport()) {
      semanticErrorEntryPointOnImportedSymbol(this.log, modifierName.range);
      return;
    }

    var stringListType = this.cache.parameterizeListType(this.cache.stringType);
    var validTypes = [this.cache.functionType(this.cache.voidType, []), this.cache.functionType(this.cache.intType, []), this.cache.functionType(this.cache.voidType, [stringListType]), this.cache.functionType(this.cache.intType, [stringListType])];

    if (!symbol.type.isError(this.cache) && !(validTypes.indexOf(symbol.type) !== -1)) {
      semanticErrorInvalidEntryPointType(this.log, modifierName.range, symbol.type, validTypes);
    }
  };

  Resolver.prototype.resolveArguments = function($arguments, argumentTypes, outer, inner) {
    if (argumentTypes.length !== $arguments.length) {
      var range = Range.equal(outer, inner) ? outer : Range.after(outer, inner);
      semanticErrorArgumentCount(this.log, range, argumentTypes.length, $arguments.length);
      this.resolveNodesAsParameterizedExpressionsAfterError($arguments);
      return;
    }

    for (var i = 0; i < $arguments.length; i = i + 1 | 0) {
      this.resolveAsParameterizedExpressionWithConversion($arguments[i], argumentTypes[i], CastKind.IMPLICIT_CAST);
    }
  };

  Resolver.prototype.resolveAsType = function(node) {
    if (!in_NodeKind.isExpression(node.kind)) {
      throw new Error('assert node.kind.isExpression() (src/resolver/resolver.sk:2392:5)');
    }

    this.resolve(node, null);
    this.checkIsType(node);
  };

  Resolver.prototype.resolveAsParameterizedType = function(node) {
    this.resolveAsType(node);
    this.checkIsParameterized(node);
  };

  Resolver.prototype.resolveAsParameterizedExpression = function(node) {
    if (!in_NodeKind.isExpression(node.kind)) {
      throw new Error('assert node.kind.isExpression() (src/resolver/resolver.sk:2403:5)');
    }

    this.resolve(node, null);
    this.checkIsInstance(node);
    this.checkIsParameterized(node);
  };

  Resolver.prototype.resolveAsParameterizedExpressionWithTypeContext = function(node, type) {
    if (!in_NodeKind.isExpression(node.kind)) {
      throw new Error('assert node.kind.isExpression() (src/resolver/resolver.sk:2410:5)');
    }

    this.resolve(node, type);
    this.checkIsInstance(node);
    this.checkIsParameterized(node);
  };

  Resolver.prototype.resolveAsParameterizedExpressionWithConversion = function(node, type, kind) {
    if (!in_NodeKind.isExpression(node.kind)) {
      throw new Error('assert node.kind.isExpression() (src/resolver/resolver.sk:2417:5)');
    }

    this.resolve(node, type);
    this.checkIsInstance(node);
    this.checkIsParameterized(node);

    if (type !== null) {
      this.checkConversion(type, node, kind);
    }
  };

  Resolver.prototype.expandPreprocessorSequences = function(parent) {
    var nodes = parent.children;

    for (var i = 0; i < nodes.length; i = i + 1 | 0) {
      var node = nodes[i];

      if (node.kind === NodeKind.PREPROCESSOR_SEQUENCE) {
        var distanceFromEnd = nodes.length - i | 0;
        this.expandPreprocessorSequence(node);
        i = nodes.length - distanceFromEnd | 0;
      }
    }
  };

  Resolver.prototype.expandPreprocessorSequence = function(node) {
    var test = node.sequenceTest();
    var trueNodes = node.sequenceTrue();
    var falseNodes = node.sequenceFalse();
    var result = this.evaluatePreprocessorValue(test, LogErrors.LOG_ERRORS);

    if (result === PreprocessorResult.ERROR) {
      node.become(Node.createError());
      return;
    }

    if (result === PreprocessorResult.FALSE && falseNodes === null) {
      node.remove();
    } else {
      var selected = result !== PreprocessorResult.FALSE ? trueNodes : falseNodes;
      this.expandPreprocessorSequences(selected);
      node.replaceWithNodes(selected.removeChildren());
    }
  };

  Resolver.prototype.resolveNodes = function(nodes) {
    for (var i = 0; i < nodes.length; i = i + 1 | 0) {
      this.resolve(nodes[i], null);
    }
  };

  Resolver.prototype.resolveNodesAsParameterizedExpressionsAfterError = function(nodes) {
    for (var i = 0; i < nodes.length; i = i + 1 | 0) {
      this.resolveAsParameterizedExpressionWithTypeContext(nodes[i], this.cache.errorType);
    }
  };

  Resolver.prototype.resolveNodesAsVariableTypes = function(nodes) {
    for (var i = 0; i < nodes.length; i = i + 1 | 0) {
      var node = nodes[i];
      this.resolveAsParameterizedType(node);
      this.checkIsValidVariableType(node);
    }
  };

  Resolver.prototype.resolveChildren = function(node) {
    if (node.hasChildren()) {
      this.resolveNodes(node.children);
    }
  };

  Resolver.prototype.resolveProgram = function(node) {
    if (node.parent !== null) {
      throw new Error('assert node.parent == null (src/resolver/resolver.sk:2487:5)');
    }

    this.resolveChildren(node);
  };

  Resolver.prototype.resolveFile = function(node) {
    if (node.parent === null) {
      throw new Error('assert node.parent != null (src/resolver/resolver.sk:2492:5)');
    }

    if (node.parent.kind !== NodeKind.PROGRAM) {
      throw new Error('assert node.parent.kind == .PROGRAM (src/resolver/resolver.sk:2493:5)');
    }

    this.resolve(node.fileBlock(), null);
  };

  Resolver.prototype.resolveBlock = function(node) {
    this.resolveChildren(node);

    var statements = node.blockStatements();

    for (var i = 0; i < statements.length; i = i + 1 | 0) {
      var child = statements[i];
      var kind = child.kind;

      if (kind === NodeKind.ASSERT_CONST || kind === NodeKind.PREPROCESSOR_DEFINE || kind === NodeKind.ASSERT && this.options.removeAsserts) {
        node.removeChildAtIndex(i);
        i = i - 1 | 0;
      }
    }
  };

  Resolver.prototype.resolveCase = function(node) {
    if (node.parent.kind !== NodeKind.NODE_LIST) {
      throw new Error('assert node.parent.kind == .NODE_LIST (src/resolver/resolver.sk:2515:5)');
    }

    if (node.parent.parent.kind !== NodeKind.SWITCH) {
      throw new Error('assert node.parent.parent.kind == .SWITCH (src/resolver/resolver.sk:2516:5)');
    }

    if (this.context.switchValue === null) {
      throw new Error('assert context.switchValue != null (src/resolver/resolver.sk:2517:5)');
    }

    if (this.context.switchValue.type === null) {
      throw new Error('assert context.switchValue.type != null (src/resolver/resolver.sk:2518:5)');
    }

    var values = node.caseValues().children;
    var block = node.caseBlock();

    for (var i = 0; i < values.length; i = i + 1 | 0) {
      var value = values[i];
      this.resolveAsParameterizedExpressionWithConversion(value, this.context.switchValue.type, CastKind.IMPLICIT_CAST);
      this.constantFolder.foldConstants(value);

      if (!value.type.isIgnored(this.cache) && !in_NodeKind.isConstant(value.kind)) {
        semanticErrorNonConstantCaseValue(this.log, value.range);
        value.type = this.cache.errorType;
      }
    }

    this.resolve(block, null);
  };

  Resolver.prototype.resolveNamespace = function(node) {
    this.checkDeclarationLocation(node, AllowDeclaration.ALLOW_TOP_LEVEL);

    if (node.symbol !== null) {
      this.initializeSymbol(node.symbol);
    }

    this.resolve(node.declarationBlock(), null);
  };

  Resolver.prototype.resolveEnum = function(node) {
    this.checkDeclarationLocation(node, AllowDeclaration.ALLOW_TOP_LEVEL);
    this.initializeSymbol(node.symbol);
    this.resolve(node.declarationBlock(), null);
  };

  Resolver.prototype.resolveObject = function(node) {
    this.checkDeclarationLocation(node, AllowDeclaration.ALLOW_TOP_LEVEL);
    this.initializeSymbol(node.symbol);

    var members = node.symbol.type.sortedMembers();

    for (var i = 0; i < members.length; i = i + 1 | 0) {
      var member = members[i];

      if (member.symbol.kind === SymbolKind.UNMERGED) {
        this.initializeMember(member);
      }
    }

    var oldSymbolForThis = this.context.symbolForThis;
    this.context.symbolForThis = node.symbol;

    var $constructor = node.symbol.type.$constructor();

    if ($constructor !== null) {
      this.initializeMember($constructor);
    }

    this.resolve(node.declarationBlock(), null);
    this.context.symbolForThis = oldSymbolForThis;
  };

  Resolver.prototype.resolveExtension = function(node) {
    this.checkDeclarationLocation(node, AllowDeclaration.ALLOW_TOP_LEVEL);
    this.initializeSymbol(node.symbol);

    var oldSymbolForThis = this.context.symbolForThis;

    if (in_SymbolKind.isTypeWithInstances(node.symbol.kind)) {
      this.context.symbolForThis = node.symbol;
    }

    this.resolve(node.declarationBlock(), null);
    this.context.symbolForThis = oldSymbolForThis;
  };

  Resolver.prototype.resolveFunction = function(node) {
    var symbol = node.symbol;

    if (symbol.enclosingSymbol !== null && in_SymbolKind.isTypeWithInstances(symbol.enclosingSymbol.kind) && (this.context.symbolForThis === null || this.context.symbolForThis !== symbol.enclosingSymbol)) {
      throw new Error('assert symbol.enclosingSymbol == null || !symbol.enclosingSymbol.kind.isTypeWithInstances() ||\n      context.symbolForThis != null && context.symbolForThis == symbol.enclosingSymbol (src/resolver/resolver.sk:2598:5)');
    }

    this.checkDeclarationLocation(node, AllowDeclaration.ALLOW_TOP_OR_OBJECT_LEVEL);
    this.initializeSymbol(symbol);

    var oldFunctionSymbol = this.context.functionSymbol;
    this.context.functionSymbol = symbol;

    var block = node.functionBlock();

    if (block !== null) {
      var oldResultType = this.resultType;

      if (symbol.isVirtual() && symbol.enclosingSymbol !== null && symbol.enclosingSymbol.kind === SymbolKind.INTERFACE) {
        semanticErrorCannotImplementInterfaceFunction(this.log, block.range);
      } else if (symbol.isImport()) {
        semanticErrorCannotImplementImportedFunction(this.log, block.range);
      }

      if (!symbol.type.isFunction()) {
        this.resultType = this.cache.errorType;
      } else if (symbol.kind === SymbolKind.CONSTRUCTOR_FUNCTION) {
        this.resultType = this.cache.voidType;
      } else {
        this.resultType = symbol.type.resultType();
      }

      this.resolve(block, null);

      if (!this.resultType.isIgnored(this.cache) && !this.resultType.isVoid(this.cache) && !block.blockAlwaysEndsWithReturn()) {
        semanticErrorMissingReturn(this.log, node.declarationName().range, symbol.name, this.resultType);
      }

      this.resultType = oldResultType;
    } else if (!symbol.isImport() && !symbol.isVirtual()) {
      if (symbol.kind === SymbolKind.INSTANCE_FUNCTION) {
        semanticErrorFunctionMustBeAbstract(this.log, node.declarationName().range);
      } else if (symbol.kind === SymbolKind.CONSTRUCTOR_FUNCTION) {
        semanticErrorUnimplementedConstructor(this.log, node.declarationName().range);
      } else {
        semanticErrorUnimplementedFunction(this.log, node.declarationName().range);
      }
    }

    if (node.kind === NodeKind.CONSTRUCTOR) {
      this.resolveConstructorFunction(symbol);
    }

    this.context.functionSymbol = oldFunctionSymbol;
  };

  Resolver.prototype.resolveConstructorFunction = function(symbol) {
    var node = symbol.node;
    var block = node.functionBlock();
    var overriddenMember = symbol.overriddenMember;
    var overriddenType = this.cache.errorType;

    if (overriddenMember !== null) {
      this.initializeMember(overriddenMember);
      overriddenType = overriddenMember.type;
    }

    var superInitializer = node.superInitializer();

    if (superInitializer !== null) {
      if (overriddenMember !== null) {
        superInitializer.symbol = overriddenMember.symbol;
      } else {
        semanticErrorBadSuperInitializer(this.log, superInitializer.range);
      }

      var $arguments = superInitializer.superCallArguments();

      if (overriddenType.isIgnored(this.cache)) {
        this.resolveNodesAsParameterizedExpressionsAfterError($arguments);
      } else {
        if (!overriddenType.isFunction()) {
          throw new Error('assert overriddenType.isFunction() (src/resolver/resolver.sk:2690:9)');
        }

        this.resolveArguments($arguments, overriddenType.argumentTypes(), superInitializer.range, superInitializer.range);
      }
    } else if (overriddenType.isFunction()) {
      if (overriddenType.argumentTypes().length !== 0) {
        semanticErrorMissingSuperInitializer(this.log, node.declarationName().range);
      } else {
        node.replaceChild(3, Node.createSuperCall([]).withSymbol(overriddenMember.symbol));
      }
    }

    var memberInitializers = node.memberInitializers();

    if (memberInitializers === null) {
      memberInitializers = Node.createNodeList([]);
      node.replaceChild(4, memberInitializers);
    }

    if ((superInitializer !== null || memberInitializers.children.length !== 0) && block === null) {
      semanticErrorAbstractConstructorInitializer(this.log, Resolver.initializerListRange(node));
    }

    var enclosingSymbol = symbol.enclosingSymbol;

    if (!enclosingSymbol.isImport()) {
      var members = enclosingSymbol.type.sortedMembers();
      var index = 0;

      for (var i = 0; i < members.length; i = i + 1 | 0) {
        var member = members[i];
        var memberSymbol = member.symbol;

        if (memberSymbol.kind === SymbolKind.INSTANCE_VARIABLE && memberSymbol.enclosingSymbol === enclosingSymbol) {
          var value = memberSymbol.node.variableValue();

          if (value !== null) {
            this.initializeMember(member);

            var oldScope = this.context.scope;
            this.context.scope = node.scope.lexicalParent;
            this.context.functionSymbol = null;
            this.resolve(memberSymbol.node, null);
            this.context.functionSymbol = symbol;
            this.context.scope = oldScope;
            memberInitializers.insertChild(index, Node.createMemberInitializer(Node.createName(memberSymbol.name).withSymbol(memberSymbol).withType(member.type), value.replaceWith(null)));
            index = index + 1 | 0;
          } else {
            var j = 0;

            for (j = 0; j < memberInitializers.children.length; j = j + 1 | 0) {
              if (memberInitializers.children[j].memberInitializerName().asString() === memberSymbol.name) {
                break;
              }
            }

            if (j === memberInitializers.children.length) {
              this.initializeMember(member);
              memberInitializers.insertChild(index, Node.createMemberInitializer(Node.createName(memberSymbol.name).withSymbol(memberSymbol).withType(member.type), this.createDefaultValue(member.type, memberSymbol.nameRange())));
              index = index + 1 | 0;
            }
          }
        }
      }
    }

    for (var i = 0; i < memberInitializers.children.length; i = i + 1 | 0) {
      var memberInitializer = memberInitializers.children[i];
      var name = memberInitializer.memberInitializerName();
      var value = memberInitializer.memberInitializerValue();
      var oldScope = this.context.scope;
      this.context.scope = node.scope.lexicalParent;
      this.resolve(name, null);
      this.context.scope = oldScope;
      memberInitializer.symbol = name.symbol;

      if (name.symbol !== null) {
        this.resolveAsParameterizedExpressionWithConversion(value, name.symbol.type, CastKind.IMPLICIT_CAST);

        for (var j = 0; j < i; j = j + 1 | 0) {
          var other = memberInitializers.children[j];

          if (other.memberInitializerName().symbol === name.symbol) {
            semanticErrorAlreadyInitialized(this.log, value.range, name.symbol.name, other.memberInitializerValue().range);
            break;
          }
        }
      } else {
        this.resolveAsParameterizedExpression(value);
      }
    }
  };

  Resolver.prototype.isPureValue = function(node) {
    var kind = node.kind;

    if (node.type.isIgnored(this.cache)) {
      return true;
    }

    switch (kind) {
    case 49:
    case 50:
      if (node.hasChildren()) {
        for (var i = 0; i < node.children.length; i = i + 1 | 0) {
          if (!this.isPureValue(node.children[i])) {
            return false;
          }
        }
      }

      return true;

    case 51:
      return this.isPureValue(node.itemKey()) && this.isPureValue(node.itemValue());

    case 42:
      return this.isPureValue(node.hookTest()) && this.isPureValue(node.hookTrue()) && this.isPureValue(node.hookFalse());

    case 55:
      var value = node.callValue();
      var $arguments = node.callArguments();
      var symbol = value.kind === NodeKind.TYPE ? node.symbol : value.symbol;

      if (symbol === null || !symbol.isPure()) {
        return false;
      }

      for (var i = 0; i < $arguments.length; i = i + 1 | 0) {
        if (!this.isPureValue($arguments[i])) {
          return false;
        }
      }

      return true;

    case 60:
    case 61:
      return this.isPureValue(node.castValue());

    case 39:
      return node.symbol !== null && node.symbol.isConst();
    }

    return in_NodeKind.isConstant(kind) || in_NodeKind.isUnaryOperator(kind) && this.isPureValue(node.unaryValue()) || in_NodeKind.isBinaryOperator(kind) && this.isPureValue(node.binaryLeft()) && this.isPureValue(node.binaryRight());
  };

  Resolver.prototype.resolveVariable = function(node) {
    var symbol = node.symbol;
    this.initializeSymbol(symbol);

    var value = node.variableValue();
    var enclosingSymbol = symbol.enclosingSymbol;

    if (!symbol.isStatic() && enclosingSymbol !== null) {
      var enclosingSymbolType = enclosingSymbol.type;

      if (enclosingSymbolType.isInterface() || symbol.isFromExtension() && enclosingSymbolType.isEnum()) {
        this.unexpectedStatement(node);
      } else if (symbol.isFromExtension() && in_SymbolKind.isTypeWithInstances(enclosingSymbol.kind) && value === null) {
        semanticErrorUninitializedExtensionVariable(this.log, node.declarationName().range);
      }
    }

    if (value !== null) {
      this.resolveAsParameterizedExpressionWithConversion(value, symbol.isEnumValue() ? this.cache.intType : symbol.type, CastKind.IMPLICIT_CAST);

      if (symbol.kind === SymbolKind.GLOBAL_VARIABLE) {
        this.constantFolder.foldConstants(value);

        if (!this.isPureValue(value) && !symbol.type.isIgnored(this.cache)) {
          semanticErrorNonPureGlobalVariable(this.log, value.range);
          value.type = this.cache.errorType;
        }
      }
    } else if (!symbol.type.isIgnored(this.cache) && node.parent.kind === NodeKind.VARIABLE_CLUSTER && symbol.kind !== SymbolKind.INSTANCE_VARIABLE) {
      node.replaceChild(2, this.createDefaultValue(symbol.type, node.declarationName().range).withType(symbol.type));
    }
  };

  Resolver.prototype.resolveVariableCluster = function(node) {
    var variables = node.clusterVariables();
    this.resolveNodes(variables);

    if (node.parent.kind === NodeKind.FOR) {
      var first = variables[0].symbol;

      for (var i = 1; i < variables.length; i = i + 1 | 0) {
        var current = variables[i].symbol;

        if (!first.type.isIgnored(this.cache) && !current.type.isIgnored(this.cache) && first.type !== current.type) {
          semanticErrorForVariablesMustBeSameType(this.log, node.range, first.name, first.type, current.name, current.type);
          break;
        }
      }
    }
  };

  Resolver.prototype.resolveParameter = function(node) {
    this.initializeSymbol(node.symbol);
  };

  Resolver.prototype.resolveDefine = function(node) {
    this.initializeDefine(node.symbol);
    this.checkDeclarationLocation(node, AllowDeclaration.ALLOW_TOP_LEVEL);
  };

  Resolver.prototype.resolveAlias = function(node) {
    if (node.symbol !== null) {
      this.initializeSymbol(node.symbol);
    }
  };

  Resolver.prototype.resolveIf = function(node) {
    this.checkStatementLocation(node);
    this.resolveAsParameterizedExpressionWithConversion(node.ifTest(), this.cache.boolType, CastKind.IMPLICIT_CAST);
    this.resolve(node.ifTrue(), null);

    if (node.ifFalse() !== null) {
      this.resolve(node.ifFalse(), null);
    }
  };

  Resolver.prototype.resolveThrow = function(node) {
    this.resolveAsParameterizedExpression(node.throwValue());
  };

  Resolver.prototype.resolveTry = function(node) {
    var catches = node.catches();
    var finallyBlock = node.finallyBlock();
    this.checkStatementLocation(node);
    this.resolve(node.tryBlock(), null);

    for (var i = 0; i < catches.length; i = i + 1 | 0) {
      var catchNode = catches[i];
      var variable = catchNode.catchVariable();

      if (variable !== null) {
        this.resolveVariable(variable);
      }

      this.resolve(catchNode.catchBlock(), null);
    }

    if (finallyBlock !== null) {
      this.resolve(finallyBlock, null);
    }
  };

  Resolver.prototype.resolveFor = function(node) {
    this.checkStatementLocation(node);

    var setup = node.forSetup();
    var test = node.forTest();
    var update = node.forUpdate();

    if (setup !== null) {
      if (setup.kind === NodeKind.VARIABLE_CLUSTER) {
        this.resolve(setup, null);
      } else {
        this.resolveAsParameterizedExpression(setup);
        this.checkUnusedExpression(setup);
      }
    }

    if (test !== null) {
      this.resolveAsParameterizedExpressionWithConversion(test, this.cache.boolType, CastKind.IMPLICIT_CAST);
    }

    if (update !== null) {
      this.resolveAsParameterizedExpression(update);
      this.checkUnusedExpression(update);
    }

    var oldLoop = this.context.loop;
    this.context.loop = node;
    this.resolve(node.forBlock(), null);
    this.context.loop = oldLoop;
  };

  Resolver.prototype.resolveForEach = function(node) {
    var value = node.forEachValue();
    this.checkStatementLocation(node);
    this.resolve(node.forEachVariable(), null);
    this.resolve(value, null);

    if (!value.type.isIgnored(this.cache)) {
      this.log.error(node.range, 'TODO: implement for-each statement');
    }

    var oldLoop = this.context.loop;
    this.context.loop = node;
    this.resolve(node.forEachBlock(), null);
    this.context.loop = oldLoop;
  };

  Resolver.prototype.resolveWhile = function(node) {
    this.checkStatementLocation(node);

    var test = node.whileTest();

    if (test !== null) {
      this.resolveAsParameterizedExpressionWithConversion(test, this.cache.boolType, CastKind.IMPLICIT_CAST);
    }

    var oldLoop = this.context.loop;
    this.context.loop = node;
    this.resolve(node.whileBlock(), null);
    this.context.loop = oldLoop;
  };

  Resolver.prototype.resolveReturn = function(node) {
    var value = node.returnValue();

    if (this.resultType === null) {
      this.unexpectedStatement(node);

      if (value !== null) {
        this.resolveAsParameterizedExpression(value);
      }

      return;
    }

    if (value !== null) {
      this.resolveAsParameterizedExpressionWithConversion(value, this.resultType, CastKind.IMPLICIT_CAST);
    } else if (!this.resultType.isIgnored(this.cache) && !this.resultType.isVoid(this.cache)) {
      semanticErrorExpectedReturnValue(this.log, node.range, this.resultType);
    }
  };

  Resolver.prototype.resolveBreak = function(node) {
    if (this.context.loop === null) {
      this.unexpectedStatement(node);
    }
  };

  Resolver.prototype.resolveContinue = function(node) {
    if (this.context.loop === null) {
      this.unexpectedStatement(node);
    }
  };

  Resolver.prototype.resolveAssert = function(node) {
    if (node.kind === NodeKind.ASSERT) {
      this.checkStatementLocation(node);
    }

    var value = node.assertValue();
    this.resolveAsParameterizedExpressionWithConversion(value, this.cache.boolType, CastKind.IMPLICIT_CAST);

    if (node.kind === NodeKind.ASSERT_CONST) {
      this.constantFolder.foldConstants(value);

      if (!value.type.isIgnored(this.cache)) {
        if (!in_NodeKind.isConstant(value.kind)) {
          semanticErrorNonConstantAssert(this.log, value.range);
        } else if (!value.isTrue()) {
          semanticErrorFalseAssert(this.log, value.range);
        }
      }
    }
  };

  Resolver.prototype.resolveExpression = function(node) {
    var value = node.expressionValue();

    if (value.kind !== NodeKind.ERROR) {
      this.checkStatementLocation(node);
    }

    this.resolveAsParameterizedExpression(value);
    this.checkUnusedExpression(value);
  };

  Resolver.prototype.resolveSwitch = function(node) {
    this.checkStatementLocation(node);

    var value = node.switchValue();
    var cases = node.switchCases().children;
    this.resolveAsParameterizedExpression(value);

    if (!value.type.isIgnored(this.cache) && !value.type.isInteger(this.cache)) {
      semanticErrorNonIntegerSwitch(this.log, value.range, value.type);
      value.type = this.cache.errorType;
    }

    var oldSwitchValue = this.context.switchValue;
    this.context.switchValue = value;
    this.resolveNodes(cases);
    this.context.switchValue = oldSwitchValue;

    var uniqueValues = [];

    for (var i = 0; i < cases.length; i = i + 1 | 0) {
      var child = cases[i];
      var caseValues = child.caseValues().children;

      if (caseValues.length === 0 && i < (cases.length - 1 | 0)) {
        semanticErrorBadDefaultCase(this.log, child.range);
      }

      for (var j = 0; j < caseValues.length; j = j + 1 | 0) {
        var caseValue = caseValues[j];

        if (caseValue.type.isIgnored(this.cache)) {
          continue;
        }

        if (!in_NodeKind.isConstant(caseValue.kind)) {
          throw new Error('assert caseValue.kind.isConstant() (src/resolver/resolver.sk:3119:9)');
        }

        var k = 0;

        for (k = 0; k < uniqueValues.length; k = k + 1 | 0) {
          var original = uniqueValues[k];

          if (original.kind === caseValue.kind && Content.equal(original.content, caseValue.content)) {
            semanticErrorDuplicateCase(this.log, caseValue.range, original.range);
            break;
          }
        }

        if (k === uniqueValues.length) {
          uniqueValues.push(caseValue);
        }
      }
    }
  };

  Resolver.prototype.resolvePreprocessorDiagnostic = function(node) {
    var value = node.diagnosticValue();

    if (node.kind === NodeKind.PREPROCESSOR_WARNING) {
      this.log.warning(node.range, value.asString());
    } else {
      if (node.kind !== NodeKind.PREPROCESSOR_ERROR) {
        throw new Error('assert node.kind == .PREPROCESSOR_ERROR (src/resolver/resolver.sk:3142:7)');
      }

      this.log.error(node.range, value.asString());
    }
  };

  Resolver.prototype.resolveModifier = function(node) {
    this.resolveNodes(node.modifierStatements());
  };

  Resolver.prototype.resolveName = function(node) {
    var name = node.asString();
    var member = this.context.scope.find(name);

    if (member === null) {
      semanticErrorUndeclaredSymbol(this.log, node.range, name);
      return;
    }

    this.initializePotentiallyDuplicatedMember(member, node.range);
    node.symbol = member.symbol;

    if (!this.checkAccessToInstanceSymbol(node)) {
      node.type = this.cache.errorType;
      return;
    }

    if (in_SymbolKind.isType(member.symbol.kind)) {
      node.become(Node.createType(member.type).withRange(node.range).withSymbol(member.symbol));
      return;
    }

    node.type = member.type;
    this.checkAccess(node.symbol, node.range);
    this.checkPureInsideFunction(node);
    this.maybeInlineConstant(node);
  };

  Resolver.prototype.resolveThis = function(node) {
    if (this.checkAccessToThis(node.range)) {
      if (this.context.symbolForThis === null) {
        throw new Error('assert context.symbolForThis != null (src/resolver/resolver.sk:3181:7)');
      }

      var symbol = this.context.symbolForThis;
      this.initializeSymbol(symbol);
      node.symbol = symbol;
      node.type = this.cache.ensureTypeIsParameterized(symbol.type);
    }
  };

  Resolver.prototype.resolveAnnotation = function(node) {
    var annotationName = node.annotationName();
    var name = annotationName.asString();

    if (name === '@ContentsOfFile') {
      this.resolveContentsOfFile(node);
    } else {
      semanticErrorUnknownAnnotation(this.log, annotationName.range, name);
    }
  };

  Resolver.prototype.resolveContentsOfFile = function(node) {
    var content = this.requireSingleStringLiteral(node);

    if (content !== null) {
      if (this.options.fileAccess === null) {
        semanticErrorNoFileAccess(this.log, node.range);
      } else {
        var name = node.range.source.name;
        var source = this.options.fileAccess.contentsOfFile(name, content.value);

        if (source === null) {
          semanticErrorCannotFindFile(this.log, node.annotationArguments().children[0].range, content.value);
        } else {
          if (this.options.target === CompilerTarget.JOINED) {
            if (!(name in this.sourceSubstitutions)) {
              this.sourceSubstitutions[name] = [];
            }

            this.sourceSubstitutions[name].push(new SourceSubstitution(node.range, source.contents));
          }

          node.become(Node.createString(source.contents).withType(this.cache.stringType).withRange(node.range));
        }
      }
    }
  };

  Resolver.prototype.resolveHook = function(node) {
    var trueNode = node.hookTrue();
    var falseNode = node.hookFalse();
    this.resolveAsParameterizedExpressionWithConversion(node.hookTest(), this.cache.boolType, CastKind.IMPLICIT_CAST);

    if (this.typeContext !== null || this.needsTypeContext(trueNode) === this.needsTypeContext(falseNode)) {
      this.resolveAsParameterizedExpressionWithTypeContext(trueNode, this.typeContext);
      this.resolveAsParameterizedExpressionWithTypeContext(falseNode, this.typeContext);
    } else {
      this.resolveWithTypeContextTransfer(trueNode, falseNode);
    }

    var trueType = trueNode.type;
    var falseType = falseNode.type;

    if (trueType.isIgnored(this.cache) || falseType.isIgnored(this.cache)) {
      return;
    }

    var commonType = this.cache.commonImplicitType(trueType, falseType);

    if (commonType === null) {
      commonType = this.typeContext;

      if (commonType === null || !this.cache.canImplicitlyConvert(trueType, commonType) || !this.cache.canImplicitlyConvert(falseType, commonType)) {
        semanticErrorNoCommonType(this.log, Range.span(trueNode.range, falseNode.range), trueType, falseType);
        return;
      }
    } else if (commonType === this.cache.intType && this.typeContext !== null && this.typeContext.isEnumFlags()) {
      commonType = this.typeContext;
    }

    this.checkConversion(commonType, trueNode, CastKind.IMPLICIT_CAST);
    this.checkConversion(commonType, falseNode, CastKind.IMPLICIT_CAST);
    node.type = commonType;
  };

  Resolver.prototype.resolvePreprocessorHook = function(node) {
    var test = node.hookTest();
    var trueNode = node.hookTrue();
    var falseNode = node.hookFalse();
    var result = this.evaluatePreprocessorValue(test, LogErrors.LOG_ERRORS);

    if (result === PreprocessorResult.ERROR) {
      return;
    }

    var value = result !== PreprocessorResult.FALSE ? trueNode : falseNode;
    this.resolveAsParameterizedExpressionWithTypeContext(value, this.typeContext);
    node.become(value);
  };

  Resolver.prototype.resolveInt = function(node) {
    node.type = this.cache.intType;
  };

  Resolver.prototype.resolveList = function(node) {
    this.expandPreprocessorSequences(node);

    var values = node.listValues();

    if (this.typeContext !== null && this.typeContext.isIgnored(this.cache)) {
      this.resolveNodesAsParameterizedExpressionsAfterError(values);
      return;
    }

    if (this.typeContext !== null && this.typeContext.isList(this.cache)) {
      var itemType = this.typeContext.substitutions[0];

      for (var i = 0; i < values.length; i = i + 1 | 0) {
        this.resolveAsParameterizedExpressionWithConversion(values[i], itemType, CastKind.IMPLICIT_CAST);
      }

      node.type = this.typeContext;
      return;
    }

    var commonType = null;

    for (var i = 0; i < values.length; i = i + 1 | 0) {
      var value = values[i];
      this.resolveAsParameterizedExpression(value);
      commonType = this.mergeCommonLiteralType(commonType, value, node);
    }

    if (commonType !== null && commonType.isIgnored(this.cache)) {
      return;
    }

    if (commonType === null) {
      semanticErrorListLiteralCommonTypeInferenceFailed(this.log, node.range);
      return;
    }

    node.type = this.cache.parameterizeListType(commonType);
  };

  Resolver.prototype.resolveMap = function(node) {
    this.expandPreprocessorSequences(node);

    var items = node.mapItems();
    var keyType = null;
    var valueType = null;

    if (this.typeContext !== null && this.typeContext.isIgnored(this.cache)) {
      this.resolveNodesAsParameterizedExpressionsAfterError(items);
      return;
    }

    if (this.typeContext !== null && (this.typeContext.isStringMap(this.cache) || this.typeContext.isIntMap(this.cache))) {
      if (items.length === 0) {
        node.become(Node.createCall(Node.createType(this.typeContext), []));
        this.resolveAsParameterizedExpression(node);
        return;
      }

      keyType = this.typeContext.isStringMap(this.cache) ? this.cache.stringType : this.cache.intType;
      valueType = this.typeContext.substitutions[0];

      for (var i = 0; i < items.length; i = i + 1 | 0) {
        var item = items[i];

        if (item.kind !== NodeKind.KEY_VALUE) {
          if (item.kind !== NodeKind.ERROR) {
            throw new Error('assert item.kind == .ERROR (src/resolver/resolver.sk:3358:11)');
          }

          continue;
        }

        this.resolveAsParameterizedExpressionWithConversion(item.itemKey(), keyType, CastKind.IMPLICIT_CAST);
        this.resolveAsParameterizedExpressionWithConversion(item.itemValue(), valueType, CastKind.IMPLICIT_CAST);
        item.type = this.cache.errorType;
      }

      node.type = this.typeContext;
    } else {
      for (var i = 0; i < items.length; i = i + 1 | 0) {
        if (items[i].kind !== NodeKind.KEY_VALUE) {
          if (items[i].kind !== NodeKind.ERROR) {
            throw new Error('assert items[i].kind == .ERROR (src/resolver/resolver.sk:3372:11)');
          }

          this.resolveNodesAsParameterizedExpressionsAfterError(items);
          return;
        }
      }

      for (var i = 0; i < items.length; i = i + 1 | 0) {
        var item = items[i];
        this.resolveKeyValue(item);
        keyType = this.mergeCommonLiteralType(keyType, item.itemKey(), node);
        valueType = this.mergeCommonLiteralType(valueType, item.itemValue(), node);
        item.type = this.cache.errorType;
      }

      if (keyType !== null && keyType.isIgnored(this.cache) || valueType !== null && valueType.isIgnored(this.cache)) {
        return;
      }

      if (keyType === null) {
        semanticErrorMapLiteralCommonTypeInferenceFailed(this.log, node.range, 'key');
        return;
      }

      var isString = keyType.isString(this.cache);
      var isInteger = keyType.isInteger(this.cache);

      if (!isString && !isInteger) {
        semanticErrorMapLiteralBadKeyType(this.log, node.range, keyType);
        return;
      }

      if (isInteger && !keyType.isInt(this.cache)) {
        keyType = this.cache.intType;

        for (var i = 0; i < items.length; i = i + 1 | 0) {
          this.checkConversion(keyType, items[i].itemKey(), CastKind.IMPLICIT_CAST);
        }
      }

      node.type = this.cache.parameterize(isString ? this.cache.stringMapType : this.cache.intMapType, [valueType]);
    }

    if (in_CompilerTarget.needsMapLiteralFactory(this.options.target)) {
      var literal = node.type.findMember('literal').symbol;
      var keys = [];
      var values = [];

      for (var i = 0; i < items.length; i = i + 1 | 0) {
        var item = items[i];
        keys.push(item.itemKey().replaceWith(null));
        values.push(item.itemValue().replaceWith(null));
      }

      node.become(Node.createCall(Node.createName(literal.name).withSymbol(literal).withType(this.cache.parameterize(literal.type, [valueType])), [Node.createList(keys).withType(this.cache.parameterizeListType(keyType)), Node.createList(values).withType(this.cache.parameterizeListType(valueType))]).withRange(node.range).withType(node.type));
    }
  };

  Resolver.prototype.mergeCommonLiteralType = function(commonType, child, parent) {
    if (commonType === null || child.type.isIgnored(this.cache)) {
      commonType = child.type;
    } else if (!commonType.isIgnored(this.cache)) {
      commonType = this.cache.commonImplicitType(commonType, child.type);

      if (commonType === null) {
        if (parent.kind === NodeKind.LIST) {
          semanticErrorListLiteralCommonTypeInferenceFailed(this.log, parent.range);
        } else {
          semanticErrorMapLiteralCommonTypeInferenceFailed(this.log, parent.range, child === child.parent.itemKey() ? 'key' : 'value');
        }

        commonType = this.cache.errorType;
      }
    }

    return commonType;
  };

  Resolver.prototype.resolveKeyValue = function(node) {
    this.resolveAsParameterizedExpression(node.itemKey());
    this.resolveAsParameterizedExpression(node.itemValue());
  };

  Resolver.prototype.resolveDot = function(node) {
    var target = node.dotTarget();
    var dotName = node.dotName();

    if (target !== null) {
      this.resolve(target, null);
    }

    var type = target !== null ? target.type : this.typeContext;

    if (type === null) {
      semanticErrorMissingTypeContext(this.log, node.range);
      return;
    }

    if (type.isIgnored(this.cache)) {
      return;
    }

    if (node.kind === NodeKind.DOT_ARROW || node.kind === NodeKind.DOT_COLON) {
      semanticErrorBadDotToken(this.log, target !== null ? dotName !== null ? Range.inner(target.range, dotName.range) : Range.after(node.range, target.range) : dotName !== null ? Range.before(node.range, dotName.range) : node.range);
      node.kind = NodeKind.DOT;
    }

    if (dotName === null) {
      return;
    }

    if (dotName.kind === NodeKind.STRING) {
      return;
    }

    var name = dotName.asString();
    var member = type.findMember(name);

    if (member === null) {
      semanticErrorUnknownMemberSymbol(this.log, dotName.range, name, type);
      return;
    }

    node.symbol = member.symbol;
    dotName.symbol = member.symbol;
    this.initializePotentiallyDuplicatedMember(member, dotName.range);

    var symbolIsType = in_SymbolKind.isType(member.symbol.kind);
    var targetIsType = target === null || target.kind === NodeKind.TYPE;

    if (!type.isNamespace()) {
      var isStatic = symbolIsType || member.symbol.isStatic();

      if (isStatic && !targetIsType) {
        semanticErrorMemberUnexpectedStatic(this.log, dotName.range, name);
      } else if (!isStatic && targetIsType) {
        semanticErrorMemberUnexpectedInstance(this.log, dotName.range, name);
      }
    }

    if (symbolIsType) {
      node.become(Node.createType(member.type).withRange(node.range).withSymbol(member.symbol));
    } else if (targetIsType) {
      node.become(Node.createName(member.symbol.name).withRange(node.range).withSymbol(member.symbol).withType(member.type));
    } else {
      node.type = member.type;
      dotName.type = member.type;
    }

    this.checkAccess(node.symbol, dotName.range);
    this.checkPureInsideFunction(dotName);
    this.maybeInlineConstant(node);
  };

  Resolver.prototype.resolveCall = function(node) {
    this.expandPreprocessorSequences(node);

    var value = node.callValue();
    var $arguments = node.callArguments();

    if (!in_NodeKind.isExpression(value.kind)) {
      throw new Error('assert value.kind.isExpression() (src/resolver/resolver.sk:3547:5)');
    }

    this.resolve(value, null);
    this.checkIsParameterized(value);

    var valueType = value.type;

    if (valueType.isIgnored(this.cache)) {
      this.resolveNodesAsParameterizedExpressionsAfterError($arguments);
      return;
    }

    if (value.kind === NodeKind.TYPE) {
      if (valueType.isList(this.cache)) {
        node.become(Node.createList([]).withRange(node.range).withType(valueType));
        return;
      }

      var member = valueType.$constructor();

      if (member === null) {
        semanticErrorUnconstructableType(this.log, value.range, valueType);
        this.resolveNodesAsParameterizedExpressionsAfterError($arguments);
        return;
      }

      this.initializeMember(member);

      if (valueType.symbol.isAbstract()) {
        var reason = valueType.symbol.reasonForAbstract;
        semanticErrorAbstractNew(this.log, value.range, valueType, reason.nameRange(), reason.fullName());
        this.resolveNodesAsParameterizedExpressionsAfterError($arguments);
        return;
      }

      var symbol = member.symbol;

      if (this.context.inPureFunction() && !symbol.isPure()) {
        semanticErrorPurityViolation(this.log, value.range);
      }

      node.symbol = symbol;
      valueType = member.type;

      if (valueType.isIgnored(this.cache)) {
        this.resolveNodesAsParameterizedExpressionsAfterError($arguments);
        return;
      }

      this.checkAccess(symbol, value.range);

      if (symbol.kind === SymbolKind.GLOBAL_FUNCTION) {
        value.become(Node.createName(symbol.name).withSymbol(symbol).withType(valueType).withRange(value.range));
      }
    }

    if (!valueType.isFunction()) {
      semanticErrorInvalidCall(this.log, value.range, valueType);
      this.resolveNodesAsParameterizedExpressionsAfterError($arguments);
      return;
    }

    node.type = valueType.resultType();
    this.resolveArguments($arguments, valueType.argumentTypes(), node.range, value.range);
  };

  Resolver.prototype.resolveSuperCall = function(node) {
    var $arguments = node.superCallArguments();

    if (this.context.functionSymbol === null || !this.context.functionSymbol.isObjectMember() || this.context.functionSymbol.overriddenMember === null || this.context.functionSymbol.kind === SymbolKind.CONSTRUCTOR_FUNCTION) {
      semanticErrorBadSuperCall(this.log, node.range);
      this.resolveNodesAsParameterizedExpressionsAfterError($arguments);
    } else {
      var member = this.context.functionSymbol.overriddenMember;
      this.initializeMember(member);

      var type = member.type;

      if (type.isIgnored(this.cache) || !type.isFunction()) {
        this.resolveNodesAsParameterizedExpressionsAfterError($arguments);
        return;
      }

      if (member.symbol.node.functionBlock() === null) {
        semanticErrorAbstractSuperCall(this.log, node.range, member.symbol.nameRange());
        this.resolveNodesAsParameterizedExpressionsAfterError($arguments);
        return;
      }

      this.resolveArguments($arguments, type.argumentTypes(), node.range, node.range);
      node.symbol = member.symbol;
      node.type = type.resultType();
    }
  };

  Resolver.prototype.resolveSequence = function(node) {
    var values = node.sequenceValues();

    for (var i = 0, n = values.length; i < n; i = i + 1 | 0) {
      var child = values[i];

      if (i < (n - 1 | 0)) {
        this.resolveAsParameterizedExpression(child);
        this.checkUnusedExpression(child);
      } else {
        this.resolveAsParameterizedExpressionWithConversion(child, this.typeContext, node.parent.kind === NodeKind.CAST ? CastKind.EXPLICIT_CAST : CastKind.IMPLICIT_CAST);
      }
    }

    node.type = in_List.last(values).type;
  };

  Resolver.prototype.resolveParameterize = function(node) {
    var value = node.parameterizeValue();
    var substitutions = node.parameterizeTypes();
    this.resolve(value, null);
    this.resolveNodesAsVariableTypes(substitutions);

    var unparameterized = value.type;

    if (unparameterized.isIgnored(this.cache)) {
      return;
    }

    if (!unparameterized.hasParameters() || unparameterized.isParameterized()) {
      semanticErrorCannotParameterize(this.log, value.range, unparameterized);
      return;
    }

    var parameters = unparameterized.symbol.parameters;
    var sortedParameters = unparameterized.symbol.sortedParameters;

    if (parameters.length !== substitutions.length) {
      semanticErrorParameterCount(this.log, Range.after(node.range, value.range), parameters.length, substitutions.length);
      return;
    }

    if (parameters.length !== sortedParameters.length) {
      throw new Error('assert parameters.size() == sortedParameters.size() (src/resolver/resolver.sk:3695:5)');
    }

    var sortedTypes = [];

    for (var i = 0; i < sortedParameters.length; i = i + 1 | 0) {
      var parameter = sortedParameters[i];
      var index = parameters.indexOf(parameter);
      var substitution = substitutions[index];

      if (parameter.type.isIgnored(this.cache)) {
        return;
      }

      var bound = parameter.type.bound();

      if (bound !== null) {
        if (i !== 0) {
          bound = this.cache.substitute(bound, sortedParameters.slice(0, i), sortedTypes.slice(0, i));
        }

        this.checkConversion(bound, substitution, CastKind.IMPLICIT_CAST);
      }

      if (substitution.type.isError(this.cache)) {
        return;
      }

      sortedTypes.push(substitution.type);
    }

    var types = [];

    for (var i = 0; i < substitutions.length; i = i + 1 | 0) {
      types.push(substitutions[i].type);
    }

    var parameterized = this.cache.parameterize(unparameterized, types);
    node.become(value.kind === NodeKind.TYPE ? Node.createType(parameterized).withRange(node.range).withSymbol(value.symbol) : value.replaceWith(null).withRange(node.range).withType(parameterized));
  };

  Resolver.prototype.resolveCast = function(node) {
    var type = node.castType();
    this.resolveAsParameterizedType(type);
    this.checkIsValidVariableType(type);
    this.resolveAsParameterizedExpressionWithConversion(node.castValue(), type.type, CastKind.EXPLICIT_CAST);
    node.type = type.type;
  };

  Resolver.prototype.traverseQuotedContent = function(node) {
    if (node.kind === NodeKind.QUOTED) {
      var value = node.quotedValue();
      this.resolve(value, null);
      node.become(value);
      return;
    }

    if (node.hasChildren()) {
      for (var i = 0; i < node.children.length; i = i + 1 | 0) {
        var child = node.children[i];

        if (child !== null) {
          this.traverseQuotedContent(child);
        }
      }
    }

    node.type = this.cache.errorType;
  };

  Resolver.prototype.resolveQuoted = function(node) {
    this.traverseQuotedContent(node.quotedValue());
  };

  Resolver.prototype.resolveVar = function(node) {
    semanticErrorUnexpectedNode(this.log, node.range, node.kind);
  };

  Resolver.prototype.resolveUnary = function(node) {
    var kind = node.kind;
    var value = node.unaryValue();

    if (kind === NodeKind.COMPLEMENT && this.typeContext !== null && this.typeContext.isEnumFlags()) {
      this.resolveAsParameterizedExpressionWithTypeContext(value, this.typeContext);
    } else {
      this.resolveAsParameterizedExpression(value);
    }

    var type = value.type;

    if (type.isIgnored(this.cache)) {
      return;
    }

    if (kind === NodeKind.POSITIVE || kind === NodeKind.NEGATIVE) {
      if (type.isEnum()) {
        node.type = this.cache.intType;
      } else if (type.isNumeric(this.cache)) {
        node.type = type;
      }
    } else if (in_NodeKind.isUnaryStorageOperator(kind)) {
      this.checkStorageOperator(node);

      if (!type.isEnum() && type.isNumeric(this.cache)) {
        this.checkStorage(value);
        node.type = type;
      }
    } else if (kind === NodeKind.NOT) {
      if (type.isBool(this.cache)) {
        node.type = type;
      }
    } else if (kind === NodeKind.COMPLEMENT) {
      if (type.isEnumFlags()) {
        node.type = type;
      } else if (type.isInteger(this.cache)) {
        node.type = this.cache.intType;
      }
    }

    if (node.type.isIgnored(this.cache)) {
      this.checkForOperatorOverload(node);
    } else {
      this.checkConversion(node.type, value, CastKind.IMPLICIT_CAST);
    }
  };

  Resolver.prototype.wrapWithToStringCall = function(node) {
    if (node.type.isIgnored(this.cache)) {
      return false;
    }

    var toString = node.type.findMember('toString');

    if (toString === null) {
      semanticErrorMissingToString(this.log, node.range, node.type);
      return false;
    }

    this.initializeMember(toString);

    if (toString.type.isIgnored(this.cache)) {
      return false;
    }

    if (toString.symbol.kind !== SymbolKind.INSTANCE_FUNCTION) {
      semanticErrorMissingToString(this.log, node.range, node.type);
      return false;
    }

    if (toString.type !== this.cache.toStringType) {
      semanticErrorToStringWrongType(this.log, node.range, this.cache.toStringType, toString.type, toString.symbol.nameRange());
      return false;
    }

    var children = node.removeChildren();
    var name = Node.createName('toString');
    var target = Node.createDot(node.clone().withChildren(children), name);
    var $call = Node.createCall(target, []);
    name.symbol = toString.symbol;
    target.symbol = toString.symbol;
    target.type = this.cache.toStringType;
    $call.type = this.cache.stringType;
    node.become($call);
    return true;
  };

  Resolver.prototype.resolveWithTypeContextTransfer = function(left, right) {
    if (!this.needsTypeContext(left)) {
      this.resolveAsParameterizedExpression(left);
      this.resolveAsParameterizedExpressionWithTypeContext(right, left.type);
    } else if (!this.needsTypeContext(right)) {
      this.resolveAsParameterizedExpression(right);
      this.resolveAsParameterizedExpressionWithTypeContext(left, right.type);
    }
  };

  Resolver.prototype.resolveBinary = function(node) {
    var kind = node.kind;
    var left = node.binaryLeft();
    var right = node.binaryRight();

    if (kind === NodeKind.IS) {
      this.resolveAsParameterizedExpression(left);
      this.resolveAsType(right);

      if (!left.type.isIgnored(this.cache) && !right.type.isIgnored(this.cache)) {
        semanticErrorNoMatchingOperator(this.log, node.range, kind, [left.type, right.type]);
      }

      node.type = this.cache.boolType;
      return;
    }

    if (in_NodeKind.isBinaryStorageOperator(kind)) {
      this.resolveAsParameterizedExpression(left);

      if (!left.type.isIgnored(this.cache)) {
        this.checkStorageOperator(node);
      }

      if (kind === NodeKind.ASSIGN || left.type.isInteger(this.cache) || left.type.isNumeric(this.cache) && !in_NodeKind.isBinaryBitwiseStorageOperator(kind)) {
        this.resolveAsParameterizedExpressionWithConversion(right, left.type, CastKind.IMPLICIT_CAST);
        this.checkStorage(left);
        node.type = left.type;
        return;
      } else if (kind === NodeKind.ASSIGN_ADD && left.type.isString(this.cache)) {
        this.resolveAsParameterizedExpression(right);

        if (!right.type.isString(this.cache)) {
          this.wrapWithToStringCall(right);
        }

        this.checkStorage(left);
        node.type = left.type;
        return;
      }
    } else if (kind === NodeKind.EQUAL || kind === NodeKind.NOT_EQUAL || kind === NodeKind.LESS_THAN || kind === NodeKind.GREATER_THAN || kind === NodeKind.LESS_THAN_OR_EQUAL || kind === NodeKind.GREATER_THAN_OR_EQUAL) {
      this.resolveWithTypeContextTransfer(left, right);
    } else if (kind === NodeKind.BITWISE_AND || kind === NodeKind.BITWISE_OR || kind === NodeKind.BITWISE_XOR) {
      if (this.typeContext !== null && this.typeContext.isEnumFlags()) {
        this.resolveAsParameterizedExpressionWithTypeContext(left, this.typeContext);
        this.resolveAsParameterizedExpressionWithTypeContext(right, this.typeContext);
      } else {
        this.resolveWithTypeContextTransfer(left, right);
      }
    }

    this.resolveAsParameterizedExpression(left);
    this.resolveAsParameterizedExpression(right);

    var leftType = left.type;
    var rightType = right.type;
    var commonType = null;

    if (leftType.isIgnored(this.cache) || rightType.isIgnored(this.cache)) {
      return;
    }

    if (kind === NodeKind.EQUAL || kind === NodeKind.NOT_EQUAL) {
      commonType = this.cache.commonImplicitType(leftType, rightType);

      if (commonType !== null) {
        node.type = this.cache.boolType;
      }
    } else if (kind === NodeKind.ADD || kind === NodeKind.SUBTRACT || kind === NodeKind.MULTIPLY || kind === NodeKind.DIVIDE) {
      if (leftType.isNumeric(this.cache) && rightType.isNumeric(this.cache)) {
        commonType = this.cache.commonImplicitType(leftType, rightType);

        if (commonType.isEnum()) {
          commonType = this.cache.intType;
        }

        node.type = commonType;
      } else if (kind === NodeKind.ADD) {
        if (leftType.isString(this.cache) && rightType.isString(this.cache)) {
          commonType = this.cache.stringType;
          node.type = commonType;
        } else if (leftType.isString(this.cache)) {
          if (this.wrapWithToStringCall(right)) {
            commonType = this.cache.stringType;
            node.type = commonType;
          } else {
            return;
          }
        } else if (rightType.isString(this.cache)) {
          if (this.wrapWithToStringCall(left)) {
            commonType = this.cache.stringType;
            node.type = commonType;
          } else {
            return;
          }
        }
      }
    } else if (kind === NodeKind.REMAINDER || kind === NodeKind.SHIFT_LEFT || kind === NodeKind.SHIFT_RIGHT) {
      if (leftType.isInteger(this.cache) && rightType.isInteger(this.cache)) {
        commonType = this.cache.intType;
        node.type = commonType;
      }
    } else if (kind === NodeKind.BITWISE_AND || kind === NodeKind.BITWISE_OR || kind === NodeKind.BITWISE_XOR) {
      if (leftType === rightType && leftType.isEnumFlags()) {
        commonType = leftType;
        node.type = commonType;
      } else if (leftType.isInteger(this.cache) && rightType.isInteger(this.cache)) {
        commonType = this.cache.intType;
        node.type = commonType;
      }
    } else if (kind === NodeKind.LOGICAL_AND || kind === NodeKind.LOGICAL_OR) {
      if (leftType.isBool(this.cache) && rightType.isBool(this.cache)) {
        commonType = this.cache.boolType;
        node.type = commonType;
      }
    } else if (kind === NodeKind.LESS_THAN || kind === NodeKind.GREATER_THAN || kind === NodeKind.LESS_THAN_OR_EQUAL || kind === NodeKind.GREATER_THAN_OR_EQUAL) {
      if (leftType.isNumeric(this.cache) && rightType.isNumeric(this.cache) || leftType.isString(this.cache) && rightType.isString(this.cache)) {
        commonType = this.cache.commonImplicitType(leftType, rightType);
        node.type = this.cache.boolType;
      }
    } else if (kind === NodeKind.POWER) {
      if (leftType.isNumeric(this.cache) && rightType.isNumeric(this.cache)) {
        var pow = this.cache.globalType.findMember('math').symbol.type.findMember('pow').symbol;
        this.initializeSymbol(pow);
        commonType = this.cache.doubleType;
        node.become(Node.createCall(Node.createName(pow.name).withSymbol(pow).withType(pow.type), [left.replaceWith(null), right.replaceWith(null)]).withRange(node.range).withType(commonType));
      }
    }

    if (node.type.isIgnored(this.cache)) {
      this.checkForOperatorOverload(node);
    } else if (commonType !== null) {
      this.checkConversion(commonType, left, CastKind.IMPLICIT_CAST);
      this.checkConversion(commonType, right, CastKind.IMPLICIT_CAST);
    }
  };

  Resolver.prototype.resolveTernary = function(node) {
    var left = node.ternaryLeft();
    var middle = node.ternaryMiddle();
    var right = node.ternaryRight();
    this.resolveAsParameterizedExpression(left);
    this.resolveAsParameterizedExpression(middle);
    this.resolveAsParameterizedExpression(right);
    this.checkForOperatorOverload(node);
  };

  Resolver.prototype.assessOperatorOverloadMatch = function(nodeTypes, argumentTypes) {
    if (nodeTypes.length !== (1 + argumentTypes.length | 0)) {
      throw new Error('assert nodeTypes.size() == 1 + argumentTypes.size() (src/resolver/resolver.sk:4070:5)');
    }

    var foundImplicitConversion = false;

    for (var i = 0; i < argumentTypes.length; i = i + 1 | 0) {
      var a = nodeTypes[i + 1 | 0];
      var b = argumentTypes[i];

      if (a !== b) {
        if (this.cache.canImplicitlyConvert(a, b)) {
          foundImplicitConversion = true;
        } else {
          return MatchKind.NONE;
        }
      }
    }

    return foundImplicitConversion ? MatchKind.INEXACT : MatchKind.EXACT;
  };

  Resolver.prototype.applyOperatorOverload = function(node, member) {
    var symbol = member.symbol;
    var argumentTypes = member.type.argumentTypes();
    var children = node.removeChildren();

    if (node.kind === NodeKind.IN) {
      children.reverse();
    }

    var dotTarget = children[0];
    var dotName = Node.createName(symbol.name).withSymbol(symbol).withType(member.type);
    var value = Node.createDot(dotTarget, dotName).withSymbol(symbol).withType(member.type);
    var $arguments = [];

    for (var i = 0; i < argumentTypes.length; i = i + 1 | 0) {
      var argument = children[i + 1 | 0];
      this.checkConversion(argumentTypes[i], argument, CastKind.IMPLICIT_CAST);
      $arguments.push(argument);
    }

    node.become(Node.createCall(value, $arguments).withRange(node.range).withType(member.type.resultType()));
  };

  Resolver.prototype.checkForOperatorOverload = function(node) {
    var children = node.children;
    var types = [];

    for (var i = 0; i < children.length; i = i + 1 | 0) {
      var type = children[i].type;

      if (type.isIgnored(this.cache)) {
        return;
      }

      types.push(type);
    }

    var kind = node.kind;

    if (kind === NodeKind.LESS_THAN || kind === NodeKind.LESS_THAN_OR_EQUAL || kind === NodeKind.GREATER_THAN || kind === NodeKind.GREATER_THAN_OR_EQUAL) {
      kind = NodeKind.COMPARE;
    }

    var typeForMatching = types;

    if (kind === NodeKind.IN) {
      typeForMatching = types.slice();
      typeForMatching.reverse();
    }

    var targetType = typeForMatching[0];

    if (targetType.symbol === null) {
      semanticErrorNoMatchingOperator(this.log, node.range, node.kind, types);
      return;
    }

    var overloads = targetType.symbol.operatorOverloadsForKind(kind);
    var bestMatch = MatchKind.INEXACT;
    var matches = [];
    var first = null;

    for (var i = 0; i < overloads.length; i = i + 1 | 0) {
      var overload = overloads[i];

      if (!overload.type.isFunction()) {
        throw new Error('assert overload.type.isFunction() (src/resolver/resolver.sk:4153:7)');
      }

      if ((overload.type.argumentTypes().length + 1 | 0) !== children.length) {
        throw new Error('assert overload.type.argumentTypes().size() + 1 == children.size() (src/resolver/resolver.sk:4154:7)');
      }

      var member = targetType.findOperatorOverload(overload);
      this.initializeMember(member);

      if (!member.type.isFunction()) {
        throw new Error('assert member.type.isFunction() (src/resolver/resolver.sk:4157:7)');
      }

      var match = this.assessOperatorOverloadMatch(typeForMatching, member.type.argumentTypes());

      if (match > bestMatch) {
        bestMatch = match;
        matches = [member];
      } else if (match === bestMatch) {
        matches.push(member);
      }

      if (i === 0) {
        first = member;
      }
    }

    if (matches.length === 0 && overloads.length === 1) {
      matches.push(first);
    }

    if (matches.length === 0) {
      semanticErrorNoMatchingOperator(this.log, node.range, node.kind, types);
    } else if (matches.length > 1) {
      semanticErrorAmbiguousOperator(this.log, node.range, node.kind, Resolver.fullNamesForMembers(matches));
    } else {
      var originalKind = node.kind;
      this.applyOperatorOverload(node, matches[0]);

      if (kind === NodeKind.COMPARE) {
        var children = node.removeChildren();
        var clone = node.clone().withChildren(children);
        node.become(Node.createBinary(originalKind, clone, Node.createInt(0).withType(this.cache.intType)).withType(this.cache.boolType));
      }
    }
  };

  Resolver.initializerListRange = function(node) {
    var superInitializer = node.superInitializer();
    var memberInitializers = node.memberInitializers();
    return Range.span((superInitializer !== null ? superInitializer : memberInitializers.children[0]).range, (memberInitializers.children.length < 1 ? superInitializer : memberInitializers.lastChild()).range);
  };

  Resolver.isAbstractFunction = function(symbol) {
    return in_SymbolKind.isFunction(symbol.kind) && (symbol.kind === SymbolKind.MERGED_INSTANCE_FUNCTION ? symbol.isAbstract() : symbol.node.functionBlock() === null);
  };

  Resolver.fullNamesForMembers = function(members) {
    var names = [];

    for (var i = 0; i < members.length; i = i + 1 | 0) {
      names.push(members[i].symbol.fullName());
    }

    return names;
  };

  function Scope(_0) {
    this.type = null;
    this.locals = null;
    this.lexicalParent = _0;
  }

  Scope.prototype.insert = function(member) {
    if (this.type !== null) {
      this.type.addMember(member);
      return;
    }

    this.insertLocal(member);
  };

  Scope.prototype.insertLocal = function(member) {
    if (this.locals === null) {
      this.locals = Object.create(null);
    }

    if (member.symbol.name in this.locals) {
      throw new Error('assert !(member.symbol.name in locals) (src/resolver/scope.sk:26:5)');
    }

    this.locals[member.symbol.name] = member;
  };

  Scope.prototype.find = function(name) {
    var member = this.findLocal(name);
    return member !== null ? member : this.lexicalParent !== null ? this.lexicalParent.find(name) : null;
  };

  Scope.prototype.findLocal = function(name) {
    if (this.locals !== null) {
      var member = in_StringMap.getOrDefault(this.locals, name, null);

      if (member !== null) {
        return member;
      }
    }

    if (this.type !== null) {
      var member = this.type.findMember(name);

      if (member !== null) {
        return member;
      }
    }

    return null;
  };

  var SymbolKind = {
    OTHER: 0,
    DEFINE: 1,
    AUTOMATIC: 2,
    AMBIGUOUS: 3,
    UNMERGED: 4,
    FORWARDED: 5,
    QUOTED_TYPE: 6,
    ALIAS: 7,
    OBJECT_PARAMETER: 8,
    FUNCTION_PARAMETER: 9,
    GLOBAL_NAMESPACE: 10,
    NAMESPACE: 11,
    ENUM: 12,
    ENUM_FLAGS: 13,
    CLASS: 14,
    INTERFACE: 15,
    GLOBAL_FUNCTION: 16,
    INSTANCE_FUNCTION: 17,
    CONSTRUCTOR_FUNCTION: 18,
    MERGED_INSTANCE_FUNCTION: 19,
    LOCAL_VARIABLE: 20,
    GLOBAL_VARIABLE: 21,
    INSTANCE_VARIABLE: 22
  };

  var SymbolFlag = {
    PUBLIC: 1,
    PRIVATE: 2,
    PROTECTED: 4,
    ABSTRACT: 8,
    FROM_EXTENSION: 16,
    OVERRIDE: 32,
    STATIC: 64,
    VIRTUAL: 128,
    FINAL: 256,
    INLINE: 512,
    CONST: 1024,
    PURE: 2048,
    EXPORT: 4096,
    IMPORT: 8192,
    INITIALIZING: 16384,
    INITIALIZED: 32768,
    EXTERN_C: 65536,
    PRIMITIVE: 131072,
    ENTRY_POINT: 262144,
    HAS_ANNOTATIONS: 524288,
    HAS_LOCATION_ERROR: 1048576,
    INITIALIZE_MASK: 49152
  };

  function Symbol(_0, _1) {
    this.flags = 0;
    this.type = null;
    this.node = null;
    this.enclosingSymbol = null;
    this.reasonForAbstract = null;
    this.overriddenMember = null;
    this.constant = null;
    this.identicalMembers = null;
    this.parameters = null;
    this.sortedParameters = null;
    this.operatorOverloads = null;
    this.operatorOverloadKinds = null;
    this.neededIncludes = null;
    this.emitAs = null;
    this.uniqueID = Symbol.generateUniqueID();
    this.name = _0;
    this.kind = _1;
  }

  Symbol.generateUniqueID = function() {
    Symbol.nextUniqueID = Symbol.nextUniqueID + 1 | 0;
    return Symbol.nextUniqueID;
  };

  Symbol.prototype.sortParametersByDependencies = function() {
    this.sortedParameters = this.parameters.slice();

    for (var i = 0; i < this.sortedParameters.length; i = i + 1 | 0) {
      var j = i;

      for (; j < this.sortedParameters.length; j = j + 1 | 0) {
        var k = i;
        var parameter = this.sortedParameters[j];

        if (!parameter.type.isParameter()) {
          continue;
        }

        var parameterBound = parameter.type.bound();

        if (parameterBound === null) {
          break;
        }

        for (; k < this.sortedParameters.length; k = k + 1 | 0) {
          var other = this.sortedParameters[k];

          if (parameter === other || !other.type.isParameter()) {
            continue;
          }

          if (parameterBound !== null && parameterBound.dependsOnParameter(other)) {
            break;
          }
        }

        if (k === this.sortedParameters.length) {
          break;
        }
      }

      if (j < this.sortedParameters.length) {
        in_List.swap(this.sortedParameters, i, j);
      }
    }
  };

  Symbol.prototype.addNeededInclude = function(name) {
    if (this.neededIncludes === null) {
      this.neededIncludes = [];
    }

    if (!(this.neededIncludes.indexOf(name) !== -1)) {
      this.neededIncludes.push(name);
    }
  };

  Symbol.prototype.registerOperatorOverload = function(kind) {
    if (this.operatorOverloadKinds === null) {
      this.operatorOverloadKinds = [];
    }

    if (!(this.operatorOverloadKinds.indexOf(kind) !== -1)) {
      this.operatorOverloadKinds.push(kind);
    }
  };

  Symbol.prototype.operatorOverloadsForKind = function(kind) {
    if (this.operatorOverloads === null) {
      this.operatorOverloads = Object.create(null);
    }

    var symbols = in_IntMap.getOrDefault(this.operatorOverloads, kind, null);

    if (symbols === null) {
      symbols = [];
      this.operatorOverloads[kind] = symbols;
    }

    return symbols;
  };

  Symbol.prototype.canonicalizeSiblingChain = function() {
    for (var previous = null, current = this.node; current !== null; previous = current, current = current.sibling) {
      if (current.kind !== NodeKind.EXTENSION) {
        if (previous !== null) {
          previous.sibling = current.sibling;
          current.sibling = this.node;
          this.node = current;
        }

        break;
      }
    }
  };

  Symbol.prototype.nameRange = function() {
    if (this.kind === SymbolKind.UNMERGED || this.kind === SymbolKind.MERGED_INSTANCE_FUNCTION) {
      return this.enclosingSymbol.nameRange();
    }

    if (this.kind === SymbolKind.FORWARDED) {
      return this.overriddenMember.symbol.nameRange();
    }

    return this.node.declarationName().range;
  };

  Symbol.prototype.fullName = function() {
    return this.enclosingSymbol !== null && !in_SymbolKind.isParameter(this.kind) && this.enclosingSymbol.kind !== SymbolKind.GLOBAL_NAMESPACE ? this.enclosingSymbol.fullName() + '.' + this.name : this.name;
  };

  Symbol.prototype.hasParameters = function() {
    return this.parameters !== null && this.parameters.length > 0;
  };

  Symbol.prototype.isEnumValue = function() {
    return in_SymbolKind.isVariable(this.kind) && this.enclosingSymbol !== null && in_SymbolKind.isEnum(this.enclosingSymbol.kind) && !this.isFromExtension();
  };

  Symbol.prototype.isObjectMember = function() {
    return this.enclosingSymbol !== null && in_SymbolKind.isObject(this.enclosingSymbol.kind);
  };

  Symbol.prototype.isEnumMember = function() {
    return this.enclosingSymbol !== null && in_SymbolKind.isEnum(this.enclosingSymbol.kind);
  };

  Symbol.prototype.isPrivate = function() {
    return (this.flags & SymbolFlag.PRIVATE) !== 0;
  };

  Symbol.prototype.isPrivateOrProtected = function() {
    return (this.flags & (SymbolFlag.PRIVATE | SymbolFlag.PROTECTED)) !== 0;
  };

  Symbol.prototype.isAbstract = function() {
    return (this.flags & SymbolFlag.ABSTRACT) !== 0;
  };

  Symbol.prototype.isFromExtension = function() {
    return (this.flags & SymbolFlag.FROM_EXTENSION) !== 0;
  };

  Symbol.prototype.isOverride = function() {
    return (this.flags & SymbolFlag.OVERRIDE) !== 0;
  };

  Symbol.prototype.isStatic = function() {
    return (this.flags & SymbolFlag.STATIC) !== 0;
  };

  Symbol.prototype.isVirtual = function() {
    return (this.flags & SymbolFlag.VIRTUAL) !== 0;
  };

  Symbol.prototype.isFinal = function() {
    return (this.flags & SymbolFlag.FINAL) !== 0;
  };

  Symbol.prototype.isInline = function() {
    return (this.flags & SymbolFlag.INLINE) !== 0;
  };

  Symbol.prototype.isConst = function() {
    return (this.flags & SymbolFlag.CONST) !== 0;
  };

  Symbol.prototype.isPure = function() {
    return (this.flags & SymbolFlag.PURE) !== 0;
  };

  Symbol.prototype.isImport = function() {
    return (this.flags & SymbolFlag.IMPORT) !== 0;
  };

  Symbol.prototype.isExport = function() {
    return (this.flags & SymbolFlag.EXPORT) !== 0;
  };

  Symbol.prototype.isImportOrExport = function() {
    return (this.flags & (SymbolFlag.IMPORT | SymbolFlag.EXPORT)) !== 0;
  };

  Symbol.prototype.isUninitialized = function() {
    if ((this.flags & SymbolFlag.INITIALIZE_MASK) === SymbolFlag.INITIALIZE_MASK) {
      throw new Error('assert (flags & .INITIALIZE_MASK) != .INITIALIZE_MASK (src/resolver/symbol.sk:370:5)');
    }

    return (this.flags & SymbolFlag.INITIALIZE_MASK) === 0;
  };

  Symbol.prototype.isInitializing = function() {
    if ((this.flags & SymbolFlag.INITIALIZE_MASK) === SymbolFlag.INITIALIZE_MASK) {
      throw new Error('assert (flags & .INITIALIZE_MASK) != .INITIALIZE_MASK (src/resolver/symbol.sk:375:5)');
    }

    return (this.flags & SymbolFlag.INITIALIZING) !== 0;
  };

  Symbol.prototype.isInitialized = function() {
    if ((this.flags & SymbolFlag.INITIALIZE_MASK) === SymbolFlag.INITIALIZE_MASK) {
      throw new Error('assert (flags & .INITIALIZE_MASK) != .INITIALIZE_MASK (src/resolver/symbol.sk:380:5)');
    }

    return (this.flags & SymbolFlag.INITIALIZED) !== 0;
  };

  Symbol.prototype.isPrimitive = function() {
    return (this.flags & SymbolFlag.PRIMITIVE) !== 0;
  };

  Symbol.prototype.isExternC = function() {
    return (this.flags & SymbolFlag.EXTERN_C) !== 0;
  };

  Symbol.prototype.isEntryPoint = function() {
    return (this.flags & SymbolFlag.ENTRY_POINT) !== 0;
  };

  Symbol.prototype.hasAnnotations = function() {
    return (this.flags & SymbolFlag.HAS_ANNOTATIONS) !== 0;
  };

  Symbol.prototype.hasLocationError = function() {
    return (this.flags & SymbolFlag.HAS_LOCATION_ERROR) !== 0;
  };

  function SymbolComparison() {
  }

  SymbolComparison.prototype.compare = function(left, right) {
    return left.uniqueID - right.uniqueID | 0;
  };

  function SymbolMotionPass(_0) {
    this.resolver = _0;
  }

  SymbolMotionPass.run = function(resolver) {
    var pass = new SymbolMotionPass(resolver);

    for (var i = 0; i < resolver.allSymbols.length; i = i + 1 | 0) {
      pass.moveSymbol(resolver.allSymbols[i]);
    }
  };

  SymbolMotionPass.prototype.moveSymbol = function(symbol) {
    var enclosingSymbol = symbol.enclosingSymbol;

    if (!symbol.isImport() && enclosingSymbol !== null && !in_SymbolKind.isParameter(symbol.kind) && (enclosingSymbol.isImport() || in_SymbolKind.isEnum(enclosingSymbol.kind) && symbol.isFromExtension() || in_SymbolKind.isGlobal(symbol.kind) && (in_CompilerTarget.moveStaticGlobalsOffGenericTypes(this.resolver.options.target) && enclosingSymbol.hasParameters() || in_CompilerTarget.moveNonVirtualSymbolsOffInterfaces(this.resolver.options.target) && enclosingSymbol.kind === SymbolKind.INTERFACE))) {
      var enclosingType = symbol.enclosingSymbol.type;
      var shadow = this.shadowForSymbol(enclosingSymbol);
      var member = enclosingType.members[symbol.name];

      if (member.symbol !== symbol) {
        throw new Error('assert member.symbol == symbol (src/resolver/symbolmotion.sk:24:7)');
      }

      delete enclosingType.members[symbol.name];

      if (shadow.findMember(symbol.name) !== null) {
        throw new Error('assert shadow.findMember(symbol.name) == null (src/resolver/symbolmotion.sk:26:7)');
      }

      shadow.addMember(member);
      symbol.enclosingSymbol = shadow.symbol;
      symbol.flags &= ~SymbolFlag.STATIC;

      var block = shadow.symbol.node.declarationBlock();
      var parent = symbol.node.parent;
      var node = symbol.node.remove();

      if (parent.kind === NodeKind.VARIABLE_CLUSTER) {
        node = Node.createVariableCluster(Node.createType(symbol.type), [node]);

        if (parent.children.length === 1) {
          parent.remove();
        }
      }

      block.appendChild(node);
    }
  };

  SymbolMotionPass.prototype.shadowForSymbol = function(symbol) {
    var inName = 'in_' + symbol.name;
    var enclosingSymbol = symbol.enclosingSymbol;
    var inMember = enclosingSymbol.type.findMember(inName);

    if (inMember !== null) {
      return inMember.type;
    }

    var inSymbol = this.resolver.createSymbol(inName, SymbolKind.NAMESPACE);
    inSymbol.enclosingSymbol = enclosingSymbol;

    var inType = new Type(inSymbol);
    inSymbol.type = inType;
    inMember = new Member(inSymbol);
    inMember.type = inType;
    enclosingSymbol.type.addMember(inMember);
    inSymbol.node = Node.createNamespace(Node.createName(inName).withSymbol(inSymbol), Node.createBlock([])).withSymbol(inSymbol);
    symbol.node.insertSiblingAfter(inSymbol.node);
    return inType;
  };

  function TreeShakingPass(_0) {
    this.includedSymbols = Object.create(null);
    this.includedTypes = Object.create(null);
    this.isFirstList = true;
    this.options = _0;
  }

  TreeShakingPass.run = function(program, options, resolver) {
    var pass = new TreeShakingPass(options);
    var allSymbols = resolver.allSymbols;

    for (var i = 0; i < allSymbols.length; i = i + 1 | 0) {
      var symbol = allSymbols[i];

      if (symbol.isExport() || symbol.isEntryPoint()) {
        pass.includeSymbol(symbol);
      }
    }

    var deadSymbolsWithOverrides = [];
    var isFixedPoint = false;

    for (var i = 0; i < allSymbols.length; i = i + 1 | 0) {
      var symbol = allSymbols[i];

      if (!(symbol.uniqueID in pass.includedSymbols) && symbol.overriddenMember !== null) {
        deadSymbolsWithOverrides.push(symbol);
      }
    }

    while (!isFixedPoint) {
      isFixedPoint = true;

      for (var i = 0; i < deadSymbolsWithOverrides.length; i = i + 1 | 0) {
        if (pass.includeDueToOverriddenMember(deadSymbolsWithOverrides[i])) {
          isFixedPoint = false;
        }
      }
    }

    var live = 0;

    for (var i = 0; i < allSymbols.length; i = i + 1 | 0) {
      var symbol = allSymbols[i];

      if (!pass.removeSymbolIfDead(symbol)) {
        allSymbols[live] = symbol;
        live = live + 1 | 0;
      }
    }

    while (allSymbols.length > live) {
      allSymbols.pop();
    }
  };

  TreeShakingPass.prototype.includeSymbol = function(symbol) {
    if (symbol.kind === SymbolKind.GLOBAL_VARIABLE && symbol.isConst() && this.options.foldAllConstants) {
      return;
    }

    if (!(symbol.uniqueID in this.includedSymbols)) {
      this.includedSymbols[symbol.uniqueID] = true;

      if (symbol.enclosingSymbol !== null && symbol.kind !== SymbolKind.INSTANCE_VARIABLE) {
        this.includeSymbol(symbol.enclosingSymbol);
      }

      if (in_SymbolKind.isObject(symbol.kind)) {
        var $constructor = symbol.type.$constructor();

        if ($constructor !== null) {
          this.includeSymbol($constructor.symbol);
        }
      }

      if (symbol.type.hasRelevantTypes()) {
        var types = symbol.type.relevantTypes;

        for (var i = 0; i < types.length; i = i + 1 | 0) {
          var relevantSymbol = types[i].symbol;

          if (relevantSymbol !== null) {
            this.includeSymbol(relevantSymbol);
          }
        }
      }

      var node = symbol.node;

      if (node !== null && !in_NodeKind.isNamedBlockDeclaration(node.kind)) {
        this.visit(node);
      }
    }
  };

  TreeShakingPass.prototype.includeType = function(type) {
    if (!(type.uniqueID in this.includedTypes)) {
      this.includedTypes[type.uniqueID] = true;

      if (type.symbol !== null) {
        this.includeSymbol(type.symbol);

        if (type.isParameterized()) {
          for (var i = 0; i < type.substitutions.length; i = i + 1 | 0) {
            this.includeType(type.substitutions[i]);
          }
        }
      }
    }
  };

  TreeShakingPass.prototype.visit = function(node) {
    if (node.symbol !== null) {
      this.includeSymbol(node.symbol);
    }

    if (node.type !== null) {
      this.includeType(node.type);
    }

    if (this.options.target === CompilerTarget.CPP && node.kind === NodeKind.LIST && this.isFirstList) {
      var literal = node.type.findMember('literal');

      if (literal === null) {
        throw new Error('assert literal != null (src/resolver/treeshaking.sk:135:7)');
      }

      this.includeSymbol(literal.symbol);
      this.isFirstList = false;
    }

    if (node.hasChildren()) {
      var children = node.children;

      for (var i = 0, n = children.length; i < n; i = i + 1 | 0) {
        var child = children[i];

        if (child !== null) {
          this.visit(child);
        }
      }
    }
  };

  TreeShakingPass.prototype.includeDueToOverriddenMember = function(symbol) {
    if (symbol.overriddenMember === null) {
      throw new Error('assert symbol.overriddenMember != null (src/resolver/treeshaking.sk:152:5)');
    }

    if (symbol.enclosingSymbol === null) {
      throw new Error('assert symbol.enclosingSymbol != null (src/resolver/treeshaking.sk:153:5)');
    }

    if (!(symbol.uniqueID in this.includedSymbols) && (symbol.overriddenMember.symbol.isImport() || symbol.enclosingSymbol.uniqueID in this.includedSymbols && symbol.overriddenMember.symbol.uniqueID in this.includedSymbols)) {
      this.includeSymbol(symbol);
      return true;
    }

    return false;
  };

  TreeShakingPass.prototype.removeSymbolIfDead = function(symbol) {
    if (symbol.kind === SymbolKind.LOCAL_VARIABLE) {
      return false;
    }

    if (!(symbol.uniqueID in this.includedSymbols)) {
      if (symbol.enclosingSymbol !== null) {
        delete symbol.enclosingSymbol.type.members[symbol.name];
      }

      if (symbol.node !== null && symbol.kind !== SymbolKind.QUOTED_TYPE) {
        symbol.node.remove();
        symbol.node = null;
      }

      return true;
    }

    if (symbol.overriddenMember !== null && !(symbol.overriddenMember.symbol.uniqueID in this.includedSymbols)) {
      symbol.overriddenMember = null;
    }

    return false;
  };

  function Type(_0) {
    this.members = Object.create(null);
    this.relevantTypes = null;
    this.substitutions = null;
    this.operatorOverloadCache = null;
    this.uniqueID = Type.generateUniqueID();
    this.symbol = _0;
  }

  Type.generateUniqueID = function() {
    Type.nextUniqueID = Type.nextUniqueID + 1 | 0;
    return Type.nextUniqueID;
  };

  Type.prototype.findOperatorOverload = function(symbol) {
    if (this.operatorOverloadCache === null) {
      this.operatorOverloadCache = Object.create(null);
    }

    var member = in_IntMap.getOrDefault(this.operatorOverloadCache, symbol.uniqueID, null);

    if (member === null) {
      var list = in_StringMap.values(this.members);

      for (var i = 0; i < list.length; i = i + 1 | 0) {
        if (list[i].symbol === symbol) {
          member = list[i];
          break;
        }
      }
    }

    this.operatorOverloadCache[symbol.uniqueID] = member;
    return member;
  };

  Type.prototype.sortedMembers = function() {
    var result = in_StringMap.values(this.members);
    result.sort(bindCompare(MemberComparison.INSTANCE));
    return result;
  };

  Type.prototype.$constructor = function() {
    if (this.symbol === null) {
      return null;
    }

    return in_StringMap.getOrDefault(this.members, 'new', null);
  };

  Type.prototype.hasBaseType = function(type) {
    if (this.isParameter()) {
      var upper = this.bound();
      return upper !== null && upper.hasBaseType(type);
    }

    if (!this.isClass() && !this.isInterface()) {
      return false;
    }

    if (this === type) {
      return true;
    }

    if (this.relevantTypes !== null) {
      for (var i = 0; i < this.relevantTypes.length; i = i + 1 | 0) {
        if (this.relevantTypes[i].hasBaseType(type)) {
          return true;
        }
      }
    }

    return false;
  };

  Type.prototype.hasBaseSymbol = function(symbol) {
    if (this.isParameter()) {
      var upper = this.bound();
      return upper !== null && upper.hasBaseSymbol(symbol);
    }

    if (!this.isClass() && !this.isInterface()) {
      return false;
    }

    if (this.symbol === symbol) {
      return true;
    }

    if (this.relevantTypes !== null) {
      for (var i = 0; i < this.relevantTypes.length; i = i + 1 | 0) {
        if (this.relevantTypes[i].hasBaseSymbol(symbol)) {
          return true;
        }
      }
    }

    return false;
  };

  Type.prototype.addMember = function(member) {
    this.members[member.symbol.name] = member;
  };

  Type.prototype.copyMembersFrom = function(other) {
    var otherMembers = in_StringMap.values(other.members);

    for (var i = 0; i < otherMembers.length; i = i + 1 | 0) {
      var member = otherMembers[i];

      if (!(member.symbol.name in this.members)) {
        this.members[member.symbol.name] = member;
      }
    }
  };

  Type.prototype.findMember = function(name) {
    return in_StringMap.getOrDefault(this.members, name, null);
  };

  Type.environmentToString = function(parameters, substitutions) {
    if (parameters.length !== substitutions.length) {
      throw new Error('assert parameters.size() == substitutions.size() (src/resolver/type.sk:123:5)');
    }

    var text = '[';

    for (var i = 0; i < parameters.length; i = i + 1 | 0) {
      if (i !== 0) {
        text += ', ';
      }

      text += parameters[i].name + ' => ' + substitutions[i];
    }

    return text + ']';
  };

  Type.prototype.toString = function() {
    if (this.substitutions !== null && this.substitutions.length !== this.symbol.parameters.length) {
      throw new Error('assert substitutions == null || substitutions.size() == symbol.parameters.size() (src/resolver/type.sk:133:5)');
    }

    var parameterText = '';

    if (this.hasParameters()) {
      parameterText = '<';

      for (var i = 0; i < this.symbol.parameters.length; i = i + 1 | 0) {
        if (i !== 0) {
          parameterText += ', ';
        }

        parameterText += this.isParameterized() ? this.substitutions[i].toString() : this.symbol.parameters[i].name;
      }

      parameterText += '>';
    }

    if (this.isFunction()) {
      var text = this.resultType() + ' fn' + parameterText + '(';
      var $arguments = this.argumentTypes();

      for (var i = 0; i < $arguments.length; i = i + 1 | 0) {
        if (i !== 0) {
          text += ', ';
        }

        text += $arguments[i];
      }

      return text + ')';
    }

    return this.symbol.fullName() + parameterText;
  };

  Type.prototype.hasParameters = function() {
    return this.symbol !== null && this.symbol.hasParameters();
  };

  Type.prototype.isParameterized = function() {
    return this.substitutions !== null;
  };

  Type.prototype.hasRelevantTypes = function() {
    return this.relevantTypes !== null && this.relevantTypes.length > 0;
  };

  Type.prototype.baseClass = function() {
    if (!this.isClass()) {
      throw new Error('assert isClass() (src/resolver/type.sk:173:5)');
    }

    if (!this.hasRelevantTypes()) {
      return null;
    }

    var first = this.relevantTypes[0];
    return first.isClass() ? first : null;
  };

  Type.prototype.bound = function() {
    if (!this.isParameter()) {
      throw new Error('assert isParameter() (src/resolver/type.sk:180:5)');
    }

    return this.hasRelevantTypes() ? this.relevantTypes[0] : null;
  };

  Type.prototype.dependsOnParameter = function(parameter) {
    if (this.symbol === parameter || this.hasParameters() && this.symbol.parameters.indexOf(parameter) !== -1 || this.isParameterized() && this.substitutions.indexOf(parameter.type) !== -1) {
      return true;
    }

    if (this.hasRelevantTypes()) {
      for (var i = 0; i < this.relevantTypes.length; i = i + 1 | 0) {
        var type = this.relevantTypes[i];

        if (type.dependsOnParameter(parameter)) {
          return true;
        }
      }
    }

    return false;
  };

  Type.prototype.resultType = function() {
    if (!this.isFunction()) {
      throw new Error('assert isFunction() (src/resolver/type.sk:202:5)');
    }

    if (!this.hasRelevantTypes()) {
      throw new Error('assert hasRelevantTypes() (src/resolver/type.sk:203:5)');
    }

    return this.relevantTypes[0];
  };

  Type.prototype.argumentTypes = function() {
    if (!this.isFunction()) {
      throw new Error('assert isFunction() (src/resolver/type.sk:208:5)');
    }

    if (!this.hasRelevantTypes()) {
      throw new Error('assert hasRelevantTypes() (src/resolver/type.sk:209:5)');
    }

    return this.relevantTypes.slice(1, this.relevantTypes.length);
  };

  Type.prototype.isVoid = function(cache) {
    return this === cache.voidType;
  };

  Type.prototype.isInt = function(cache) {
    return this === cache.intType;
  };

  Type.prototype.isNull = function(cache) {
    return this === cache.nullType;
  };

  Type.prototype.isBool = function(cache) {
    return this === cache.boolType;
  };

  Type.prototype.isFloat = function(cache) {
    return this === cache.floatType;
  };

  Type.prototype.isDouble = function(cache) {
    return this === cache.doubleType;
  };

  Type.prototype.isString = function(cache) {
    return this === cache.stringType;
  };

  Type.prototype.isPrimitive = function() {
    return this.symbol !== null && this.symbol.isPrimitive();
  };

  Type.prototype.isList = function(cache) {
    return this.symbol === cache.listType.symbol;
  };

  Type.prototype.isStringMap = function(cache) {
    return this.symbol === cache.stringMapType.symbol;
  };

  Type.prototype.isIntMap = function(cache) {
    return this.symbol === cache.intMapType.symbol;
  };

  Type.prototype.isError = function(cache) {
    return this === cache.errorType;
  };

  Type.prototype.isIgnored = function(cache) {
    return this.isError(cache) || this.isQuoted();
  };

  Type.prototype.isQuoted = function() {
    return this.symbol !== null && this.symbol.kind === SymbolKind.QUOTED_TYPE;
  };

  Type.prototype.isFunction = function() {
    return this.symbol === null || in_SymbolKind.isFunction(this.symbol.kind);
  };

  Type.prototype.isNamespace = function() {
    return this.symbol !== null && in_SymbolKind.isNamespace(this.symbol.kind);
  };

  Type.prototype.isEnum = function() {
    return this.symbol !== null && in_SymbolKind.isEnum(this.symbol.kind);
  };

  Type.prototype.isRegularEnum = function() {
    return this.symbol !== null && this.symbol.kind === SymbolKind.ENUM;
  };

  Type.prototype.isEnumFlags = function() {
    return this.symbol !== null && this.symbol.kind === SymbolKind.ENUM_FLAGS;
  };

  Type.prototype.isParameter = function() {
    return this.symbol !== null && in_SymbolKind.isParameter(this.symbol.kind);
  };

  Type.prototype.isObject = function() {
    return this.symbol !== null && in_SymbolKind.isObject(this.symbol.kind);
  };

  Type.prototype.isClass = function() {
    return this.symbol !== null && this.symbol.kind === SymbolKind.CLASS;
  };

  Type.prototype.isInterface = function() {
    return this.symbol !== null && this.symbol.kind === SymbolKind.INTERFACE;
  };

  Type.prototype.isReference = function() {
    if (this.isClass()) {
      return !this.isPrimitive();
    }

    return this.isInterface() || this.isFunction() || this.isParameter() && this.bound() !== null;
  };

  Type.prototype.isInteger = function(cache) {
    return this.isInt(cache) || this.isEnum();
  };

  Type.prototype.isReal = function(cache) {
    return this.isFloat(cache) || this.isDouble(cache);
  };

  Type.prototype.isNumeric = function(cache) {
    return this.isInteger(cache) || this.isReal(cache);
  };

  Type.prototype.isDynamic = function() {
    return this.isQuoted() && this.symbol.node.kind === NodeKind.NAME && this.symbol.node.asString() === 'dynamic';
  };

  function TypeCache() {
    this.globalType = null;
    this.nullType = null;
    this.errorType = null;
    this.voidType = null;
    this.intType = null;
    this.boolType = null;
    this.floatType = null;
    this.doubleType = null;
    this.stringType = null;
    this.listType = null;
    this.stringMapType = null;
    this.intMapType = null;
    this.toStringType = null;
    this.hashTable = Object.create(null);
    this.globalType = this.createType(new Symbol('<global>', SymbolKind.GLOBAL_NAMESPACE), 0);
    this.nullType = this.createType(new Symbol('null', SymbolKind.OTHER), 0);
    this.errorType = this.createType(new Symbol('<error>', SymbolKind.OTHER), 0);
  }

  TypeCache.prototype.insertGlobals = function(scope) {
    scope.type = this.globalType;
  };

  TypeCache.prototype.linkGlobals = function(scope) {
    this.voidType = TypeCache.findType(scope, 'void', SymbolFlag.PRIMITIVE);
    this.intType = TypeCache.findType(scope, 'int', SymbolFlag.PRIMITIVE);
    this.boolType = TypeCache.findType(scope, 'bool', SymbolFlag.PRIMITIVE);
    this.floatType = TypeCache.findType(scope, 'float', SymbolFlag.PRIMITIVE);
    this.doubleType = TypeCache.findType(scope, 'double', SymbolFlag.PRIMITIVE);
    this.stringType = TypeCache.findType(scope, 'string', SymbolFlag.PRIMITIVE);
    this.listType = TypeCache.findType(scope, 'List', 0);
    this.stringMapType = TypeCache.findType(scope, 'StringMap', 0);
    this.intMapType = TypeCache.findType(scope, 'IntMap', 0);
    this.toStringType = this.functionType(this.stringType, []);
  };

  TypeCache.prototype.createType = function(symbol, flags) {
    var type = new Type(symbol);
    symbol.type = type;
    symbol.flags |= SymbolFlag.INITIALIZED | flags;
    symbol.enclosingSymbol = this.globalType === null ? null : this.globalType.symbol;
    return type;
  };

  TypeCache.findType = function(scope, name, flags) {
    var symbol = scope.findLocal(name).symbol;
    symbol.flags |= flags;
    return symbol.type;
  };

  TypeCache.commonBaseClass = function(left, right) {
    for (var a = left; a !== null; a = a.baseClass()) {
      for (var b = right; b !== null; b = b.baseClass()) {
        if (a === b) {
          return a;
        }
      }
    }

    return null;
  };

  TypeCache.computeHashCode = function(symbol, relevantTypes) {
    var seed = symbol === null ? -1 : symbol.type.uniqueID;

    for (var i = 0; i < relevantTypes.length; i = i + 1 | 0) {
      seed = hashCombine(seed, relevantTypes[i].uniqueID);
    }

    return seed;
  };

  TypeCache.areTypeListsEqual = function(left, right) {
    var n = left.length;

    if (n !== right.length) {
      return false;
    }

    for (var i = 0; i < n; i = i + 1 | 0) {
      if (left[i] !== right[i]) {
        return false;
      }
    }

    return true;
  };

  TypeCache.prototype.substitute = function(type, parameters, substitutions) {
    if (parameters.length !== substitutions.length) {
      throw new Error('assert parameters.size() == substitutions.size() (src/resolver/typecache.sk:97:5)');
    }

    if (trace.GENERICS) {
      trace.log('substitute ' + type + ' with ' + Type.environmentToString(parameters, substitutions));
      trace.indent();
    }

    var result = null;

    if (type.symbol === null) {
      result = this.parameterize(null, this.substituteAll(type.relevantTypes, parameters, substitutions));
    } else if (in_SymbolKind.isFunction(type.symbol.kind)) {
      result = new Type(type.symbol);
      result.relevantTypes = this.substituteAll(type.relevantTypes, parameters, substitutions);
    } else if (!type.hasParameters()) {
      var index = parameters.indexOf(type.symbol);
      result = index >= 0 ? substitutions[index] : type;
    } else {
      if (type.substitutions === null) {
        throw new Error('assert type.substitutions != null (src/resolver/typecache.sk:113:7)');
      }

      result = this.parameterize(type, this.substituteAll(type.substitutions, parameters, substitutions));
    }

    if (trace.GENERICS) {
      trace.log('substitute gave ' + result);
      trace.dedent();
    }

    return result;
  };

  TypeCache.prototype.substituteAll = function(types, parameters, substitutions) {
    if (parameters.length !== substitutions.length) {
      throw new Error('assert parameters.size() == substitutions.size() (src/resolver/typecache.sk:125:5)');
    }

    var results = [];

    for (var i = 0; i < types.length; i = i + 1 | 0) {
      results.push(this.substitute(types[i], parameters, substitutions));
    }

    return results;
  };

  TypeCache.prototype.ensureTypeIsParameterized = function(unparameterized) {
    if (unparameterized.isParameterized()) {
      throw new Error('assert !unparameterized.isParameterized() (src/resolver/typecache.sk:137:5)');
    }

    if (unparameterized.hasParameters()) {
      var parameters = unparameterized.symbol.parameters;
      var substitutions = [];

      for (var i = 0; i < parameters.length; i = i + 1 | 0) {
        substitutions.push(parameters[i].type);
      }

      return this.parameterize(unparameterized, substitutions);
    }

    return unparameterized;
  };

  TypeCache.prototype.parameterize = function(unparameterized, substitutions) {
    var symbol = unparameterized !== null ? unparameterized.symbol : null;

    if (symbol !== null) {
      if (!symbol.hasParameters()) {
        throw new Error('assert symbol.hasParameters() (src/resolver/typecache.sk:153:7)');
      }

      if (symbol.type.isParameterized()) {
        throw new Error('assert !symbol.type.isParameterized() (src/resolver/typecache.sk:154:7)');
      }

      if (symbol.parameters.length !== substitutions.length) {
        throw new Error('assert symbol.parameters.size() == substitutions.size() (src/resolver/typecache.sk:155:7)');
      }
    }

    var hash = TypeCache.computeHashCode(symbol, substitutions);
    var existingTypes = in_IntMap.getOrDefault(this.hashTable, hash, null);

    if (existingTypes !== null) {
      for (var i = 0; i < existingTypes.length; i = i + 1 | 0) {
        var existing = existingTypes[i];

        if (symbol === existing.symbol && symbol !== null && substitutions.length !== existing.substitutions.length) {
          throw new Error('assert symbol != existing.symbol || symbol == null || substitutions.size() == existing.substitutions.size() (src/resolver/typecache.sk:166:9)');
        }

        if (symbol === existing.symbol && (symbol === null && TypeCache.areTypeListsEqual(substitutions, existing.relevantTypes) || symbol !== null && TypeCache.areTypeListsEqual(substitutions, existing.substitutions))) {
          return existing;
        }
      }
    } else {
      existingTypes = [];
      this.hashTable[hash] = existingTypes;
    }

    if (trace.GENERICS && symbol !== null && substitutions !== null) {
      trace.log('parameterize ' + (unparameterized !== null ? unparameterized.toString() : 'null') + ' with ' + Type.environmentToString(symbol.parameters, substitutions));
      trace.indent();
    }

    var type = new Type(symbol);

    if (symbol !== null) {
      type.substitutions = substitutions;
      type.relevantTypes = this.substituteAll(unparameterized.relevantTypes, symbol.parameters, substitutions);

      var members = in_StringMap.values(unparameterized.members);

      for (var i = 0; i < members.length; i = i + 1 | 0) {
        var member = members[i];
        var clone = new Member(member.symbol);
        clone.dependency = member.dependency !== null ? member.dependency : member;
        clone.parameterizedType = type;

        var parameterizedType = member.parameterizedType;

        if (parameterizedType !== null && parameterizedType !== unparameterized) {
          var merged = [];

          for (var j = 0; j < parameterizedType.substitutions.length; j = j + 1 | 0) {
            var parameter = parameterizedType.symbol.parameters[j];
            var index = symbol.parameters.indexOf(parameter);
            merged.push(index >= 0 ? substitutions[index] : this.substitute(parameterizedType.substitutions[j], symbol.parameters, substitutions));
          }

          clone.parameterizedType = this.parameterize(parameterizedType.symbol.type, merged);
        }

        type.addMember(clone);
      }

      if (trace.GENERICS && substitutions !== null) {
        trace.log('parameterize gave ' + type);
        trace.dedent();
      }
    } else {
      type.relevantTypes = substitutions;
    }

    existingTypes.push(type);
    return type;
  };

  TypeCache.prototype.parameterizeListType = function(itemType) {
    return this.parameterize(this.listType, [itemType]);
  };

  TypeCache.prototype.functionType = function(result, $arguments) {
    $arguments.unshift(result);
    return this.parameterize(null, $arguments);
  };

  TypeCache.prototype.canCastToNumeric = function(type) {
    return type.isNumeric(this) || type.isBool(this);
  };

  TypeCache.prototype.commonImplicitType = function(left, right) {
    if (left === right) {
      return left;
    }

    if (this.canImplicitlyConvert(left, right)) {
      return right;
    }

    if (this.canImplicitlyConvert(right, left)) {
      return left;
    }

    if (left.isNumeric(this) && right.isNumeric(this)) {
      return left.isInteger(this) && right.isInteger(this) ? this.intType : left.isFloat(this) && right.isFloat(this) ? this.floatType : this.doubleType;
    }

    if (left.isClass() && right.isClass()) {
      return TypeCache.commonBaseClass(left, right);
    }

    return null;
  };

  TypeCache.prototype.canImplicitlyConvert = function(from, to) {
    if (from === to) {
      return true;
    }

    if (from.isNull(this) && to.isReference()) {
      return true;
    }

    if ((from.isInteger(this) || from.isReal(this)) && to.isReal(this)) {
      return true;
    }

    if (from.isEnum() && (to.isInt(this) || to.isDouble(this))) {
      return true;
    }

    if (from.hasBaseType(to)) {
      return true;
    }

    return false;
  };

  TypeCache.prototype.canExplicitlyConvert = function(from, to) {
    if (this.canImplicitlyConvert(from, to)) {
      return true;
    }

    if (this.canCastToNumeric(from) && this.canCastToNumeric(to)) {
      return true;
    }

    if (to.hasBaseType(from)) {
      return true;
    }

    return false;
  };

  function FrontendFileAccess() {
  }

  FrontendFileAccess.prototype.contentsOfFile = function(sourcePath, relativePath) {
    var path = joinPath(splitPath(sourcePath).directory, relativePath);
    var contents = io.readFile(path);
    return contents !== null ? new Source(path, contents.value) : null;
  };

  var Option = {
    CONFIG: 0,
    DEFINE: 1,
    ERROR_LIMIT: 2,
    FOLD_CONSTANTS: 3,
    GC: 4,
    GLOBALIZE: 5,
    HELP: 6,
    INCLUDE_LIBRARIES: 7,
    INLINE: 8,
    LIBRARY: 9,
    MANGLE: 10,
    MINIFY: 11,
    OUTPUT_DIRECTORY: 12,
    OUTPUT_FILE: 13,
    RELEASE: 14,
    REMOVE_ASSERTS: 15,
    SOURCE_MAP: 16,
    TARGET: 17,
    VERBOSE: 18
  };

  var frontend = {};

  var io = {};

  var OptionType = {
    BOOL: 0,
    INT: 1,
    STRING: 2,
    STRING_LIST: 3
  };

  function OptionData(_0, _1, _2, _3, _4) {
    this.parser = _0;
    this.type = _1;
    this.option = _2;
    this.name = _3;
    this.description = _4;
  }

  OptionData.prototype.nameText = function() {
    return this.name + (this.type === OptionType.BOOL ? '' : this.type === OptionType.STRING_LIST ? ':___' : '=___');
  };

  OptionData.prototype.aliases = function(names) {
    for (var i = 0; i < names.length; i = i + 1 | 0) {
      this.parser.map[names[i]] = this;
    }

    return this;
  };

  function OptionParser() {
    this.options = [];
    this.map = Object.create(null);
    this.optionalArguments = Object.create(null);
    this.normalArguments = [];
    this.source = null;
  }

  OptionParser.prototype.define = function(type, option, name, description) {
    var data = new OptionData(this, type, option, name, description);
    this.map[name] = data;
    this.options.push(data);
    return data;
  };

  OptionParser.prototype.nodeForOption = function(option) {
    return in_IntMap.getOrDefault(this.optionalArguments, option, null);
  };

  OptionParser.prototype.boolForOption = function(option, defaultValue) {
    var node = this.nodeForOption(option);
    return node !== null ? node.asBool() : defaultValue;
  };

  OptionParser.prototype.intForOption = function(option, defaultValue) {
    var node = this.nodeForOption(option);
    return node !== null ? node.asInt() : defaultValue;
  };

  OptionParser.prototype.stringRangeForOption = function(option) {
    var node = this.nodeForOption(option);
    return node !== null ? node.range : null;
  };

  OptionParser.prototype.stringRangeListForOption = function(option) {
    var node = this.nodeForOption(option);
    var ranges = [];

    if (node !== null) {
      for (var i = 0; i < node.children.length; i = i + 1 | 0) {
        ranges.push(node.children[i].range);
      }
    }

    return ranges;
  };

  OptionParser.prototype.parse = function(log, $arguments) {
    this.source = new Source('<arguments>', '');

    var ranges = [];

    for (var i = 0; i < $arguments.length; i = i + 1 | 0) {
      var argument = $arguments[i];
      var needsQuotes = argument.indexOf(' ') !== -1;
      var start = this.source.contents.length + (needsQuotes | 0) | 0;
      ranges.push(new Range(this.source, start, start + argument.length | 0));
      this.source.contents += needsQuotes ? "'" + argument + "' " : argument + ' ';
    }

    for (var i = 0; i < $arguments.length; i = i + 1 | 0) {
      var argument = $arguments[i];
      var range = ranges[i];

      if (argument === '' || argument.charCodeAt(0) !== 45 && !(argument in this.map)) {
        this.normalArguments.push(range);
        continue;
      }

      var equals = argument.indexOf('=');
      var colon = argument.indexOf(':');
      var separator = equals >= 0 && (colon < 0 || equals < colon) ? equals : colon;
      var name = separator >= 0 ? argument.slice(0, separator) : argument;
      var data = in_StringMap.getOrDefault(this.map, name, null);

      if (data === null) {
        commandLineErrorBadFlag(log, range.fromStart(name.length), name);
        continue;
      }

      var text = argument.slice(separator + 1 | 0, argument.length);
      var separatorRange = separator < 0 ? Range.EMPTY : range.slice(separator, separator + 1 | 0);
      var textRange = range.fromEnd(text.length);

      switch (data.type) {
      case 0:
        if (separator < 0) {
          text = 'true';
        } else if (argument.charCodeAt(separator) !== 61) {
          commandLineErrorExpectedToken(log, separatorRange, '=', argument[separator], argument);
          continue;
        } else if (text !== 'true' && text !== 'false') {
          commandLineErrorNonBooleanValue(log, textRange, text, argument);
          continue;
        }

        if (data.option in this.optionalArguments) {
          commandLineWarningDuplicateFlagValue(log, textRange, name, this.optionalArguments[data.option].range);
        }

        this.optionalArguments[data.option] = Node.createBool(text === 'true').withRange(textRange);
        break;

      case 1:
        if (separator < 0) {
          commandLineErrorMissingValue(log, textRange, data.nameText());
        } else if (argument.charCodeAt(separator) !== 61) {
          commandLineErrorExpectedToken(log, separatorRange, '=', argument[separator], argument);
        } else if (!OptionParser.isInteger(text)) {
          commandLineErrorNonIntegerValue(log, textRange, text, argument);
        } else {
          if (data.option in this.optionalArguments) {
            commandLineWarningDuplicateFlagValue(log, textRange, name, this.optionalArguments[data.option].range);
          }

          this.optionalArguments[data.option] = Node.createInt(parseIntLiteral(text, 10)).withRange(textRange);
        }
        break;

      case 2:
        if (separator < 0) {
          commandLineErrorMissingValue(log, textRange, data.nameText());
        } else if (argument.charCodeAt(separator) !== 61) {
          commandLineErrorExpectedToken(log, separatorRange, '=', argument[separator], argument);
        } else {
          if (data.option in this.optionalArguments) {
            commandLineWarningDuplicateFlagValue(log, textRange, name, this.optionalArguments[data.option].range);
          }

          this.optionalArguments[data.option] = Node.createString(text).withRange(textRange);
        }
        break;

      case 3:
        if (separator < 0) {
          commandLineErrorMissingValue(log, textRange, data.nameText());
        } else if (argument.charCodeAt(separator) !== 58) {
          commandLineErrorExpectedToken(log, separatorRange, ':', argument[separator], argument);
          continue;
        } else {
          var node = null;

          if (data.option in this.optionalArguments) {
            node = this.optionalArguments[data.option];
          } else {
            node = Node.createList([]);
            this.optionalArguments[data.option] = node;
          }

          node.appendChild(Node.createString(text).withRange(textRange));
        }
        break;
      }
    }
  };

  OptionParser.prototype.usageText = function(wrapWidth) {
    var text = '';
    var columnWidth = 0;

    for (var i = 0; i < this.options.length; i = i + 1 | 0) {
      var width = this.options[i].nameText().length + 4 | 0;

      if (columnWidth < width) {
        columnWidth = width;
      }
    }

    var columnText = in_string.repeat(' ', columnWidth);

    for (var i = 0; i < this.options.length; i = i + 1 | 0) {
      var option = this.options[i];
      var nameText = option.nameText();
      text += '\n  ' + nameText + in_string.repeat(' ', (columnWidth - nameText.length | 0) - 2 | 0);

      var lines = prettyPrint.wrapWords(option.description, wrapWidth - columnWidth | 0);

      for (var j = 0; j < lines.length; j = j + 1 | 0) {
        text += (j > 0 ? columnText : '') + lines[j] + '\n';
      }
    }

    return text + '\n';
  };

  OptionParser.isInteger = function(text) {
    var found = false;

    for (var i = in_string.startsWith(text, '-') ? 1 : 0; i < text.length; i = i + 1 | 0) {
      var c = text.charCodeAt(i);

      if (c < 48 || c > 57) {
        return false;
      }

      found = true;
    }

    return found;
  };

  var in_string = {};

  var in_List = {};

  var in_StringMap = {};

  var in_IntMap = {};

  var in_OperatingSystem = {};

  var in_NodeKind = {};

  var in_CompilerTarget = {};

  var in_Precedence = {};

  var in_SymbolKind = {};

  var in_TokenKind = {};

  in_string.startsWith = function($this, prefix) {
    return $this.length >= prefix.length && $this.slice(0, prefix.length) === prefix;
  };

  in_string.repeat = function($this, count) {
    var result = '';

    for (var i = 0; i < count; i = i + 1 | 0) {
      result += $this;
    }

    return result;
  };

  in_string.replaceAll = function($this, before, after) {
    var result = '';
    var start = 0;

    while (true) {
      var end = $this.indexOf(before, start);

      if (end === -1) {
        break;
      }

      result += $this.slice(start, end) + after;
      start = end + before.length | 0;
    }

    return result + $this.slice(start, $this.length);
  };

  math.imax = function(a, b) {
    return a > b ? a : b;
  };

  math.imin = function(a, b) {
    return a < b ? a : b;
  };

  function bindCompare(comparison) {
    return comparison.compare.bind(comparison);
  }

  in_List.last = function($this) {
    return $this[$this.length - 1 | 0];
  };

  in_List.swap = function($this, a, b) {
    var temp = $this[a];
    $this[a] = $this[b];
    $this[b] = temp;
  };

  in_List.pushOnce = function($this, value) {
    if (!($this.indexOf(value) !== -1)) {
      $this.push(value);
      return true;
    }

    return false;
  };

  in_StringMap.getOrDefault = function($this, key, defaultValue) {
    return key in $this ? $this[key] : defaultValue;
  };

  in_StringMap.values = function($this) {
    var values = [];

    for (var key in $this) {
      values.push($this[key]);
    }

    return values;
  };

  in_StringMap.clone = function($this) {
    var clone = Object.create(null);

    for (var key in $this) {
      clone[key] = $this[key];
    }

    return clone;
  };

  in_StringMap.literal = function(keys, values) {
    var map = Object.create(null);

    if (keys.length !== values.length) {
      throw new Error('assert keys.size() == values.size() (<compiler>/stringmap.sk:112:5)');
    }

    for (var i = 0; i < keys.length; i = i + 1 | 0) {
      map[keys[i]] = values[i];
    }

    return map;
  };

  in_IntMap.getOrDefault = function($this, key, defaultValue) {
    return key in $this ? $this[key] : defaultValue;
  };

  in_IntMap.values = function($this) {
    var values = [];

    for (var key in $this) {
      values.push($this[key]);
    }

    return values;
  };

  in_IntMap.literal = function(keys, values) {
    var map = Object.create(null);

    if (keys.length !== values.length) {
      throw new Error('assert keys.size() == values.size() (<compiler>/intmap.sk:117:5)');
    }

    for (var i = 0; i < keys.length; i = i + 1 | 0) {
      map[keys[i]] = values[i];
    }

    return map;
  };

  in_OperatingSystem.current = function() {
    var platform = process.platform;
    return platform === 'darwin' ? OperatingSystem.OSX : platform === 'win32' ? OperatingSystem.WINDOWS : platform === 'linux' ? OperatingSystem.LINUX : OperatingSystem.UNKNOWN;
  };

  terminal.setColor = function(color) {
    if (process.stdout.isTTY) {
      process.stdout.write('\x1B[0;' + color + 'm');
    }
  };

  in_string.codePoints = function($this) {
    var codePoints = [];
    unicode.StringIterator.INSTANCE.reset($this, 0);

    while (true) {
      var codePoint = unicode.StringIterator.INSTANCE.nextCodePoint();

      if (codePoint < 0) {
        break;
      }

      codePoints.push(codePoint);
    }

    return codePoints;
  };

  in_string.fromCodePoints = function(codePoints) {
    var builder = new StringBuilder();

    if (unicode.STRING_ENCODING === unicode.Encoding.UTF8) {
      for (var i = 0, n = codePoints.length; i < n; i = i + 1 | 0) {
        var codePoint = codePoints[i];

        if (codePoint < 128) {
          builder._buffer += String.fromCharCode(codePoint);
        } else {
          if (codePoint < 2048) {
            builder._buffer += String.fromCharCode(codePoint >> 6 & 31 | 192);
          } else {
            if (codePoint < 65536) {
              builder._buffer += String.fromCharCode(codePoint >> 12 & 15 | 224);
            } else {
              builder._buffer += String.fromCharCode(codePoint >> 18 & 7 | 240);
              builder._buffer += String.fromCharCode(codePoint >> 12 & 63 | 128);
            }

            builder._buffer += String.fromCharCode(codePoint >> 6 & 63 | 128);
          }

          builder._buffer += String.fromCharCode(codePoint & 63 | 128);
        }
      }
    } else if (unicode.STRING_ENCODING === unicode.Encoding.UTF16) {
      for (var i = 0, n = codePoints.length; i < n; i = i + 1 | 0) {
        var codePoint = codePoints[i];

        if (codePoint < 65536) {
          builder._buffer += String.fromCharCode(codePoint);
        } else {
          codePoint = codePoint - 65536 | 0;
          builder._buffer += String.fromCharCode((codePoint >> 10) + 55296 | 0);
          builder._buffer += String.fromCharCode((codePoint & (1 << 10) - 1) + 56320 | 0);
        }
      }
    } else {
      for (var i = 0, n = codePoints.length; i < n; i = i + 1 | 0) {
        builder._buffer += String.fromCharCode(codePoints[i]);
      }
    }

    return builder._buffer;
  };

  function checkAllNodeListKinds(node, checker) {
    if (node === null) {
      throw new Error('assert node != null (src/ast/create.sk:427:3)');
    }

    if (node.kind !== NodeKind.NODE_LIST) {
      throw new Error('assert node.kind == .NODE_LIST (src/ast/create.sk:428:3)');
    }

    if (node.children === null) {
      throw new Error('assert node.children != null (src/ast/create.sk:429:3)');
    }

    return checkAllNodeKinds(node.children, checker);
  }

  function checkAllNodeKinds(nodes, checker) {
    if (nodes === null) {
      throw new Error('assert nodes != null (src/ast/create.sk:434:3)');
    }

    for (var i = 0; i < nodes.length; i = i + 1 | 0) {
      if (!checker.check(nodes[i].kind)) {
        return false;
      }
    }

    return true;
  }

  in_NodeKind.isStatement = function($this) {
    return $this >= NodeKind.VARIABLE_CLUSTER && $this <= NodeKind.PREPROCESSOR_IF;
  };

  in_NodeKind.isNamedBlockDeclaration = function($this) {
    return $this >= NodeKind.NAMESPACE && $this <= NodeKind.EXTENSION;
  };

  in_NodeKind.isNamedDeclaration = function($this) {
    return $this >= NodeKind.NAMESPACE && $this <= NodeKind.ALIAS;
  };

  in_NodeKind.isEnum = function($this) {
    return $this >= NodeKind.ENUM && $this <= NodeKind.ENUM_FLAGS;
  };

  in_NodeKind.isObject = function($this) {
    return $this >= NodeKind.CLASS && $this <= NodeKind.INTERFACE;
  };

  in_NodeKind.isFunction = function($this) {
    return $this >= NodeKind.CONSTRUCTOR && $this <= NodeKind.FUNCTION;
  };

  in_NodeKind.isAssert = function($this) {
    return $this >= NodeKind.ASSERT && $this <= NodeKind.ASSERT_CONST;
  };

  in_NodeKind.isExpression = function($this) {
    return $this >= NodeKind.NAME && $this <= NodeKind.ASSIGN_INDEX;
  };

  in_NodeKind.isConstant = function($this) {
    return $this >= NodeKind.NULL && $this <= NodeKind.STRING;
  };

  in_NodeKind.isCall = function($this) {
    return $this >= NodeKind.CALL && $this <= NodeKind.SUPER_CALL;
  };

  in_NodeKind.isUnaryOperator = function($this) {
    return $this >= NodeKind.NOT && $this <= NodeKind.POSTFIX_REFERENCE;
  };

  in_NodeKind.isUnaryTypeOperator = function($this) {
    return $this >= NodeKind.POSTFIX_DEREFERENCE && $this <= NodeKind.POSTFIX_REFERENCE;
  };

  in_NodeKind.isUnaryStorageOperator = function($this) {
    return $this >= NodeKind.PREFIX_INCREMENT && $this <= NodeKind.POSTFIX_DECREMENT;
  };

  in_NodeKind.isBinaryOperator = function($this) {
    return $this >= NodeKind.ADD && $this <= NodeKind.ASSIGN_SHIFT_RIGHT;
  };

  in_NodeKind.isBinaryStorageOperator = function($this) {
    return $this >= NodeKind.ASSIGN && $this <= NodeKind.ASSIGN_SHIFT_RIGHT;
  };

  in_NodeKind.isBinaryBitwiseStorageOperator = function($this) {
    return $this >= NodeKind.ASSIGN_BITWISE_AND && $this <= NodeKind.ASSIGN_SHIFT_RIGHT;
  };

  in_NodeKind.isTernaryOperator = function($this) {
    return $this === NodeKind.ASSIGN_INDEX;
  };

  in_NodeKind.isCast = function($this) {
    return $this >= NodeKind.CAST && $this <= NodeKind.IMPLICIT_CAST;
  };

  in_NodeKind.isReal = function($this) {
    return $this >= NodeKind.FLOAT && $this <= NodeKind.DOUBLE;
  };

  in_NodeKind.isJump = function($this) {
    return $this >= NodeKind.RETURN && $this <= NodeKind.THROW;
  };

  in_NodeKind.isDot = function($this) {
    return $this >= NodeKind.DOT && $this <= NodeKind.DOT_COLON;
  };

  in_NodeKind.isLoop = function($this) {
    return $this >= NodeKind.FOR && $this <= NodeKind.DO_WHILE;
  };

  in_NodeKind.isStorage = function($this) {
    return $this === NodeKind.NAME || $this === NodeKind.DOT;
  };

  in_NodeKind.prettyPrint = function($this) {
    return in_string.replaceAll(in_NodeKind._toString_[$this].toLowerCase(), '_', '-');
  };

  in_CompilerTarget.shouldRunResolver = function($this) {
    return $this >= CompilerTarget.NONE && $this <= CompilerTarget.RUBY;
  };

  in_CompilerTarget.needsMapLiteralFactory = function($this) {
    return $this !== CompilerTarget.RUBY;
  };

  in_CompilerTarget.hasNoNestedScopes = function($this) {
    return $this === CompilerTarget.JAVASCRIPT;
  };

  in_CompilerTarget.moveStaticGlobalsOffGenericTypes = function($this) {
    return $this === CompilerTarget.CPP;
  };

  in_CompilerTarget.moveNonVirtualSymbolsOffInterfaces = function($this) {
    return $this === CompilerTarget.JAVASCRIPT || $this === CompilerTarget.RUBY;
  };

  function canIncrement(value) {
    return (value + 1 | 0) === value + 1;
  }

  function canDecrement(value) {
    return (value - 1 | 0) === value - 1;
  }

  function hashCombine(left, right) {
    return left ^ ((right - 1640531527 | 0) + (left << 6) | 0) + (left >> 2);
  }

  function logBase2(value) {
    if (value < 1 || (value & value - 1) !== 0) {
      return -1;
    }

    var result = 0;

    while (value > 1) {
      value >>= 1;
      result = result + 1 | 0;
    }

    return result;
  }

  function parseHexCharacter(c) {
    if (c >= 48 && c <= 57) {
      return c - 48 | 0;
    }

    if (c >= 65 && c <= 70) {
      return (c - 65 | 0) + 10 | 0;
    }

    if (c >= 97 && c <= 102) {
      return (c - 97 | 0) + 10 | 0;
    }

    return -1;
  }

  function doubleToStringWithDot(value) {
    var text = value.toString();
    var e = math.imax(text.indexOf('e'), text.indexOf('E'));

    if (e !== -1 && (e + 2 | 0) < text.length && text.charCodeAt(e + 2 | 0) === 48) {
      text = text.slice(0, e + 2 | 0) + text.slice(e + 3 | 0, text.length);
    }

    if (!(text.indexOf('.') !== -1)) {
      if (e === -1) {
        text += '.0';
      } else {
        text = text.slice(0, e) + '.0' + text.slice(e, text.length);
      }
    }

    return text;
  }

  function parseStringLiteral(log, range, text) {
    if (text.length < 2) {
      throw new Error('assert text.size() >= 2 (src/core/support.sk:87:3)');
    }

    if (text.charCodeAt(0) !== 34 && text.charCodeAt(0) !== 39) {
      throw new Error("assert text[0] == '\"' || text[0] == '\\'' (src/core/support.sk:88:3)");
    }

    if (text.charCodeAt(text.length - 1 | 0) !== 34 && text.charCodeAt(text.length - 1 | 0) !== 39) {
      throw new Error("assert text[text.size() - 1] == '\"' || text[text.size() - 1] == '\\'' (src/core/support.sk:89:3)");
    }

    var isValidString = true;
    var builder = new StringBuilder();
    var start = 1;
    var i = 1;

    while ((i + 1 | 0) < text.length) {
      var c = text.charCodeAt(i);
      i = i + 1 | 0;

      if (c === 92) {
        var escape = i - 1 | 0;
        builder._buffer += text.slice(start, escape);

        if ((i + 1 | 0) < text.length) {
          c = text.charCodeAt(i);
          i = i + 1 | 0;

          if (c === 110) {
            builder._buffer += '\n';
            start = i;
          } else if (c === 114) {
            builder._buffer += '\r';
            start = i;
          } else if (c === 116) {
            builder._buffer += '\t';
            start = i;
          } else if (c === 101) {
            builder._buffer += '\x1B';
            start = i;
          } else if (c === 48) {
            builder._buffer += '\0';
            start = i;
          } else if (c === 92 || c === 34 || c === 39) {
            builder._buffer += String.fromCharCode(c);
            start = i;
          } else if (c === 120) {
            if ((i + 1 | 0) < text.length) {
              var c0 = parseHexCharacter(text.charCodeAt(i));
              i = i + 1 | 0;

              if ((i + 1 | 0) < text.length) {
                var c1 = parseHexCharacter(text.charCodeAt(i));
                i = i + 1 | 0;

                if (c0 !== -1 && c1 !== -1) {
                  builder._buffer += String.fromCharCode(c0 << 4 | c1);
                  start = i;
                }
              }
            }
          }
        }

        if (start < i) {
          syntaxErrorInvalidEscapeSequence(log, new Range(range.source, range.start + escape | 0, range.start + i | 0), text.slice(escape, i));
          isValidString = false;
        }
      }
    }

    builder._buffer += text.slice(start, i);
    return isValidString ? new StringContent(builder._buffer) : null;
  }

  function quoteString(text, quote) {
    var builder = new StringBuilder();
    var quoteString = String.fromCharCode(quote);
    var escaped = '';
    var start = 0;
    var i = 0;
    builder._buffer += quoteString;

    for (i = 0; i < text.length; i = i + 1 | 0) {
      var c = text.charCodeAt(i);

      if (c === quote) {
        escaped = '\\' + quoteString;
      } else if (c === 10) {
        escaped = '\\n';
      } else if (c === 13) {
        escaped = '\\r';
      } else if (c === 9) {
        escaped = '\\t';
      } else if (c === 0) {
        escaped = '\\0';
      } else if (c === 92) {
        escaped = '\\\\';
      } else if (c < 32) {
        escaped = '\\x' + HEX[c >> 4] + HEX[c & 15];
      } else {
        continue;
      }

      builder._buffer += text.slice(start, i);
      builder._buffer += escaped;
      start = i + 1 | 0;
    }

    builder._buffer += text.slice(start, i);
    builder._buffer += quoteString;
    return builder._buffer;
  }

  prettyPrint.plural = function(value) {
    return value === 1 ? '' : 's';
  };

  prettyPrint.join = function(parts, trailing) {
    if (parts.length < 3) {
      return parts.join(' ' + trailing + ' ');
    }

    var text = '';

    for (var i = 0; i < parts.length; i = i + 1 | 0) {
      if (i !== 0) {
        text += ', ';

        if ((i + 1 | 0) === parts.length) {
          text += trailing + ' ';
        }
      }

      text += parts[i];
    }

    return text;
  };

  prettyPrint.wrapWords = function(text, width) {
    if (width < 1) {
      return [text];
    }

    var words = text.split(' ');
    var lines = [];
    var line = '';

    for (var i = 0; i < words.length; i = i + 1 | 0) {
      var word = words[i];
      var lineLength = line.length;
      var wordLength = word.length;
      var estimatedLength = (lineLength + 1 | 0) + wordLength | 0;

      if (word === '') {
        continue;
      }

      if (line === '') {
        while (word.length > width) {
          lines.push(word.slice(0, width));
          word = word.slice(width, word.length);
        }

        line = word;
      } else if (estimatedLength < width) {
        line += ' ' + word;
      } else if (estimatedLength === width) {
        lines.push(line + ' ' + word);
        line = '';
      } else {
        lines.push(line);
        line = '';
        i = i - 1 | 0;
      }
    }

    if (line !== '' || lines.length === 0) {
      lines.push(line);
    }

    return lines;
  };

  function splitPath(path) {
    var slashIndex = math.imax(path.lastIndexOf('/'), path.lastIndexOf('\\'));
    return slashIndex === -1 ? new SplitPath('.', path) : new SplitPath(path.slice(0, slashIndex), path.slice(slashIndex + 1 | 0, path.length));
  }

  function joinPath(directory, entry) {
    return directory + (in_OperatingSystem.current() === OperatingSystem.WINDOWS ? '\\' : '/') + entry;
  }

  function formatNumber(number) {
    return (Math.round(number * 10) / 10).toString();
  }

  function bytesToString(bytes) {
    if (bytes === 1) {
      return '1 byte';
    }

    if (bytes < ByteSize.KB) {
      return bytes + ' bytes';
    }

    if (bytes < ByteSize.MB) {
      return formatNumber(bytes / ByteSize.KB) + 'kb';
    }

    if (bytes < ByteSize.GB) {
      return formatNumber(bytes / ByteSize.MB) + 'mb';
    }

    return formatNumber(bytes / ByteSize.GB) + 'gb';
  }

  trace.indent = function() {
    trace.spaces += '  ';
  };

  trace.dedent = function() {
    trace.spaces = trace.spaces.slice(2, trace.spaces.length);
  };

  trace.log = function(text) {
    process.stdout.write(trace.spaces + text + '\n');
  };

  function simpleQuote(name) {
    return '"' + name + '"';
  }

  function simpleQuoteAll(names) {
    var quoted = [];

    for (var i = 0; i < names.length; i = i + 1 | 0) {
      quoted.push(simpleQuote(names[i]));
    }

    return quoted;
  }

  function firstLineOf(text) {
    var index = text.indexOf('\n');
    return index < 0 ? text : text.slice(0, index);
  }

  function typeToText(type) {
    return 'type "' + type + '"';
  }

  function namesToText(names, separator) {
    return prettyPrint.join(simpleQuoteAll(names), separator);
  }

  function typesToText(types, separator) {
    var names = [];

    for (var i = 0; i < types.length; i = i + 1 | 0) {
      names.push(typeToText(types[i]));
    }

    return prettyPrint.join(names, separator);
  }

  function expectedCountText(singular, expected, found, because) {
    return 'Expected ' + expected + ' ' + singular + prettyPrint.plural(expected) + because + ' but found ' + found + ' ' + singular + prettyPrint.plural(found);
  }

  json.dump = function(node) {
    var visitor = new json.DumpVisitor();
    visitor.visit(node);
    visitor.builder._buffer += '\n';
    return visitor.builder._buffer;
  };

  lisp.dump = function(node) {
    var visitor = new lisp.DumpVisitor();
    visitor.visit(node);
    visitor.builder._buffer += '\n';
    return visitor.builder._buffer;
  };

  xml.dump = function(node) {
    var visitor = new xml.DumpVisitor();
    visitor.visit(node);
    visitor.builder._buffer += '\n';
    return visitor.builder._buffer;
  };

  function tokenize(log, source) {
    var tokens = [];
    var text = source.contents;
    var text_length = text.length;
    var yy_last_accepting_state = 0;
    var yy_last_accepting_cpos = 0;
    var yy_cp = 0;

    while (yy_cp < text_length) {
      var yy_current_state = 1;
      var yy_bp = yy_cp;

      while (yy_current_state !== 314) {
        if (yy_cp >= text_length) {
          break;
        }

        var c = text.charCodeAt(yy_cp);
        var index = c < 127 ? c : 127;
        var yy_c = yy_ec[index];

        if (yy_accept[yy_current_state] !== TokenKind.YY_INVALID_ACTION) {
          yy_last_accepting_state = yy_current_state;
          yy_last_accepting_cpos = yy_cp;
        }

        while (yy_chk[yy_base[yy_current_state] + yy_c | 0] !== yy_current_state) {
          yy_current_state = yy_def[yy_current_state];

          if (yy_current_state >= 315) {
            yy_c = yy_meta[yy_c];
          }
        }

        yy_current_state = yy_nxt[yy_base[yy_current_state] + yy_c | 0];
        yy_cp = yy_cp + 1 | 0;
      }

      var yy_act = yy_accept[yy_current_state];

      while (yy_act === TokenKind.YY_INVALID_ACTION) {
        yy_cp = yy_last_accepting_cpos;
        yy_current_state = yy_last_accepting_state;
        yy_act = yy_accept[yy_current_state];
      }

      if (yy_act === TokenKind.WHITESPACE) {
        continue;
      } else if (yy_act === TokenKind.ERROR) {
        var iterator = unicode.StringIterator.INSTANCE.reset(text, yy_bp);
        iterator.nextCodePoint();

        var range = new Range(source, yy_bp, iterator.index);
        syntaxErrorExtraData(log, range, range.toString());
        break;
      } else if (yy_act !== TokenKind.END_OF_FILE) {
        tokens.push(new Token(new Range(source, yy_bp, yy_cp), yy_act));

        if (yy_act === TokenKind.ASSIGN_SHIFT_RIGHT || yy_act === TokenKind.SHIFT_RIGHT || yy_act === TokenKind.GREATER_THAN_OR_EQUAL) {
          tokens.push(null);

          if (yy_act === TokenKind.ASSIGN_SHIFT_RIGHT) {
            tokens.push(null);
          }
        }
      }
    }

    tokens.push(new Token(new Range(source, text_length, text_length), TokenKind.END_OF_FILE));
    return tokens;
  }

  function prepareTokens(tokens) {
    var previousKind = TokenKind.NULL;
    var stack = [];
    var count = 0;

    for (var i = 0, n = tokens.length; i < n; i = i + 1 | 0) {
      var token = tokens[i];

      if (token === null) {
        continue;
      }

      tokens[count] = token;
      count = count + 1 | 0;

      var tokenKind = token.kind;
      var tokenStartsWithGreaterThan = token.firstCodeUnit() === 62;

      if (token.kind === TokenKind.NEWLINE && previousKind in REMOVE_NEWLINE_AFTER) {
        count = count - 1 | 0;
        continue;
      } else if (previousKind === TokenKind.NEWLINE && token.kind in REMOVE_NEWLINE_BEFORE) {
        tokens[count - 2 | 0] = token;
        count = count - 1 | 0;
      }

      previousKind = tokenKind;

      while (stack.length !== 0) {
        var top = in_List.last(stack);
        var topKind = top.kind;

        if (topKind === TokenKind.LESS_THAN && tokenKind !== TokenKind.LESS_THAN && tokenKind !== TokenKind.IDENTIFIER && tokenKind !== TokenKind.IS && tokenKind !== TokenKind.COMMA && tokenKind !== TokenKind.DOT && tokenKind !== TokenKind.TICK && !tokenStartsWithGreaterThan) {
          stack.pop();
        } else {
          break;
        }
      }

      if (tokenKind === TokenKind.LEFT_PARENTHESIS || tokenKind === TokenKind.LEFT_BRACE || tokenKind === TokenKind.LEFT_BRACKET || tokenKind === TokenKind.LESS_THAN) {
        stack.push(token);
        continue;
      }

      if (tokenKind === TokenKind.RIGHT_PARENTHESIS || tokenKind === TokenKind.RIGHT_BRACE || tokenKind === TokenKind.RIGHT_BRACKET || tokenStartsWithGreaterThan) {
        while (stack.length !== 0) {
          var top = in_List.last(stack);
          var topKind = top.kind;

          if (tokenStartsWithGreaterThan && topKind !== TokenKind.LESS_THAN) {
            break;
          }

          stack.pop();

          if (topKind === TokenKind.LESS_THAN) {
            if (!tokenStartsWithGreaterThan) {
              continue;
            }

            if (tokenKind !== TokenKind.GREATER_THAN) {
              var range = token.range;
              var start = range.start;

              if ((i + 1 | 0) >= tokens.length) {
                throw new Error('assert i + 1 < tokens.size() (src/lexer/token.sk:157:13)');
              }

              if (tokens[i + 1 | 0] !== null) {
                throw new Error('assert tokens[i + 1] == null (src/lexer/token.sk:158:13)');
              }

              if (tokenKind !== TokenKind.SHIFT_RIGHT && tokenKind !== TokenKind.GREATER_THAN_OR_EQUAL && tokenKind !== TokenKind.ASSIGN_SHIFT_RIGHT) {
                throw new Error('assert\n              tokenKind == .SHIFT_RIGHT ||\n              tokenKind == .GREATER_THAN_OR_EQUAL ||\n              tokenKind == .ASSIGN_SHIFT_RIGHT (src/lexer/token.sk:159:13)');
              }

              tokens[i + 1 | 0] = new Token(new Range(range.source, start + 1 | 0, range.end), tokenKind === TokenKind.SHIFT_RIGHT ? TokenKind.GREATER_THAN : tokenKind === TokenKind.GREATER_THAN_OR_EQUAL ? TokenKind.ASSIGN : TokenKind.GREATER_THAN_OR_EQUAL);
              token.range = new Range(range.source, start, start + 1 | 0);
            }

            top.kind = TokenKind.START_PARAMETER_LIST;
            token.kind = TokenKind.END_PARAMETER_LIST;
          }

          break;
        }
      }
    }

    while (tokens.length > count) {
      tokens.pop();
    }
  }

  function syntaxErrorInvalidEscapeSequence(log, range, text) {
    log.error(range, 'Invalid escape sequence ' + firstLineOf(simpleQuote(text)));
  }

  function syntaxErrorInvalidCharacter(log, range, text) {
    log.error(range, 'Invalid character literal ' + firstLineOf(text));
  }

  function syntaxErrorExtraData(log, range, text) {
    log.error(range, 'Syntax error ' + quoteString(text, 34));
  }

  function syntaxErrorUnexpectedToken(log, token) {
    log.error(token.range, 'Unexpected ' + in_TokenKind._toString_[token.kind]);
  }

  function syntaxErrorExpectedToken(log, range, found, expected) {
    log.error(range, 'Expected ' + in_TokenKind._toString_[expected] + ' but found ' + in_TokenKind._toString_[found]);
  }

  function syntaxErrorBadForEach(log, range) {
    log.error(range, 'More than one variable inside a for-each loop');
  }

  function syntaxWarningOctal(log, range) {
    log.warning(range, 'Number interpreted as decimal (use the prefix "0o" for octal numbers)');
  }

  function parseIntLiteral(text, base) {
    if (base !== 10) {
      text = text.slice(2, text.length);
    }

    return parseInt(text, base) | 0;
  }

  function parseDoubleLiteral(text) {
    return +text;
  }

  function doubleToStringWithoutDotZero(value) {
    return value.toString();
  }

  in_Precedence.incrementIfLeftAssociative = function($this, associativity) {
    return $this + (associativity === Associativity.LEFT | 0) | 0;
  };

  in_Precedence.incrementIfRightAssociative = function($this, associativity) {
    return $this + (associativity === Associativity.RIGHT | 0) | 0;
  };

  function peekEndOfLine(context) {
    return context.peek(TokenKind.SEMICOLON) || context.peek(TokenKind.NEWLINE) || context.peek(TokenKind.RIGHT_BRACE) || context.peek(TokenKind.END_OF_FILE);
  }

  function eatEndOfLine(context) {
    if (context.eat(TokenKind.SEMICOLON)) {
      if (peekEndOfLine(context)) {
        context.undo();
        context.unexpectedToken();
        context.next();
        eatEndOfLine(context);
      }

      return true;
    }

    return context.eat(TokenKind.NEWLINE) || context.peek(TokenKind.RIGHT_BRACE) || context.peek(TokenKind.END_OF_FILE);
  }

  function expectEndOfLine(context) {
    if (!eatEndOfLine(context)) {
      context.expect(TokenKind.NEWLINE);

      do {
        context.next();
      } while (!eatEndOfLine(context));
    }
  }

  function scanForToken(context, kind) {
    if (context.expect(kind)) {
      return true;
    }

    while (!context.eat(kind) && context.next().kind !== TokenKind.END_OF_FILE) {
    }

    return false;
  }

  function parseGroup(context) {
    var token = context.current();

    if (!context.expect(TokenKind.LEFT_PARENTHESIS)) {
      return null;
    }

    var value = pratt.parse(context, Precedence.LOWEST);
    scanForToken(context, TokenKind.RIGHT_PARENTHESIS);
    return value.withRange(context.spanSince(token.range));
  }

  function createNameFromToken(token) {
    return Node.createName(token.text()).withRange(token.range);
  }

  function parseName(context) {
    var token = context.current();

    if (!context.expect(TokenKind.IDENTIFIER)) {
      return null;
    }

    return createNameFromToken(token);
  }

  function parseNameOrString(context) {
    var token = context.current();

    if (context.eat(TokenKind.STRING)) {
      return parseStringToken(context, token);
    }

    return parseName(context);
  }

  function parseBlock(context, hint) {
    var token = context.current();
    context.eat(TokenKind.NEWLINE);

    if (!context.expect(TokenKind.LEFT_BRACE)) {
      return null;
    }

    var statements = parseStatements(context, hint);
    scanForToken(context, TokenKind.RIGHT_BRACE);
    return Node.createBlock(statements).withRange(context.spanSince(token.range));
  }

  function parseBlockOrStatement(context, hint) {
    context.eat(TokenKind.NEWLINE);

    if (context.peek(TokenKind.LEFT_BRACE)) {
      return parseBlock(context, hint);
    }

    var statement = parseStatement(context, hint);

    if (statement === null) {
      return null;
    }

    if (hint === StatementHint.IN_IF && context.peek(TokenKind.ELSE)) {
      context.unexpectedToken();
    }

    return Node.createBlock([statement]).withRange(statement.range);
  }

  function parseCaseStatement(context) {
    var token = context.current();
    var values = [];

    if (!context.eat(TokenKind.DEFAULT)) {
      if (!context.expect(TokenKind.CASE)) {
        return null;
      }

      do {
        if (context.peek(TokenKind.LEFT_BRACE)) {
          context.unexpectedToken();
          values.push(Node.createError());
          break;
        }

        values.push(pratt.parse(context, Precedence.COMMA));
      } while (eatCommaAndMaybeNewline(context));
    }

    var block = parseBlock(context, StatementHint.NORMAL);

    if (block === null) {
      return null;
    }

    return Node.createCase(values, block).withRange(context.spanSince(token.range));
  }

  function eatCommaAndMaybeNewline(context) {
    if (!context.eat(TokenKind.COMMA)) {
      return false;
    }

    context.eat(TokenKind.NEWLINE);
    return true;
  }

  function parseStatements(context, hint) {
    var statements = [];
    context.eat(TokenKind.NEWLINE);

    while (true) {
      var kind = context.current().kind;

      if (kind === TokenKind.RIGHT_BRACE || kind === TokenKind.PREPROCESSOR_ELIF || kind === TokenKind.PREPROCESSOR_ELSE || kind === TokenKind.PREPROCESSOR_ENDIF || kind === TokenKind.END_OF_FILE) {
        break;
      }

      if (hint === StatementHint.IN_ENUM) {
        var declaration = parseEnumValueDeclaration(context);

        if (declaration === null) {
          break;
        }

        statements.push(declaration);

        if (!context.eat(TokenKind.NEWLINE)) {
          if (context.peek(TokenKind.RIGHT_BRACE) || !context.expect(TokenKind.COMMA)) {
            break;
          }

          if (context.peek(TokenKind.NEWLINE) || context.peek(TokenKind.RIGHT_BRACE)) {
            context.undo();
            context.unexpectedToken();
            context.next();
            context.eat(TokenKind.NEWLINE);
          }
        }
      } else {
        var statement = hint === StatementHint.IN_SWITCH ? parseCaseStatement(context) : parseStatement(context, hint);

        if (statement === null) {
          break;
        }

        statements.push(statement);
        expectEndOfLine(context);
      }
    }

    return statements;
  }

  function parseArgumentVariables(context) {
    var token = context.current();
    var $arguments = [];

    if (!context.expect(TokenKind.LEFT_PARENTHESIS)) {
      return null;
    }

    while (!context.peek(TokenKind.RIGHT_PARENTHESIS)) {
      if ($arguments.length !== 0 && !context.expect(TokenKind.COMMA)) {
        break;
      }

      var type = parseType(context);
      var name = parseName(context);

      if (name === null) {
        break;
      }

      $arguments.push(Node.createVariable(name, type, null).withRange(Range.span(type.range, name.range)));
    }

    scanForToken(context, TokenKind.RIGHT_PARENTHESIS);
    return Node.createNodeList($arguments).withRange(context.spanSince(token.range));
  }

  function parseType(context) {
    return pratt.parse(context, Precedence.MEMBER - 1 | 0);
  }

  function parseEnumValueDeclaration(context) {
    var name = parseName(context);

    if (name === null) {
      return null;
    }

    var value = context.eat(TokenKind.ASSIGN) ? pratt.parse(context, Precedence.COMMA) : null;
    return Node.createVariable(name, null, value).withRange(context.spanSince(name.range));
  }

  function parseParameter(context) {
    var token = context.current();
    var name = parseName(context);

    if (name === null) {
      return null;
    }

    var bound = context.eat(TokenKind.IS) ? pratt.parse(context, Precedence.COMMA) : null;
    return Node.createParameter(name, bound).withRange(context.spanSince(token.range));
  }

  function parseParameters(context) {
    var token = context.current();
    var parameters = [];

    if (!context.eat(TokenKind.START_PARAMETER_LIST)) {
      return null;
    }

    while (parameters.length === 0 || !context.peek(TokenKind.END_PARAMETER_LIST)) {
      if (parameters.length !== 0 && !context.expect(TokenKind.COMMA)) {
        break;
      }

      var parameter = parseParameter(context);

      if (parameter === null) {
        break;
      }

      parameters.push(parameter);
    }

    scanForToken(context, TokenKind.END_PARAMETER_LIST);
    return Node.createNodeList(parameters).withRange(context.spanSince(token.range));
  }

  function parseMapKeyValuePair(context) {
    var key = pratt.parse(context, Precedence.COMMA);

    if (!context.expect(TokenKind.COLON)) {
      return Node.createError().withRange(key.range);
    }

    var value = pratt.parse(context, Precedence.COMMA);
    return Node.createKeyValue(key, value).withRange(Range.span(key.range, value.range));
  }

  function parsePreprocessorSequence(context, mode) {
    context.needsPreprocessor = true;

    var token = context.next();
    var value = pratt.parse(context, Precedence.COMMA);
    var trueNodes = parsePreprocessorCommaSeparatedList(context, mode);
    var falseNodes = null;

    if (context.peek(TokenKind.PREPROCESSOR_ELIF)) {
      var node = parsePreprocessorSequence(context, mode);
      falseNodes = Node.createNodeList([node]).withRange(node.range);
    } else {
      if (context.eat(TokenKind.PREPROCESSOR_ELSE)) {
        falseNodes = parsePreprocessorCommaSeparatedList(context, mode);
      }

      if (!context.expect(TokenKind.PREPROCESSOR_ENDIF)) {
        return errorExpressionSinceToken(context, token);
      }
    }

    return Node.createPreprocessorSequence(value, trueNodes, falseNodes).withRange(context.spanSince(token.range));
  }

  function isEndOfCommaSeparatedList(context) {
    var kind = context.current().kind;
    return kind === TokenKind.PREPROCESSOR_ELIF || kind === TokenKind.PREPROCESSOR_ELSE || kind === TokenKind.PREPROCESSOR_ENDIF || kind === TokenKind.RIGHT_BRACE || kind === TokenKind.RIGHT_BRACKET || kind === TokenKind.RIGHT_PARENTHESIS;
  }

  function parseCommaSeparatedList(context, mode) {
    var values = [];

    while (!isEndOfCommaSeparatedList(context)) {
      var isPreprocessorSequence = context.peek(TokenKind.PREPROCESSOR_IF);
      var value = isPreprocessorSequence ? parsePreprocessorSequence(context, mode) : mode === ListMode.KEY_VALUE ? parseMapKeyValuePair(context) : pratt.parse(context, Precedence.COMMA);
      values.push(value);

      if (value.kind === NodeKind.ERROR) {
        break;
      }

      var ateNewline = context.eat(TokenKind.NEWLINE);

      if (!isPreprocessorSequence && !isEndOfCommaSeparatedList(context)) {
        if (ateNewline) {
          context.undo();
        }

        if (!context.expect(TokenKind.COMMA)) {
          break;
        }

        context.eat(TokenKind.NEWLINE);
      }
    }

    return values;
  }

  function parsePreprocessorCommaSeparatedList(context, mode) {
    var token = context.current();
    expectEndOfLine(context);

    var values = parseCommaSeparatedList(context, mode);
    return Node.createNodeList(values).withRange(context.spanSince(token.range));
  }

  function parseWrappedCommaSeparatedList(context, left, right, mode) {
    if (!context.expect(left)) {
      return [];
    }

    var values = parseCommaSeparatedList(context, mode);
    scanForToken(context, right);
    return values;
  }

  function parseTypeList(context, end) {
    var types = [];

    while (types.length === 0 || !context.peek(end)) {
      if (context.peek(TokenKind.LEFT_BRACE)) {
        context.unexpectedToken();
        break;
      }

      if (types.length !== 0 && !context.eat(TokenKind.COMMA)) {
        context.expect(end);
        break;
      }

      if (context.peek(TokenKind.LEFT_BRACE)) {
        context.unexpectedToken();
        break;
      }

      types.push(parseType(context));
    }

    return types;
  }

  function parseObject(context, kind) {
    var token = context.next();
    var name = parseName(context);

    if (name === null) {
      return null;
    }

    var parameters = parseParameters(context);
    var bases = context.eat(TokenKind.COLON) ? Node.createNodeList(parseTypeList(context, TokenKind.LEFT_BRACE)) : null;
    var block = parseBlock(context, StatementHint.IN_OBJECT);

    if (block === null) {
      return null;
    }

    return Node.createObject(kind, name, parameters, bases, block).withRange(context.spanSince(token.range));
  }

  function parseNestedNamespaceBlock(context) {
    if (!context.eat(TokenKind.DOT)) {
      return parseBlock(context, StatementHint.NORMAL);
    }

    var name = parseName(context);
    var block = parseNestedNamespaceBlock(context);

    if (block === null) {
      return null;
    }

    var range = context.spanSince((name !== null ? name : block).range);
    return Node.createBlock([Node.createNamespace(name, block).withRange(range)]).withRange(range);
  }

  function parseNamespace(context) {
    var token = context.next();
    var name = parseName(context);

    if (name === null) {
      return null;
    }

    var block = parseNestedNamespaceBlock(context);

    if (block === null) {
      return null;
    }

    return Node.createNamespace(name, block).withRange(context.spanSince(token.range));
  }

  function parseConstructor(context, hint) {
    if (hint !== StatementHint.IN_OBJECT) {
      context.unexpectedToken();
      return null;
    }

    var token = context.next();
    var name = createNameFromToken(token);
    var $arguments = parseArgumentVariables(context);

    if ($arguments === null) {
      return null;
    }

    var superInitializer = null;
    var memberInitializers = null;

    if (context.eat(TokenKind.COLON)) {
      if (context.peek(TokenKind.SUPER)) {
        superInitializer = parseSuperCall(context);
      }

      if (superInitializer === null || context.eat(TokenKind.COMMA)) {
        var values = [];
        var first = context.current();

        do {
          var member = parseName(context);

          if (member === null) {
            break;
          }

          if (!context.expect(TokenKind.ASSIGN)) {
            break;
          }

          var value = pratt.parse(context, Precedence.COMMA);
          values.push(Node.createMemberInitializer(member, value).withRange(context.spanSince(member.range)));
        } while (context.eat(TokenKind.COMMA));

        memberInitializers = Node.createNodeList(values).withRange(context.spanSince(first.range));
      }
    }

    var block = null;
    var ateNewline = context.eat(TokenKind.NEWLINE);

    if (context.peek(TokenKind.LEFT_BRACE)) {
      block = parseBlock(context, StatementHint.NORMAL);

      if (block === null) {
        return null;
      }
    } else if (ateNewline) {
      context.undo();
    }

    return Node.createConstructor(name, $arguments, block, superInitializer, memberInitializers).withRange(context.spanSince(token.range));
  }

  function parseExpression(context) {
    var token = context.current();
    var value = pratt.parse(context, Precedence.LOWEST);
    return Node.createExpression(value).withRange(context.spanSince(token.range));
  }

  function parseModifier(context, hint) {
    var token = context.next();
    var name = createNameFromToken(token);
    var block = parseBlockOrStatement(context, hint);

    if (block === null) {
      return null;
    }

    return Node.createModifier(name, null, block.removeChildren()).withRange(context.spanSince(token.range));
  }

  function parseAnnotation(context, hint) {
    var token = context.next();
    var name = createNameFromToken(token);
    var $arguments = null;

    if (context.peek(TokenKind.LEFT_PARENTHESIS)) {
      var parenthesis = context.current();
      var values = parseWrappedCommaSeparatedList(context, TokenKind.LEFT_PARENTHESIS, TokenKind.RIGHT_PARENTHESIS, ListMode.NORMAL);
      $arguments = Node.createNodeList(values).withRange(context.spanSince(parenthesis.range));
    }

    context.eat(TokenKind.NEWLINE);

    var block = parseBlockOrStatement(context, hint);

    if (block === null) {
      return null;
    }

    return Node.createModifier(name, $arguments, block.removeChildren()).withRange(context.spanSince(token.range));
  }

  function parseReturn(context) {
    var token = context.next();
    var value = null;

    if (context.inNonVoidFunction) {
      context.eat(TokenKind.NEWLINE);
    }

    if (!peekEndOfLine(context)) {
      value = pratt.parse(context, Precedence.LOWEST);
    }

    return Node.createReturn(value).withRange(context.spanSince(token.range));
  }

  function parseBreak(context) {
    var token = context.next();
    return Node.createBreak().withRange(context.spanSince(token.range));
  }

  function parseContinue(context) {
    var token = context.next();
    return Node.createContinue().withRange(context.spanSince(token.range));
  }

  function parseAssert(context) {
    var token = context.next();
    var isConst = context.eat(TokenKind.CONST);
    var value = pratt.parse(context, Precedence.LOWEST);
    return Node.createAssert(isConst ? NodeKind.ASSERT_CONST : NodeKind.ASSERT, value).withRange(context.spanSince(token.range));
  }

  function parseSwitch(context) {
    var token = context.next();
    var value = parseGroup(context);

    if (value === null) {
      return null;
    }

    var block = parseBlock(context, StatementHint.IN_SWITCH);

    if (block === null) {
      return null;
    }

    return Node.createSwitch(value, block.removeChildren()).withRange(context.spanSince(token.range));
  }

  function parseWhile(context) {
    var token = context.next();
    var value = parseGroup(context);

    if (value === null) {
      return null;
    }

    var block = parseBlockOrStatement(context, StatementHint.NORMAL);

    if (block === null) {
      return null;
    }

    return Node.createWhile(value, block).withRange(context.spanSince(token.range));
  }

  function parseDoWhile(context) {
    var token = context.next();
    var block = parseBlockOrStatement(context, StatementHint.NORMAL);

    if (block === null) {
      return null;
    }

    if (!context.expect(TokenKind.WHILE)) {
      return null;
    }

    var value = parseGroup(context);
    return Node.createDoWhile(block, value).withRange(context.spanSince(token.range));
  }

  function parseIf(context) {
    var token = context.next();
    var value = parseGroup(context);

    if (value === null) {
      return null;
    }

    var trueBlock = parseBlockOrStatement(context, StatementHint.IN_IF);

    if (trueBlock === null) {
      return null;
    }

    var falseBlock = null;

    if ((context.eat(TokenKind.NEWLINE) || context.eat(TokenKind.SEMICOLON)) && !context.peek(TokenKind.ELSE)) {
      context.undo();
    }

    if (context.eat(TokenKind.ELSE)) {
      falseBlock = parseBlockOrStatement(context, StatementHint.NORMAL);

      if (falseBlock === null) {
        return null;
      }
    }

    return Node.createIf(NodeKind.IF, value, trueBlock, falseBlock).withRange(context.spanSince(token.range));
  }

  function parseExtension(context) {
    var token = context.next();
    var name = parseName(context);

    if (name === null) {
      return null;
    }

    context.eat(TokenKind.NEWLINE);

    var bases = context.eat(TokenKind.COLON) ? Node.createNodeList(parseTypeList(context, TokenKind.LEFT_BRACE)) : null;
    var block = parseBlock(context, StatementHint.IN_OBJECT);

    if (block === null) {
      return null;
    }

    return Node.createExtension(name, bases, block).withRange(context.spanSince(token.range));
  }

  function parseEnum(context) {
    var token = context.next();
    var isFlags = false;

    if (context.peek(TokenKind.IDENTIFIER) && context.current().text() === 'flags') {
      isFlags = true;
      context.next();
    }

    var name = parseName(context);

    if (name === null) {
      return null;
    }

    var block = parseBlock(context, StatementHint.IN_ENUM);

    if (block === null) {
      return null;
    }

    return (isFlags ? Node.createEnumFlags(name, block) : Node.createEnum(name, block)).withRange(context.spanSince(token.range));
  }

  function parseVariableCluster(context, type, name) {
    var variables = [];
    var start = type;

    while (variables.length === 0 || !peekEndOfLine(context) && !context.peek(TokenKind.SEMICOLON) && !context.peek(TokenKind.IN)) {
      if (variables.length !== 0 && !context.expect(TokenKind.COMMA)) {
        break;
      }

      if (name === null) {
        name = parseName(context);

        if (name === null) {
          break;
        }

        start = name;
      }

      var value = context.eat(TokenKind.ASSIGN) ? pratt.parse(context, Precedence.COMMA) : null;
      variables.push(Node.createVariable(name, null, value).withRange(context.spanSince(start.range)));
      name = null;
    }

    return Node.createVariableCluster(type, variables).withRange(context.spanSince(type.range));
  }

  function parseFor(context) {
    var token = context.next();

    if (!context.expect(TokenKind.LEFT_PARENTHESIS)) {
      return null;
    }

    var setup = null;
    var test = null;
    var update = null;

    do {
      if (!context.peek(TokenKind.SEMICOLON) && !context.peek(TokenKind.RIGHT_PARENTHESIS)) {
        setup = parseType(context);

        if (context.peek(TokenKind.IDENTIFIER)) {
          var name = parseName(context);
          setup = name !== null ? parseVariableCluster(context, setup, name) : null;

          if (setup !== null && context.eat(TokenKind.IN)) {
            var values = pratt.parse(context, Precedence.LOWEST);
            scanForToken(context, TokenKind.RIGHT_PARENTHESIS);

            var body = parseBlockOrStatement(context, StatementHint.NORMAL);

            if (body === null) {
              return null;
            }

            var variables = setup.clusterVariables();

            if (variables.length > 1) {
              syntaxErrorBadForEach(context.log, setup.range);
            }

            var name = variables[0].declarationName().remove();
            var value = Node.createVariable(name, setup.clusterType().remove(), null).withRange(name.range);
            return Node.createForEach(value, values, body).withRange(context.spanSince(token.range));
          }
        } else if (!context.peek(TokenKind.SEMICOLON)) {
          setup = pratt.resume(context, Precedence.LOWEST, setup);
        }
      }

      if (!context.expect(TokenKind.SEMICOLON)) {
        break;
      }

      if (!context.peek(TokenKind.SEMICOLON) && !context.peek(TokenKind.RIGHT_PARENTHESIS)) {
        test = pratt.parse(context, Precedence.LOWEST);
      }

      if (!context.expect(TokenKind.SEMICOLON)) {
        break;
      }

      if (!context.peek(TokenKind.RIGHT_PARENTHESIS)) {
        update = pratt.parse(context, Precedence.LOWEST);
      }
    } while (false);

    scanForToken(context, TokenKind.RIGHT_PARENTHESIS);

    var block = parseBlockOrStatement(context, StatementHint.NORMAL);

    if (block === null) {
      return null;
    }

    return Node.createFor(setup, test, update, block).withRange(context.spanSince(token.range));
  }

  function parseSuperCall(context) {
    var token = context.next();
    var values = parseWrappedCommaSeparatedList(context, TokenKind.LEFT_PARENTHESIS, TokenKind.RIGHT_PARENTHESIS, ListMode.NORMAL);
    return Node.createSuperCall(values).withRange(context.spanSince(token.range));
  }

  function parsePossibleTypedDeclaration(context, hint) {
    var type = parseType(context);

    if (!context.peek(TokenKind.IDENTIFIER)) {
      var value = pratt.resume(context, Precedence.LOWEST, type);
      return Node.createExpression(value).withRange(context.spanSince(type.range));
    }

    var name = parseName(context);

    if (name === null) {
      return null;
    }

    if (context.peek(TokenKind.LEFT_PARENTHESIS) || context.peek(TokenKind.START_PARAMETER_LIST)) {
      var parameters = parseParameters(context);
      var $arguments = parseArgumentVariables(context);

      if ($arguments === null) {
        return null;
      }

      var block = null;
      var ateNewline = context.eat(TokenKind.NEWLINE);

      if (context.peek(TokenKind.LEFT_BRACE)) {
        context.inNonVoidFunction = type.kind !== NodeKind.NAME || type.asString() !== 'void';
        block = parseBlock(context, StatementHint.NORMAL);
        context.inNonVoidFunction = false;

        if (block === null) {
          return null;
        }
      } else if (ateNewline) {
        context.undo();
      }

      return Node.createFunction(name, $arguments, block, type, parameters).withRange(context.spanSince(type.range));
    }

    var cluster = parseVariableCluster(context, type, name);
    var last = cluster.lastChild();
    last.withRange(context.spanSince(last.range));
    return cluster;
  }

  function parseThrow(context) {
    var token = context.next();
    var value = pratt.parse(context, Precedence.LOWEST);
    return Node.createThrow(value).withRange(context.spanSince(token.range));
  }

  function parseTry(context) {
    var token = context.next();
    var noMoreCatches = false;
    var error = false;
    var catches = [];
    var finallyBlock = null;
    var tryBlock = parseBlock(context, StatementHint.NORMAL);

    if (tryBlock === null) {
      return null;
    }

    while (context.peek(TokenKind.CATCH)) {
      if (noMoreCatches) {
        context.expect(TokenKind.FINALLY);
        error = true;
      }

      var catchToken = context.next();
      var variable = null;

      if (context.eat(TokenKind.LEFT_PARENTHESIS)) {
        var type = parseType(context);
        var name = parseName(context);

        if (name === null) {
          break;
        }

        variable = Node.createVariable(name, type, null).withRange(context.spanSince(type.range));

        if (!context.expect(TokenKind.RIGHT_PARENTHESIS)) {
          return null;
        }
      }

      var block = parseBlock(context, StatementHint.NORMAL);

      if (block === null) {
        return null;
      }

      catches.push(Node.createCatch(variable, block).withRange(context.spanSince(catchToken.range)));
      noMoreCatches = variable === null;
    }

    if (context.eat(TokenKind.FINALLY)) {
      finallyBlock = parseBlock(context, StatementHint.NORMAL);

      if (finallyBlock === null) {
        return null;
      }
    }

    if (catches.length === 0 && finallyBlock === null) {
      context.expect(TokenKind.CATCH);
      return null;
    }

    if (error) {
      return errorStatementSinceToken(context, token);
    }

    return Node.createTry(tryBlock, catches, finallyBlock).withRange(context.spanSince(token.range));
  }

  function parseUsing(context) {
    var token = context.next();
    var value = parseType(context);
    return Node.createUsing(value).withRange(context.spanSince(token.range));
  }

  function parseAlias(context) {
    var token = context.next();
    var name = parseName(context);

    if (name === null || !context.expect(TokenKind.ASSIGN)) {
      return errorStatementSinceToken(context, token);
    }

    var value = pratt.parse(context, Precedence.LOWEST);
    return Node.createAlias(name, value).withRange(context.spanSince(token.range));
  }

  function looksLikeType(node) {
    switch (node.kind) {
    case 52:
      var target = node.dotTarget();
      return target !== null && looksLikeType(target);

    case 39:
    case 59:
    case 62:
      return true;
    }

    return false;
  }

  function parseStringToken(context, token) {
    var result = parseStringLiteral(context.log, token.range, token.text());
    return (result !== null ? Node.createString(result.value) : Node.createError()).withRange(token.range);
  }

  function parsePreprocessorDefine(context) {
    context.needsPreprocessor = true;

    var token = context.next();
    var name = parseName(context);

    if (name === null) {
      return errorStatementSinceToken(context, token);
    }

    var value = pratt.parse(context, Precedence.COMMA);
    return Node.createPreprocessorDefine(name, value).withRange(context.spanSince(token.range));
  }

  function parsePreprocessorDiagnostic(context, kind) {
    context.needsPreprocessor = true;

    var token = context.next();
    var stringToken = context.current();

    if (!context.expect(TokenKind.STRING)) {
      return errorStatementSinceToken(context, token);
    }

    var value = parseStringToken(context, stringToken);

    if (value.kind === NodeKind.ERROR) {
      return Node.createExpression(value).withRange(value.range);
    }

    return Node.createPreprocessorDiagnostic(kind, value).withRange(context.spanSince(token.range));
  }

  function parsePreprocessorBlock(context, hint) {
    expectEndOfLine(context);

    var token = context.current();
    var statements = parseStatements(context, hint);
    return Node.createBlock(statements).withRange(context.spanSince(token.range));
  }

  function parsePreprocessorIf(context, hint) {
    context.needsPreprocessor = true;

    var token = context.next();
    var value = pratt.parse(context, Precedence.COMMA);
    var trueNode = parsePreprocessorBlock(context, hint);
    var falseNode = null;

    if (context.peek(TokenKind.PREPROCESSOR_ELIF)) {
      var node = parsePreprocessorIf(context, hint);

      if (node === null) {
        return null;
      }

      falseNode = Node.createBlock([node]).withRange(node.range);
    } else {
      if (context.eat(TokenKind.PREPROCESSOR_ELSE)) {
        falseNode = parsePreprocessorBlock(context, hint);
      }

      if (!context.expect(TokenKind.PREPROCESSOR_ENDIF)) {
        return null;
      }
    }

    return Node.createIf(NodeKind.PREPROCESSOR_IF, value, trueNode, falseNode).withRange(context.spanSince(token.range));
  }

  function parseStatement(context, hint) {
    switch (context.current().kind) {
    case 0:
      return parseAlias(context);

    case 1:
      return parseAnnotation(context, hint);

    case 3:
      return parseAssert(context);

    case 18:
      return parseBreak(context);

    case 22:
      return parseObject(context, NodeKind.CLASS);

    case 25:
    case 40:
    case 42:
    case 50:
    case 53:
    case 76:
    case 86:
    case 87:
    case 88:
    case 89:
    case 99:
    case 111:
      return parseModifier(context, hint);

    case 26:
      return parseContinue(context);

    case 31:
      return parseDoWhile(context);

    case 37:
      return parseEnum(context);

    case 45:
      return parseFor(context);

    case 48:
    case 110:
    case 105:
      return parsePossibleTypedDeclaration(context, hint);

    case 49:
      return parseIf(context);

    case 51:
      return parseExtension(context);

    case 54:
      return parseObject(context, NodeKind.INTERFACE);

    case 70:
      return parseNamespace(context);

    case 71:
      if (hint === StatementHint.IN_OBJECT) {
        return parseConstructor(context, hint);
      }
      break;

    case 79:
      return parsePreprocessorDefine(context);

    case 83:
      return parsePreprocessorDiagnostic(context, NodeKind.PREPROCESSOR_ERROR);

    case 84:
      return parsePreprocessorIf(context, hint);

    case 85:
      return parsePreprocessorDiagnostic(context, NodeKind.PREPROCESSOR_WARNING);

    case 92:
      return parseReturn(context);

    case 102:
      return parseSwitch(context);

    case 104:
      return parseThrow(context);

    case 108:
      return parseTry(context);

    case 109:
      return parseUsing(context);

    case 112:
      return parseWhile(context);
    }

    return parseExpression(context);
  }

  function parseFile(log, tokens) {
    var context = new ParserContext(log, tokens);
    var token = context.current();
    var statements = parseStatements(context, StatementHint.NORMAL);

    if (statements === null) {
      return null;
    }

    if (!context.expect(TokenKind.END_OF_FILE)) {
      return null;
    }

    var range = context.spanSince(token.range);
    var file = Node.createFile(Node.createBlock(statements).withRange(range)).withRange(range);

    if (context.needsPreprocessor) {
      file.flags |= NodeFlags.NEEDS_PREPROCESSOR;
    }

    return file;
  }

  function errorStatementSinceToken(context, token) {
    var range = context.spanSince(token.range);
    return Node.createExpression(Node.createError().withRange(range)).withRange(range);
  }

  function errorExpressionSinceToken(context, token) {
    return Node.createError().withRange(context.spanSince(token.range));
  }

  function createParser() {
    var pratt = new Pratt();
    pratt.literal(TokenKind.NULL, new TokenLiteral(NodeKind.NULL));
    pratt.literal(TokenKind.THIS, new TokenLiteral(NodeKind.THIS));
    pratt.literal(TokenKind.TRUE, new BoolLiteral(true));
    pratt.literal(TokenKind.FALSE, new BoolLiteral(false));
    pratt.literal(TokenKind.INT_DECIMAL, new IntLiteral(10));
    pratt.literal(TokenKind.INT_BINARY, new IntLiteral(2));
    pratt.literal(TokenKind.INT_OCTAL, new IntLiteral(8));
    pratt.literal(TokenKind.INT_HEX, new IntLiteral(16));
    pratt.literal(TokenKind.FLOAT, new FloatLiteral());
    pratt.literal(TokenKind.DOUBLE, new DoubleLiteral());
    pratt.literal(TokenKind.VAR, new VarLiteral());
    pratt.literal(TokenKind.STRING, new StringLiteral());
    pratt.literal(TokenKind.CHARACTER, new CharacterLiteral());
    pratt.literal(TokenKind.IDENTIFIER, new NameLiteral());
    pratt.postfix(TokenKind.INCREMENT, Precedence.UNARY_POSTFIX, new UnaryPostfix(NodeKind.POSTFIX_INCREMENT));
    pratt.postfix(TokenKind.DECREMENT, Precedence.UNARY_POSTFIX, new UnaryPostfix(NodeKind.POSTFIX_DECREMENT));
    pratt.prefix(TokenKind.INCREMENT, Precedence.UNARY_PREFIX, new UnaryPrefix(NodeKind.PREFIX_INCREMENT));
    pratt.prefix(TokenKind.DECREMENT, Precedence.UNARY_PREFIX, new UnaryPrefix(NodeKind.PREFIX_DECREMENT));
    pratt.prefix(TokenKind.PLUS, Precedence.UNARY_PREFIX, new UnaryPrefix(NodeKind.POSITIVE));
    pratt.prefix(TokenKind.MINUS, Precedence.UNARY_PREFIX, new UnaryPrefix(NodeKind.NEGATIVE));
    pratt.prefix(TokenKind.NOT, Precedence.UNARY_PREFIX, new UnaryPrefix(NodeKind.NOT));
    pratt.prefix(TokenKind.TILDE, Precedence.UNARY_PREFIX, new UnaryPrefix(NodeKind.COMPLEMENT));
    pratt.prefix(TokenKind.MULTIPLY, Precedence.UNARY_PREFIX, new UnaryPrefix(NodeKind.PREFIX_DEREFERENCE));
    pratt.prefix(TokenKind.BITWISE_AND, Precedence.UNARY_PREFIX, new UnaryPrefix(NodeKind.PREFIX_REFERENCE));
    pratt.prefix(TokenKind.DELETE, Precedence.UNARY_PREFIX, new UnaryPrefix(NodeKind.DELETE));
    pratt.infix(TokenKind.BITWISE_OR, Precedence.BITWISE_OR, new BinaryInfix(NodeKind.BITWISE_OR));
    pratt.infix(TokenKind.BITWISE_XOR, Precedence.BITWISE_XOR, new BinaryInfix(NodeKind.BITWISE_XOR));
    pratt.infix(TokenKind.DIVIDE, Precedence.MULTIPLY, new BinaryInfix(NodeKind.DIVIDE));
    pratt.infix(TokenKind.EQUAL, Precedence.EQUAL, new BinaryInfix(NodeKind.EQUAL));
    pratt.infix(TokenKind.GREATER_THAN, Precedence.COMPARE, new BinaryInfix(NodeKind.GREATER_THAN));
    pratt.infix(TokenKind.GREATER_THAN_OR_EQUAL, Precedence.COMPARE, new BinaryInfix(NodeKind.GREATER_THAN_OR_EQUAL));
    pratt.infix(TokenKind.IN, Precedence.COMPARE, new BinaryInfix(NodeKind.IN));
    pratt.infix(TokenKind.IS, Precedence.COMPARE, new BinaryInfix(NodeKind.IS));
    pratt.infix(TokenKind.LESS_THAN, Precedence.COMPARE, new BinaryInfix(NodeKind.LESS_THAN));
    pratt.infix(TokenKind.LESS_THAN_OR_EQUAL, Precedence.COMPARE, new BinaryInfix(NodeKind.LESS_THAN_OR_EQUAL));
    pratt.infix(TokenKind.LOGICAL_AND, Precedence.LOGICAL_AND, new BinaryInfix(NodeKind.LOGICAL_AND));
    pratt.infix(TokenKind.LOGICAL_OR, Precedence.LOGICAL_OR, new BinaryInfix(NodeKind.LOGICAL_OR));
    pratt.infix(TokenKind.MINUS, Precedence.ADD, new BinaryInfix(NodeKind.SUBTRACT));
    pratt.infix(TokenKind.NOT_EQUAL, Precedence.EQUAL, new BinaryInfix(NodeKind.NOT_EQUAL));
    pratt.infix(TokenKind.PLUS, Precedence.ADD, new BinaryInfix(NodeKind.ADD));
    pratt.infix(TokenKind.REMAINDER, Precedence.MULTIPLY, new BinaryInfix(NodeKind.REMAINDER));
    pratt.infix(TokenKind.SHIFT_LEFT, Precedence.SHIFT, new BinaryInfix(NodeKind.SHIFT_LEFT));
    pratt.infix(TokenKind.SHIFT_RIGHT, Precedence.SHIFT, new BinaryInfix(NodeKind.SHIFT_RIGHT));
    pratt.infixRight(TokenKind.POWER, Precedence.UNARY_PREFIX, new BinaryInfix(NodeKind.POWER));
    pratt.infixRight(TokenKind.ASSIGN, Precedence.ASSIGN, new BinaryInfix(NodeKind.ASSIGN));
    pratt.infixRight(TokenKind.ASSIGN_PLUS, Precedence.ASSIGN, new BinaryInfix(NodeKind.ASSIGN_ADD));
    pratt.infixRight(TokenKind.ASSIGN_BITWISE_AND, Precedence.ASSIGN, new BinaryInfix(NodeKind.ASSIGN_BITWISE_AND));
    pratt.infixRight(TokenKind.ASSIGN_BITWISE_OR, Precedence.ASSIGN, new BinaryInfix(NodeKind.ASSIGN_BITWISE_OR));
    pratt.infixRight(TokenKind.ASSIGN_BITWISE_XOR, Precedence.ASSIGN, new BinaryInfix(NodeKind.ASSIGN_BITWISE_XOR));
    pratt.infixRight(TokenKind.ASSIGN_DIVIDE, Precedence.ASSIGN, new BinaryInfix(NodeKind.ASSIGN_DIVIDE));
    pratt.infixRight(TokenKind.ASSIGN_MULTIPLY, Precedence.ASSIGN, new BinaryInfix(NodeKind.ASSIGN_MULTIPLY));
    pratt.infixRight(TokenKind.ASSIGN_REMAINDER, Precedence.ASSIGN, new BinaryInfix(NodeKind.ASSIGN_REMAINDER));
    pratt.infixRight(TokenKind.ASSIGN_SHIFT_LEFT, Precedence.ASSIGN, new BinaryInfix(NodeKind.ASSIGN_SHIFT_LEFT));
    pratt.infixRight(TokenKind.ASSIGN_SHIFT_RIGHT, Precedence.ASSIGN, new BinaryInfix(NodeKind.ASSIGN_SHIFT_RIGHT));
    pratt.infixRight(TokenKind.ASSIGN_MINUS, Precedence.ASSIGN, new BinaryInfix(NodeKind.ASSIGN_SUBTRACT));
    pratt.parselet(TokenKind.ANNOTATION, Precedence.LOWEST).prefix = new AnnotationParselet();
    pratt.parselet(TokenKind.PREPROCESSOR_IF, Precedence.LOWEST).prefix = new IfParselet();
    pratt.parselet(TokenKind.LEFT_BRACKET, Precedence.LOWEST).prefix = new ListParselet();
    pratt.parselet(TokenKind.LEFT_BRACE, Precedence.LOWEST).prefix = new MapParselet();
    pratt.parselet(TokenKind.LEFT_PARENTHESIS, Precedence.LOWEST).prefix = new ParenthesisParselet();
    pratt.parselet(TokenKind.QUESTION_MARK, Precedence.ASSIGN).infix = new HookParselet();
    pratt.parselet(TokenKind.COMMA, Precedence.COMMA).infix = new SequenceParselet();
    pratt.parselet(TokenKind.DOT, Precedence.MEMBER).infix = new DotInfixParselet(NodeKind.DOT);
    pratt.parselet(TokenKind.ARROW, Precedence.MEMBER).infix = new DotInfixParselet(NodeKind.DOT_ARROW);
    pratt.parselet(TokenKind.DOUBLE_COLON, Precedence.MEMBER).infix = new DotInfixParselet(NodeKind.DOT_COLON);
    pratt.parselet(TokenKind.DOT, Precedence.LOWEST).prefix = new DotPrefixParselet(NodeKind.DOT);
    pratt.parselet(TokenKind.DOUBLE_COLON, Precedence.LOWEST).prefix = new DotPrefixParselet(NodeKind.DOT_COLON);
    pratt.parselet(TokenKind.LEFT_PARENTHESIS, Precedence.UNARY_POSTFIX).infix = new CallParselet();
    pratt.parselet(TokenKind.NEW, Precedence.UNARY_PREFIX).prefix = new NewParselet();
    pratt.parselet(TokenKind.LEFT_BRACKET, Precedence.UNARY_POSTFIX).infix = new IndexParselet();
    pratt.parselet(TokenKind.START_PARAMETER_LIST, Precedence.MEMBER).infix = new ParameterizeParselet();
    pratt.parselet(TokenKind.TICK, Precedence.UNARY_PREFIX).prefix = new QuotedParselet();
    pratt.parselet(TokenKind.SUPER, Precedence.LOWEST).prefix = new SuperParselet();
    pratt.parselet(TokenKind.BITWISE_AND, Precedence.BITWISE_AND).infix = new BinaryInfixOrUnaryPostfix(NodeKind.BITWISE_AND, NodeKind.POSTFIX_REFERENCE, Precedence.BITWISE_AND);
    pratt.parselet(TokenKind.MULTIPLY, Precedence.MULTIPLY).infix = new BinaryInfixOrUnaryPostfix(NodeKind.MULTIPLY, NodeKind.POSTFIX_DEREFERENCE, Precedence.MULTIPLY);
    return pratt;
  }

  function semanticWarningUnusedExpression(log, range) {
    log.warning(range, 'Unused expression');
  }

  function semanticWarningDuplicateModifier(log, range, modifier) {
    log.warning(range, 'Duplicate modifier ' + simpleQuote(modifier));
  }

  function semanticErrorRedundantModifier(log, range, modifier, where) {
    log.error(range, 'Redundant modifier ' + simpleQuote(modifier) + ' ' + where);
  }

  function semanticErrorUnexpectedModifier(log, range, modifier, where) {
    log.error(range, 'Cannot use the ' + simpleQuote(modifier) + ' modifier ' + where);
  }

  function semanticErrorDuplicateSymbol(log, range, name, previous) {
    log.error(range, simpleQuote(name) + ' is already declared');

    if (!previous.isEmpty()) {
      log.note(previous, 'The previous declaration is here');
    }
  }

  function semanticErrorUnexpectedNode(log, range, kind) {
    log.error(range, 'Unexpected ' + in_NodeKind._toString_[kind]);
  }

  function semanticErrorUnexpectedExpression(log, range, type) {
    log.error(range, 'Unexpected expression of ' + typeToText(type));
  }

  function semanticErrorUnexpectedType(log, range, type) {
    log.error(range, 'Unexpected ' + typeToText(type));
  }

  function semanticErrorUndeclaredSymbol(log, range, name) {
    log.error(range, simpleQuote(name) + ' is not declared');
  }

  function semanticErrorUnknownMemberSymbol(log, range, name, type) {
    log.error(range, simpleQuote(name) + ' is not declared on ' + typeToText(type));
  }

  function semanticErrorBadDotToken(log, range) {
    log.error(range, 'Use the "." operator for member access');
  }

  function semanticErrorExtensionMissingTarget(log, range, name) {
    log.error(range, 'No type named ' + simpleQuote(name) + ' to extend');
  }

  function semanticErrorBadUsingValue(log, range) {
    log.error(range, 'Expected a type here');
  }

  function semanticErrorBadUsing(log, range) {
    log.error(range, 'Expected a namespace here');
  }

  function semanticErrorUnexpectedStatement(log, range) {
    log.error(range, 'Cannot use this statement here');
  }

  function semanticErrorCyclicDeclaration(log, range, name) {
    log.error(range, 'Cyclic declaration of ' + simpleQuote(name));
  }

  function semanticErrorUnexpectedThis(log, range, name) {
    log.error(range, 'Cannot use ' + simpleQuote(name) + ' outside a class');
  }

  function semanticErrorStaticThis(log, range, name) {
    log.error(range, 'Cannot access ' + simpleQuote(name) + ' from a static context');
  }

  function semanticErrorIncompatibleTypes(log, range, from, to, isCastAllowed) {
    log.error(range, 'Cannot convert from ' + typeToText(from) + ' to ' + typeToText(to) + (isCastAllowed ? ' without a cast' : ''));
  }

  function semanticErrorNoCommonType(log, range, left, right) {
    log.error(range, 'No common type for ' + typeToText(left) + ' and ' + typeToText(right));
  }

  function semanticErrorBadType(log, range, type) {
    log.error(range, 'Cannot use ' + typeToText(type) + ' here');
  }

  function semanticErrorMemberUnexpectedStatic(log, range, name) {
    log.error(range, 'Cannot access static member ' + simpleQuote(name) + ' from an instance context');
  }

  function semanticErrorMemberUnexpectedInstance(log, range, name) {
    log.error(range, 'Cannot access instance member ' + simpleQuote(name) + ' from a static context');
  }

  function semanticErrorMissingTypeContext(log, range) {
    log.error(range, 'Expression has no type context here');
  }

  function semanticErrorBadTypeParameterBound(log, range, type) {
    log.error(range, 'Cannot use ' + typeToText(type) + ' as a type parameter bound');
  }

  function semanticErrorUninitializedExtensionVariable(log, range) {
    log.error(range, 'Instance variables in extension blocks must be initialized');
  }

  function semanticErrorNonPureGlobalVariable(log, range) {
    log.error(range, 'Global variables must be initialized to a pure expression (one without side effects)');
  }

  function semanticErrorNonConstantConstValue(log, range) {
    log.error(range, 'Variables with the "const" modifier must be initialized to a compile-time constant');
  }

  function semanticErrorNonConstantAnnotationString(log, range) {
    log.error(range, 'This value must be a compile-time constant string');
  }

  function semanticErrorConstMissingValue(log, range) {
    log.error(range, 'Variables with the "const" modifier must be initialized');
  }

  function semanticErrorVarMissingValue(log, range) {
    log.error(range, 'Implicitly typed variables must be initialized');
  }

  function semanticErrorVarBadType(log, range, type) {
    log.error(range, 'Implicitly typed variables cannot be of ' + typeToText(type));
  }

  function semanticErrorInvalidCall(log, range, type) {
    log.error(range, 'Cannot call ' + typeToText(type));
  }

  function semanticErrorParameterCount(log, range, expected, found) {
    log.error(range, expectedCountText('type parameter', expected, found, ''));
  }

  function semanticErrorArgumentCount(log, range, expected, found) {
    log.error(range, expectedCountText('argument', expected, found, ''));
  }

  function semanticErrorExpectedReturnValue(log, range, type) {
    log.error(range, 'Return statement must return ' + typeToText(type));
  }

  function semanticErrorNonConstantCaseValue(log, range) {
    log.error(range, 'Non-constant case value');
  }

  function semanticErrorBadDefaultCase(log, range) {
    log.error(range, 'Only the last case can be a default case');
  }

  function semanticErrorNonIntegerSwitch(log, range, type) {
    log.error(range, 'Expected an integer type but got ' + typeToText(type));
  }

  function semanticErrorDuplicateCase(log, range, previous) {
    log.error(range, 'Duplicate case value');

    if (!previous.isEmpty()) {
      log.note(previous, 'The first occurrence is here');
    }
  }

  function semanticErrorUnconstructableType(log, range, type) {
    log.error(range, 'Cannot construct ' + typeToText(type));
  }

  function semanticErrorAbstractConstructorInitializer(log, range) {
    log.error(range, 'An abstract constructor must not have initializer list');
  }

  function semanticErrorAbstractNew(log, range, type, reason, name) {
    log.error(range, 'Cannot construct abstract ' + typeToText(type));

    if (!reason.isEmpty()) {
      log.note(reason, 'The ' + typeToText(type) + ' is abstract due to member ' + simpleQuote(name));
    }
  }

  function semanticErrorUnexpectedBaseType(log, range, what) {
    log.error(range, what + ' cannot inherit from another type');
  }

  function semanticErrorClassBaseNotFirst(log, range, type) {
    log.error(range, 'Base ' + typeToText(type) + ' must come first in a class declaration');
  }

  function semanticErrorBadBaseType(log, range, type) {
    log.error(range, 'Invalid base ' + typeToText(type));
  }

  function semanticErrorDuplicateBaseType(log, range, type) {
    log.error(range, 'Duplicate base ' + typeToText(type));
  }

  function semanticErrorAmbiguousSymbol(log, range, name, names) {
    log.error(range, 'Reference to ' + simpleQuote(name) + ' is ambiguous, could be ' + namesToText(names, 'or'));
  }

  function semanticErrorCannotMerge(log, range, name, names) {
    log.error(range, 'Cannot merge ' + namesToText(names, 'and') + ' for ' + simpleQuote(name));
  }

  function semanticErrorAmbiguousMergedType(log, range, name, types) {
    log.error(range, 'Member ' + simpleQuote(name) + ' has an ambiguous inherited type, could be ' + typesToText(types, 'or'));
  }

  function semanticErrorAmbiguousPurity(log, range, name) {
    log.error(range, 'Member ' + simpleQuote(name) + ' has an ambiguous inherited purity');
  }

  function semanticErrorBadOverride(log, range, name, base, overridden) {
    log.error(range, simpleQuote(name) + ' overrides another declaration with the same name in base ' + typeToText(base));

    if (!overridden.isEmpty()) {
      log.note(overridden, 'The overridden declaration is here');
    }
  }

  function semanticErrorOverrideDifferentTypes(log, range, name, base, derived, overridden) {
    log.error(range, simpleQuote(name) + ' must have the same signature as the function it overrides (expected ' + typeToText(base) + ' but found ' + typeToText(derived) + ')');

    if (!overridden.isEmpty()) {
      log.note(overridden, 'The overridden declaration is here');
    }
  }

  function semanticErrorModifierMissingOverride(log, range, name, overridden) {
    log.error(range, simpleQuote(name) + ' overrides another symbol with the same name but is missing the "override" modifier');

    if (!overridden.isEmpty()) {
      log.note(overridden, 'The overridden declaration is here');
    }
  }

  function semanticErrorCannotOverrideNonVirtual(log, range, name, overridden) {
    log.error(range, simpleQuote(name) + ' cannot override a non-virtual function');

    if (!overridden.isEmpty()) {
      log.note(overridden, 'The overridden declaration is here');
    }
  }

  function semanticErrorOverridePurityMismatch(log, range, name, overridden) {
    log.error(range, simpleQuote(name) + ' overrides another symbol with a different purity');

    if (!overridden.isEmpty()) {
      log.note(overridden, 'The overridden declaration is here');
    }
  }

  function semanticErrorBadIntegerConstant(log, range, type) {
    log.error(range, 'Expected integer constant but found expression of ' + typeToText(type));
  }

  function semanticErrorBadStorage(log, range) {
    log.error(range, 'Cannot store to this location');
  }

  function semanticErrorStorageToProtectedSymbol(log, range, modifier) {
    log.error(range, 'Cannot store to a symbol marked as ' + simpleQuote(modifier));
  }

  function semanticErrorUnparameterizedType(log, range, type) {
    log.error(range, 'Cannot use unparameterized ' + typeToText(type));
  }

  function semanticErrorCannotParameterize(log, range, type) {
    log.error(range, 'Cannot parameterize ' + typeToText(type) + (type.hasParameters() ? ' because it is already parameterized' : ' because it has no type parameters'));
  }

  function semanticErrorBadSuperInitializer(log, range) {
    log.error(range, 'No base constructor to call');
  }

  function semanticErrorMissingSuperInitializer(log, range) {
    log.error(range, 'Missing call to "super" in initializer list');
  }

  function semanticErrorStaticConstructorInitializerList(log, range) {
    log.error(range, 'Static constructors cannot have initializer lists');
  }

  function semanticErrorAlreadyInitialized(log, range, name, previous) {
    log.error(range, simpleQuote(name) + ' is already initialized');

    if (!previous.isEmpty()) {
      log.note(previous, 'The previous initialization is here');
    }
  }

  function semanticErrorBadEnumToString(log, range, name, first, second, value) {
    log.error(range, 'Cannot automatically generate "toString" for ' + simpleQuote(name) + ' because ' + simpleQuote(first) + ' and ' + simpleQuote(second) + ' both have the same value ' + value);
  }

  function semanticErrorMissingReturn(log, range, name, type) {
    log.error(range, 'All control paths for ' + simpleQuote(name) + ' must return a value of ' + typeToText(type));
  }

  function semanticErrorBaseClassInExtension(log, range) {
    log.error(range, 'The base class must be set from the class declaration, not from an extension block');
  }

  function semanticErrorMustCallFunctionReference(log, range) {
    log.error(range, 'Raw function references are not allowed (call the function instead)');
  }

  function semanticErrorMissingToString(log, range, type) {
    log.error(range, 'Expression of ' + typeToText(type) + ' has no toString() member to call');
  }

  function semanticErrorToStringWrongType(log, range, expected, found, declaration) {
    log.error(range, 'Expected toString() to have ' + typeToText(expected) + ' but found ' + typeToText(found));

    if (!declaration.isEmpty()) {
      log.note(declaration, 'The declaration for toString() is here');
    }
  }

  function semanticErrorCannotImplementInterfaceFunction(log, range) {
    log.error(range, 'Virtual interface functions cannot have an implementation');
  }

  function semanticErrorCannotImplementImportedFunction(log, range) {
    log.error(range, 'Imported functions cannot have an implementation');
  }

  function semanticErrorFunctionMustBeAbstract(log, range) {
    log.error(range, 'Abstract functions must use the "virtual" modifier');
  }

  function semanticErrorUnimplementedConstructor(log, range) {
    log.error(range, 'Every constructor must have an implementation');
  }

  function semanticErrorUnimplementedFunction(log, range) {
    log.error(range, 'Use the "import" modifier to import functions');
  }

  function semanticErrorNonConstantAssert(log, range) {
    log.error(range, 'The argument to a compile-time assert must be a constant');
  }

  function semanticErrorFalseAssert(log, range) {
    log.error(range, 'Assertion failed');
  }

  function semanticErrorListLiteralCommonTypeInferenceFailed(log, range) {
    log.error(range, 'Cannot infer a common element type for this list literal');
  }

  function semanticErrorMapLiteralCommonTypeInferenceFailed(log, range, where) {
    log.error(range, 'Cannot infer a common ' + where + ' type for this map literal');
  }

  function semanticErrorMapLiteralBadKeyType(log, range, type) {
    log.error(range, 'No support for maps with keys of ' + typeToText(type));
  }

  function semanticErrorNoDefaultValue(log, range, type) {
    log.error(range, 'Cannot create a default value for ' + typeToText(type));
  }

  function semanticErrorEnumValueOutOfRange(log, range, name) {
    log.error(range, 'Assigned value for enum ' + simpleQuote(name) + ' cannot fit in an integer');
  }

  function semanticErrorBadSuperCall(log, range) {
    log.error(range, 'Cannot use "super" here');
  }

  function semanticErrorAbstractSuperCall(log, range, overridden) {
    log.error(range, 'Cannot call abstract member in base class');

    if (!overridden.isEmpty()) {
      log.note(overridden, 'The overridden member is here');
    }
  }

  function semanticErrorNestedStorageOperator(log, range) {
    log.error(range, 'Assignment expressions are not allowed inside other expressions');
  }

  function semanticErrorForVariablesMustBeSameType(log, range, firstName, firstType, secondName, secondType) {
    log.error(range, 'All for loop variables must have the same type (' + simpleQuote(firstName) + ' has ' + typeToText(firstType) + ' but ' + simpleQuote(secondName) + ' has ' + typeToText(secondType) + ')');
  }

  function semanticErrorUnknownAnnotation(log, range, name) {
    log.error(range, 'Unknown annotation ' + simpleQuote(name));
  }

  function semanticErrorUnexpectedAnnotationArgumentCount(log, range, name, expected) {
    log.error(range, 'The annotation ' + simpleQuote(name) + (expected === 0 ? ' cannot take arguments' : ' must take ' + expected + ' argument' + prettyPrint.plural(expected)));
  }

  function semanticErrorNoFileAccess(log, range) {
    log.error(range, 'The compiler does not have file access');
  }

  function semanticErrorCannotFindFile(log, range, relativePath) {
    log.error(range, 'The file ' + simpleQuote(relativePath) + ' could not be found');
  }

  function semanticErrorOperatorOnNonInstanceFunction(log, range) {
    log.error(range, 'Operator overloading only applies to instance functions');
  }

  function semanticErrorNonGlobalEntryPoint(log, range) {
    log.error(range, 'The entry point must be a global function');
  }

  function semanticErrorNonTopLevelExternC(log, range) {
    log.error(range, 'An external C-style symbol must be a top-level function or variable');
  }

  function semanticErrorOperatorArgumentCount(log, range, expected, found, name) {
    log.error(range, expectedCountText('argument', expected, found, ' because of ' + simpleQuote(name)));
  }

  function semanticErrorNoMatchingOperator(log, range, kind, types) {
    if (!(kind in operatorInfo)) {
      throw new Error('assert kind in operatorInfo (src/resolver/diagnostics.sk:403:3)');
    }

    log.error(range, 'No ' + (types.length === 1 ? 'unary' : types.length === 2 ? 'binary' : 'ternary') + ' operator "' + operatorInfo[kind].text + '" for ' + typesToText(types, 'and'));
  }

  function semanticErrorAmbiguousOperator(log, range, kind, names) {
    if (!(kind in operatorInfo)) {
      throw new Error('assert kind in operatorInfo (src/resolver/diagnostics.sk:409:3)');
    }

    log.error(range, (names.length === 1 ? 'Unary' : names.length === 2 ? 'Binary' : 'Ternary') + ' operator "' + operatorInfo[kind].text + '" is ambiguous, could be ' + namesToText(names, 'or'));
  }

  function semanticErrorDuplicateEntryPoint(log, range, previous) {
    log.error(range, 'Multiple entry points are declared');
    log.note(previous, 'The first entry point is here');
  }

  function semanticErrorInvalidEntryPointType(log, range, found, expected) {
    log.error(range, 'Unexpected entry point ' + typeToText(found) + ', expected ' + typesToText(expected, 'or'));
  }

  function semanticErrorEntryPointOnImportedSymbol(log, range) {
    log.error(range, 'The entry point cannot be imported');
  }

  function semanticErrorDuplicateEmitAs(log, range) {
    log.error(range, 'Duplicate @EmitAs annotation');
  }

  function semanticErrorPreprocessorInvalidValue(log, range) {
    log.error(range, 'Unexpected expression in preprocessor value');
  }

  function semanticErrorPreprocessorInvalidSymbol(log, range, name) {
    log.error(range, simpleQuote(name) + ' is not a valid preprocessor symbol');
  }

  function semanticErrorPreprocessorInvalidOverriddenDefine(log, range, name) {
    log.error(range, 'Could not find a #define named ' + simpleQuote(name) + ' to override');
  }

  function semanticErrorPurityViolation(log, range) {
    log.error(range, 'Cannot use an impure value inside a pure function');
  }

  function semanticErrorAccessViolation(log, range, level, name) {
    log.error(range, 'Cannot access ' + level + ' symbol ' + simpleQuote(name) + ' here');
  }

  FunctionInliningPass.run = function(callGraph, options) {
    var graph = new InliningGraph(callGraph, options);

    for (var i = 0; i < graph.inliningInfo.length; i = i + 1 | 0) {
      FunctionInliningPass.inlineSymbol(graph, graph.inliningInfo[i]);
    }
  };

  FunctionInliningPass.inlineSymbol = function(graph, info) {
    if (!info.shouldInline) {
      return;
    }

    for (var i = 0; i < info.bodyCalls.length; i = i + 1 | 0) {
      FunctionInliningPass.inlineSymbol(graph, info.bodyCalls[i]);
    }

    for (var i = 0; i < info.callSites.length; i = i + 1 | 0) {
      var callSite = info.callSites[i];

      if (callSite !== null && callSite.kind === NodeKind.CALL) {
        if (info.symbol.neededIncludes !== null) {
          FunctionInliningPass.propagateNeededIncludes(info.symbol, callSite);
        }

        info.callSites[i] = null;

        var clone = info.inlineValue.clone().withType(callSite.type);
        var values = callSite.removeChildren();

        if (values.length !== (info.$arguments.length + 1 | 0)) {
          throw new Error('assert values.size() == info.arguments.size() + 1 (src/resolver/functioninlining.sk:36:9)');
        }

        var value = values.shift();

        if (value.kind !== NodeKind.NAME || value.symbol !== info.symbol) {
          throw new Error('assert value.kind == .NAME && value.symbol == info.symbol (src/resolver/functioninlining.sk:38:9)');
        }

        if (info.unusedArguments.length !== 0) {
          var sequence = null;

          for (var j = 0; j < info.unusedArguments.length; j = j + 1 | 0) {
            var index = info.$arguments.indexOf(info.unusedArguments[j]);

            if (index < 0) {
              throw new Error('assert index >= 0 (src/resolver/functioninlining.sk:56:13)');
            }

            var replacement = values[index];

            if (!replacement.hasNoSideEffects()) {
              if (sequence === null) {
                sequence = [];
              }

              sequence.push(replacement);
            }
          }

          if (sequence !== null) {
            sequence.push(clone);
            callSite.become(Node.createSequence(sequence));
            FunctionInliningPass.recursivelySubstituteArguments(callSite, info.$arguments, values);
            continue;
          }
        }

        callSite.become(clone);
        FunctionInliningPass.recursivelySubstituteArguments(callSite, info.$arguments, values);
      }
    }
  };

  FunctionInliningPass.propagateNeededIncludes = function(symbol, node) {
    if (symbol.neededIncludes === null) {
      throw new Error('assert symbol.neededIncludes != null (src/resolver/functioninlining.sk:78:5)');
    }

    while (node !== null) {
      if (in_NodeKind.isNamedDeclaration(node.kind) && node.symbol !== null) {
        var kind = node.symbol.kind;

        if (in_SymbolKind.isGlobal(kind) || in_SymbolKind.isInstance(kind)) {
          for (var i = 0; i < symbol.neededIncludes.length; i = i + 1 | 0) {
            node.symbol.addNeededInclude(symbol.neededIncludes[i]);
          }

          break;
        }
      }

      node = node.parent;
    }
  };

  FunctionInliningPass.recursivelySubstituteArguments = function(node, $arguments, values) {
    if (node.symbol !== null) {
      var index = $arguments.indexOf(node.symbol);

      if (index >= 0) {
        node.replaceWith(values[index]);
        return;
      }
    }

    if (node.hasChildren()) {
      for (var i = 0; i < node.children.length; i = i + 1 | 0) {
        var child = node.children[i];

        if (child !== null) {
          FunctionInliningPass.recursivelySubstituteArguments(child, $arguments, values);
        }
      }
    }
  };

  GlobalizePass.run = function(graph, resolver) {
    for (var i = 0; i < graph.callInfo.length; i = i + 1 | 0) {
      var info = graph.callInfo[i];
      var symbol = info.symbol;
      var enclosingSymbol = symbol.enclosingSymbol;

      if (symbol.kind === SymbolKind.INSTANCE_FUNCTION && !symbol.isImport() && symbol.node.functionBlock() !== null && (enclosingSymbol.isImport() || in_SymbolKind.isEnum(enclosingSymbol.kind) || (resolver.options.globalizeAllFunctions || symbol.isInline()) && !symbol.isExport() && !symbol.isVirtual() || in_CompilerTarget.moveNonVirtualSymbolsOffInterfaces(resolver.options.target) && enclosingSymbol.kind === SymbolKind.INTERFACE && !symbol.isVirtual())) {
        var thisSymbol = resolver.createSymbol('this', SymbolKind.LOCAL_VARIABLE);
        thisSymbol.type = enclosingSymbol.type;

        if (enclosingSymbol.hasParameters()) {
          if (symbol.parameters === null) {
            symbol.parameters = [];
          }

          for (var j = 0; j < enclosingSymbol.parameters.length; j = j + 1 | 0) {
            var parameter = enclosingSymbol.parameters[j];
            var clone = resolver.createSymbol(parameter.name, SymbolKind.FUNCTION_PARAMETER);
            clone.type = new Type(clone);
            symbol.parameters.push(clone);
          }
        }

        thisSymbol.type = resolver.cache.ensureTypeIsParameterized(thisSymbol.type);
        GlobalizePass.recursivelyReplaceThis(symbol.node.functionBlock(), thisSymbol);
        symbol.kind = SymbolKind.GLOBAL_FUNCTION;
        symbol.flags |= SymbolFlag.STATIC;

        var $arguments = symbol.type.argumentTypes();
        $arguments.unshift(thisSymbol.type);
        resolver.createFunctionType(symbol, symbol.type.resultType(), $arguments);
        thisSymbol.node = Node.createVariable(GlobalizePass.createThis(thisSymbol), Node.createType(thisSymbol.type), null).withSymbol(thisSymbol);
        symbol.node.functionArguments().insertChild(0, thisSymbol.node);
        GlobalizePass.updateAllCallSites(info.callSites, symbol, thisSymbol, resolver);
      }
    }
  };

  GlobalizePass.updateAllCallSites = function(callSites, symbol, thisSymbol, resolver) {
    for (var i = 0; i < callSites.length; i = i + 1 | 0) {
      var callSite = callSites[i];
      var value = callSite.callValue();
      var target = null;
      var name = null;

      if (value.kind === NodeKind.DOT) {
        target = value.dotTarget().replaceWith(null);
        name = value.dotName().replaceWith(null);
      } else {
        if (value.kind !== NodeKind.NAME) {
          throw new Error('assert value.kind == .NAME (src/resolver/globalize.sk:71:9)');
        }

        target = Node.createThis().withType(thisSymbol.type);
        name = value.replaceWith(null);
      }

      var targetSubstitutions = target.type !== null ? target.type.substitutions : null;
      var nameSubstitutions = name.type !== null ? name.type.substitutions : null;

      if (targetSubstitutions !== null || nameSubstitutions !== null) {
        var types = [];

        if (nameSubstitutions !== null) {
          for (var j = 0; j < nameSubstitutions.length; j = j + 1 | 0) {
            types.push(nameSubstitutions[j]);
          }
        }

        if (targetSubstitutions !== null) {
          for (var j = 0; j < targetSubstitutions.length; j = j + 1 | 0) {
            types.push(targetSubstitutions[j]);
          }
        }

        name.type = resolver.cache.parameterize(symbol.type, types);
      } else {
        name.type = symbol.type;
      }

      callSite.replaceChild(0, name);
      callSite.insertChild(1, target);
    }
  };

  GlobalizePass.createThis = function(symbol) {
    return Node.createName(symbol.name).withSymbol(symbol).withType(symbol.type);
  };

  GlobalizePass.recursivelyReplaceThis = function(node, symbol) {
    if (node.kind === NodeKind.THIS) {
      node.become(GlobalizePass.createThis(symbol).withRange(node.range));
    } else if (node.isNameExpression() && node.symbol !== null && (node.symbol.kind === SymbolKind.INSTANCE_FUNCTION || node.symbol.kind === SymbolKind.INSTANCE_VARIABLE)) {
      node.become(Node.createDot(GlobalizePass.createThis(symbol), node.clone()).withType(node.type).withRange(node.range).withSymbol(node.symbol));
    } else if (node.hasChildren()) {
      for (var i = 0; i < node.children.length; i = i + 1 | 0) {
        var child = node.children[i];

        if (child !== null) {
          GlobalizePass.recursivelyReplaceThis(child, symbol);
        }
      }
    }
  };

  in_SymbolKind.isParameter = function($this) {
    return $this >= SymbolKind.OBJECT_PARAMETER && $this <= SymbolKind.FUNCTION_PARAMETER;
  };

  in_SymbolKind.isNamespace = function($this) {
    return $this >= SymbolKind.GLOBAL_NAMESPACE && $this <= SymbolKind.NAMESPACE;
  };

  in_SymbolKind.isTypeWithInstances = function($this) {
    return $this >= SymbolKind.ENUM && $this <= SymbolKind.INTERFACE;
  };

  in_SymbolKind.isEnum = function($this) {
    return $this >= SymbolKind.ENUM && $this <= SymbolKind.ENUM_FLAGS;
  };

  in_SymbolKind.isObject = function($this) {
    return $this >= SymbolKind.CLASS && $this <= SymbolKind.INTERFACE;
  };

  in_SymbolKind.isType = function($this) {
    return $this >= SymbolKind.QUOTED_TYPE && $this <= SymbolKind.INTERFACE;
  };

  in_SymbolKind.isFunction = function($this) {
    return $this >= SymbolKind.GLOBAL_FUNCTION && $this <= SymbolKind.MERGED_INSTANCE_FUNCTION;
  };

  in_SymbolKind.isVariable = function($this) {
    return $this >= SymbolKind.LOCAL_VARIABLE && $this <= SymbolKind.INSTANCE_VARIABLE;
  };

  in_SymbolKind.isGlobal = function($this) {
    return $this === SymbolKind.GLOBAL_FUNCTION || $this === SymbolKind.GLOBAL_VARIABLE;
  };

  in_SymbolKind.isInstance = function($this) {
    return $this >= SymbolKind.INSTANCE_FUNCTION && $this <= SymbolKind.MERGED_INSTANCE_FUNCTION || $this === SymbolKind.INSTANCE_VARIABLE;
  };

  function commandLineWarningDuplicateFlagValue(log, range, name, previous) {
    log.warning(range, 'Multiple values are specified for ' + simpleQuote(name) + ', using the later value');

    if (!previous.isEmpty()) {
      log.note(previous, 'Ignoring the value from the previous use');
    }
  }

  function commandLineErrorBadFlag(log, range, name) {
    log.error(range, 'Unknown command line flag ' + simpleQuote(name));
  }

  function commandLineErrorMissingTarget(log, range, name) {
    log.error(range, 'Specify the target format using ' + simpleQuote(name));
  }

  function commandLineErrorMissingOutput(log, range, first, second) {
    log.error(range, 'Specify the output location using either ' + simpleQuote(first) + ' or ' + simpleQuote(second));
  }

  function commandLineErrorDuplicateOutput(log, range, first, second) {
    log.error(range, 'Cannot specify both ' + simpleQuote(first) + ' and ' + simpleQuote(second));
  }

  function commandLineErrorNonBooleanValue(log, range, value, text) {
    log.error(range, 'Expected "true" or "false" but found ' + simpleQuote(value) + ' in ' + simpleQuote(text));
  }

  function commandLineErrorNonIntegerValue(log, range, value, text) {
    log.error(range, 'Expected integer constant but found ' + simpleQuote(value) + ' in ' + simpleQuote(text));
  }

  function commandLineErrorMissingValue(log, range, text) {
    log.error(range, 'Use ' + simpleQuote(text) + ' to provide a value');
  }

  function commandLineErrorExpectedToken(log, range, expected, found, text) {
    log.error(range, 'Expected ' + simpleQuote(expected) + ' but found ' + simpleQuote(found) + ' in ' + simpleQuote(text));
  }

  function commandLineErrorInvalidEnum(log, range, name, found, expected) {
    log.error(range, 'Invalid ' + name + ' ' + simpleQuote(found) + ', must be either ' + prettyPrint.join(simpleQuoteAll(expected), 'or'));
  }

  function commandLineErrorUnexpectedConfiguration(log, range, config, target) {
    log.error(range, 'Unexpected configuration ' + simpleQuote(config) + ' for target ' + simpleQuote(target));
  }

  function commandLineErrorUnexpectedGarbageCollectionStrategy(log, range, target) {
    log.error(range, 'The ' + simpleQuote(target) + ' target does not have a configurable garbage collection strategy');
  }

  function commandLineErrorUnreadableFile(log, range, name) {
    log.error(range, 'Could not read from ' + simpleQuote(name));
  }

  function commandLineErrorUnwritableFile(log, range, name) {
    log.error(range, 'Could not write to ' + simpleQuote(name));
  }

  function commandLineErrorNoInputFiles(log, range) {
    log.error(range, 'Missing input files');
  }

  frontend.main = function($arguments) {
    var log = new Log();
    var parser = new OptionParser();
    var options = frontend.parseOptions(log, parser, $arguments);
    var inputs = frontend.readSources(log, parser.normalArguments);

    if (!log.hasErrors() && options !== null) {
      var compiler = new Compiler(options);

      for (var i = 0; i < inputs.length; i = i + 1 | 0) {
        compiler.addInput(inputs[i]);
      }

      var result = compiler.compile();

      if (!log.hasErrors()) {
        for (var i = 0; i < result.outputs.length; i = i + 1 | 0) {
          var output = result.outputs[i];

          if (!io.writeFile(output.name, output.contents)) {
            var outputFile = parser.stringRangeForOption(Option.OUTPUT_FILE);
            var outputDirectory = parser.stringRangeForOption(Option.OUTPUT_DIRECTORY);
            commandLineErrorUnwritableFile(log, outputFile !== null ? outputFile : outputDirectory, output.name);
            break;
          }
        }

        if (!log.hasErrors() && options.verbose) {
          process.stdout.write(compiler.statistics(result) + '\n');
        }
      }
    }

    frontend.printLogWithColor(log, parser.intForOption(Option.ERROR_LIMIT, frontend.DEFAULT_ERROR_LIMIT));
    return log.hasErrors() ? 1 : 0;
  };

  frontend.joinKeys = function(keys) {
    keys.sort(bindCompare(StringComparison.INSTANCE));
    return prettyPrint.join(simpleQuoteAll(keys), 'and');
  };

  frontend.parseEnum = function(log, name, map, range, defaultValue) {
    var key = range.toString();

    if (key in map) {
      return map[key];
    }

    var keys = Object.keys(map);
    keys.sort(bindCompare(StringComparison.INSTANCE));
    commandLineErrorInvalidEnum(log, range, name, key, keys);
    return defaultValue;
  };

  frontend.parseOptions = function(log, parser, $arguments) {
    parser.define(OptionType.BOOL, Option.HELP, '--help', 'Prints this message.').aliases('-help ? -? -h -H /? /h /H'.split(' '));
    parser.define(OptionType.STRING, Option.TARGET, '--target', 'Sets the target format. Valid targets are ' + frontend.joinKeys(Object.keys(frontend.VALID_TARGETS)) + '.');
    parser.define(OptionType.STRING, Option.OUTPUT_FILE, '--output-file', 'Combines all output into a single file. Mutually exclusive with --output-dir.');
    parser.define(OptionType.STRING, Option.OUTPUT_DIRECTORY, '--output-dir', 'Places all output files in the specified directory. Mutually exclusive with --output-file.');
    parser.define(OptionType.STRING_LIST, Option.DEFINE, '--define', 'Overrides the value of a #define statement. Example: --define:UNIT_TESTS=true.');
    parser.define(OptionType.BOOL, Option.RELEASE, '--release', 'Implies --inline, --globalize, --remove-asserts, --fold-constants, --minify, --mangle, and --define:BUILD_RELEASE.');
    parser.define(OptionType.STRING, Option.CONFIG, '--config', 'Provides the configuration for the target format. Valid configurations are ' + frontend.joinKeys(Object.keys(frontend.VALID_JS_CONFIGS)) + ' for JavaScript and ' + frontend.joinKeys(Object.keys(frontend.VALID_CPP_CONFIGS)) + ' for C++. Defaults to "browser" for JavaScript and the current operating system for C++.');
    parser.define(OptionType.BOOL, Option.VERBOSE, '--verbose', 'Prints out information about the compilation.');
    parser.define(OptionType.STRING, Option.GC, '--gc', 'Sets the garbage collection strategy when targeting C++. Valid strategies are ' + frontend.joinKeys(Object.keys(frontend.VALID_GC_STRATEGIES)) + '. Defaults to "none".');
    parser.define(OptionType.BOOL, Option.SOURCE_MAP, '--source-map', 'Generates a source map when targeting JavaScript. The source map is saved with the ".map" extension in the same directory as the main output file.');
    parser.define(OptionType.BOOL, Option.INCLUDE_LIBRARIES, '--include-libraries', 'Includes library source code in the output. Only applies to the "joined", "json-ast", "lisp-ast", and "xml-ast" targets.');
    parser.define(OptionType.BOOL, Option.INLINE, '--inline', 'Uses heuristics to automatically inline simple functions.');
    parser.define(OptionType.BOOL, Option.GLOBALIZE, '--globalize', 'Changes all internal non-virtual instance methods to static methods. This provides more inlining opportunities at compile time and avoids property access overhead at runtime.');
    parser.define(OptionType.BOOL, Option.REMOVE_ASSERTS, '--remove-asserts', 'Removes all assert statements during compilation.');
    parser.define(OptionType.BOOL, Option.FOLD_CONSTANTS, '--fold-constants', 'Evaluates constants at compile time and removes dead code inside functions.');
    parser.define(OptionType.BOOL, Option.MINIFY, '--minify', 'Omits whitespace so the emitted JavaScript takes up less space.');
    parser.define(OptionType.BOOL, Option.MANGLE, '--mangle', 'Transforms your JavaScript code to be as small as possible. The "export" modifier prevents renaming a symbol.');
    parser.define(OptionType.INT, Option.ERROR_LIMIT, '--error-limit', 'Sets the maximum number of errors to report. Pass 0 to disable the error limit. The default is 20.');
    parser.define(OptionType.STRING_LIST, Option.LIBRARY, '--lib', 'Include a library in the compilation. Valid library names are ' + frontend.joinKeys(Object.keys(frontend.VALID_OPTIONAL_LIBRARIES)) + '.');
    parser.parse(log, $arguments);

    if (log.hasErrors()) {
      return null;
    }

    if (parser.boolForOption(Option.HELP, $arguments.length === 0)) {
      frontend.printUsage(parser);
      return null;
    }

    var options = new CompilerOptions();
    var releaseFlag = parser.boolForOption(Option.RELEASE, false);
    options.fileAccess = new FrontendFileAccess();
    options.verbose = parser.boolForOption(Option.VERBOSE, false);
    options.sourceMap = parser.boolForOption(Option.SOURCE_MAP, false);
    options.minify = parser.boolForOption(Option.MINIFY, releaseFlag);
    options.mangle = parser.boolForOption(Option.MANGLE, releaseFlag);
    options.removeAsserts = parser.boolForOption(Option.REMOVE_ASSERTS, releaseFlag);
    options.foldAllConstants = parser.boolForOption(Option.FOLD_CONSTANTS, releaseFlag);
    options.includeLibraries = parser.boolForOption(Option.INCLUDE_LIBRARIES, false);
    options.inlineAllFunctions = parser.boolForOption(Option.INLINE, releaseFlag);
    options.globalizeAllFunctions = parser.boolForOption(Option.GLOBALIZE, releaseFlag);
    options.log = log;

    if (releaseFlag) {
      options.overrideDefine('BUILD_RELEASE', true);
    }

    var defines = parser.stringRangeListForOption(Option.DEFINE);

    if (defines !== null) {
      for (var i = 0; i < defines.length; i = i + 1 | 0) {
        var range = defines[i];
        var text = range.toString();
        var equals = text.indexOf('=');
        var value = true;
        var name = text;

        if (equals >= 0) {
          name = text.slice(0, equals);

          var boolean = text.slice(equals + 1 | 0, text.length);

          if (boolean !== 'true' && boolean !== 'false') {
            commandLineErrorNonBooleanValue(log, range.fromEnd(boolean.length), boolean, text);
            continue;
          }

          value = boolean === 'true';
          range = range.fromStart(name.length);
        }

        options.overriddenDefines[name] = new OverriddenDefine(value, range);
      }
    }

    var end = parser.source.contents.length;
    var trailingSpace = new Range(parser.source, end - 1 | 0, end);

    if (parser.normalArguments.length === 0) {
      commandLineErrorNoInputFiles(log, trailingSpace);
    }

    var target = parser.stringRangeForOption(Option.TARGET);

    if (target !== null) {
      options.target = frontend.parseEnum(log, 'target', frontend.VALID_TARGETS, target, CompilerTarget.NONE);
    } else {
      commandLineErrorMissingTarget(log, trailingSpace, '--target');
    }

    var outputFile = parser.stringRangeForOption(Option.OUTPUT_FILE);
    var outputDirectory = parser.stringRangeForOption(Option.OUTPUT_DIRECTORY);

    if (outputFile === null && outputDirectory === null) {
      commandLineErrorMissingOutput(log, trailingSpace, '--output-file', '--output-dir');
    } else if (outputFile !== null && outputDirectory !== null) {
      commandLineErrorDuplicateOutput(log, outputFile.start > outputDirectory.start ? outputFile : outputDirectory, '--output-file', '--output-dir');
    } else if (outputFile !== null) {
      options.outputFile = outputFile.toString();
    } else {
      options.outputDirectory = outputDirectory.toString();
    }

    var config = parser.stringRangeForOption(Option.CONFIG);

    if (options.target !== CompilerTarget.NONE && config !== null) {
      if (options.target === CompilerTarget.JAVASCRIPT || options.target === CompilerTarget.CPP) {
        options.config = frontend.parseEnum(log, 'configuration', options.target === CompilerTarget.JAVASCRIPT ? frontend.VALID_JS_CONFIGS : frontend.VALID_CPP_CONFIGS, config, CompilerConfig.AUTOMATIC);
      } else {
        commandLineErrorUnexpectedConfiguration(log, config, config.toString(), target.toString());
      }
    }

    var gc = parser.stringRangeForOption(Option.GC);

    if (gc !== null) {
      if (options.target === CompilerTarget.CPP) {
        options.memoryManagement = frontend.parseEnum(log, 'garbage collection strategy', frontend.VALID_GC_STRATEGIES, gc, MemoryManagement.NONE);
      } else if (options.target !== CompilerTarget.NONE) {
        commandLineErrorUnexpectedGarbageCollectionStrategy(log, gc, target.toString());
      }
    }

    var libraries = parser.stringRangeListForOption(Option.LIBRARY);

    if (libraries !== null) {
      for (var i = 0; i < libraries.length; i = i + 1 | 0) {
        var range = libraries[i];
        var name = range.toString();
        var library = frontend.parseEnum(log, 'library name', frontend.VALID_OPTIONAL_LIBRARIES, range, OptionalLibrary.NONE);
        var dependencies = in_IntMap.getOrDefault(frontend.OPTIONAL_LIBRARY_DEPENDENCIES, library, null);

        if (library !== OptionalLibrary.NONE) {
          in_List.pushOnce(options.optionalLibraries, library);

          if (dependencies !== null) {
            for (var j = 0; j < dependencies.length; j = j + 1 | 0) {
              in_List.pushOnce(options.optionalLibraries, dependencies[j]);
            }
          }
        }
      }
    }

    return options;
  };

  frontend.readSources = function(log, files) {
    var result = [];
    var error = false;

    for (var i = 0; i < files.length; i = i + 1 | 0) {
      var file = files[i];
      var path = file.toString();
      var contents = io.readFile(path);

      if (contents === null) {
        commandLineErrorUnreadableFile(log, file, path);
      } else {
        result.push(new Source(path, contents.value));
      }
    }

    return error ? null : result;
  };

  frontend.printWithColor = function(color, text) {
    terminal.setColor(color);
    process.stdout.write(text);
    terminal.setColor(terminal.Color.DEFAULT);
  };

  frontend.printError = function(text) {
    frontend.printWithColor(terminal.Color.RED, 'error: ');
    frontend.printWithColor(terminal.Color.BOLD, text + '\n');
  };

  frontend.printNote = function(text) {
    frontend.printWithColor(terminal.Color.GRAY, 'note: ');
    frontend.printWithColor(terminal.Color.BOLD, text + '\n');
  };

  frontend.printWarning = function(text) {
    frontend.printWithColor(terminal.Color.MAGENTA, 'warning: ');
    frontend.printWithColor(terminal.Color.BOLD, text + '\n');
  };

  frontend.printUsage = function(parser) {
    frontend.printWithColor(terminal.Color.GREEN, '\nusage: ');
    frontend.printWithColor(terminal.Color.BOLD, 'skewc [flags] [inputs]\n');
    process.stdout.write(parser.usageText(80 - frontend.terminalWidthPadding() | 0));
  };

  frontend.printLogWithColor = function(log, errorLimit) {
    var terminalWidth = process.stdout.columns - frontend.terminalWidthPadding() | 0;
    var errorCount = 0;

    for (var i = 0; i < log.diagnostics.length; i = i + 1 | 0) {
      var diagnostic = log.diagnostics[i];

      if (diagnostic.kind === DiagnosticKind.ERROR && errorLimit > 0 && errorCount === errorLimit) {
        break;
      }

      if (!diagnostic.range.isEmpty()) {
        frontend.printWithColor(terminal.Color.BOLD, diagnostic.range.locationString() + ': ');
      }

      switch (diagnostic.kind) {
      case 1:
        frontend.printWarning(diagnostic.text);
        break;

      case 0:
        frontend.printError(diagnostic.text);
        errorCount = errorCount + 1 | 0;
        break;
      }

      if (!diagnostic.range.isEmpty()) {
        var formatted = diagnostic.range.format(terminalWidth);
        process.stdout.write(formatted.line + '\n');
        frontend.printWithColor(terminal.Color.GREEN, formatted.range + '\n');
      }

      if (!diagnostic.noteRange.isEmpty()) {
        frontend.printWithColor(terminal.Color.BOLD, diagnostic.noteRange.locationString() + ': ');
        frontend.printNote(diagnostic.noteText);

        var formatted = diagnostic.noteRange.format(terminalWidth);
        process.stdout.write(formatted.line + '\n');
        frontend.printWithColor(terminal.Color.GREEN, formatted.range + '\n');
      }
    }

    var hasErrors = log.hasErrors();
    var hasWarnings = log.hasWarnings();
    var summary = '';

    if (hasWarnings) {
      summary += log.warningCount + ' warning' + prettyPrint.plural(log.warningCount);

      if (hasErrors) {
        summary += ' and ';
      }
    }

    if (hasErrors) {
      summary += log.errorCount + ' error' + prettyPrint.plural(log.errorCount);
    }

    if (hasWarnings || hasErrors) {
      process.stdout.write(summary + ' generated');
      frontend.printWithColor(terminal.Color.GRAY, errorCount < log.errorCount ? ' (only showing ' + errorLimit + ' error' + prettyPrint.plural(errorLimit) + ', use "--error-limit=0" to see all)\n' : '\n');
    }
  };

  frontend.terminalWidthPadding = function() {
    return in_OperatingSystem.current() === OperatingSystem.WINDOWS ? 1 : 0;
  };

  io.readFile = function(path) {
    try {
      var contents = require('fs').readFileSync(path, 'utf8');
      return new Box(in_string.replaceAll(contents, '\r\n', '\n'));
    } catch ($exception) {
      return null;
    }
  };

  io.writeFile = function(path, contents) {
    try {
      require('fs').writeFileSync(path, contents);
      return true;
    } catch ($exception) {
      return false;
    }
  };

  math.INFINITY = Infinity;
  unicode.STRING_ENCODING = 1;
  unicode.StringIterator.INSTANCE = new unicode.StringIterator();
  var operatorInfo = in_IntMap.literal([67, 68, 69, 70, 71, 72, 73, 74, 77, 78, 79, 80, 75, 76, 81, 82, 83, 84, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 111, 112, 106, 107, 108, 113, 114, 109, 115], [new OperatorInfo('!', 13, 0), new OperatorInfo('+', 13, 0), new OperatorInfo('-', 13, 0), new OperatorInfo('~', 13, 0), new OperatorInfo('++', 13, 0), new OperatorInfo('--', 13, 0), new OperatorInfo('++', 14, 0), new OperatorInfo('--', 14, 0), new OperatorInfo('*', 13, 0), new OperatorInfo('&', 13, 0), new OperatorInfo('*', 14, 0), new OperatorInfo('&', 14, 0), new OperatorInfo('new', 13, 0), new OperatorInfo('delete', 13, 0), new OperatorInfo('+', 11, 1), new OperatorInfo('&', 7, 1), new OperatorInfo('|', 5, 1), new OperatorInfo('^', 6, 1), new OperatorInfo('/', 12, 1), new OperatorInfo('==', 8, 1), new OperatorInfo('>', 9, 1), new OperatorInfo('>=', 9, 1), new OperatorInfo('in', 9, 1), new OperatorInfo('[]', 15, 1), new OperatorInfo('is', 9, 1), new OperatorInfo('<', 9, 1), new OperatorInfo('<=', 9, 1), new OperatorInfo('&&', 4, 1), new OperatorInfo('||', 3, 1), new OperatorInfo('*', 12, 1), new OperatorInfo('!=', 8, 1), new OperatorInfo('**', 13, 2), new OperatorInfo('%', 12, 1), new OperatorInfo('<<', 10, 1), new OperatorInfo('>>', 10, 1), new OperatorInfo('-', 11, 1), new OperatorInfo('=', 2, 2), new OperatorInfo('+=', 2, 2), new OperatorInfo('&=', 2, 2), new OperatorInfo('|=', 2, 2), new OperatorInfo('^=', 2, 2), new OperatorInfo('/=', 2, 2), new OperatorInfo('*=', 2, 2), new OperatorInfo('%=', 2, 2), new OperatorInfo('<<=', 2, 2), new OperatorInfo('>>=', 2, 2), new OperatorInfo('-=', 2, 2), new OperatorInfo('[]=', 2, 2)]);
  Compiler.cachedLibraries = [new CachedLibrary('defines.sk', '// The "--release" flag automatically overrides BUILD_RELEASE with true\n#define BUILD_DEBUG   !BUILD_RELEASE\n#define BUILD_RELEASE false\n\n// These will be overridden by the compiler with the current language target\n#define TARGET_CPP   false\n#define TARGET_JS    false\n#define TARGET_RUBY  false\n#define TARGET_NONE  !TARGET_CPP && !TARGET_JS && !TARGET_RUBY\n\n// The "--config" flag can be used to override these (example: "--config=node").\n// Using "--target=js" defaults to "--config=browser" and using "--target=cpp"\n// defaults to the config for the current operating system.\n#define CONFIG_IOS     false\n#define CONFIG_OSX     false\n#define CONFIG_LINUX   false\n#define CONFIG_ANDROID false\n#define CONFIG_WINDOWS false\n#define CONFIG_NODE    false\n#define CONFIG_BROWSER false\n#define CONFIG_UNKNOWN !CONFIG_IOS && !CONFIG_OSX && !CONFIG_LINUX && !CONFIG_ANDROID && !CONFIG_WINDOWS && !CONFIG_NODE && !CONFIG_BROWSER\n', 0), new CachedLibrary('primitives.sk', 'import class void {}\nalias dynamic = `dynamic`\n\n#if TARGET_JS\n\n  import class int { pure string toString() }\n  import class bool { pure string toString() }\n  import class float { pure string toString() }\n  import class double { pure string toString() }\n\n  import class string {\n    pure {\n      string slice(int start, int end)\n      List<string> split(string separator)\n      int indexOf(string value)\n      int lastIndexOf(string value)\n      string toLowerCase()\n      string toUpperCase()\n    }\n  }\n\n  in string {\n    inline pure {\n      int size() { return `this`.length }\n      int indexOfFrom(string value, int fromIndex) { return `this`.indexOf(value, fromIndex) }\n      int lastIndexOfFrom(string value, int fromIndex) { return `this`.lastIndexOf(value, fromIndex) }\n      string sliceCodeUnit(int index) { return `this`[index] }\n      string join(List<string> values) { return values."join"(this) }\n      @OperatorGet int codeUnitAt(int index) { return `this`.charCodeAt(index) }\n      static string fromCodeUnit(int value) { return `String`.fromCharCode(value) }\n    }\n  }\n\n  class StringBuilder {\n    private var _buffer = ""\n\n    pure inline {\n      void append(string text) { _buffer += text }\n      string toString() { return _buffer }\n    }\n  }\n\n#elif TARGET_CPP\n\n  import class int {}\n  import class bool {}\n  import class float {}\n  import class double {}\n\n  @NeedsInclude("<string>")\n  @EmitAs("std::string")\n  import class string {}\n\n  in int {\n    inline pure string toString() { return `std`::to_string(this) }\n  }\n\n  in bool {\n    inline pure string toString() { return this ? "true" : "false" }\n  }\n\n  in float {\n    inline pure string toString() { return double._format_(this) }\n  }\n\n  in double {\n    pure {\n      inline string toString() { return _format_(this) }\n\n      #if !CONFIG_WINDOWS\n\n        // Try shorter strings first. Good test cases: 0.1, 9.8, 0.00000000001, 1.1 - 1.0\n        @NeedsInclude("<cstdio>")\n        static string _format_(double value) {\n          string buffer\n          `buffer.resize(64)`\n          `std::snprintf(&buffer[0], buffer.size(), "%.15g", value)`\n          if (`std::stod(&buffer[0]) != value`) {\n            `std::snprintf(&buffer[0], buffer.size(), "%.16g", value)`\n            if (`std::stod(&buffer[0]) != value`) {\n              `std::snprintf(&buffer[0], buffer.size(), "%.17g", value)`\n            }\n          }\n          return `buffer.c_str()`\n        }\n\n      #else\n\n        // MSVC won\'t allow std::sprintf() even though it\'s in the C++11 standard\n        @NeedsInclude("<stdio.h>")\n        static string _format_(double value) {\n          string buffer\n          `buffer.resize(64)`\n          `sprintf_s(&buffer[0], buffer.size(), "%.15g", value)`\n          if (`std::stod(&buffer[0]) != value`) {\n            `sprintf_s(&buffer[0], buffer.size(), "%.16g", value)`\n            if (`std::stod(&buffer[0]) != value`) {\n              `sprintf_s(&buffer[0], buffer.size(), "%.17g", value)`\n            }\n          }\n          return `buffer.c_str()`\n        }\n\n      #endif\n    }\n  }\n\n  in string {\n    pure {\n      inline {\n        int size() { return (int)`this`.size() }\n        string slice(int start, int end) { return `this`.substr(start, end - start) }\n        string sliceCodeUnit(int index) { return fromCodeUnit(codeUnitAt(index)) }\n        int indexOf(string value) { return (int)`this`.find(value) }\n        int indexOfFrom(string value, int fromIndex) { return (int)`this`.find(value, fromIndex) }\n        int lastIndexOf(string value) { return (int)`this`.rfind(value) }\n        int lastIndexOfFrom(string value, int fromIndex) { return (int)`this`.rfind(value, fromIndex) }\n        @OperatorGet int codeUnitAt(int index) { return `this`[index] & 0xFF } // Must not return negative values\n        static string fromCodeUnit(int value) { return ``string``(1, value) }\n      }\n\n      @NeedsInclude("<algorithm>")\n      @NeedsInclude("<ctype.h>") {\n        string toLowerCase() {\n          var clone = this\n          `std::transform(clone.begin(), clone.end(), clone.begin(), ::tolower)`\n          return clone\n        }\n\n        string toUpperCase() {\n          var clone = this\n          `std::transform(clone.begin(), clone.end(), clone.begin(), ::toupper)`\n          return clone\n        }\n      }\n\n      string join(List<string> values) {\n        var result = ""\n        for (var i = 0; i < values.size(); i++) {\n          if (i > 0) result += this\n          result += values[i]\n        }\n        return result\n      }\n\n      List<string> split(string separator) {\n        List<string> values = []\n        var start = 0\n        while (true) {\n          var end = indexOfFrom(separator, start)\n          if (end == -1) break\n          values.push(slice(start, end))\n          start = end + separator.size()\n        }\n        values.push(slice(start, size()))\n        return values\n      }\n    }\n  }\n\n  class StringBuilder {\n    private var _buffer = ""\n\n    pure inline {\n      void append(string text) { _buffer += text }\n      string toString() { return _buffer }\n    }\n  }\n\n#elif TARGET_RUBY\n\n  import class int { @EmitAs("to_s") pure string toString() }\n  import class bool { @EmitAs("to_s") pure string toString() }\n  import class float { @EmitAs("to_s") pure string toString() }\n  import class double { @EmitAs("to_s") pure string toString() }\n\n  import class string {\n    pure {\n      int size()\n      List<string> split(string separator)\n      @EmitAs("upcase") string toLowerCase()\n      @EmitAs("downcase") string toUpperCase()\n    }\n  }\n\n  in string {\n    pure inline {\n      string join(List<string> values) { return values."join"(this) }\n      string slice(int start, int end) { return `this`.slice(start, end - start) }\n      string sliceCodeUnit(int index) { return `this`[index] }\n      @OperatorGet int codeUnitAt(int index) { return sliceCodeUnit(index)."ord" }\n      static string fromCodeUnit(int value) { return value."chr"("UTF-8") }\n\n      int indexOf(string value) {\n        var i = `this`.index(value)\n        return i != null ? i : -1\n      }\n\n      int indexOfFrom(string value, int fromIndex) {\n        var i = `this`.index(value, fromIndex)\n        return i != null ? i : -1\n      }\n\n      int lastIndexOf(string value) {\n        var i = `this`.rindex(value)\n        return i != null ? i : -1\n      }\n\n      int lastIndexOfFrom(string value, int fromIndex) {\n        var i = `this`.rindex(value, fromIndex)\n        return i != null ? i : -1\n      }\n    }\n  }\n\n  import class StringBuilder {}\n\n  in StringBuilder {\n    pure inline {\n      new() { return `""` }\n      void append(string text) { `this` << text }\n      string toString() { return this."dup" }\n    }\n  }\n\n#else\n\n  import class int { pure string toString() }\n  import class bool { pure string toString() }\n  import class float { pure string toString() }\n  import class double { pure string toString() }\n\n  import class string {\n    pure {\n      int size()\n      List<string> split(string separator)\n      string slice(int start, int end)\n      string sliceCodeUnit(int index)\n      int indexOf(string value)\n      int indexOfFrom(string value, int fromIndex)\n      int lastIndexOf(string value)\n      int lastIndexOfFrom(string value, int fromIndex)\n      string toLowerCase()\n      string toUpperCase()\n      string join(List<string> values)\n      @OperatorGet int codeUnitAt(int index)\n      static string fromCodeUnit(int value)\n    }\n  }\n\n  import class StringBuilder {\n    pure {\n      new()\n      void append(string text)\n      string toString()\n    }\n  }\n\n#endif\n\nin string {\n  pure {\n    @OperatorIn\n    inline bool contains(string value) {\n      return indexOf(value) != -1\n    }\n\n    inline string toString() {\n      return this\n    }\n\n    bool startsWith(string prefix) {\n      return size() >= prefix.size() && slice(0, prefix.size()) == prefix\n    }\n\n    bool endsWith(string suffix) {\n      return size() >= suffix.size() && slice(size() - suffix.size(), size()) == suffix\n    }\n\n    string repeat(int count) {\n      var result = ""\n      for (var i = 0; i < count; i++) result += this\n      return result\n    }\n\n    string replaceAll(string before, string after) {\n      var result = ""\n      var start = 0\n      while (true) {\n        var end = indexOfFrom(before, start)\n        if (end == -1) break\n        result += slice(start, end) + after\n        start = end + before.size()\n      }\n      return result + slice(start, size())\n    }\n  }\n}\n\n// Boxes are useful for representing nullable primitive types\nclass Box<T> {\n  T value\n}\n', 0), new CachedLibrary('math.sk', '#if TARGET_JS\n\n  namespace math {\n    inline pure {\n      double abs(double x) { return `Math`.abs(x) }\n      double sin(double x) { return `Math`.sin(x) }\n      double cos(double x) { return `Math`.cos(x) }\n      double tan(double x) { return `Math`.tan(x) }\n      double asin(double x) { return `Math`.asin(x) }\n      double acos(double x) { return `Math`.acos(x) }\n      double atan(double x) { return `Math`.atan(x) }\n      double atan2(double y, double x) { return `Math`.atan2(y, x) }\n      double sqrt(double x) { return `Math`.sqrt(x) }\n      double exp(double x) { return `Math`.exp(x) }\n      double log(double x) { return `Math`.log(x) }\n      double pow(double x, double y) { return `Math`.pow(x, y) }\n      double floor(double x) { return `Math`.floor(x) }\n      double round(double x) { return `Math`.round(x) }\n      double ceil(double x) { return `Math`.ceil(x) }\n      double min(double x, double y) { return `Math`.min(x, y) }\n      double max(double x, double y) { return `Math`.max(x, y) }\n      bool isNaN(double x) { return `isNaN`(x) }\n      bool isFinite(double x) { return `isFinite`(x) }\n    }\n\n    inline double random() { return `Math`.random() }\n  }\n\n#elif TARGET_CPP\n\n  namespace math {\n    inline pure @NeedsInclude("<cmath>") {\n      double abs(double x) { return `std`::abs(x) }\n      double sin(double x) { return `std`::sin(x) }\n      double cos(double x) { return `std`::cos(x) }\n      double tan(double x) { return `std`::tan(x) }\n      double asin(double x) { return `std`::asin(x) }\n      double acos(double x) { return `std`::acos(x) }\n      double atan(double x) { return `std`::atan(x) }\n      double atan2(double y, double x) { return `std`::atan2(y, x) }\n      double sqrt(double x) { return `std`::sqrt(x) }\n      double exp(double x) { return `std`::exp(x) }\n      double log(double x) { return `std`::log(x) }\n      double pow(double x, double y) { return `std`::pow(x, y) }\n      double floor(double x) { return `std`::floor(x) }\n      double round(double x) { return `std`::round(x) }\n      double ceil(double x) { return `std`::ceil(x) }\n      double min(double x, double y) { return `std`::fmin(x, y) }\n      double max(double x, double y) { return `std`::fmax(x, y) }\n      bool isNaN(double x) { return `std`::isnan(x) }\n      bool isFinite(double x) { return `std`::isfinite(x) }\n    }\n\n    @NeedsInclude("<random>") {\n      `std::uniform_real_distribution<double>` _distribution_\n      `(std::mt19937 *)` _generator_ = null\n\n      double random() {\n        if (_generator_ == null) {\n          _generator_ = new `std`::mt19937(`std`::random_device()())\n        }\n        return _distribution_(*_generator_)\n      }\n    }\n  }\n\n#elif TARGET_RUBY\n\n  namespace math {\n    inline pure {\n      double abs(double x) { return x."abs" }\n      double sin(double x) { return `Math`.sin(x) }\n      double cos(double x) { return `Math`.cos(x) }\n      double tan(double x) { return `Math`.tan(x) }\n      double asin(double x) { return `Math`.asin(x) }\n      double acos(double x) { return `Math`.acos(x) }\n      double atan(double x) { return `Math`.atan(x) }\n      double atan2(double y, double x) { return `Math`.atan2(y, x) }\n      double sqrt(double x) { return `Math`.sqrt(x) }\n      double exp(double x) { return `Math`.exp(x) }\n      double log(double x) { return `Math`.log(x) }\n      double pow(double x, double y) { return ``x` ** `y`` }\n      double floor(double x) { return x."floor" }\n      double round(double x) { return x."round" }\n      double ceil(double x) { return x."ceil" }\n      double min(double x, double y) { return x < y ? x : y }\n      double max(double x, double y) { return x > y ? x : y }\n      bool isNaN(double x) { return x."nan?" }\n      bool isFinite(double x) { return x."finite?" }\n      double random() { return `Random`.rand }\n    }\n  }\n\n#else\n\n  import namespace math {\n    pure {\n      double abs(double x)\n      double sin(double x)\n      double cos(double x)\n      double tan(double x)\n      double asin(double x)\n      double acos(double x)\n      double atan(double x)\n      double atan2(double y, double x)\n      double sqrt(double x)\n      double exp(double x)\n      double log(double x)\n      double pow(double x, double y)\n      double floor(double x)\n      double round(double x)\n      double ceil(double x)\n      double min(double x, double y)\n      double max(double x, double y)\n      double random()\n      bool isNaN(double x)\n      bool isFinite(double x)\n    }\n  }\n\n#endif\n\nin math {\n  double clamp(double x, double a, double b) { return max(a, min(x, b)) }\n  int iclamp(int x, int a, int b) { return imax(a, imin(x, b)) }\n  int imax(int a, int b) { return a > b ? a : b }\n  int imin(int a, int b) { return a < b ? a : b }\n\n  const {\n    var SQRT2 = 1.414213562373095\n    var PI = 3.141592653589793\n    var TWOPI = 2 * PI\n    var E = 2.718281828459045\n    var INFINITY = 1 / 0.0\n    var NAN = 0 / 0.0\n  }\n}\n', 0), new CachedLibrary('list.sk', '#if TARGET_RUBY\nexport interface Comparison<T> {\n  virtual int compare(T left, T right)\n}\n#else\ninterface Comparison<T> {\n  virtual int compare(T left, T right)\n}\n#endif\n\n#if TARGET_JS\n\n  void bindCompare<T>(Comparison<T> comparison) {\n    return comparison.compare."bind"(comparison)\n  }\n\n  import class List<T> {\n    pure {\n      new()\n      void push(T value)\n      void unshift(T value)\n      List<T> slice(int start, int end)\n      int indexOf(T value)\n      int lastIndexOf(T value)\n      T shift()\n      T pop()\n      void reverse()\n    }\n  }\n\n  in List {\n    pure {\n      inline {\n        int size() { return `this`.length }\n        List<T> clone() { return `this`.slice() }\n        T removeAt(int index) { return `this`.splice(index, 1)[0] }\n        void removeRange(int start, int end) { `this`.splice(start, end - start) }\n        void insert(int index, T value) { `this`.splice(index, 0, value) }\n        @OperatorGet T get(int index) { return `this`[index] }\n        @OperatorSet void set(int index, T value) { `this`[index] = value }\n        @OperatorIn bool contains(T value) { return indexOf(value) != -1 }\n      }\n\n      T last() { return this[size() - 1] }\n      void clear() { `this`.length = 0 }\n      void swap(int a, int b) {\n        var temp = this[a]\n        this[a] = this[b]\n        this[b] = temp\n      }\n    }\n\n    inline void sort(Comparison<T> comparison) { `this`.sort(bindCompare<T>(comparison)) }\n  }\n\n#elif TARGET_CPP\n\n  bool bindCompare<T>(Comparison<T> comparison, T left, T right) {\n    return comparison.compare(left, right) < 0\n  }\n\n  @NeedsInclude("<vector>")\n  class List<T> {\n    pure {\n      new() {}\n\n      int size() {\n        return (int)_data.size()\n      }\n\n      void push(T value) {\n        _data.push_back(value)\n      }\n\n      void unshift(T value) {\n        insert(0, value)\n      }\n\n      List<T> slice(int start, int end) {\n        assert start >= 0 && start <= end && end <= size()\n        List<T> slice = []\n        slice._data.insert(slice._data.begin(), _data.begin() + start, _data.begin() + end)\n        return slice\n      }\n\n      T shift() {\n        T value = this[0]\n        removeAt(0)\n        return value\n      }\n\n      T pop() {\n        T value = this[size() - 1]\n        _data.pop_back()\n        return value\n      }\n\n      T last() {\n        assert size() > 0\n        return _data.back()\n      }\n\n      List<T> clone() {\n        List<T> clone = []\n        clone._data = _data\n        return clone\n      }\n\n      T removeAt(int index) {\n        T value = this[index]\n        _data.erase(_data.begin() + index)\n        return value\n      }\n\n      void removeRange(int start, int end) {\n        assert 0 <= start && start <= end && end <= size()\n        _data.erase(_data.begin() + start, _data.begin() + end)\n      }\n\n      void insert(int index, T value) {\n        assert index >= 0 && index <= size()\n        _data.insert(_data.begin() + index, value)\n      }\n\n      @OperatorGet\n      T get(int index) {\n        assert index >= 0 && index < size()\n        return _data[index]\n      }\n\n      @OperatorSet\n      void set(int index, T value) {\n        assert index >= 0 && index < size()\n        _data[index] = value\n      }\n\n      @OperatorIn\n      bool contains(T value) {\n        return indexOf(value) != -1\n      }\n\n      void clear() {\n        _data.clear()\n      }\n\n      @NeedsInclude("<algorithm>") {\n        int indexOf(T value) {\n          int index = (int)(`std`::find(_data.begin(), _data.end(), value) - _data.begin())\n          return index == size() ? -1 : index\n        }\n\n        int lastIndexOf(T value) {\n          int index = (int)(`std`::find(_data.rbegin(), _data.rend(), value) - _data.rbegin())\n          return size() - index - 1\n        }\n\n        void swap(int a, int b) {\n          assert a >= 0 && a < size()\n          assert b >= 0 && b < size()\n          `std`::swap(_data[a], _data[b])\n        }\n\n        void reverse() {\n          `std`::reverse(_data.begin(), _data.end())\n        }\n      }\n\n      // Normally this would be in a constructor but clang has a bug that\n      // sometimes emits incorrect code for a constructor taking an empty\n      // initializer list. See http://llvm.org/bugs/show_bug.cgi?id=22256\n      // for details.\n      @NeedsInclude("<initializer_list>")\n      private List<T> literal(`std::initializer_list<T>` list) {\n        _data.insert(_data.end(), list.begin(), list.end())\n        return this\n      }\n    }\n\n    @NeedsInclude("<functional>")\n    @NeedsInclude("<algorithm>")\n    inline void sort(Comparison<T> comparison) {\n      `std`::sort(_data.begin(), _data.end(), `std`::bind(`&`bindCompare`<T>`, comparison, `std`::placeholders::_1, `std`::placeholders::_2))\n    }\n\n    private `std::vector<T>` _data\n  }\n\n#elif TARGET_RUBY\n\n  import class List<T> {\n    pure {\n      new()\n      int size()\n      void push(T value)\n      void unshift(T value)\n      T shift()\n      T pop()\n      T last()\n      @EmitAs("reverse!") void reverse()\n      List<T> clone()\n      @EmitAs("delete_at") T removeAt(int index)\n      void insert(int index, T value)\n      @EmitAs("include?") @OperatorIn bool contains(T value)\n      void clear()\n    }\n  }\n\n  in List {\n    pure {\n      inline @OperatorGet T get(int index) { return `this`[index] }\n      inline @OperatorSet void set(int index, T value) { `this`[index] = value }\n\n      int indexOf(T value) {\n        var i = `this`.index(value)\n        return i != null ? i : -1\n      }\n\n      int lastIndexOf(T value) {\n        var i = `this`.rindex(value)\n        return i != null ? i : -1\n      }\n\n      List<T> slice(int start, int end) {\n        return `this`.slice(start, end - start)\n      }\n\n      void removeRange(int start, int end) {\n        this."slice!"(start, end - start)\n      }\n\n      void swap(int a, int b) {\n        assert a >= 0 && a < size()\n        assert b >= 0 && b < size()\n        var temp = this[a]\n        this[a] = this[b]\n        this[b] = temp\n      }\n    }\n\n    inline void sort(Comparison<T> comparison) {\n      `sort_helper`(this, comparison)\n    }\n  }\n\n#else\n\n  import class List<T> {\n    pure {\n      new()\n      int size()\n      void push(T value)\n      void unshift(T value)\n      List<T> slice(int start, int end)\n      int indexOf(T value)\n      int lastIndexOf(T value)\n      T shift()\n      T pop()\n      T last()\n      void reverse()\n      List<T> clone()\n      T removeAt(int index)\n      void removeRange(int start, int end)\n      void insert(int index, T value)\n      @OperatorGet T get(int index)\n      @OperatorSet void set(int index, T value)\n      @OperatorIn bool contains(T value)\n      void clear()\n      void swap(int a, int b)\n    }\n    void sort(Comparison<T> comparison)\n  }\n\n#endif\n\nin List {\n  bool pushOnce(T value) {\n    if (!(value in this)) {\n      push(value)\n      return true\n    }\n    return false\n  }\n\n  bool removeOnce(T value) {\n    var index = indexOf(value)\n    if (index != -1) {\n      removeAt(index)\n      return true\n    }\n    return false\n  }\n}\n', 0), new CachedLibrary('stringmap.sk', '#if TARGET_JS\n\n  import class StringMap<T> {}\n\n  in StringMap {\n    pure inline {\n      new() { return `Object`.create(null) }\n      @OperatorGet T get(string key) { return `this`[key] }\n      @OperatorSet void set(string key, T value) { `this`[key] = value }\n      @OperatorIn bool containsKey(string key) { return key in `this` }\n      void remove(string key) { delete `this`[key] }\n      List<string> keys() { return `Object`.keys(this) }\n\n      T getOrDefault(string key, T defaultValue) {\n        return key in this ? this[key] : defaultValue\n      }\n\n      List<T> values() {\n        List<T> values = []\n        for (string key in `this`) values.push(this[key])\n        return values\n      }\n\n      StringMap<T> clone() {\n        var clone = StringMap<T>()\n        for (string key in `this`) clone[key] = this[key]\n        return clone\n      }\n    }\n  }\n\n#elif TARGET_CPP\n\n  @NeedsInclude("<unordered_map>")\n  class StringMap<T> {\n    pure {\n      new() {}\n      @OperatorGet T get(string key) { return _table[key] }\n      T getOrDefault(string key, T defaultValue) {\n        `auto` it = _table.find(key)\n        return it != _table.end() ? it->second : defaultValue\n      }\n      @OperatorSet void set(string key, T value) { _table[key] = value }\n      @OperatorIn bool containsKey(string key) { return _table.count(key) > 0 }\n      void remove(string key) { _table.erase(key) }\n      List<string> keys() {\n        List<string> keys = []\n        for (`(auto &)` it in _table) keys.push(it.first)\n        return keys\n      }\n      List<T> values() {\n        List<T> values = []\n        for (`(auto &)` it in _table) values.push(it.second)\n        return values\n      }\n      StringMap<T> clone() {\n        var clone = StringMap<T>()\n        clone._table = _table\n        return clone\n      }\n    }\n\n    private `std::unordered_map<`string`, T>` _table\n  }\n\n#elif TARGET_RUBY\n\n  import class StringMap<T> {\n    pure {\n      @EmitAs("key?") @OperatorIn bool containsKey(string key)\n      @EmitAs("delete") bool remove(string key)\n      List<string> keys()\n      List<T> values()\n      StringMap<T> clone()\n    }\n  }\n\n  in StringMap {\n    pure inline {\n      new() { return `{}` }\n      @OperatorGet T get(string key) { return `this`.fetch(key) }\n      @OperatorSet void set(string key, T value) { `this`[key] = value }\n      T getOrDefault(string key, T defaultValue) { return `this`.fetch(key, defaultValue) }\n    }\n  }\n\n#else\n\n  import class StringMap<T> {\n    pure {\n      new()\n      @OperatorGet T get(string key)\n      T getOrDefault(string key, T defaultValue)\n      @OperatorSet void set(string key, T value)\n      @OperatorIn bool containsKey(string key)\n      void remove(string key)\n      List<string> keys()\n      List<T> values()\n      StringMap<T> clone()\n    }\n  }\n\n#endif\n\n// This is used by the compiler to implement map literals:\n//\n//   { "a": false, "b": true } => StringMap.literal<bool>(["a", "b"], [false, true])\n//\nin StringMap {\n  private static pure StringMap<X> literal<X>(List<string> keys, List<X> values) {\n    var map = StringMap<X>()\n    assert keys.size() == values.size()\n    for (var i = 0; i < keys.size(); i++) {\n      map[keys[i]] = values[i]\n    }\n    return map\n  }\n}\n', 0), new CachedLibrary('intmap.sk', '#if TARGET_JS\n\n  import class IntMap<T> {}\n\n  in IntMap {\n    pure inline {\n      new() { return `Object`.create(null) }\n      @OperatorGet T get(int key) { return `this`[key] }\n      @OperatorSet void set(int key, T value) { `this`[key] = value }\n      @OperatorIn bool containsKey(int key) { return key in `this` }\n      void remove(int key) { delete `this`[key] }\n\n      T getOrDefault(int key, T defaultValue) {\n        return key in this ? this[key] : defaultValue\n      }\n\n      List<int> keys() {\n        List<int> keys = []\n        for (double key in `this`) keys.push((int)key)\n        return keys\n      }\n\n      List<T> values() {\n        List<T> values = []\n        for (int key in `this`) values.push(this[key])\n        return values\n      }\n\n      IntMap<T> clone() {\n        var clone = IntMap<T>()\n        for (int key in `this`) clone[key] = this[key]\n        return clone\n      }\n    }\n  }\n\n#elif TARGET_CPP\n\n  @NeedsInclude("<unordered_map>")\n  class IntMap<T> {\n    pure {\n      new() {}\n      @OperatorGet T get(int key) { return _table[key] }\n      T getOrDefault(int key, T defaultValue) {\n        `auto` it = _table.find(key)\n        return it != _table.end() ? it->second : defaultValue\n      }\n      @OperatorSet void set(int key, T value) { _table[key] = value }\n      @OperatorIn bool containsKey(int key) { return _table.count(key) > 0 }\n      void remove(int key) { _table.erase(key) }\n      List<int> keys() {\n        List<int> keys = []\n        for (`(auto &)` it in _table) keys.push(it.first)\n        return keys\n      }\n      List<T> values() {\n        List<T> values = []\n        for (`(auto &)` it in _table) values.push(it.second)\n        return values\n      }\n      IntMap<T> clone() {\n        var clone = IntMap<T>()\n        clone._table = _table\n        return clone\n      }\n    }\n\n    private `std::unordered_map<`int`, T>` _table\n  }\n\n#elif TARGET_RUBY\n\n  import class IntMap<T> {\n    pure {\n      @EmitAs("key?") @OperatorIn bool containsKey(int key)\n      @EmitAs("delete") bool remove(int key)\n      List<int> keys()\n      List<T> values()\n      IntMap<T> clone()\n    }\n  }\n\n  in IntMap {\n    pure inline {\n      new() { return `{}` }\n      @OperatorGet T get(int key) { return `this`.fetch(key) }\n      @OperatorSet void set(int key, T value) { `this`[key] = value }\n      T getOrDefault(int key, T defaultValue) { return `this`.fetch(key, defaultValue) }\n    }\n  }\n\n#else\n\n  import class IntMap<T> {\n    pure {\n      new()\n      @OperatorGet T get(int key)\n      T getOrDefault(int key, T defaultValue)\n      @OperatorSet void set(int key, T value)\n      @OperatorIn bool containsKey(int key)\n      void remove(int key)\n      List<int> keys()\n      List<T> values()\n      IntMap<T> clone()\n    }\n  }\n\n#endif\n\n// This is used by the compiler to implement map literals:\n//\n//   { 1: false, 2: true } => IntMap.literal<bool>([1, 2], [false, true])\n//\nin IntMap {\n  private static pure IntMap<X> literal<X>(List<int> keys, List<X> values) {\n    var map = IntMap<X>()\n    assert keys.size() == values.size()\n    for (var i = 0; i < keys.size(); i++) {\n      map[keys[i]] = values[i]\n    }\n    return map\n  }\n}\n', 0), new CachedLibrary('os.sk', 'enum OperatingSystem {\n  ANDROID\n  IOS\n  LINUX\n  OSX\n  UNKNOWN\n  WINDOWS\n}\n\nin OperatingSystem {\n  static pure OperatingSystem current() {\n    #if CONFIG_ANDROID\n\n      return .ANDROID\n\n    #elif CONFIG_IOS\n\n      return .IOS\n\n    #elif CONFIG_LINUX\n\n      return .LINUX\n\n    #elif CONFIG_OSX\n\n      return .OSX\n\n    #elif CONFIG_WINDOWS\n\n      return .WINDOWS\n\n    #elif CONFIG_NODE\n\n      string platform = `process.platform`\n      return\n        // Presumably this also means iOS but there\'s no way to check\n        platform == "darwin" ? .OSX :\n\n        // Official documentation says this will never contain "win64"\n        platform == "win32" ? .WINDOWS :\n\n        // Presumably this also means Android but there\'s no way to check\n        platform == "linux" ? .LINUX :\n\n        // This may also be "freebsd" or "sunos"\n        .UNKNOWN\n\n    #elif CONFIG_BROWSER\n\n      string platform = `navigator.platform`\n      string userAgent = `navigator.userAgent`\n      return\n        // OS X encodes the architecture into the platform\n        platform == "MacIntel" || platform == "MacPPC" ? .OSX :\n\n        // MSDN sources say Win64 is used, unlike node\n        platform == "Win32" || platform == "Win64" ? .WINDOWS :\n\n        // Assume the user is using Mobile Safari or Chrome and not some random\n        // browser with a strange platform (Opera apparently messes with this)\n        platform == "iPhone" || platform == "iPad" ? .IOS :\n\n        // Apparently most Android devices have a platform of "Linux" instead\n        // of "Android", so check the user agent instead. Also make sure to test\n        // for Android before Linux for this reason.\n        "Android" in userAgent ? .ANDROID :\n        "Linux" in platform ? .LINUX :\n\n        // The platform string has no specification and can be literally anything.\n        // Other examples: "BlackBerry", "Nintendo 3DS", "PlayStation 4", etc.\n        .UNKNOWN\n\n    #else\n\n      return .UNKNOWN\n\n    #endif\n  }\n}\n', 1), new CachedLibrary('terminal.sk', 'namespace terminal {\n  enum Color {\n    DEFAULT = 0\n    BOLD = 1\n    GRAY = 90\n    RED = 91\n    GREEN = 92\n    YELLOW = 93\n    BLUE = 94\n    MAGENTA = 95\n    CYAN = 96\n  }\n\n  #if TARGET_JS && CONFIG_BROWSER\n\n    inline {\n      int width() { return 0 }\n      int height() { return 0 }\n      void setColor(Color color) {}\n      void flush() {}\n\n      void print(string text) {\n        `console`.log(text)\n      }\n\n      // Browser logs are so varied that buffering standard output doesn\'t make much sense\n      void write(string text) {\n        `console`.log(text)\n      }\n    }\n\n  #elif TARGET_JS && CONFIG_NODE\n\n    void setColor(Color color) {\n      if (`process`.stdout.isTTY) {\n        write("\\x1B[0;" + (int)color + "m")\n      }\n    }\n\n    inline {\n      int width() {\n        return `process`.stdout.columns\n      }\n\n      int height() {\n        return `process`.stdout.rows\n      }\n\n      void flush() {\n      }\n\n      void print(string text) {\n        write(text + "\\n")\n      }\n\n      void write(string text) {\n        `process`.stdout.write(text)\n      }\n    }\n\n  #elif TARGET_CPP && CONFIG_WINDOWS\n\n    `HANDLE` _handle = `INVALID_HANDLE_VALUE`\n    `CONSOLE_SCREEN_BUFFER_INFO` _info\n\n    @NeedsInclude("<windows.h>")\n    void _setup() {\n      if (_handle == `INVALID_HANDLE_VALUE`) {\n        _handle = `GetStdHandle(STD_OUTPUT_HANDLE)`\n        `GetConsoleScreenBufferInfo`(_handle, &_info)\n      }\n    }\n\n    int width() {\n      _setup()\n      return _info.dwSize.X\n    }\n\n    int height() {\n      _setup()\n      return _info.dwSize.Y\n    }\n\n    void setColor(Color color) {\n      _setup()\n      int value = _info.wAttributes\n      switch (color) {\n        case .BOLD { value |= `FOREGROUND_INTENSITY` }\n        case .GRAY { value = `FOREGROUND_RED | FOREGROUND_GREEN | FOREGROUND_BLUE` }\n        case .RED { value = `FOREGROUND_RED | FOREGROUND_INTENSITY` }\n        case .GREEN { value = `FOREGROUND_GREEN | FOREGROUND_INTENSITY` }\n        case .YELLOW { value = `FOREGROUND_BLUE | FOREGROUND_INTENSITY` }\n        case .BLUE { value = `FOREGROUND_RED | FOREGROUND_GREEN | FOREGROUND_INTENSITY` }\n        case .MAGENTA { value = `FOREGROUND_RED | FOREGROUND_BLUE | FOREGROUND_INTENSITY` }\n        case .CYAN { value = `FOREGROUND_GREEN | FOREGROUND_BLUE | FOREGROUND_INTENSITY` }\n      }\n      `SetConsoleTextAttribute`(_handle, value)\n    }\n\n    void flush() {\n    }\n\n    inline void print(string text) {\n      write(text + "\\n")\n    }\n\n    void write(string text) {\n      _setup()\n\n      // Use WriteConsoleA() instead of std::cout for a huge performance boost\n      `WriteConsoleA`(_handle, `text`.c_str(), `text`.size(), null, null)\n    }\n\n  #elif TARGET_CPP && (CONFIG_OSX || CONFIG_LINUX)\n\n    int _width\n    int _height\n    bool _isTTY\n    bool _isSetup\n\n    @NeedsInclude("<sys/ioctl.h>")\n    @NeedsInclude("<unistd.h>")\n    void _setup() {\n      if (!_isSetup) {\n        `winsize` size\n        if (!`ioctl`(2, `TIOCGWINSZ`, &size)) {\n          _width = size.ws_col\n          _height = size.ws_row\n        }\n        _isTTY = `isatty(STDOUT_FILENO)`\n        _isSetup = true\n      }\n    }\n\n    int width() {\n      _setup()\n      return _width\n    }\n\n    int height() {\n      _setup()\n      return _height\n    }\n\n    void setColor(Color color) {\n      _setup()\n      if (_isTTY) {\n        write("\\x1B[0;" + (int)color + "m")\n      }\n    }\n\n    @NeedsInclude("<iostream>")\n    inline {\n      void flush() {\n        `std`::cout.flush()\n      }\n\n      void print(string text) {\n        `std`::cout << text << `std`::endl\n      }\n\n      void write(string text) {\n        `std`::cout << text\n      }\n    }\n\n  #elif TARGET_RUBY\n\n    void setColor(Color color) {\n      if (`STDOUT`.isatty) {\n        write("\\x1B[0;" + (int)color + "m")\n      }\n    }\n\n    inline {\n      int width() {\n        `require`("io/console")\n        return `STDIN`.winsize[1]\n      }\n\n      int height() {\n        `require`("io/console")\n        return `STDIN`.winsize[0]\n      }\n\n      void flush() {\n      }\n\n      void print(string text) {\n        `puts`(text)\n      }\n\n      void write(string text) {\n        `print`(text)\n      }\n    }\n\n  #else\n\n    int width() { return 0 }\n    int height() { return 0 }\n    void setColor(Color color) {}\n    void flush() {}\n    void print(string text) {}\n    void write(string text) {}\n\n  #endif\n}\n', 2), new CachedLibrary('timestamp.sk', 'namespace timestamp {\n  #if TARGET_JS && CONFIG_BROWSER\n\n    // Use "self" instead of "window" since "self" works in web workers\n    double now() {\n      if (`self.performance && performance.now`) {\n        return `performance.now()`\n      }\n      return `Date.now()`\n    }\n\n  #elif TARGET_JS && CONFIG_NODE\n\n    inline double now() {\n      return `Date`.now()\n    }\n\n  #elif TARGET_CPP && CONFIG_WINDOWS\n\n    `LARGE_INTEGER` _frequency\n\n    @NeedsInclude("<windows.h>")\n    double now() {\n      `LARGE_INTEGER` counter\n      if (!_frequency.QuadPart) {\n        `QueryPerformanceFrequency`(&_frequency)\n      }\n      `QueryPerformanceCounter`(&counter)\n      return counter.QuadPart * 1000.0 / _frequency.QuadPart\n    }\n\n  #elif TARGET_CPP && (CONFIG_OSX || CONFIG_LINUX)\n\n    @NeedsInclude("<sys/time.h>")\n    double now() {\n      `timeval` data\n      `gettimeofday`(&data, null)\n      return data.tv_sec * 1000.0 + data.tv_usec / 1000.0\n    }\n\n  #elif TARGET_RUBY\n\n    inline double now() {\n      return new `Time`().to_f * 1000\n    }\n\n  #else\n\n    import double now()\n\n  #endif\n}\n', 3), new CachedLibrary('unicode.sk', 'namespace unicode {\n  enum Encoding {\n    UTF8\n    UTF16\n    UTF32\n  }\n\n  const Encoding STRING_ENCODING =\n    TARGET_CPP ? .UTF8 :\n    TARGET_JS ? .UTF16 :\n    .UTF32\n\n  class StringIterator {\n    static final var INSTANCE = StringIterator()\n\n    var value = ""\n    var index = 0\n    var stop = 0\n\n    StringIterator reset(string text, int start) {\n      value = text\n      index = start\n      stop = text.size()\n      return this\n    }\n\n    int countCodePointsUntil(int stop) {\n      var count = 0\n      while (index < stop && nextCodePoint() >= 0) {\n        count++\n      }\n      return count\n    }\n\n    int nextCodePoint() {\n      if (STRING_ENCODING == .UTF8) {\n        if (index >= stop) return -1\n        var a = value.codeUnitAt(index)\n        index++\n        if (a < 0xC0) return a\n        if (index >= stop) return -1\n        var b = value.codeUnitAt(index)\n        index++\n        if (a < 0xE0) return ((a & 0x1F) << 6) | (b & 0x3F)\n        if (index >= stop) return -1\n        var c = value.codeUnitAt(index)\n        index++\n        if (a < 0xF0) return ((a & 0x0F) << 12) | ((b & 0x3F) << 6) | (c & 0x3F)\n        if (index >= stop) return -1\n        var d = value.codeUnitAt(index)\n        index++\n        return ((a & 0x07) << 18) | ((b & 0x3F) << 12) | ((c & 0x3F) << 6) | (d & 0x3F)\n      }\n\n      else if (STRING_ENCODING == .UTF16) {\n        if (index >= stop) return -1\n        var a = value.codeUnitAt(index)\n        index++\n        if (a < 0xD800) return a\n        if (index >= stop) return -1\n        var b = value.codeUnitAt(index)\n        index++\n        return (a << 10) + b + (0x10000 - (0xD800 << 10) - 0xDC00)\n      }\n\n      else {\n        if (index >= stop) return -1\n        var c = value.codeUnitAt(index)\n        index++\n        return c\n      }\n    }\n  }\n}\n\nin string {\n  using unicode\n\n  List<int> codePoints() {\n    List<int> codePoints = []\n    StringIterator.INSTANCE.reset(this, 0)\n    while (true) {\n      var codePoint = StringIterator.INSTANCE.nextCodePoint()\n      if (codePoint < 0) {\n        break\n      }\n      codePoints.push(codePoint)\n    }\n    return codePoints\n  }\n\n  static string fromCodePoints(List<int> codePoints) {\n    var builder = StringBuilder()\n\n    if (STRING_ENCODING == .UTF8) {\n      for (var i = 0, n = codePoints.size(); i < n; i++) {\n        var codePoint = codePoints[i]\n        if (codePoint < 0x80) {\n          builder.append(fromCodeUnit(codePoint))\n        } else {\n          if (codePoint < 0x800) {\n            builder.append(fromCodeUnit(((codePoint >> 6) & 0x1F) | 0xC0))\n          } else {\n            if (codePoint < 0x10000) {\n              builder.append(fromCodeUnit(((codePoint >> 12) & 0x0F) | 0xE0))\n            } else {\n              builder.append(fromCodeUnit(((codePoint >> 18) & 0x07) | 0xF0))\n              builder.append(fromCodeUnit(((codePoint >> 12) & 0x3F) | 0x80))\n            }\n            builder.append(fromCodeUnit(((codePoint >> 6) & 0x3F) | 0x80))\n          }\n          builder.append(fromCodeUnit((codePoint & 0x3F) | 0x80))\n        }\n      }\n    }\n\n    else if (STRING_ENCODING == .UTF16) {\n      for (var i = 0, n = codePoints.size(); i < n; i++) {\n        var codePoint = codePoints[i]\n        if (codePoint < 0x10000) {\n          builder.append(fromCodeUnit(codePoint))\n        } else {\n          codePoint -= 0x10000\n          builder.append(fromCodeUnit((codePoint >> 10) + 0xD800))\n          builder.append(fromCodeUnit((codePoint & ((1 << 10) - 1)) + 0xDC00))\n        }\n      }\n    }\n\n    else {\n      for (var i = 0, n = codePoints.size(); i < n; i++) {\n        builder.append(fromCodeUnit(codePoints[i]))\n      }\n    }\n\n    return builder.toString()\n  }\n}\n', 4), new CachedLibrary('unit.sk', 'namespace unit {\n  enum Status {\n    FAILURE\n    SUCCESS\n  }\n\n  interface Report {\n    virtual void begin(int count)\n    virtual void completed(Test test, Status status)\n    virtual void end()\n  }\n\n  class Failure {\n    final string expected\n    final string observed\n  }\n\n  ////////////////////////////////////////////////////////////////////////////////\n\n  class Test {\n    new() {\n      all.push(this)\n    }\n\n    inline string name() { return _name }\n    inline Failure failure() { return _failure }\n    inline void rename(string name) { _name = name }\n\n    virtual void before() {}\n    virtual void after() {}\n    virtual void run()\n\n    static void runAll(Report report) {\n      var tests = all\n      var count = tests.size()\n\n      all = []\n      report.begin(count)\n\n      for (var i = 0; i < count; i++) {\n        var test = tests[i]\n        test.before()\n        try {\n          test.run()\n        } catch {\n          if (test._failure == null) {\n            test._failure = Failure("", "(runtime error)")\n          }\n        }\n        test.after()\n        report.completed(test, test._failure == null ? .SUCCESS : .FAILURE)\n      }\n\n      report.end()\n    }\n\n    void expectString(string expected, string observed) {\n      if (expected != observed) {\n        _failure = Failure(expected, observed)\n        throw _failure\n      }\n    }\n\n    private {\n      string _name\n      Failure _failure\n      static List<Test> all = []\n    }\n  }\n\n  ////////////////////////////////////////////////////////////////////////////////\n\n  class TerminalReport : Report {\n    using math\n    using terminal\n    using timestamp\n\n    inline int failedCount() {\n      return _failed.size()\n    }\n\n    override void begin(int count) {\n      _wrapWidth = width() * 3 / 4\n      _startTime = now()\n      _count = count\n      _completed = 0\n      write("\\n  ")\n    }\n\n    override void completed(Test test, Status status) {\n      _completed++\n      if (status == .FAILURE) {\n        _failed.push(test)\n        setColor(.RED)\n        write("x")\n      } else {\n        setColor(.GREEN)\n        write(".")\n      }\n      if (_completed < _count && _wrapWidth != 0 && _completed % _wrapWidth == 0) {\n        write("\\n  ")\n      }\n      setColor(.DEFAULT)\n      flush()\n    }\n\n    override void end() {\n      print("\\n")\n\n      // Print the summary\n      var totalTime = (int)floor((now() - _startTime) / 100)\n      setColor(.GREEN)\n      write("  " + (_count - _failed.size()) + " passing")\n      setColor(.GRAY)\n      print("  (" + totalTime / 10 + "." + totalTime % 10 + "s)")\n      if (_failed.size() != 0) {\n        setColor(.RED)\n        print("  " + _failed.size() + " failing")\n      }\n      setColor(.DEFAULT)\n      print("")\n\n      // Print the failed tests\n      var indent = " ".repeat(_failed.size().toString().size() + 5)\n      for (var i = 0; i < _failed.size(); i++) {\n        var test = _failed[i]\n        var text = "  " + (i + 1) + ")"\n        var failure = test.failure()\n        setColor(.BOLD)\n        print(text + " ".repeat(indent.size() - text.size()) + test.name() + "\\n")\n        printDiff(indent,\n          failure.expected == "" ? [] : failure.expected.split("\\n"),\n          failure.observed == "" ? [] : failure.observed.split("\\n"))\n        setColor(.DEFAULT)\n        print("")\n      }\n    }\n\n    private {\n      static void printDiff(string indent, List<string> expected, List<string> observed) {\n        var m = expected.size()\n        var n = observed.size()\n        List<int> matrix = []\n\n        // Solve for the lowest common subsequence length\n        for (var i = 0, ij = 0; i < m; i++) {\n          for (var j = 0; j < n; j++, ij++) {\n            matrix.push(expected[i] == observed[j]\n              ? i > 0 && j > 0 ? matrix[ij - n - 1] + 1 : 1\n              : math.imax(i > 0 ? matrix[ij - n] : 0, j > 0 ? matrix[ij - 1] : 0))\n          }\n        }\n\n        // Extract the diff in reverse\n        List<string> reversed = []\n        var i = m - 1\n        var j = n - 1\n        while (i >= 0 || j >= 0) {\n          var ij = i * n + j\n\n          // Common\n          if (i >= 0 && j >= 0 && expected[i] == observed[j]) {\n            reversed.push(" " + expected[i])\n            i--\n            j--\n          }\n\n          // Removal\n          else if (j >= 0 && (i < 0 || (j > 0 ? matrix[ij - 1] : 0) > (i > 0 ? matrix[ij - n] : 0))) {\n            reversed.push("-" + observed[j])\n            j--\n          }\n\n          // Insertion\n          else {\n            assert i >= 0 && (j < 0 || (j > 0 ? matrix[ij - 1] : 0) <= (i > 0 ? matrix[ij - n] : 0))\n            reversed.push("+" + expected[i])\n            i--\n          }\n        }\n\n        // Print out the diff\n        for (var i = reversed.size() - 1; i >= 0; i--) {\n          var text = reversed[i]\n          var c = text[0]\n          setColor(c == \'+\' ? .GREEN : c == \'-\' ? .RED : .GRAY)\n          print(indent + text)\n        }\n      }\n\n      List<Test> _failed = []\n      var _wrapWidth = 0\n      var _startTime = 0.0\n      var _completed = 0\n      var _count = 0\n    }\n  }\n}\n', 5)];
  Range.EMPTY = new Range(null, 0, 0);
  var HEX = '0123456789ABCDEF';
  trace.GENERICS = false;
  trace.spaces = '';
  StringComparison.INSTANCE = new StringComparison();
  js.Emitter.isKeyword = in_StringMap.literal('apply arguments Boolean break call case catch class const constructor continue Date debugger default delete do double else export extends false finally float for Function function if import in instanceof int let new null Number Object return String super this throw true try var'.split(' '), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  js.SymbolGroupComparison.INSTANCE = new js.SymbolGroupComparison();
  SourceMappingComparison.INSTANCE = new SourceMappingComparison();
  SourceMapGenerator.BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var yy_accept = [114, 114, 114, 36, 39, 113, 72, 73, 39, 39, 91, 15, 39, 63, 95, 69, 77, 24, 68, 32, 30, 56, 56, 23, 96, 64, 4, 46, 90, 39, 48, 62, 94, 17, 105, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 61, 16, 93, 106, 113, 72, 74, 114, 100, 114, 59, 59, 59, 59, 59, 12, 66, 5, 114, 21, 114, 78, 10, 52, 11, 27, 9, 2, 33, 114, 113, 8, 114, 56, 114, 114, 44, 114, 114, 34, 97, 65, 38, 47, 98, 1, 48, 7, 48, 48, 48, 48, 48, 48, 48, 31, 48, 48, 48, 48, 48, 48, 49, 48, 51, 60, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 6, 67, 59, 59, 59, 59, 59, 84, 59, 114, 44, 114, 114, 114, 113, 114, 33, 55, 58, 57, 13, 14, 1, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 45, 48, 48, 48, 48, 71, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 108, 48, 110, 48, 48, 59, 59, 59, 59, 59, 59, 114, 33, 113, 48, 48, 48, 19, 48, 48, 48, 48, 48, 48, 35, 37, 48, 48, 48, 48, 48, 48, 48, 75, 48, 48, 48, 48, 89, 48, 48, 48, 48, 103, 48, 107, 48, 48, 48, 59, 80, 81, 59, 59, 59, 0, 48, 18, 20, 22, 25, 48, 48, 48, 48, 41, 42, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 101, 48, 104, 109, 48, 112, 59, 82, 83, 59, 3, 48, 48, 29, 40, 48, 50, 53, 48, 48, 48, 48, 48, 88, 92, 99, 102, 48, 79, 59, 48, 28, 43, 48, 48, 48, 86, 48, 111, 85, 26, 48, 48, 76, 48, 54, 70, 87, 114];
  var yy_ec = [0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 5, 6, 1, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 20, 20, 20, 20, 20, 21, 21, 22, 23, 24, 25, 26, 27, 28, 29, 29, 29, 29, 30, 29, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 32, 33, 34, 35, 31, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 31, 46, 47, 48, 49, 50, 51, 31, 52, 53, 54, 55, 56, 57, 58, 59, 31, 60, 61, 62, 63, 1];
  var yy_meta = [0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 4, 4, 5, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1];
  var yy_base = [0, 0, 0, 433, 434, 430, 62, 406, 61, 27, 405, 61, 62, 434, 434, 58, 60, 434, 62, 60, 79, 89, 81, 407, 434, 50, 403, 64, 434, 0, 0, 434, 434, 402, 434, 29, 374, 56, 71, 66, 83, 87, 77, 369, 82, 383, 87, 73, 370, 101, 378, 434, 91, 434, 434, 419, 146, 434, 93, 434, 417, 0, 378, 104, 376, 380, 434, 434, 434, 134, 434, 413, 434, 434, 434, 434, 434, 434, 434, 139, 133, 0, 434, 143, 152, 170, 136, 434, 156, 0, 434, 390, 434, 434, 434, 389, 0, 0, 434, 368, 359, 370, 112, 373, 360, 137, 0, 355, 352, 355, 358, 355, 351, 0, 351, 145, 0, 353, 343, 352, 357, 150, 149, 343, 359, 344, 349, 151, 143, 348, 340, 339, 345, 434, 434, 0, 347, 133, 348, 335, 0, 334, 191, 434, 196, 202, 203, 0, 203, 207, 198, 211, 0, 434, 434, 0, 348, 343, 346, 341, 342, 327, 179, 342, 337, 336, 328, 325, 321, 336, 0, 322, 326, 329, 328, 0, 321, 315, 310, 311, 317, 322, 307, 307, 319, 305, 305, 307, 315, 0, 306, 0, 300, 306, 307, 309, 309, 304, 298, 298, 216, 220, 434, 293, 293, 298, 0, 299, 289, 287, 295, 284, 284, 0, 0, 285, 295, 288, 282, 284, 280, 278, 0, 278, 292, 287, 282, 0, 274, 280, 272, 284, 0, 265, 0, 278, 265, 278, 269, 0, 0, 275, 264, 270, 0, 260, 0, 0, 0, 0, 264, 265, 270, 256, 0, 262, 254, 266, 264, 254, 259, 249, 250, 222, 211, 220, 0, 214, 0, 0, 220, 0, 215, 0, 0, 206, 0, 199, 199, 0, 0, 193, 0, 0, 214, 213, 208, 206, 192, 0, 0, 0, 0, 198, 0, 201, 202, 0, 0, 203, 179, 166, 0, 164, 0, 0, 0, 156, 136, 0, 52, 0, 0, 0, 434, 262, 264, 269, 271, 274, 277, 282, 287, 290, 292, 297];
  var yy_def = [0, 314, 1, 314, 314, 314, 314, 314, 315, 316, 314, 314, 317, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 318, 319, 314, 314, 314, 314, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 314, 314, 314, 314, 314, 314, 314, 315, 314, 315, 320, 320, 320, 320, 320, 314, 314, 314, 317, 314, 317, 314, 314, 314, 314, 314, 314, 314, 314, 321, 322, 314, 314, 314, 314, 314, 314, 314, 323, 314, 314, 314, 314, 314, 314, 324, 319, 314, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 314, 314, 320, 320, 320, 320, 320, 320, 320, 314, 314, 321, 325, 321, 322, 314, 314, 314, 314, 323, 314, 314, 324, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 320, 320, 320, 320, 320, 320, 314, 314, 314, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 320, 320, 320, 320, 320, 320, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 320, 320, 320, 320, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 319, 320, 320, 319, 319, 319, 319, 319, 319, 319, 319, 319, 320, 319, 319, 319, 319, 319, 319, 319, 319, 0, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314];
  var yy_nxt = [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 22, 22, 23, 24, 25, 26, 27, 28, 29, 30, 30, 30, 31, 4, 32, 33, 34, 35, 36, 37, 38, 39, 40, 30, 30, 41, 30, 30, 30, 42, 43, 44, 45, 46, 47, 48, 49, 50, 30, 30, 51, 52, 53, 54, 56, 56, 59, 62, 63, 67, 72, 70, 64, 74, 91, 92, 99, 76, 79, 79, 79, 79, 100, 73, 65, 75, 68, 77, 78, 94, 95, 80, 313, 102, 60, 71, 81, 83, 59, 84, 84, 84, 84, 103, 82, 83, 104, 84, 84, 84, 84, 85, 105, 107, 117, 108, 133, 127, 118, 85, 110, 106, 85, 87, 109, 128, 60, 86, 111, 113, 85, 87, 119, 112, 121, 114, 115, 122, 130, 88, 116, 124, 125, 70, 126, 145, 131, 89, 56, 56, 146, 137, 134, 138, 150, 150, 139, 79, 79, 79, 79, 79, 79, 79, 79, 159, 160, 71, 83, 142, 84, 84, 84, 84, 151, 151, 151, 312, 195, 163, 142, 143, 85, 148, 164, 148, 196, 180, 149, 149, 149, 149, 172, 85, 87, 178, 186, 311, 188, 173, 179, 181, 189, 187, 200, 310, 200, 309, 145, 201, 201, 201, 201, 146, 145, 145, 150, 150, 308, 202, 146, 149, 149, 149, 149, 149, 149, 149, 149, 151, 151, 151, 209, 210, 201, 201, 201, 201, 201, 201, 201, 201, 307, 306, 305, 304, 303, 302, 301, 87, 300, 299, 298, 297, 296, 295, 294, 293, 292, 291, 290, 289, 143, 58, 58, 58, 58, 58, 61, 61, 69, 69, 69, 69, 69, 96, 96, 97, 97, 97, 135, 135, 135, 144, 144, 144, 144, 144, 147, 288, 147, 147, 147, 152, 152, 155, 155, 155, 146, 146, 146, 146, 146, 287, 286, 285, 284, 283, 282, 281, 280, 279, 278, 277, 276, 275, 274, 273, 272, 271, 270, 269, 268, 267, 266, 265, 264, 263, 262, 261, 260, 259, 258, 257, 256, 255, 254, 253, 252, 251, 250, 249, 248, 247, 246, 245, 244, 243, 242, 241, 240, 239, 238, 237, 236, 235, 234, 233, 232, 231, 230, 229, 228, 227, 226, 225, 224, 223, 222, 221, 220, 219, 218, 217, 216, 215, 214, 213, 212, 211, 208, 207, 206, 205, 204, 203, 199, 198, 197, 194, 193, 192, 191, 190, 185, 184, 183, 182, 177, 176, 175, 174, 171, 170, 169, 168, 167, 166, 165, 162, 161, 158, 157, 156, 154, 153, 314, 141, 140, 136, 314, 55, 132, 129, 123, 120, 101, 98, 93, 90, 66, 57, 55, 314, 3, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314];
  var yy_chk = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 8, 9, 9, 11, 15, 12, 9, 16, 25, 25, 35, 18, 19, 19, 19, 19, 35, 15, 9, 16, 11, 18, 18, 27, 27, 20, 310, 37, 8, 12, 20, 22, 58, 22, 22, 22, 22, 37, 20, 21, 37, 21, 21, 21, 21, 22, 38, 39, 42, 39, 52, 47, 42, 21, 40, 38, 22, 22, 39, 47, 58, 21, 40, 41, 21, 21, 42, 40, 44, 41, 41, 44, 49, 21, 41, 46, 46, 69, 46, 80, 49, 21, 56, 56, 80, 63, 52, 63, 86, 86, 63, 79, 79, 79, 79, 83, 83, 83, 83, 102, 102, 69, 84, 79, 84, 84, 84, 84, 88, 88, 88, 308, 137, 105, 79, 79, 84, 85, 105, 85, 137, 122, 85, 85, 85, 85, 115, 84, 84, 121, 127, 307, 128, 115, 121, 122, 128, 127, 142, 303, 142, 301, 144, 142, 142, 142, 142, 144, 145, 146, 150, 150, 300, 145, 146, 148, 148, 148, 148, 149, 149, 149, 149, 151, 151, 151, 162, 162, 200, 200, 200, 200, 201, 201, 201, 201, 299, 296, 295, 293, 288, 287, 286, 149, 285, 284, 281, 278, 277, 275, 272, 270, 267, 265, 264, 263, 201, 315, 315, 315, 315, 315, 316, 316, 317, 317, 317, 317, 317, 318, 318, 319, 319, 319, 320, 320, 320, 321, 321, 321, 321, 321, 322, 262, 322, 322, 322, 323, 323, 324, 324, 324, 325, 325, 325, 325, 325, 261, 260, 259, 258, 257, 256, 255, 253, 252, 251, 250, 245, 243, 242, 241, 238, 237, 236, 235, 233, 231, 230, 229, 228, 226, 225, 224, 223, 221, 220, 219, 218, 217, 216, 215, 212, 211, 210, 209, 208, 207, 205, 204, 203, 199, 198, 197, 196, 195, 194, 193, 192, 190, 188, 187, 186, 185, 184, 183, 182, 181, 180, 179, 178, 177, 176, 174, 173, 172, 171, 169, 168, 167, 166, 165, 164, 163, 161, 160, 159, 158, 157, 156, 141, 139, 138, 136, 132, 131, 130, 129, 126, 125, 124, 123, 120, 119, 118, 117, 114, 112, 111, 110, 109, 108, 107, 104, 103, 101, 100, 99, 95, 91, 71, 65, 64, 62, 60, 55, 50, 48, 45, 43, 36, 33, 26, 23, 10, 7, 5, 3, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314, 314];
  var REMOVE_NEWLINE_BEFORE = in_IntMap.literal([20, 23, 24, 43, 90, 94, 95], [0, 0, 0, 0, 0, 0, 0]);
  var REMOVE_NEWLINE_AFTER = in_IntMap.literal([3, 19, 20, 23, 72, 90, 108, 61, 62, 63, 77, 15, 16, 17, 30, 38, 46, 47, 51, 60, 64, 65, 66, 67, 69, 74, 91, 97, 98, 68, 4, 11, 5, 6, 7, 8, 10, 12, 13, 14, 9], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  var pratt = createParser();
  MemberComparison.INSTANCE = new MemberComparison();
  MemberRangeComparison.INSTANCE = new MemberRangeComparison();
  SourceSubstitutionComparison.INSTANCE = new SourceSubstitutionComparison();
  Resolver.nameToSymbolFlag = in_StringMap.literal('const export final import inline override private protected public pure static virtual'.split(' '), [1024, 4096, 256, 8192, 512, 32, 2, 4, 1, 2048, 64, 128]);
  Resolver.operatorAnnotationMap = in_StringMap.literal('@OperatorGet @OperatorSet @OperatorCompare @OperatorAdd @OperatorSubtract @OperatorMultiply @OperatorDivide @OperatorRemainder @OperatorAnd @OperatorOr @OperatorXor @OperatorShiftLeft @OperatorShiftRight @OperatorIn @OperatorAddAssign @OperatorSubtractAssign @OperatorMultiplyAssign @OperatorDivideAssign @OperatorRemainderAssign @OperatorAndAssign @OperatorOrAssign @OperatorXorAssign @OperatorShiftLeftAssign @OperatorShiftRightAssign @OperatorNegative @OperatorComplement'.split(' '), [91, 115, 85, 81, 103, 97, 86, 100, 82, 83, 84, 101, 102, 90, 105, 109, 107, 106, 108, 110, 111, 112, 113, 114, 69, 70]);
  Symbol.nextUniqueID = -1;
  SymbolComparison.INSTANCE = new SymbolComparison();
  Type.nextUniqueID = -1;
  frontend.DEFAULT_ERROR_LIMIT = 20;
  frontend.VALID_TARGETS = in_StringMap.literal('cpp joined js json-ast lisp-ast ruby xml-ast'.split(' '), [1, 3, 2, 5, 6, 4, 7]);
  frontend.VALID_JS_CONFIGS = in_StringMap.literal(['browser', 'node'], [2, 5]);
  frontend.VALID_CPP_CONFIGS = in_StringMap.literal(['android', 'ios', 'linux', 'osx', 'windows'], [1, 3, 4, 6, 7]);
  frontend.VALID_GC_STRATEGIES = in_StringMap.literal(['mark-sweep', 'none', 'none-fast'], [2, 0, 1]);
  frontend.VALID_OPTIONAL_LIBRARIES = in_StringMap.literal(['os', 'terminal', 'timestamp', 'unicode', 'unit'], [1, 2, 3, 4, 5]);
  frontend.OPTIONAL_LIBRARY_DEPENDENCIES = in_IntMap.literal([5], [[3]]);
  in_NodeKind._toString_ = 'PROGRAM FILE BLOCK NODE_LIST CASE CATCH MEMBER_INITIALIZER VARIABLE_CLUSTER NAMESPACE ENUM ENUM_FLAGS CLASS INTERFACE EXTENSION CONSTRUCTOR FUNCTION VARIABLE PARAMETER PREPROCESSOR_DEFINE ALIAS IF TRY FOR FOR_EACH WHILE DO_WHILE RETURN BREAK CONTINUE THROW ASSERT ASSERT_CONST EXPRESSION SWITCH MODIFIER USING PREPROCESSOR_WARNING PREPROCESSOR_ERROR PREPROCESSOR_IF NAME TYPE THIS HOOK NULL BOOL INT FLOAT DOUBLE STRING LIST MAP KEY_VALUE DOT DOT_ARROW DOT_COLON CALL SUPER_CALL ERROR SEQUENCE PARAMETERIZE CAST IMPLICIT_CAST QUOTED VAR ANNOTATION PREPROCESSOR_HOOK PREPROCESSOR_SEQUENCE NOT POSITIVE NEGATIVE COMPLEMENT PREFIX_INCREMENT PREFIX_DECREMENT POSTFIX_INCREMENT POSTFIX_DECREMENT NEW DELETE PREFIX_DEREFERENCE PREFIX_REFERENCE POSTFIX_DEREFERENCE POSTFIX_REFERENCE ADD BITWISE_AND BITWISE_OR BITWISE_XOR COMPARE DIVIDE EQUAL GREATER_THAN GREATER_THAN_OR_EQUAL IN INDEX IS LESS_THAN LESS_THAN_OR_EQUAL LOGICAL_AND LOGICAL_OR MULTIPLY NOT_EQUAL POWER REMAINDER SHIFT_LEFT SHIFT_RIGHT SUBTRACT ASSIGN ASSIGN_ADD ASSIGN_DIVIDE ASSIGN_MULTIPLY ASSIGN_REMAINDER ASSIGN_SUBTRACT ASSIGN_BITWISE_AND ASSIGN_BITWISE_OR ASSIGN_BITWISE_XOR ASSIGN_SHIFT_LEFT ASSIGN_SHIFT_RIGHT ASSIGN_INDEX'.split(' ');
  in_TokenKind._toString_ = 'ALIAS ANNOTATION ARROW ASSERT ASSIGN ASSIGN_BITWISE_AND ASSIGN_BITWISE_OR ASSIGN_BITWISE_XOR ASSIGN_DIVIDE ASSIGN_MINUS ASSIGN_MULTIPLY ASSIGN_PLUS ASSIGN_REMAINDER ASSIGN_SHIFT_LEFT ASSIGN_SHIFT_RIGHT BITWISE_AND BITWISE_OR BITWISE_XOR BREAK CASE CATCH CHARACTER CLASS COLON COMMA CONST CONTINUE DECREMENT DEFAULT DELETE DIVIDE DO DOT DOUBLE DOUBLE_COLON ELSE END_OF_FILE ENUM EQUAL ERROR EXPORT FALSE FINAL FINALLY FLOAT FOR GREATER_THAN GREATER_THAN_OR_EQUAL IDENTIFIER IF IMPORT IN INCREMENT INLINE INTERFACE INT_BINARY INT_DECIMAL INT_HEX INT_OCTAL INVALID_PREPROCESSOR_DIRECTIVE IS LEFT_BRACE LEFT_BRACKET LEFT_PARENTHESIS LESS_THAN LESS_THAN_OR_EQUAL LOGICAL_AND LOGICAL_OR MINUS MULTIPLY NAMESPACE NEW NEWLINE NOT NOT_EQUAL NULL OVERRIDE PLUS POWER PREPROCESSOR_DEFINE PREPROCESSOR_ELIF PREPROCESSOR_ELSE PREPROCESSOR_ENDIF PREPROCESSOR_ERROR PREPROCESSOR_IF PREPROCESSOR_WARNING PRIVATE PROTECTED PUBLIC PURE QUESTION_MARK REMAINDER RETURN RIGHT_BRACE RIGHT_BRACKET RIGHT_PARENTHESIS SEMICOLON SHIFT_LEFT SHIFT_RIGHT STATIC STRING SUPER SWITCH THIS THROW TICK TILDE TRUE TRY USING VAR VIRTUAL WHILE WHITESPACE YY_INVALID_ACTION START_PARAMETER_LIST END_PARAMETER_LIST'.split(' ');
  process.exit(frontend.main(process.argv.slice(2)));
}());
//# sourceMappingURL=skewc.js.map
