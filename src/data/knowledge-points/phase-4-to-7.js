// Phase 4 ~ Phase 7 知识点详细内容
// 异常处理与 IO 流 · 多线程与并发编程 · JVM 原理浅尝 · 数据库编程

export const phase4Topics = [
  {
    "id": "p4-exception-hierarchy",
    "title": "异常体系",
    "description": "理解 Java 异常分类树与处理策略",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p4-kp-throwable-tree",
        "title": "Throwable → Error / Exception 体系",
        "shortDesc": "异常体系就像一棵族谱树，Throwable 是老祖宗，Error 和 Exception 是两大家族",
        "deepPrinciple": "<p>Java 异常体系根植于 <strong>Throwable</strong>，两个子类：</p><ul><li><strong>Error</strong>：JVM 层面严重问题（OutOfMemoryError、StackOverflowError），程序<strong>不应该捕获</strong></li><li><strong>Exception</strong>：程序逻辑可处理的异常</li></ul><p>编译器通过继承树决定哪些异常<strong>必须处理</strong>（受检异常），哪些<strong>选择性处理</strong>（非受检异常）。Error 代表系统级灾难（内存耗尽），Exception 代表业务级问题（文件找不到），程序可以采取补救措施。</p>",
        "scenario": "调用第三方支付接口可能抛出 IOException（受检，必须处理）；\n传了 null 导致 NullPointerException（非受检，应修代码避免）。\n了解异常体系能帮你快速判断：该捕获还是该修代码。",
        "codeExample": "public class ExceptionHierarchyDemo {\n    public static void main(String[] args) {\n        // 受检异常：编译器强制处理\n        try {\n            Class.forName(\"com.example.NonExistent\");\n        } catch (ClassNotFoundException e) {\n            System.out.println(\"受检异常: \" + e.getMessage());\n        }\n\n        // 非受检异常：运行时才暴露\n        try {\n            int[] arr = {1, 2, 3};\n            System.out.println(arr[10]);\n        } catch (ArrayIndexOutOfBoundsException e) {\n            System.out.println(\"非受检异常: \" + e.getMessage());\n        }\n\n        // 打印继承链\n        Class<?> clazz = NullPointerException.class;\n        while (clazz != null) {\n            System.out.println(\"  -> \" + clazz.getName());\n            clazz = clazz.getSuperclass();\n        }\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p4-kp-checked-unchecked",
        "title": "受检异常 vs 非受检异常",
        "shortDesc": "受检异常像过安检——编译器强制你处理；非受检异常像踩香蕉皮——运行时才暴露",
        "deepPrinciple": "<p><strong>受检异常（Checked）</strong>：继承 Exception 但不继承 RuntimeException，编译器强制用 try-catch 或 throws。</p><p><strong>非受检异常（Unchecked）</strong>：继承 RuntimeException，编译器不强制。</p><p>设计哲学：受检异常是<strong>可预见的外部风险</strong>（文件不存在、网络中断）；非受检异常是<strong>程序 Bug</strong>（空指针、越界），应修正代码而非 try-catch。现代框架（Spring）倾向使用非受检异常避免冗长的 throws 链。</p>",
        "scenario": "FileNotFoundException 是受检异常，编译器提醒你\"文件可能不存在\"。\nIllegalArgumentException 是非受检异常，表示调用方传参有误。",
        "codeExample": "import java.io.FileInputStream;\nimport java.io.FileNotFoundException;\n\npublic class CheckedVsUncheckedDemo {\n    // 受检异常：不处理编译不通过\n    public static void readFile(String path) {\n        try {\n            FileInputStream fis = new FileInputStream(path);\n            fis.close();\n        } catch (FileNotFoundException e) {\n            System.out.println(\"文件未找到: \" + path);\n        } catch (Exception e) {\n            System.out.println(\"读取出错: \" + e.getMessage());\n        }\n    }\n\n    // 非受检异常：编译器不强制\n    public static int divide(int a, int b) {\n        if (b == 0) throw new IllegalArgumentException(\"除数不能为零\");\n        return a / b;\n    }\n\n    public static void main(String[] args) {\n        readFile(\"不存在.txt\");\n        try { divide(10, 0); }\n        catch (IllegalArgumentException e) { System.out.println(e.getMessage()); }\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p4-kp-common-exceptions",
        "title": "常见异常类速查",
        "shortDesc": "记住十几个高频异常，遇到报错不再一脸懵",
        "deepPrinciple": "<p>常见异常分类：</p><ul><li><strong>空指针</strong>：NullPointerException</li><li><strong>类型转换</strong>：ClassCastException、NumberFormatException</li><li><strong>索引越界</strong>：ArrayIndexOutOfBoundsException、StringIndexOutOfBoundsException</li><li><strong>IO</strong>：FileNotFoundException、IOException</li><li><strong>并发</strong>：ConcurrentModificationException（遍历时修改集合）</li><li><strong>状态</strong>：IllegalStateException、IllegalArgumentException、UnsupportedOperationException</li></ul><p>理解语义才能快速定位。看到 ConcurrentModificationException 就想到 for-each 里调了 remove。</p>",
        "scenario": "线上日志出现 NumberFormatException，排查发现前端传了带空格的金额 \" 99.9 \"，\n后端 Double.parseDouble() 没做 trim()。5 分钟定位线上 Bug。",
        "codeExample": "import java.util.*;\n\npublic class CommonExceptionsDemo {\n    public static void main(String[] args) {\n        try { String s = null; s.length(); }\n        catch (NullPointerException e) { System.out.println(\"空指针\"); }\n\n        try { Object o = \"Hello\"; Integer n = (Integer) o; }\n        catch (ClassCastException e) { System.out.println(\"类型转换失败\"); }\n\n        try { Integer.parseInt(\"abc\"); }\n        catch (NumberFormatException e) { System.out.println(\"数字格式错误\"); }\n\n        // ConcurrentModificationException 与正确做法\n        List<String> list = new ArrayList<>(Arrays.asList(\"a\", \"b\", \"c\"));\n        var it = list.iterator();\n        while (it.hasNext()) { if (\"b\".equals(it.next())) it.remove(); }\n        System.out.println(\"安全删除后: \" + list);\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      }
    ]
  },
  {
    "id": "p4-try-catch-finally",
    "title": "try-catch-finally",
    "description": "异常捕获的三种核心姿势",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p4-kp-multi-catch",
        "title": "多重捕获（| 语法）",
        "shortDesc": "Java 7 的 | 语法让你一张网捞多种鱼",
        "deepPrinciple": "<p>Java 7 的 <strong>multi-catch</strong>，一个 catch 块捕获多种异常。规则：</p><ul><li>类型间<strong>不能有继承关系</strong></li><li>异常变量是<strong>隐式 final</strong></li><li><strong>子类异常必须在父类之前</strong>catch</li></ul><p>底层：编译器为每个异常类型生成异常表条目，JVM 按顺序匹配。</p>",
        "scenario": "解析 CSV 时 IOException 和 NumberFormatException 处理逻辑相同，\n用 multi-catch 避免重复代码。",
        "codeExample": "import java.io.*;\n\npublic class MultiCatchDemo {\n    public static void main(String[] args) {\n        try {\n            riskyOp(2);\n        } catch (FileNotFoundException e) {\n            System.out.println(\"文件未找到: \" + e.getMessage());\n        } catch (IOException | NumberFormatException e) {\n            // 一个 catch 捕获多种无继承关系的异常\n            System.out.println(\"统一处理: \" + e.getClass().getSimpleName());\n        }\n    }\n\n    static void riskyOp(int type) throws IOException {\n        switch (type) {\n            case 1 -> throw new FileNotFoundException(\"data.csv 不存在\");\n            case 2 -> throw new IOException(\"磁盘读取失败\");\n            default -> throw new NumberFormatException(\"无法解析\");\n        }\n    }\n}",
        "estimatedMinutes": 20,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p4-kp-finally-timing",
        "title": "finally 执行时机",
        "shortDesc": "finally 像航班的安全检查——不管飞行是否颠簸，落地后一定会执行",
        "deepPrinciple": "<p><strong>finally 几乎一定会执行</strong>，即使 try/catch 中有 return。关键细节：</p><ul><li>try 中有 return：finally 在 return <strong>之前</strong>执行，但返回值已<strong>暂存</strong></li><li>finally 中有 return：<strong>覆盖</strong> try 的返回值（极危险）</li><li>基本类型 return 后 finally 修改不影响返回值；引用类型修改内容会生效</li><li>不执行：System.exit()、JVM 崩溃</li></ul>",
        "scenario": "数据库操作中，无论 SQL 成功失败都必须 finally 关闭 Connection，否则连接泄漏。",
        "codeExample": "public class FinallyTimingDemo {\n    public static void main(String[] args) {\n        System.out.println(\"testReturn: \" + testReturn());       // 1\n        System.out.println(\"testPrimitive: \" + testPrimitive()); // 10\n        System.out.println(\"testReference: \" + testReference());  // Hello World\n    }\n\n    static int testReturn() {\n        try { return 1; }\n        finally { System.out.println(\"  finally 在 return 前执行\"); }\n    }\n\n    // 基本类型：finally 修改不影响暂存值\n    static int testPrimitive() {\n        int result = 10;\n        try { return result; } // 暂存 10\n        finally { result = 20; } // 返回 10\n    }\n\n    // 引用类型：finally 修改对象内容生效\n    static StringBuilder testReference() {\n        StringBuilder sb = new StringBuilder(\"Hello\");\n        try { return sb; }\n        finally { sb.append(\" World\"); } // 返回 \"Hello World\"\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学",
          "面试"
        ]
      },
      {
        "id": "p4-kp-try-with-resources",
        "title": "try-with-resources 自动关闭",
        "shortDesc": "Java 7 的自动关门神器——进门时声明资源，出门自动帮你关好",
        "deepPrinciple": "<p>实现 <code>AutoCloseable</code> 的资源在 try 块结束后<strong>自动调用 close()</strong>。</p><ul><li>编译器转换为带 finally 的代码</li><li>try 块和 close() 都抛异常时，close() 的作为 <strong>Suppressed Exception</strong></li><li>多资源按<strong>声明的逆序</strong>关闭</li></ul>",
        "scenario": "读取上传文件用 try-with-resources，避免忘记关闭流导致文件句柄泄漏。",
        "codeExample": "import java.io.*;\n\npublic class TryWithResourcesDemo {\n    public static void main(String[] args) {\n        // try-with-resources（推荐）\n        try (BufferedReader reader = new BufferedReader(new FileReader(\"test.txt\"))) {\n            System.out.println(reader.readLine());\n        } catch (IOException e) {\n            System.out.println(\"失败: \" + e.getMessage());\n        }\n        // reader 自动关闭，无需 finally\n\n        // 多资源同时管理\n        try (\n            FileInputStream fis = new FileInputStream(\"src.dat\");\n            FileOutputStream fos = new FileOutputStream(\"dst.dat\")\n        ) {\n            byte[] buf = new byte[1024];\n            int len;\n            while ((len = fis.read(buf)) != -1) fos.write(buf, 0, len);\n        } catch (IOException e) {\n            for (Throwable s : e.getSuppressed())\n                System.out.println(\"抑制异常: \" + s.getMessage());\n        }\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      }
    ]
  },
  {
    "id": "p4-custom-exception",
    "title": "自定义异常",
    "description": "根据业务需求定义专属异常类",
    "estimatedHours": 1,
    "knowledgePoints": [
      {
        "id": "p4-kp-extend-exception",
        "title": "继承 Exception / RuntimeException",
        "shortDesc": "自定义异常就像给不同病症起专属名字——让诊断更精准",
        "deepPrinciple": "<p>核心决策：继承 <strong>Exception</strong>（受检，调用方必须处理）还是 <strong>RuntimeException</strong>（非受检，可选处理）。</p><p>现代趋势倾向 RuntimeException 子类，避免污染方法签名。Spring 大量使用非受检异常。</p><p>应提供多个构造器：无参、带消息、带消息和原因（异常链）。</p>",
        "scenario": "\"余额不足\"和\"商品下架\"用通用异常难区分。\n自定义 InsufficientBalanceException，一看类名就知道问题。",
        "codeExample": "// 受检异常\npublic class InsufficientBalanceException extends Exception {\n    private final double current;\n    private final double required;\n    public InsufficientBalanceException(double current, double required) {\n        super(String.format(\"余额不足: 当前%.2f, 需要%.2f\", current, required));\n        this.current = current;\n        this.required = required;\n    }\n    public double getCurrent() { return current; }\n    public double getRequired() { return required; }\n}\n\n// 非受检异常\npublic class InvalidParamException extends RuntimeException {\n    public InvalidParamException(String param, Object value) {\n        super(String.format(\"参数[%s]值[%s]不合法\", param, value));\n    }\n}\n\n// 使用示例\npublic class OrderService {\n    public void pay(double amount) throws InsufficientBalanceException {\n        double balance = 100.0;\n        if (amount <= 0) throw new InvalidParamException(\"amount\", amount);\n        if (amount > balance) throw new InsufficientBalanceException(balance, amount);\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p4-kp-error-code-exception",
        "title": "带错误码的业务异常",
        "shortDesc": "给异常编号，就像医院的疾病编码——方便前后端统一沟通",
        "deepPrinciple": "<p>前端需要<strong>错误码</strong>做不同处理（401 跳登录），后端需要错误码做日志分类。</p><p>设计：ErrorCode 枚举统一管理 + BusinessException 基类含 errorCode + 不同模块不同前缀（ORDER_001、USER_002）。</p>",
        "scenario": "后端返回 { \"code\": \"ORDER_001\", \"message\": \"库存不足\" }，\n前端根据 code 判断是\"调整数量\"还是\"商品已下架\"。",
        "codeExample": "public enum ErrorCode {\n    USER_NOT_FOUND(\"USER_001\", \"用户不存在\"),\n    PASSWORD_WRONG(\"USER_002\", \"密码错误\"),\n    STOCK_INSUFFICIENT(\"ORDER_001\", \"库存不足\");\n\n    private final String code;\n    private final String message;\n    ErrorCode(String code, String msg) { this.code = code; this.message = msg; }\n    public String getCode() { return code; }\n    public String getMessage() { return message; }\n}\n\npublic class BusinessException extends RuntimeException {\n    private final ErrorCode errorCode;\n    public BusinessException(ErrorCode ec) { super(ec.getMessage()); this.errorCode = ec; }\n    public BusinessException(ErrorCode ec, String detail) {\n        super(ec.getMessage() + \": \" + detail); this.errorCode = ec;\n    }\n    public String getCode() { return errorCode.getCode(); }\n}\n\n// 使用: throw new BusinessException(ErrorCode.USER_NOT_FOUND, username);",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "实战"
        ]
      }
    ]
  },
  {
    "id": "p4-throw-throws",
    "title": "throw 与 throws",
    "description": "理解抛出与声明异常的区别",
    "estimatedHours": 1,
    "knowledgePoints": [
      {
        "id": "p4-kp-throw-throws-diff",
        "title": "throw 抛出异常 vs throws 声明异常",
        "shortDesc": "throw 是扔炸弹的动作，throws 是门口的\"小心炸弹\"警告牌",
        "deepPrinciple": "<p><strong>throw</strong>：方法体内主动抛出异常对象，方法立即终止。<strong>throws</strong>：方法签名上声明可能抛出的受检异常类型，告知调用方。</p><ul><li>throw 后跟<strong>异常对象</strong>：<code>throw new XxxException()</code></li><li>throws 后跟<strong>异常类型</strong>：<code>throws IOException, SQLException</code></li></ul>",
        "scenario": "DAO 层 throws SQLException，Service 层 catch 后 throw new BusinessException，\nController 层 catch 返回前端。异常在各层之间的\"接力传递\"。",
        "codeExample": "import java.io.IOException;\n\npublic class ThrowVsThrowsDemo {\n    // throws 声明可能抛出的异常\n    static String readConfig(String path) throws IOException {\n        if (path == null) throw new IllegalArgumentException(\"路径不能为空\");\n        if (!path.endsWith(\".properties\"))\n            throw new IOException(\"格式不支持: \" + path);\n        return \"config=value\";\n    }\n\n    public static void main(String[] args) {\n        try {\n            System.out.println(readConfig(\"app.properties\"));\n            readConfig(\"app.yml\"); // 会抛 IOException\n        } catch (IOException e) {\n            System.out.println(\"捕获: \" + e.getMessage());\n        }\n    }\n}",
        "estimatedMinutes": 20,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p4-kp-exception-chain",
        "title": "异常链（Exception Chaining）",
        "shortDesc": "异常链就像犯罪线索链——层层追踪，找到最初的\"犯人\"",
        "deepPrinciple": "<p>捕获底层异常，包装成上层异常重新抛出，<strong>保留原始异常作为 cause</strong>。通过 <code>Throwable(msg, cause)</code> 构造器实现。</p><ul><li><strong>封装性</strong>：上层不需知道底层用 MySQL 还是 PostgreSQL</li><li><strong>可追溯</strong>：getCause() 追踪到根因</li><li><strong>日志友好</strong>：printStackTrace() 打印完整 Caused by 链</li></ul>",
        "scenario": "用户注册底层抛 SQLIntegrityConstraintViolationException，\nDAO 包装成 DuplicateUserException，通过 Caused by 追踪发现是用户名重复。",
        "codeExample": "public class ExceptionChainDemo {\n    static class DbException extends Exception {\n        public DbException(String msg) { super(msg); }\n    }\n    static class ServiceException extends RuntimeException {\n        public ServiceException(String msg, Throwable cause) { super(msg, cause); }\n    }\n\n    static void insertUser(String name) throws DbException {\n        if (\"admin\".equals(name))\n            throw new DbException(\"Duplicate entry 'admin' for key 'uk_username'\");\n    }\n\n    static void register(String name) {\n        try { insertUser(name); }\n        catch (DbException e) { throw new ServiceException(\"注册失败: 用户名已存在\", e); }\n    }\n\n    public static void main(String[] args) {\n        try { register(\"admin\"); }\n        catch (ServiceException e) {\n            System.out.println(\"业务异常: \" + e.getMessage());\n            System.out.println(\"根本原因: \" + e.getCause().getMessage());\n        }\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "必学"
        ]
      }
    ]
  },
  {
    "id": "p4-file-class",
    "title": "File 类",
    "description": "文件和目录的基本操作",
    "estimatedHours": 1,
    "knowledgePoints": [
      {
        "id": "p4-kp-file-path",
        "title": "路径表示与 File 对象",
        "shortDesc": "File 对象是文件的\"名片\"——只记录路径，不关心文件是否存在",
        "deepPrinciple": "<p><code>java.io.File</code> 是文件/目录的<strong>抽象表示</strong>。创建 File 对象不会创建实际文件。</p><ul><li>绝对路径 vs 相对路径</li><li>推荐用 <code>/</code>，Java 自动转换平台分隔符</li></ul><p>Java 7 的 <code>Path</code> + <code>Files</code> 是更现代的替代方案。</p>",
        "scenario": "Web 应用保存上传文件，先用 File 检查目录是否存在，不存在则 mkdirs() 创建。",
        "codeExample": "import java.io.File;\nimport java.io.IOException;\n\npublic class FilePathDemo {\n    public static void main(String[] args) throws IOException {\n        File file = new File(\"data/test.txt\");\n        System.out.println(\"路径: \" + file.getPath());\n        System.out.println(\"绝对路径: \" + file.getAbsolutePath());\n        System.out.println(\"文件名: \" + file.getName());\n        System.out.println(\"父目录: \" + file.getParent());\n        System.out.println(\"存在: \" + file.exists());\n\n        // 现代 API（Java 7+）\n        java.nio.file.Path p = java.nio.file.Paths.get(\"data\", \"test.txt\");\n        System.out.println(\"NIO Path: \" + p.toAbsolutePath());\n    }\n}",
        "estimatedMinutes": 20,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p4-kp-file-operations",
        "title": "创建、删除与遍历文件",
        "shortDesc": "用 Java 代码当文件管家——创建、删除、遍历样样行",
        "deepPrinciple": "<p>常用方法：</p><ul><li>创建：<code>createNewFile()</code>、<code>mkdir()</code>、<code>mkdirs()</code>（推荐，自动创建父目录）</li><li>删除：<code>delete()</code>（只能删空目录）、<code>deleteOnExit()</code></li><li>遍历：<code>listFiles()</code>、<code>listFiles(FilenameFilter)</code></li><li>判断：<code>isFile()</code>、<code>isDirectory()</code>、<code>canRead()</code></li></ul>",
        "scenario": "日志清理任务：遍历 /logs 目录，找 7 天前的 .log 文件并删除。",
        "codeExample": "import java.io.File;\nimport java.io.IOException;\n\npublic class FileOperationsDemo {\n    public static void main(String[] args) throws IOException {\n        File dir = new File(\"temp/logs/2024\");\n        dir.mkdirs();\n        new File(dir, \"app.log\").createNewFile();\n        new File(dir, \"error.log\").createNewFile();\n\n        // 带过滤器遍历\n        File[] logs = dir.listFiles((d, name) -> name.endsWith(\".log\"));\n        if (logs != null) for (File f : logs) System.out.println(\"  \" + f.getName());\n\n        // 递归删除\n        deleteDir(new File(\"temp\"));\n    }\n\n    static void deleteDir(File f) {\n        if (f.isDirectory()) {\n            File[] ch = f.listFiles();\n            if (ch != null) for (File c : ch) deleteDir(c);\n        }\n        f.delete();\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学"
        ]
      }
    ]
  },
  {
    "id": "p4-byte-stream",
    "title": "字节流",
    "description": "InputStream / OutputStream 家族详解",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p4-kp-stream-concept",
        "title": "InputStream / OutputStream 概念",
        "shortDesc": "字节流就像水管——数据一个字节一个字节地从源头流向目标",
        "deepPrinciple": "<p>Java IO 基于<strong>流</strong>抽象。InputStream 读数据到内存，OutputStream 写数据到外部。大量使用<strong>装饰器模式</strong>：FileInputStream 负责来源，BufferedInputStream 加缓冲。read() 返回 int（-1 表示结束）。</p>",
        "scenario": "文件下载：从磁盘读取（FileInputStream）通过网络发送（OutputStream）。",
        "codeExample": "import java.io.*;\n\npublic class StreamConceptDemo {\n    public static void main(String[] args) throws IOException {\n        // 写入\n        try (FileOutputStream fos = new FileOutputStream(\"demo.txt\")) {\n            fos.write(\"Hello, Java IO!\".getBytes(\"UTF-8\"));\n            fos.flush();\n        }\n        // 批量读取（推荐）\n        try (FileInputStream fis = new FileInputStream(\"demo.txt\")) {\n            byte[] buf = new byte[1024];\n            int len = fis.read(buf);\n            System.out.println(new String(buf, 0, len, \"UTF-8\"));\n        }\n        new File(\"demo.txt\").delete();\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p4-kp-file-copy",
        "title": "FileInputStream / FileOutputStream 文件复制",
        "shortDesc": "文件字节流——一头接文件，一头接程序",
        "deepPrinciple": "<p>关键细节：</p><ul><li><code>new FileOutputStream(\"file\", true)</code> 追加写入</li><li>大文件必须用 buffer（8192 字节），逐字节极慢</li><li>图片等二进制文件必须用字节流</li></ul>",
        "scenario": "将上传的图片从临时目录复制到正式存储目录。",
        "codeExample": "import java.io.*;\n\npublic class FileCopyDemo {\n    public static void main(String[] args) throws IOException {\n        // 缓冲区复制（推荐写法）\n        try (\n            FileInputStream fis = new FileInputStream(\"source.dat\");\n            FileOutputStream fos = new FileOutputStream(\"target.dat\")\n        ) {\n            byte[] buf = new byte[8192]; // 8KB 缓冲区\n            int len;\n            while ((len = fis.read(buf)) != -1) {\n                fos.write(buf, 0, len); // 只写有效数据\n            }\n        }\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p4-kp-buffered-stream",
        "title": "BufferedInputStream 缓冲流",
        "shortDesc": "缓冲流像快递集中配送——攒一批再发，效率高得多",
        "deepPrinciple": "<p><code>BufferedInputStream</code> 是<strong>装饰器模式</strong>，内部 8192 字节缓冲区。首次 read 批量读到缓冲区，后续从缓冲区取，将系统调用减少到 1/8192。</p><p>BufferedOutputStream 攒满或 flush() 时才写入磁盘。实际开发中几乎所有文件流都要套缓冲流。</p>",
        "scenario": "500MB 日志文件，加 BufferedInputStream 从 30 秒降到 2 秒。",
        "codeExample": "import java.io.*;\n\npublic class BufferedStreamDemo {\n    public static void main(String[] args) throws IOException {\n        try (\n            BufferedInputStream bis = new BufferedInputStream(\n                new FileInputStream(\"source.dat\"), 8192);\n            BufferedOutputStream bos = new BufferedOutputStream(\n                new FileOutputStream(\"target.dat\"), 8192)\n        ) {\n            byte[] buf = new byte[8192];\n            int len;\n            while ((len = bis.read(buf)) != -1) {\n                bos.write(buf, 0, len);\n            }\n        } // 自动 flush + close\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      }
    ]
  },
  {
    "id": "p4-char-stream",
    "title": "字符流",
    "description": "Reader / Writer 家族与编码转换",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p4-kp-reader-writer",
        "title": "Reader / Writer 概念",
        "shortDesc": "字符流是处理文本的\"翻译官\"——把字节翻译成人类可读的字符",
        "deepPrinciple": "<p>字节流以字节为单位，字符流以字符为单位，内部做<strong>编码/解码</strong>。中文 UTF-8 占 3 字节，字节流 buffer 截断会乱码；字符流保证返回完整字符。</p><p><strong>文本文件</strong>用字符流，<strong>二进制文件</strong>用字节流。</p>",
        "scenario": "读取中文配置文件用 FileInputStream 逐字节容易乱码，改用 FileReader 解决。",
        "codeExample": "import java.io.*;\n\npublic class ReaderWriterDemo {\n    public static void main(String[] args) throws IOException {\n        try (FileWriter fw = new FileWriter(\"text.txt\")) {\n            fw.write(\"你好，Java 字符流!\\n第二行。\");\n        }\n        try (FileReader fr = new FileReader(\"text.txt\")) {\n            char[] buf = new char[1024];\n            int len = fr.read(buf);\n            System.out.println(new String(buf, 0, len));\n        }\n        new File(\"text.txt\").delete();\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p4-kp-buffered-reader",
        "title": "FileReader / BufferedReader",
        "shortDesc": "BufferedReader.readLine() 是逐行读取文本的最佳利器",
        "deepPrinciple": "<p><code>readLine()</code> 遇换行返回该行（不含换行符），流末尾返回 null，空行返回 \"\"。</p><p>Java 8 的 <code>lines()</code> 返回 Stream&lt;String&gt;，配合 Stream API 做函数式处理。</p>",
        "scenario": "解析 CSV：readLine() 逐行读取，split(\",\") 拆分字段。",
        "codeExample": "import java.io.*;\n\npublic class BufferedReaderDemo {\n    public static void main(String[] args) throws IOException {\n        try (BufferedWriter bw = new BufferedWriter(new FileWriter(\"data.csv\"))) {\n            bw.write(\"姓名,年龄,成绩\\n张三,20,95.5\\n李四,21,88.0\\n\");\n        }\n\n        // 逐行读取\n        try (BufferedReader br = new BufferedReader(new FileReader(\"data.csv\"))) {\n            String line;\n            boolean header = true;\n            while ((line = br.readLine()) != null) {\n                if (header) { header = false; continue; }\n                String[] f = line.split(\",\");\n                System.out.printf(\"学生: %s, 成绩: %s%n\", f[0], f[2]);\n            }\n        }\n\n        // Stream API 计算平均分\n        try (BufferedReader br = new BufferedReader(new FileReader(\"data.csv\"))) {\n            double avg = br.lines().skip(1)\n                .mapToDouble(l -> Double.parseDouble(l.split(\",\")[2]))\n                .average().orElse(0);\n            System.out.printf(\"平均分: %.1f%n\", avg);\n        }\n        new File(\"data.csv\").delete();\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p4-kp-input-stream-reader",
        "title": "InputStreamReader 转换流",
        "shortDesc": "转换流是字节与字符世界的\"翻译桥梁\"——指定编码，杜绝乱码",
        "deepPrinciple": "<p><code>InputStreamReader</code> 将字节流按指定编码解码为字符。FileReader 用平台默认编码（Windows GBK、Linux UTF-8），跨平台可能乱码。</p><p>建议始终使用 <code>new InputStreamReader(stream, StandardCharsets.UTF_8)</code>。</p>",
        "scenario": "读取银行 GBK 编码对账文件，UTF-8 服务器上必须指定 GBK 编码。",
        "codeExample": "import java.io.*;\nimport java.nio.charset.StandardCharsets;\n\npublic class InputStreamReaderDemo {\n    public static void main(String[] args) throws IOException {\n        String text = \"你好世界\";\n        // GBK 写入\n        try (OutputStreamWriter w = new OutputStreamWriter(\n                new FileOutputStream(\"gbk.txt\"), \"GBK\")) { w.write(text); }\n\n        // 正确读 GBK\n        try (BufferedReader br = new BufferedReader(new InputStreamReader(\n                new FileInputStream(\"gbk.txt\"), \"GBK\"))) {\n            System.out.println(\"正确: \" + br.readLine());\n        }\n        // 编码不匹配 -> 乱码\n        try (BufferedReader br = new BufferedReader(new InputStreamReader(\n                new FileInputStream(\"gbk.txt\"), StandardCharsets.UTF_8))) {\n            System.out.println(\"乱码: \" + br.readLine());\n        }\n        new File(\"gbk.txt\").delete();\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学"
        ]
      }
    ]
  },
  {
    "id": "p4-serialization-nio",
    "title": "序列化与 NIO",
    "description": "对象序列化机制与 NIO 入门",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p4-kp-serializable",
        "title": "Serializable 接口",
        "shortDesc": "序列化就像把立体模型压成扁平快递包裹——方便传输，到目的地再还原",
        "deepPrinciple": "<p>序列化：对象 -> 字节；反序列化：字节 -> 对象。实现 <code>Serializable</code>（标记接口），用 ObjectOutputStream/ObjectInputStream。规则：属性也必须可序列化；transient 字段不参与；静态字段不序列化。</p>",
        "scenario": "分布式系统中将 UserSession 序列化存 Redis，其他服务器反序列化恢复登录状态。",
        "codeExample": "import java.io.*;\n\nclass Student implements Serializable {\n    private static final long serialVersionUID = 1L;\n    private String name;\n    private int age;\n    private transient String password; // 不序列化\n\n    public Student(String n, int a, String p) { name=n; age=a; password=p; }\n    public String getPassword() { return password; }\n    public String toString() { return \"Student{\" + name + \",\" + age + \"}\"; }\n}\n\npublic class SerializationDemo {\n    public static void main(String[] args) throws Exception {\n        Student stu = new Student(\"张三\", 20, \"secret\");\n        try (ObjectOutputStream oos = new ObjectOutputStream(\n                new FileOutputStream(\"stu.ser\"))) { oos.writeObject(stu); }\n        try (ObjectInputStream ois = new ObjectInputStream(\n                new FileInputStream(\"stu.ser\"))) {\n            Student r = (Student) ois.readObject();\n            System.out.println(r);\n            System.out.println(\"密码(transient): \" + r.getPassword()); // null\n        }\n        new File(\"stu.ser\").delete();\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p4-kp-transient-uid",
        "title": "transient 与 serialVersionUID",
        "shortDesc": "transient 是\"免检通行证\"，serialVersionUID 是版本\"身份证号\"",
        "deepPrinciple": "<p><strong>transient</strong>：敏感信息、可计算衍生值、不可序列化引用不参与序列化。</p><p><strong>serialVersionUID</strong>：验证类兼容性。不显式定义时 JVM 自动生成（<strong>极不稳定</strong>）。不一致抛 InvalidClassException。<strong>强烈建议</strong>显式定义。新增字段向前兼容（旧数据新字段取默认值）。</p>",
        "scenario": "线上升级 User 类新增 email，没有显式 UID 导致缓存数据全部失效。\n显式定义后旧数据 email 为 null，系统正常。",
        "codeExample": "import java.io.*;\n\nclass UserSession implements Serializable {\n    private static final long serialVersionUID = 1L; // 显式定义!\n    private String userId;\n    private transient String token;      // 安全信息不序列化\n    private transient String cachedData; // 缓存数据不序列化\n\n    public UserSession(String id, String tk) { userId = id; token = tk; }\n    public String getUserId() { return userId; }\n    public String getToken() { return token; }\n}\n\npublic class TransientDemo {\n    public static void main(String[] args) throws Exception {\n        UserSession s = new UserSession(\"u001\", \"tk_abc\");\n        ByteArrayOutputStream baos = new ByteArrayOutputStream();\n        try (ObjectOutputStream oos = new ObjectOutputStream(baos)) { oos.writeObject(s); }\n        try (ObjectInputStream ois = new ObjectInputStream(\n                new ByteArrayInputStream(baos.toByteArray()))) {\n            UserSession r = (UserSession) ois.readObject();\n            System.out.println(\"userId: \" + r.getUserId());  // u001\n            System.out.println(\"token: \" + r.getToken());    // null\n        }\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "必学"
        ]
      },
      {
        "id": "p4-kp-nio-concept",
        "title": "NIO Buffer / Channel 概念",
        "shortDesc": "传统 IO 像排队打水；NIO 像自助饮水机——多人同时取水",
        "deepPrinciple": "<p>NIO 三大核心：</p><ul><li><strong>Buffer</strong>：数据容器，capacity/position/limit，flip() 切换读写模式</li><li><strong>Channel</strong>：双向管道，通过 Buffer 读写数据</li><li><strong>Selector</strong>：单线程管理多 Channel，IO 多路复用</li></ul><p>传统 IO 面向流/阻塞/单向；NIO 面向缓冲区/可非阻塞/双向。Netty 底层就是 NIO。</p>",
        "scenario": "聊天服务器 10000 连接，传统 IO 需 10000 线程，NIO 用 1 个 Selector 线程搞定。",
        "codeExample": "import java.nio.ByteBuffer;\nimport java.nio.channels.FileChannel;\nimport java.nio.file.*;\n\npublic class NioBasicDemo {\n    public static void main(String[] args) throws Exception {\n        // Buffer 操作\n        ByteBuffer buf = ByteBuffer.allocate(16);\n        buf.put(\"Hello\".getBytes());\n        buf.flip(); // 切换读模式\n        byte[] data = new byte[buf.remaining()];\n        buf.get(data);\n        System.out.println(\"读到: \" + new String(data));\n\n        // FileChannel 文件读写\n        Path path = Path.of(\"nio.txt\");\n        try (FileChannel wc = FileChannel.open(path,\n                StandardOpenOption.CREATE, StandardOpenOption.WRITE)) {\n            wc.write(ByteBuffer.wrap(\"NIO 读写!\".getBytes(\"UTF-8\")));\n        }\n        try (FileChannel rc = FileChannel.open(path, StandardOpenOption.READ)) {\n            ByteBuffer rb = ByteBuffer.allocate(1024);\n            int len = rc.read(rb);\n            rb.flip();\n            System.out.println(new String(rb.array(), 0, len, \"UTF-8\"));\n        }\n        Files.deleteIfExists(path);\n    }\n}",
        "estimatedMinutes": 35,
        "tags": [
          "进阶",
          "了解"
        ]
      }
    ]
  }
];

export const phase5Topics = [
  {
    "id": "p5-thread-creation",
    "title": "线程创建",
    "description": "掌握创建线程的两种基本方式",
    "estimatedHours": 1,
    "knowledgePoints": [
      {
        "id": "p5-kp-thread-class",
        "title": "Thread 类创建线程",
        "shortDesc": "继承 Thread 就像亲自当快递员——自己既是线程又是任务",
        "deepPrinciple": "<p>继承 Thread 重写 run() 定义任务，start() 启动线程。</p><ul><li>start() 创建新系统线程；直接调 run() 只是普通方法调用</li><li>同一 Thread 对象只能 start() 一次</li></ul><p>缺点：Java 单继承，灵活性差。</p>",
        "scenario": "简单的后台监控线程每隔几秒检查服务器状态。",
        "codeExample": "public class ThreadClassDemo {\n    public static void main(String[] args) throws InterruptedException {\n        Thread t = new Thread(\"下载线程\") {\n            @Override\n            public void run() {\n                System.out.println(getName() + \" 开始下载\");\n                try { Thread.sleep(500); } catch (InterruptedException e) { return; }\n                System.out.println(getName() + \" 下载完成\");\n            }\n        };\n        t.start(); // 启动新线程\n        // t.run(); // 错误! 这只是普通方法调用\n        System.out.println(\"主线程继续执行\");\n        t.join(); // 等待子线程完成\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p5-kp-runnable",
        "title": "Runnable 接口与两种方式对比",
        "shortDesc": "Runnable 像雇佣快递员——任务和执行者分离，更灵活",
        "deepPrinciple": "<p>Runnable 将任务与执行者分离，符合<strong>组合优于继承</strong>。同一任务可交多个线程或线程池。Java 8 后可用 Lambda。</p><p>Callable 比 Runnable 多了返回值和抛异常能力，配合 FutureTask 使用。</p>",
        "scenario": "Web 服务器每个请求封装为 Runnable 提交给线程池，任务和线程解耦。",
        "codeExample": "import java.util.concurrent.*;\n\npublic class RunnableDemo {\n    public static void main(String[] args) throws Exception {\n        // Lambda 写法（推荐）\n        Thread t = new Thread(() -> System.out.println(\n            Thread.currentThread().getName() + \" 执行\"), \"Lambda线程\");\n        t.start();\n\n        // 同一任务给多个线程\n        Runnable task = () -> System.out.println(\n            Thread.currentThread().getName() + \" 共享任务\");\n        new Thread(task, \"A\").start();\n        new Thread(task, \"B\").start();\n\n        // Callable 有返回值\n        FutureTask<Integer> future = new FutureTask<>(() -> { Thread.sleep(200); return 42; });\n        new Thread(future).start();\n        System.out.println(\"Callable 返回: \" + future.get()); // 阻塞等待结果\n        t.join();\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学"
        ]
      }
    ]
  },
  {
    "id": "p5-thread-lifecycle",
    "title": "线程生命周期",
    "description": "理解线程六种状态及其转换",
    "estimatedHours": 1,
    "knowledgePoints": [
      {
        "id": "p5-kp-thread-states",
        "title": "线程六种状态",
        "shortDesc": "线程的一生：NEW -> RUNNABLE -> BLOCKED -> WAITING -> TIMED_WAITING -> TERMINATED",
        "deepPrinciple": "<p>Thread.State 枚举 6 种状态：</p><ul><li><strong>NEW</strong>：创建后 start() 前</li><li><strong>RUNNABLE</strong>：start() 后（含就绪和运行中）</li><li><strong>BLOCKED</strong>：等待 synchronized 锁</li><li><strong>WAITING</strong>：wait()/join()/park() 无限期等待</li><li><strong>TIMED_WAITING</strong>：sleep(ms)/wait(ms) 有限期等待</li><li><strong>TERMINATED</strong>：run() 结束</li></ul><p>BLOCKED 是被动等锁，WAITING 是主动等通知。</p>",
        "scenario": "线上大量线程 BLOCKED 说明锁竞争或死锁，jstack 查看状态定位瓶颈。",
        "codeExample": "public class ThreadStateDemo {\n    private static final Object LOCK = new Object();\n    public static void main(String[] args) throws InterruptedException {\n        Thread t = new Thread(() -> {\n            try { Thread.sleep(1000); } catch (InterruptedException e) { }\n        });\n        System.out.println(\"创建后: \" + t.getState());  // NEW\n        t.start();\n        Thread.sleep(50);\n        System.out.println(\"sleep中: \" + t.getState()); // TIMED_WAITING\n        t.join();\n        System.out.println(\"结束后: \" + t.getState());  // TERMINATED\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学",
          "面试"
        ]
      },
      {
        "id": "p5-kp-state-transition",
        "title": "状态转换触发条件",
        "shortDesc": "每个状态转换都有明确的触发动作——什么信号走什么路",
        "deepPrinciple": "<p>核心转换：</p><ul><li>NEW->RUNNABLE: start()</li><li>RUNNABLE->BLOCKED: 争抢 synchronized 锁失败</li><li>RUNNABLE->WAITING: wait()/join()/park()</li><li>RUNNABLE->TIMED_WAITING: sleep(ms)/wait(ms)</li><li>WAITING->RUNNABLE: notify()（需重新竞争锁，可能先 BLOCKED）</li><li>RUNNABLE->TERMINATED: run() 结束或未捕获异常</li></ul>",
        "scenario": "多线程下载器：主线程 join() 进入 WAITING，下载线程全部 TERMINATED 后恢复合并文件。",
        "codeExample": "public class StateTransitionDemo {\n    private static final Object MON = new Object();\n    public static void main(String[] args) throws InterruptedException {\n        Thread w = new Thread(() -> {\n            synchronized (MON) {\n                try { MON.wait(); } catch (InterruptedException e) { return; }\n            }\n            try { Thread.sleep(300); } catch (InterruptedException e) { }\n        });\n        System.out.println(\"NEW: \" + w.getState());\n        w.start(); Thread.sleep(50);\n        System.out.println(\"WAITING: \" + w.getState());\n        synchronized (MON) { MON.notify(); }\n        Thread.sleep(50);\n        System.out.println(\"TIMED_WAITING: \" + w.getState());\n        w.join();\n        System.out.println(\"TERMINATED: \" + w.getState());\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "面试"
        ]
      }
    ]
  },
  {
    "id": "p5-synchronized",
    "title": "synchronized",
    "description": "内置锁机制与线程通信",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p5-kp-object-lock",
        "title": "对象锁",
        "shortDesc": "对象锁就像洗手间门锁——同一时刻只能一个人用",
        "deepPrinciple": "<p>synchronized 保证同一时刻只有一个线程执行临界区。两种形式：同步方法（锁 this）和同步代码块（锁指定对象）。底层通过对象头 Monitor 实现，JDK 6 后有偏向锁/轻量级锁/重量级锁优化。</p>",
        "scenario": "银行转账多线程操作同一账户余额，不加锁数据不一致。",
        "codeExample": "public class SynchronizedDemo {\n    static int count = 0;\n    static final Object LOCK = new Object();\n\n    public static void main(String[] args) throws InterruptedException {\n        Thread t1 = new Thread(() -> {\n            for (int i = 0; i < 100000; i++) synchronized (LOCK) { count++; }\n        });\n        Thread t2 = new Thread(() -> {\n            for (int i = 0; i < 100000; i++) synchronized (LOCK) { count++; }\n        });\n        t1.start(); t2.start(); t1.join(); t2.join();\n        System.out.println(\"count: \" + count + \" (期望 200000)\");\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p5-kp-class-lock",
        "title": "类锁（synchronized static）",
        "shortDesc": "类锁是全班共用的黑板——不管几个实例，同一时刻只有一个人能写",
        "deepPrinciple": "<p>synchronized static 或 synchronized(Xxx.class) 锁 Class 对象，全实例互斥。对象锁和类锁<strong>独立</strong>：持有对象锁不影响获取类锁。</p>",
        "scenario": "全局 ID 生成器用 static synchronized 保证唯一性。",
        "codeExample": "public class ClassLockDemo {\n    private static int globalCount = 0;\n\n    public static synchronized void increment() { globalCount++; }\n\n    public static void main(String[] args) throws InterruptedException {\n        Thread t1 = new Thread(() -> { for (int i = 0; i < 10000; i++) increment(); });\n        Thread t2 = new Thread(() -> { for (int i = 0; i < 10000; i++) increment(); });\n        t1.start(); t2.start(); t1.join(); t2.join();\n        System.out.println(\"类锁计数: \" + globalCount + \" (期望 20000)\");\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p5-kp-wait-notify",
        "title": "wait / notify / notifyAll",
        "shortDesc": "wait/notify 是线程间的对讲机——\"我等着\" / \"好了继续\"",
        "deepPrinciple": "<p>Object 方法，必须在 synchronized 块中调用。wait() 释放锁进入 WAITING；notify() 随机唤醒一个；notifyAll() 唤醒所有（推荐）。<strong>虚假唤醒</strong>：wait 必须放在 while 循环中。</p>",
        "scenario": "生产者-消费者模型：厨师 notify 服务员，队列满时厨师 wait。",
        "codeExample": "import java.util.*;\n\npublic class WaitNotifyDemo {\n    private static final int MAX = 5;\n    private static final Queue<Integer> queue = new LinkedList<>();\n\n    public static void main(String[] args) {\n        new Thread(() -> {\n            for (int i = 1; i <= 10; i++) synchronized (queue) {\n                while (queue.size() >= MAX)\n                    try { queue.wait(); } catch (InterruptedException e) { return; }\n                queue.offer(i);\n                System.out.println(\"生产: \" + i + \" | \" + queue);\n                queue.notifyAll();\n            }\n        }, \"生产者\").start();\n\n        new Thread(() -> {\n            for (int i = 0; i < 10; i++) synchronized (queue) {\n                while (queue.isEmpty())\n                    try { queue.wait(); } catch (InterruptedException e) { return; }\n                System.out.println(\"消费: \" + queue.poll() + \" | \" + queue);\n                queue.notifyAll();\n            }\n        }, \"消费者\").start();\n    }\n}",
        "estimatedMinutes": 35,
        "tags": [
          "基础",
          "必学",
          "面试"
        ]
      }
    ]
  },
  {
    "id": "p5-volatile",
    "title": "volatile",
    "description": "轻量级同步机制",
    "estimatedHours": 1,
    "knowledgePoints": [
      {
        "id": "p5-kp-visibility",
        "title": "内存可见性与禁止指令重排",
        "shortDesc": "volatile 像公告板——写了之后所有人立刻能看到最新值",
        "deepPrinciple": "<p>volatile 两个保证：<strong>可见性</strong>（修改后其他线程立即看到，强制从主内存读）；<strong>禁止重排</strong>（通过内存屏障防止指令重排序，DCL 单例必需）。</p>",
        "scenario": "标志位控制线程停止，不加 volatile 子线程可能永远读到缓存旧值无法停止。",
        "codeExample": "public class VolatileDemo {\n    private static volatile boolean running = true;\n\n    public static void main(String[] args) throws InterruptedException {\n        Thread t = new Thread(() -> {\n            int count = 0;\n            while (running) count++; // 每次从主内存读\n            System.out.println(\"停止，循环 \" + count + \" 次\");\n        });\n        t.start();\n        Thread.sleep(100);\n        running = false; // 子线程立即可见\n        t.join();\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "进阶",
          "必学",
          "面试"
        ]
      },
      {
        "id": "p5-kp-volatile-no-atomic",
        "title": "volatile 不保证原子性",
        "shortDesc": "volatile 保证看到最新值，但 i++ 的\"读-改-写\"不是一气呵成",
        "deepPrinciple": "<p>i++ 含读/计算/写三步，多线程丢失更新。解决：synchronized 或 AtomicInteger（基于 CAS 无锁，性能更好）。volatile 适用：状态标志、DCL 单例；不适用：计数器。</p>",
        "scenario": "volatile int count 做访问计数器，并发后不准确。改用 AtomicInteger。",
        "codeExample": "import java.util.concurrent.atomic.AtomicInteger;\n\npublic class VolatileAtomicDemo {\n    private static volatile int vCount = 0;\n    private static AtomicInteger aCount = new AtomicInteger(0);\n\n    public static void main(String[] args) throws InterruptedException {\n        Thread[] ts = new Thread[10];\n        for (int i = 0; i < 10; i++) {\n            ts[i] = new Thread(() -> {\n                for (int j = 0; j < 10000; j++) {\n                    vCount++;                   // 非原子!\n                    aCount.incrementAndGet();    // 原子\n                }\n            });\n            ts[i].start();\n        }\n        for (Thread t : ts) t.join();\n        System.out.println(\"volatile: \" + vCount + \" (可能<100000)\");\n        System.out.println(\"Atomic:   \" + aCount.get() + \" (精确100000)\");\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "必学",
          "面试"
        ]
      }
    ]
  },
  {
    "id": "p5-thread-pool",
    "title": "线程池",
    "description": "ThreadPoolExecutor 核心参数与工作流程",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p5-kp-pool-params",
        "title": "ThreadPoolExecutor 核心参数",
        "shortDesc": "线程池像餐厅——核心员工、临时工、等候区、拒客策略",
        "deepPrinciple": "<p>7 个核心参数：<strong>corePoolSize</strong>（核心线程，空闲不回收）、<strong>maximumPoolSize</strong>（最大线程）、<strong>keepAliveTime+unit</strong>（临时线程存活时间）、<strong>workQueue</strong>（任务队列）、<strong>threadFactory</strong>（线程工厂）、<strong>handler</strong>（拒绝策略：AbortPolicy/CallerRunsPolicy/DiscardPolicy/DiscardOldestPolicy）。</p>",
        "scenario": "秒杀系统：core=20, max=50, 队列200, CallerRunsPolicy 限流。",
        "codeExample": "import java.util.concurrent.*;\n\npublic class ThreadPoolDemo {\n    public static void main(String[] args) {\n        ThreadPoolExecutor pool = new ThreadPoolExecutor(\n            2, 4, 60, TimeUnit.SECONDS,\n            new ArrayBlockingQueue<>(2),\n            r -> { Thread t = new Thread(r); t.setName(\"biz-\" + t.getId()); return t; },\n            new ThreadPoolExecutor.CallerRunsPolicy()\n        );\n        for (int i = 1; i <= 8; i++) {\n            final int id = i;\n            pool.execute(() -> {\n                System.out.printf(\"[%s] 任务%d%n\", Thread.currentThread().getName(), id);\n                try { Thread.sleep(1000); } catch (InterruptedException e) { }\n            });\n        }\n        pool.shutdown();\n    }\n}",
        "estimatedMinutes": 35,
        "tags": [
          "基础",
          "必学",
          "面试"
        ]
      },
      {
        "id": "p5-kp-pool-workflow",
        "title": "线程池工作流程",
        "shortDesc": "先找核心员工，核心忙了排队，队满招临时工，都满了拒绝",
        "deepPrinciple": "<p>提交流程：1.线程&lt;core：创建核心线程；2.core满+队列未满：入队；3.队列满+线程&lt;max：创建临时线程；4.都满：拒绝策略。CallerRunsPolicy 让提交者自己执行，有限流效果。</p>",
        "scenario": "core=2, max=4, queue=2，最多处理 6 个任务，第 7 个触发拒绝。",
        "codeExample": "import java.util.concurrent.*;\n\npublic class PoolWorkflowDemo {\n    public static void main(String[] args) throws InterruptedException {\n        ThreadPoolExecutor pool = new ThreadPoolExecutor(\n            2, 4, 60, TimeUnit.SECONDS,\n            new ArrayBlockingQueue<>(2),\n            new ThreadPoolExecutor.AbortPolicy());\n\n        for (int i = 1; i <= 7; i++) {\n            final int id = i;\n            try {\n                pool.execute(() -> {\n                    System.out.printf(\"任务%d [%s]%n\", id, Thread.currentThread().getName());\n                    try { Thread.sleep(2000); } catch (InterruptedException e) { }\n                });\n            } catch (RejectedExecutionException e) {\n                System.out.printf(\"任务%d 被拒绝!%n\", id);\n            }\n        }\n        pool.shutdown();\n        pool.awaitTermination(10, TimeUnit.SECONDS);\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学",
          "面试"
        ]
      },
      {
        "id": "p5-kp-pool-sizing",
        "title": "线程池大小设置原则",
        "shortDesc": "CPU 密集型 N+1，IO 密集型 2N——实际还得看压测",
        "deepPrinciple": "<p>N=CPU核心数。CPU密集型 N+1；IO密集型 2N 或 N/(1-阻塞比)。有界队列防 OOM；无界队列导致 max 失效。实际靠<strong>压测</strong>确定最优值。</p>",
        "scenario": "Web CRUD 应用（IO密集），4核服务器初始 core=8, max=16，压测调优。",
        "codeExample": "public class PoolSizingDemo {\n    public static void main(String[] args) {\n        int cores = Runtime.getRuntime().availableProcessors();\n        System.out.println(\"CPU 核心: \" + cores);\n        System.out.println(\"CPU密集型建议: \" + (cores + 1));\n        System.out.println(\"IO密集型建议: \" + (cores * 2) + \" ~ \" + (cores * 4));\n    }\n}",
        "estimatedMinutes": 20,
        "tags": [
          "进阶",
          "实战"
        ]
      }
    ]
  },
  {
    "id": "p5-executors",
    "title": "Executors 工具类",
    "description": "常见预置线程池",
    "estimatedHours": 1,
    "knowledgePoints": [
      {
        "id": "p5-kp-fixed-cached",
        "title": "newFixedThreadPool 与 newCachedThreadPool",
        "shortDesc": "Fixed 是固定编制，Cached 是随叫随到的零工队伍",
        "deepPrinciple": "<p><strong>FixedThreadPool</strong>：固定线程数+无界队列（风险：OOM）。<strong>CachedThreadPool</strong>：core=0,max=MAX_VALUE,60s回收（风险：线程过多）。阿里规范<strong>禁止用 Executors</strong>，要求用 ThreadPoolExecutor 明确参数。</p>",
        "scenario": "了解底层参数，面试说清区别和风险，实际用 ThreadPoolExecutor。",
        "codeExample": "import java.util.concurrent.*;\n\npublic class ExecutorsDemo {\n    public static void main(String[] args) throws Exception {\n        ExecutorService fixed = Executors.newFixedThreadPool(3);\n        for (int i = 0; i < 5; i++) {\n            final int id = i;\n            fixed.submit(() -> System.out.println(\"[Fixed] 任务\" + id));\n        }\n        ExecutorService cached = Executors.newCachedThreadPool();\n        for (int i = 0; i < 5; i++) {\n            final int id = i;\n            cached.submit(() -> System.out.println(\"[Cached] 任务\" + id));\n        }\n        fixed.shutdown(); cached.shutdown();\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p5-kp-scheduled-pool",
        "title": "newScheduledThreadPool",
        "shortDesc": "定时线程池——可以延迟执行或周期性重复",
        "deepPrinciple": "<p>三种调度：schedule(延迟一次)、scheduleAtFixedRate(固定频率，含执行时间)、scheduleWithFixedDelay(固定延迟，执行完等delay再执行)。比 Timer 更可靠。</p>",
        "scenario": "每 5 分钟清理过期缓存、每天凌晨生成报表。",
        "codeExample": "import java.util.concurrent.*;\nimport java.time.LocalTime;\n\npublic class ScheduledPoolDemo {\n    public static void main(String[] args) throws InterruptedException {\n        ScheduledExecutorService s = Executors.newScheduledThreadPool(2);\n        s.schedule(() -> System.out.println(\"[\" + LocalTime.now() + \"] 延迟1s\"),\n            1, TimeUnit.SECONDS);\n        ScheduledFuture<?> f = s.scheduleAtFixedRate(\n            () -> System.out.println(\"[\" + LocalTime.now() + \"] 每2s\"),\n            0, 2, TimeUnit.SECONDS);\n        Thread.sleep(5000);\n        f.cancel(false);\n        s.shutdown();\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "实战"
        ]
      }
    ]
  },
  {
    "id": "p5-lock",
    "title": "Lock 接口",
    "description": "显式锁与高级同步",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p5-kp-reentrant-lock",
        "title": "ReentrantLock 可重入锁",
        "shortDesc": "synchronized 的升级版——可尝试加锁、限时等待、可中断",
        "deepPrinciple": "<p>优势：可中断(lockInterruptibly)、可超时(tryLock(timeout))、可尝试(tryLock())、公平锁(new ReentrantLock(true))。<strong>必须 finally unlock()</strong>！</p>",
        "scenario": "秒杀中 tryLock 获取失败立即返回\"请稍后重试\"，避免大量阻塞。",
        "codeExample": "import java.util.concurrent.locks.ReentrantLock;\n\npublic class ReentrantLockDemo {\n    private static final ReentrantLock lock = new ReentrantLock();\n    private static int count = 0;\n\n    public static void main(String[] args) throws InterruptedException {\n        Thread t1 = new Thread(() -> {\n            for (int i = 0; i < 10000; i++) {\n                lock.lock();\n                try { count++; } finally { lock.unlock(); }\n            }\n        });\n        Thread t2 = new Thread(() -> {\n            for (int i = 0; i < 10000; i++) {\n                lock.lock();\n                try { count++; } finally { lock.unlock(); }\n            }\n        });\n        t1.start(); t2.start(); t1.join(); t2.join();\n        System.out.println(\"count: \" + count + \" (期望 20000)\");\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "进阶",
          "必学"
        ]
      },
      {
        "id": "p5-kp-condition",
        "title": "Condition（await/signal）",
        "shortDesc": "Condition 是 wait/notify 的升级版——一把锁可以有多个等待队列",
        "deepPrinciple": "<p>Condition 绑定 Lock，提供 await()/signal()/signalAll()。优势：一把锁创建<strong>多个 Condition</strong>，精确唤醒特定等待队列。</p>",
        "scenario": "生产者消费者中，notFull 唤醒生产者，notEmpty 唤醒消费者。",
        "codeExample": "import java.util.*;\nimport java.util.concurrent.locks.*;\n\npublic class ConditionDemo {\n    private static final Lock lock = new ReentrantLock();\n    private static final Condition notFull = lock.newCondition();\n    private static final Condition notEmpty = lock.newCondition();\n    private static final Queue<Integer> queue = new LinkedList<>();\n\n    public static void main(String[] args) {\n        new Thread(() -> {\n            for (int i = 1; i <= 10; i++) {\n                lock.lock();\n                try {\n                    while (queue.size() >= 5) notFull.await();\n                    queue.offer(i);\n                    System.out.println(\"生产: \" + i);\n                    notEmpty.signal();\n                } catch (InterruptedException e) { return;\n                } finally { lock.unlock(); }\n            }\n        }).start();\n\n        new Thread(() -> {\n            for (int i = 0; i < 10; i++) {\n                lock.lock();\n                try {\n                    while (queue.isEmpty()) notEmpty.await();\n                    System.out.println(\"消费: \" + queue.poll());\n                    notFull.signal();\n                } catch (InterruptedException e) { return;\n                } finally { lock.unlock(); }\n            }\n        }).start();\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "进阶",
          "必学"
        ]
      },
      {
        "id": "p5-kp-rwlock",
        "title": "读写锁 ReadWriteLock",
        "shortDesc": "读读不互斥，读写/写写互斥——多读少写场景性能翻倍",
        "deepPrinciple": "<p>ReentrantReadWriteLock：读锁（共享，多线程同时持有）、写锁（排它，独占）。适合<strong>读多写少</strong>场景（如配置缓存）。</p>",
        "scenario": "配置缓存：大量读（读锁），偶尔更新（写锁）。",
        "codeExample": "import java.util.*;\nimport java.util.concurrent.locks.ReentrantReadWriteLock;\n\npublic class ReadWriteLockDemo {\n    private static final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();\n    private static final Map<String, String> cache = new HashMap<>();\n\n    public static String get(String key) {\n        rwLock.readLock().lock();\n        try { return cache.get(key); } finally { rwLock.readLock().unlock(); }\n    }\n    public static void put(String key, String val) {\n        rwLock.writeLock().lock();\n        try { cache.put(key, val); } finally { rwLock.writeLock().unlock(); }\n    }\n\n    public static void main(String[] args) throws InterruptedException {\n        put(\"name\", \"Java\");\n        for (int i = 0; i < 5; i++)\n            new Thread(() -> System.out.println(\n                Thread.currentThread().getName() + \" 读: \" + get(\"name\")\n            ), \"Reader-\" + i).start();\n        Thread.sleep(200);\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "实战"
        ]
      }
    ]
  },
  {
    "id": "p5-concurrent-collections",
    "title": "并发集合",
    "description": "ConcurrentHashMap 与 CopyOnWriteArrayList",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p5-kp-concurrent-hashmap",
        "title": "ConcurrentHashMap 原理",
        "shortDesc": "HashMap 的线程安全版——JDK7 分段锁，JDK8 CAS+synchronized",
        "deepPrinciple": "<p>JDK7 分段锁（Segment），每段独立加锁。JDK8 取消分段锁，改用 <strong>CAS+synchronized</strong> 锁单个桶头节点+红黑树。比 Hashtable（全表锁）性能高得多。</p>",
        "scenario": "多线程统计词频，HashMap 丢失更新，ConcurrentHashMap 安全高效。",
        "codeExample": "import java.util.concurrent.*;\n\npublic class ConcurrentHashMapDemo {\n    public static void main(String[] args) throws InterruptedException {\n        ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();\n        String[] words = {\"java\", \"python\", \"java\", \"go\", \"java\", \"python\"};\n\n        Thread t1 = new Thread(() -> { for (String w : words) map.merge(w, 1, Integer::sum); });\n        Thread t2 = new Thread(() -> { for (String w : words) map.merge(w, 1, Integer::sum); });\n        t1.start(); t2.start(); t1.join(); t2.join();\n        System.out.println(\"词频: \" + map);\n    }\n}",
        "estimatedMinutes": 35,
        "tags": [
          "进阶",
          "必学",
          "面试"
        ]
      },
      {
        "id": "p5-kp-copyonwrite",
        "title": "CopyOnWriteArrayList 写时复制",
        "shortDesc": "写时复制一份新数组修改，读不加锁——读多写少的最优解",
        "deepPrinciple": "<p>每次修改<strong>复制底层数组</strong>，在新数组操作完替换引用。读完全无锁，迭代器不会 ConcurrentModificationException。缺点：写开销大，只适合<strong>读多写少</strong>。</p>",
        "scenario": "事件监听器列表：大量遍历触发事件，偶尔添加/移除监听器。",
        "codeExample": "import java.util.concurrent.CopyOnWriteArrayList;\n\npublic class CopyOnWriteDemo {\n    public static void main(String[] args) throws InterruptedException {\n        CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();\n        list.add(\"A\"); list.add(\"B\"); list.add(\"C\");\n\n        // 读线程遍历时不会 ConcurrentModificationException\n        Thread reader = new Thread(() -> {\n            for (String s : list) System.out.println(\"读: \" + s);\n        });\n        Thread writer = new Thread(() -> {\n            list.add(\"D\"); list.remove(\"B\");\n            System.out.println(\"写完: \" + list);\n        });\n        reader.start(); writer.start();\n        reader.join(); writer.join();\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "必学"
        ]
      },
      {
        "id": "p5-kp-blocking-queue",
        "title": "BlockingQueue 阻塞队列",
        "shortDesc": "阻塞队列是线程安全的\"传送带\"——满了生产者等，空了消费者等",
        "deepPrinciple": "<p>put() 满时阻塞，take() 空时阻塞。常用：ArrayBlockingQueue（有界）、LinkedBlockingQueue、SynchronousQueue（零容量）。是线程池 workQueue 的底层，也是生产者-消费者最优雅的实现。</p>",
        "scenario": "日志异步写入：业务线程 put 日志到队列，写线程 take 并写文件。",
        "codeExample": "import java.util.concurrent.*;\n\npublic class BlockingQueueDemo {\n    public static void main(String[] args) {\n        BlockingQueue<String> queue = new ArrayBlockingQueue<>(3);\n\n        new Thread(() -> {\n            for (String msg : new String[]{\"日志1\",\"日志2\",\"日志3\",\"日志4\",\"日志5\"}) {\n                try { queue.put(msg); System.out.println(\"生产: \" + msg); }\n                catch (InterruptedException e) { return; }\n            }\n        }).start();\n\n        new Thread(() -> {\n            for (int i = 0; i < 5; i++) {\n                try {\n                    System.out.println(\"消费: \" + queue.take());\n                    Thread.sleep(500);\n                } catch (InterruptedException e) { return; }\n            }\n        }).start();\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "必学"
        ]
      }
    ]
  },
  {
    "id": "p5-juc-tools",
    "title": "JUC 工具类",
    "description": "CountDownLatch、CyclicBarrier、Semaphore",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p5-kp-countdown-latch",
        "title": "CountDownLatch 倒计时门栓",
        "shortDesc": "像火箭发射倒计时——所有准备工作完成后才点火",
        "deepPrinciple": "<p>一次性计数器，countDown() 减1，await() 阻塞到零。<strong>不可重用</strong>。典型：主线程等 N 个子线程完成后汇总。</p>",
        "scenario": "并行查询多个微服务，全部返回后合并结果。",
        "codeExample": "import java.util.concurrent.CountDownLatch;\n\npublic class CountDownLatchDemo {\n    public static void main(String[] args) throws InterruptedException {\n        CountDownLatch latch = new CountDownLatch(3);\n        for (int i = 1; i <= 3; i++) {\n            final int id = i;\n            new Thread(() -> {\n                try { Thread.sleep((long)(Math.random() * 1000)); }\n                catch (InterruptedException e) { }\n                System.out.println(\"服务\" + id + \" 完成\");\n                latch.countDown();\n            }).start();\n        }\n        latch.await();\n        System.out.println(\"全部完成，合并结果\");\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "必学"
        ]
      },
      {
        "id": "p5-kp-cyclic-barrier",
        "title": "CyclicBarrier 循环栅栏",
        "shortDesc": "像旅游团集合点——人到齐了才出发，而且可以反复使用",
        "deepPrinciple": "<p>N 个线程互相等待到达屏障点，到齐后同时继续。<strong>可重用</strong>。可选 barrierAction。与 CountDownLatch 区别：CDL 一等多，CB 多等多且可复用。</p>",
        "scenario": "多线程分段计算，每段算完在屏障汇总，再开始下一轮。",
        "codeExample": "import java.util.concurrent.CyclicBarrier;\n\npublic class CyclicBarrierDemo {\n    public static void main(String[] args) {\n        CyclicBarrier barrier = new CyclicBarrier(3,\n            () -> System.out.println(\"--- 全部到达，开始下一轮! ---\"));\n        for (int i = 1; i <= 3; i++) {\n            final int id = i;\n            new Thread(() -> {\n                try {\n                    for (int r = 1; r <= 2; r++) {\n                        Thread.sleep((long)(Math.random() * 1000));\n                        System.out.println(\"选手\" + id + \" 第\" + r + \"轮完成\");\n                        barrier.await();\n                    }\n                } catch (Exception e) { e.printStackTrace(); }\n            }).start();\n        }\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "必学"
        ]
      },
      {
        "id": "p5-kp-semaphore",
        "title": "Semaphore 信号量",
        "shortDesc": "信号量像停车场——总共 N 个车位，满了就得等",
        "deepPrinciple": "<p>控制同时访问资源的线程数。acquire() 获取许可（无则阻塞），release() 释放。permits=1 等价互斥锁；permits=N 控制并发度。</p>",
        "scenario": "数据库连接池最多 10 个连接，用 Semaphore(10) 控制并发。",
        "codeExample": "import java.util.concurrent.Semaphore;\n\npublic class SemaphoreDemo {\n    public static void main(String[] args) {\n        Semaphore parking = new Semaphore(3);\n        for (int i = 1; i <= 6; i++) {\n            final int car = i;\n            new Thread(() -> {\n                try {\n                    parking.acquire();\n                    System.out.println(\"车\" + car + \" 停入 (剩余:\" + parking.availablePermits() + \")\");\n                    Thread.sleep(1000);\n                } catch (InterruptedException e) {\n                } finally { parking.release(); System.out.println(\"车\" + car + \" 离开\"); }\n            }).start();\n        }\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "必学"
        ]
      }
    ]
  },
  {
    "id": "p5-threadlocal",
    "title": "ThreadLocal",
    "description": "线程本地变量",
    "estimatedHours": 1,
    "knowledgePoints": [
      {
        "id": "p5-kp-threadlocal-principle",
        "title": "ThreadLocal 原理与使用场景",
        "shortDesc": "ThreadLocal 给每个线程一个专属储物柜——互不干扰",
        "deepPrinciple": "<p>每个 Thread 内有 ThreadLocalMap，key 是 ThreadLocal（弱引用），value 是存储值。典型场景：数据库连接/事务（线程独立连接）、用户上下文（请求级传递）、SimpleDateFormat（非线程安全）。</p>",
        "scenario": "Web 请求进入时存用户信息到 ThreadLocal，整个调用链无需层层传参即可获取。",
        "codeExample": "public class ThreadLocalDemo {\n    private static final ThreadLocal<String> userCtx = new ThreadLocal<>();\n\n    public static void main(String[] args) throws InterruptedException {\n        Runnable task = () -> {\n            try {\n                userCtx.set(Thread.currentThread().getName());\n                service(); // 整个调用链都能获取\n            } finally { userCtx.remove(); } // 必须清理!\n        };\n        Thread t1 = new Thread(task, \"用户A\"); Thread t2 = new Thread(task, \"用户B\");\n        t1.start(); t2.start(); t1.join(); t2.join();\n    }\n\n    static void service() {\n        System.out.println(\"  Service: \" + userCtx.get());\n        dao();\n    }\n    static void dao() {\n        System.out.println(\"  DAO: \" + userCtx.get());\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "进阶",
          "必学"
        ]
      },
      {
        "id": "p5-kp-threadlocal-leak",
        "title": "ThreadLocal 内存泄漏风险",
        "shortDesc": "用完不清理就像退房不还钥匙——线程池复用时看到上位房客数据",
        "deepPrinciple": "<p>ThreadLocalMap 的 key 是<strong>弱引用</strong>，GC 后 key 为 null 但 value 被强引用。线程池复用线程时这些孤儿 value 无法回收。<strong>解决：使用后必须 remove()</strong>，通常在 finally 中。不 remove 的后果：下个请求读到上个用户数据（越权漏洞）。</p>",
        "scenario": "线程池处理 HTTP 请求，ThreadLocal 存用户 ID。不 remove 下个请求可能读到上个用户 ID。",
        "codeExample": "import java.util.concurrent.*;\n\npublic class ThreadLocalLeakDemo {\n    private static final ThreadLocal<String> ctx = new ThreadLocal<>();\n\n    public static void main(String[] args) throws Exception {\n        ExecutorService pool = Executors.newFixedThreadPool(1);\n\n        // 请求1: 设置但没清理\n        pool.submit(() -> {\n            ctx.set(\"用户A的敏感数据\");\n            System.out.println(\"请求1: \" + ctx.get());\n            // 忘记 remove()!\n        }).get();\n\n        // 请求2: 复用同一线程，读到请求1的数据!\n        pool.submit(() -> System.out.println(\"请求2(泄漏): \" + ctx.get())).get();\n\n        // 正确写法\n        pool.submit(() -> {\n            try { ctx.set(\"用户B\"); System.out.println(\"请求3: \" + ctx.get()); }\n            finally { ctx.remove(); }\n        }).get();\n\n        pool.submit(() -> System.out.println(\"请求4(安全): \" + ctx.get())).get(); // null\n        pool.shutdown();\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "必学",
          "面试"
        ]
      }
    ]
  }
];

export const phase6Topics = [
  {
    "id": "p6-jvm-overview",
    "title": "JVM 架构概览",
    "description": "理解 JVM 的整体结构",
    "estimatedHours": 1,
    "knowledgePoints": [
      {
        "id": "p6-kp-jvm-arch",
        "title": "类加载器 → 运行时数据区 → 执行引擎",
        "shortDesc": "JVM 像一座工厂：原料入库(类加载) → 车间加工(数据区) → 产品输出(执行引擎)",
        "deepPrinciple": "<p>JVM 三大子系统：</p><ul><li><strong>类加载子系统</strong>：将 .class 加载到内存，经过验证、准备、解析、初始化</li><li><strong>运行时数据区</strong>：堆、栈、方法区、程序计数器、本地方法栈</li><li><strong>执行引擎</strong>：解释器逐行执行字节码；JIT 编译器将热点代码编译为本地机器码</li></ul><p>Java 跨平台的秘密：源码编译为字节码（.class），不同平台的 JVM 将字节码翻译为对应机器码。</p>",
        "scenario": "理解 JVM 架构是学习内存模型、GC、调优的基础。面试必问\"说说 JVM 的组成\"。",
        "codeExample": "public class JvmArchDemo {\n    public static void main(String[] args) {\n        Runtime rt = Runtime.getRuntime();\n        System.out.println(\"JVM: \" + System.getProperty(\"java.vm.name\"));\n        System.out.println(\"版本: \" + System.getProperty(\"java.vm.version\"));\n        System.out.println(\"CPU核心: \" + rt.availableProcessors());\n        System.out.println(\"最大堆: \" + rt.maxMemory() / 1024 / 1024 + \"MB\");\n        System.out.println(\"当前堆: \" + rt.totalMemory() / 1024 / 1024 + \"MB\");\n        System.out.println(\"空闲堆: \" + rt.freeMemory() / 1024 / 1024 + \"MB\");\n\n        // 类加载器层级\n        ClassLoader cl = JvmArchDemo.class.getClassLoader();\n        while (cl != null) { System.out.println(\"ClassLoader: \" + cl); cl = cl.getParent(); }\n        System.out.println(\"ClassLoader: Bootstrap (null)\");\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p6-kp-hotspot",
        "title": "HotSpot JVM 特性",
        "shortDesc": "HotSpot 的名字来源——它能找到代码中的\"热点\"并优化",
        "deepPrinciple": "<p>HotSpot 是 Oracle/OpenJDK 默认 JVM。核心技术：</p><ul><li><strong>JIT 编译</strong>：C1（快速编译）和 C2（深度优化）</li><li><strong>分层编译</strong>：解释器快速启动 → C1 → C2 深度优化热点方法</li><li><strong>逃逸分析</strong>：未逃逸对象可栈上分配或标量替换，减少 GC 压力</li></ul><p>这解释了为什么 Java 启动慢但跑起来快，基准测试需要预热。</p>",
        "scenario": "了解 JIT 编译能解释：为什么 Java 基准测试需要预热，第一次请求慢后续快。",
        "codeExample": "// 运行参数: -XX:+PrintCompilation 可观察 JIT 编译\npublic class HotSpotDemo {\n    public static void main(String[] args) {\n        long sum = 0;\n        long start = System.nanoTime();\n        for (int i = 0; i < 100_000_000; i++) {\n            sum += calculate(i); // 此方法会被 JIT 编译为机器码\n        }\n        System.out.println(\"结果: \" + sum);\n        System.out.println(\"耗时: \" + (System.nanoTime() - start) / 1_000_000 + \"ms\");\n        System.out.println(\"JIT: \" + System.getProperty(\"java.vm.info\"));\n    }\n\n    static int calculate(int n) { return n * 2 + 1; }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "了解"
        ]
      }
    ]
  },
  {
    "id": "p6-memory-model",
    "title": "内存模型",
    "description": "JVM 运行时数据区详解",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p6-kp-heap",
        "title": "堆（Young / Old 区）",
        "shortDesc": "堆是 JVM 的大仓库——所有对象都在这里出生和死亡",
        "deepPrinciple": "<p>堆是 JVM 最大内存区，<strong>所有对象实例</strong>在堆上分配。分为：</p><ul><li><strong>年轻代（Young）</strong>：Eden + S0 + S1（默认 8:1:1）。新对象在 Eden，Eden 满触发 Minor GC</li><li><strong>老年代（Old）</strong>：经过多次 Minor GC 存活的对象晋升。老年代满触发 Full GC</li></ul><p>为什么分代？绝大多数对象\"朝生夕死\"（弱分代假说），分代针对性采用不同 GC 算法提高效率。</p>",
        "scenario": "线上频繁 Full GC 卡顿，分析发现大量对象不该进老年代，调大年轻代(-Xmn)后改善。",
        "codeExample": "public class HeapDemo {\n    public static void main(String[] args) {\n        Runtime rt = Runtime.getRuntime();\n        System.out.println(\"=== 堆内存 ===\");\n        System.out.println(\"最大堆(-Xmx): \" + rt.maxMemory() / 1024 / 1024 + \"MB\");\n        System.out.println(\"当前堆(-Xms): \" + rt.totalMemory() / 1024 / 1024 + \"MB\");\n        System.out.println(\"已用: \" + (rt.totalMemory() - rt.freeMemory()) / 1024 / 1024 + \"MB\");\n\n        // 分配对象观察内存变化\n        java.util.List<byte[]> list = new java.util.ArrayList<>();\n        for (int i = 0; i < 50; i++) {\n            list.add(new byte[1024 * 1024]); // 每次 1MB\n            if (i % 10 == 0) {\n                list.subList(0, list.size() / 2).clear();\n                System.gc();\n                System.out.println(\"第\" + i + \"轮已用: \"\n                    + (rt.totalMemory() - rt.freeMemory()) / 1024 / 1024 + \"MB\");\n            }\n        }\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学",
          "面试"
        ]
      },
      {
        "id": "p6-kp-stack",
        "title": "栈（栈帧结构）",
        "shortDesc": "栈是方法调用的\"弹匣\"——每调用一个方法压入一颗子弹，返回时弹出",
        "deepPrinciple": "<p>每个线程有独立 JVM 栈。每调方法创建<strong>栈帧</strong>：</p><ul><li><strong>局部变量表</strong>：方法参数和局部变量</li><li><strong>操作数栈</strong>：字节码指令的临时数据栈</li><li><strong>动态链接</strong>：运行时常量池方法引用</li><li><strong>返回地址</strong>：方法结束后的返回位置</li></ul><p>栈大小通过 <code>-Xss</code> 设置（默认 512K~1M），递归过深导致 StackOverflowError。</p>",
        "scenario": "递归算法 StackOverflowError，增大 -Xss 或改用迭代解决。",
        "codeExample": "public class StackFrameDemo {\n    static int depth = 0;\n\n    public static void main(String[] args) {\n        // 测试栈深度\n        try { recursion(); }\n        catch (StackOverflowError e) {\n            System.out.println(\"栈溢出! 递归深度: \" + depth);\n        }\n\n        // 查看调用栈（每一行就是一个栈帧）\n        methodA();\n    }\n\n    static void recursion() { depth++; recursion(); }\n\n    static void methodA() { methodB(); }\n    static void methodB() {\n        System.out.println(\"\\n当前调用栈:\");\n        for (StackTraceElement f : Thread.currentThread().getStackTrace())\n            System.out.println(\"  \" + f);\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p6-kp-metaspace",
        "title": "方法区（元空间）与对象创建过程",
        "shortDesc": "元空间存放类的\"户籍信息\"，对象创建经过分配内存、初始化零值、设置对象头",
        "deepPrinciple": "<p><strong>方法区</strong>存储类信息、常量、静态变量。JDK 8 用<strong>元空间（Metaspace）</strong>替代永久代，使用本地内存。</p><p>对象创建过程：1.类加载检查 → 2.分配内存（指针碰撞/空闲列表） → 3.初始化零值 → 4.设置对象头（哈希码/GC年龄/锁状态） → 5.执行构造方法。</p>",
        "scenario": "线上 Metaspace OOM，通常是动态生成大量类（CGLib 代理），增大 -XX:MaxMetaspaceSize 或排查类加载泄漏。",
        "codeExample": "public class MetaspaceDemo {\n    private int value;\n    private static String staticField = \"静态字段在方法区\";\n\n    public MetaspaceDemo(int v) { this.value = v; }\n\n    public static void main(String[] args) {\n        // 对象创建过程: 检查->分配->零值->对象头->构造\n        MetaspaceDemo obj = new MetaspaceDemo(42);\n\n        // 查看对象信息\n        System.out.println(\"对象类: \" + obj.getClass().getName());\n        System.out.println(\"类加载器: \" + obj.getClass().getClassLoader());\n        System.out.println(\"hashCode: \" + System.identityHashCode(obj));\n\n        // Metaspace 参数\n        // -XX:MetaspaceSize=256m      初始大小\n        // -XX:MaxMetaspaceSize=512m   最大大小\n        System.out.println(\"\\nJVM 参数示例:\");\n        System.out.println(\"  -Xms512m -Xmx512m       堆内存\");\n        System.out.println(\"  -Xmn256m                 年轻代\");\n        System.out.println(\"  -Xss512k                 栈大小\");\n        System.out.println(\"  -XX:MaxMetaspaceSize=256m 元空间\");\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学",
          "面试"
        ]
      }
    ]
  },
  {
    "id": "p6-classloading",
    "title": "类加载机制",
    "description": "类加载过程与双亲委派",
    "estimatedHours": 1,
    "knowledgePoints": [
      {
        "id": "p6-kp-class-loading-process",
        "title": "加载 / 链接 / 初始化",
        "shortDesc": "类加载像入职流程：提交简历(加载) → 背景调查(验证) → 发工牌(准备) → 分配工位(解析) → 正式上班(初始化)",
        "deepPrinciple": "<p>类的生命周期五个阶段：</p><ul><li><strong>加载</strong>：通过类全名获取字节码，在方法区创建 Class 对象</li><li><strong>验证</strong>：确保字节码符合 JVM 规范（魔数、版本号、语义检查）</li><li><strong>准备</strong>：为静态变量分配内存并赋<strong>零值</strong>（不是代码中的初始值）</li><li><strong>解析</strong>：将符号引用替换为直接引用</li><li><strong>初始化</strong>：执行 &lt;clinit&gt; 方法（静态变量赋值、static 块）</li></ul>",
        "scenario": "面试题：static int a = 10，准备阶段 a=0，初始化阶段 a=10。理解这个过程能解释很多\"奇怪\"的初始化顺序问题。",
        "codeExample": "public class ClassLoadingDemo {\n    // 准备阶段: value = 0; 初始化阶段: value = 100\n    static int value = 100;\n    static { System.out.println(\"static块执行, value=\" + value); }\n\n    public static void main(String[] args) throws Exception {\n        // 主动引用触发初始化\n        System.out.println(\"value: \" + ClassLoadingDemo.value);\n\n        // 查看类是否已加载\n        ClassLoader cl = ClassLoadingDemo.class.getClassLoader();\n        // loadClass 不会触发初始化\n        Class<?> clazz = cl.loadClass(\"java.util.HashMap\");\n        System.out.println(\"HashMap 已加载: \" + clazz.getName());\n\n        // Class.forName 会触发初始化\n        Class<?> c2 = Class.forName(\"java.util.TreeMap\");\n        System.out.println(\"TreeMap 已初始化: \" + c2.getName());\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学",
          "面试"
        ]
      },
      {
        "id": "p6-kp-parent-delegation",
        "title": "双亲委派模型与破坏",
        "shortDesc": "双亲委派像逐级上报审批——先问上级能不能处理，上级处理不了才自己来",
        "deepPrinciple": "<p><strong>双亲委派</strong>：类加载时先委托父加载器，父加载不了再自己加载。层级：Bootstrap(核心库) → Extension(扩展) → Application(应用)。</p><p>好处：避免类重复加载；保护核心类（自定义 java.lang.String 不会被加载）。</p><p><strong>破坏双亲委派</strong>：SPI 机制（如 JDBC）。Bootstrap 加载 DriverManager，但具体驱动由应用类加载器加载，通过 Thread.getContextClassLoader() 打破委派。</p>",
        "scenario": "JDBC 的 DriverManager 在 rt.jar 中（Bootstrap 加载），但 MySQL 驱动在应用 classpath（App 加载），SPI 通过线程上下文类加载器打破双亲委派。",
        "codeExample": "public class ParentDelegationDemo {\n    public static void main(String[] args) {\n        // 三级类加载器\n        ClassLoader app = ParentDelegationDemo.class.getClassLoader();\n        ClassLoader ext = app.getParent();\n        ClassLoader boot = ext.getParent(); // null = Bootstrap\n\n        System.out.println(\"Application: \" + app);\n        System.out.println(\"Extension: \" + ext);\n        System.out.println(\"Bootstrap: \" + boot); // null\n\n        // 核心类由 Bootstrap 加载\n        System.out.println(\"\\nString loader: \" + String.class.getClassLoader()); // null\n        System.out.println(\"本类 loader: \" + app);\n\n        // SPI 破坏双亲委派: 线程上下文类加载器\n        ClassLoader contextCL = Thread.currentThread().getContextClassLoader();\n        System.out.println(\"\\n线程上下文CL: \" + contextCL);\n        // JDBC DriverManager 就是通过此机制加载具体驱动\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "进阶",
          "必学",
          "面试"
        ]
      }
    ]
  },
  {
    "id": "p6-gc-algorithms",
    "title": "GC 算法",
    "description": "垃圾回收的核心算法",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p6-kp-mark-sweep",
        "title": "标记-清除算法",
        "shortDesc": "最朴素的 GC——先标记垃圾，再清除。简单但会产生内存碎片",
        "deepPrinciple": "<p>两个阶段：<strong>标记</strong>所有需要回收的对象（从 GC Roots 出发不可达的对象），然后<strong>清除</strong>标记的对象。</p><p>缺点：产生大量不连续的<strong>内存碎片</strong>，导致大对象分配时找不到足够连续空间而提前触发 GC；标记和清除效率都不高。</p><p>GC Roots 包括：虚拟机栈引用的对象、静态变量引用、常量引用、JNI 引用。</p>",
        "scenario": "老年代常用标记-清除或标记-整理，因为老年代存活率高，复制算法效率低。",
        "codeExample": "/**\n * GC Roots 可达性分析演示\n * 对象是否回收取决于从 GC Roots 是否可达\n */\npublic class GcRootsDemo {\n    private static Object staticRef;  // 静态变量是 GC Root\n\n    public static void main(String[] args) {\n        Object localRef = new Object();   // 栈帧局部变量是 GC Root\n        staticRef = new Object();          // 静态引用的对象不会被回收\n\n        Object unreachable = new Object();\n        unreachable = null;                // 不可达，会被 GC\n\n        System.gc(); // 建议 GC（不保证立即执行）\n        System.out.println(\"localRef 存活: \" + (localRef != null));\n        System.out.println(\"staticRef 存活: \" + (staticRef != null));\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p6-kp-copy-compact",
        "title": "复制算法与标记-整理",
        "shortDesc": "复制算法把活的搬到新房间——整齐但浪费空间；标记-整理是原地收拾——不浪费但慢",
        "deepPrinciple": "<p><strong>复制算法</strong>：内存分两半，只用一半，GC 时把存活对象复制到另一半，清空当前半。优点：无碎片，效率高；缺点：浪费一半空间。<strong>年轻代</strong>使用（Eden+S0→S1），因为存活对象少。</p><p><strong>标记-整理</strong>：标记后将存活对象向一端移动，清除边界外空间。优点：无碎片不浪费空间；缺点：移动对象需更新引用。<strong>老年代</strong>使用，因为存活率高。</p>",
        "scenario": "年轻代用复制算法（存活少，复制开销小），老年代用标记-整理（存活多，不浪费空间）。",
        "codeExample": "/**\n * 分代回收模拟：年轻代用复制，老年代用标记-整理\n *\n * JVM 参数观察分代 GC:\n *   -Xms20m -Xmx20m -Xmn10m -XX:+PrintGCDetails\n *\n * Eden 8MB + S0 1MB + S1 1MB + Old 10MB\n */\npublic class GenerationalGcDemo {\n    public static void main(String[] args) {\n        // 分配对象模拟 Minor GC\n        byte[][] arrays = new byte[10][];\n        for (int i = 0; i < 10; i++) {\n            arrays[i] = new byte[1024 * 1024]; // 1MB\n            if (i % 3 == 0) arrays[i] = null;  // 部分变垃圾\n            System.out.println(\"分配第 \" + (i+1) + \" 个 1MB 对象\");\n        }\n\n        System.out.println(\"\\n年轻代(复制算法): Eden -> Survivor\");\n        System.out.println(\"老年代(标记-整理): 存活对象移动整理\");\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学",
          "面试"
        ]
      },
      {
        "id": "p6-kp-generational",
        "title": "分代回收理论",
        "shortDesc": "分代回收基于\"大多数对象朝生夕死\"的经验——新生的频繁检查，老的偶尔检查",
        "deepPrinciple": "<p>两个假说：<strong>弱分代假说</strong>（大多数对象很快死亡）、<strong>强分代假说</strong>（熬过多次 GC 的对象不容易死）。因此分为年轻代（频繁、快速 GC）和老年代（不频繁、全面 GC）。</p><p>对象晋升老年代条件：年龄达到阈值（默认 15，-XX:MaxTenuringThreshold）；Survivor 空间不足；大对象直接进老年代（-XX:PretenureSizeThreshold）。</p>",
        "scenario": "秒杀场景大量临时对象（年轻代快速回收），缓存对象长期存活（老年代）。合理设置分代大小避免频繁 Full GC。",
        "codeExample": "/**\n * 对象晋升过程演示\n * -Xms40m -Xmx40m -Xmn20m\n * -XX:MaxTenuringThreshold=3 (3次GC后晋升)\n * -XX:+PrintGCDetails\n */\npublic class TenuringDemo {\n    public static void main(String[] args) {\n        // 长期存活对象 -> 最终进入老年代\n        Object longLived = new Object();\n\n        for (int i = 0; i < 10; i++) {\n            // 短命对象: 在年轻代被回收\n            byte[] shortLived = new byte[1024 * 512]; // 512KB\n        }\n\n        System.out.println(\"longLived 仍然存活，已晋升到老年代\");\n        System.out.println(\"shortLived 们在年轻代被回收\");\n\n        // 查看 GC 信息\n        System.out.println(\"\\n常用 GC 参数:\");\n        System.out.println(\"  -XX:MaxTenuringThreshold=15  晋升年龄\");\n        System.out.println(\"  -XX:PretenureSizeThreshold   大对象直接老年代\");\n        System.out.println(\"  -XX:SurvivorRatio=8          Eden:S0:S1=8:1:1\");\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学",
          "面试"
        ]
      }
    ]
  },
  {
    "id": "p6-gc-tuning",
    "title": "GC 调优入门",
    "description": "常用 JVM 参数与 GC 工具",
    "estimatedHours": 1,
    "knowledgePoints": [
      {
        "id": "p6-kp-jvm-params",
        "title": "常用 JVM 参数与 GC 器选择",
        "shortDesc": "-Xms/-Xmx 定堆大小，G1 是现代应用的默认首选",
        "deepPrinciple": "<p>核心参数：</p><ul><li><code>-Xms / -Xmx</code>：初始/最大堆（建议设相同，避免动态扩容）</li><li><code>-Xmn</code>：年轻代大小</li><li><code>-Xss</code>：线程栈大小</li><li><code>-XX:+UseG1GC</code>：使用 G1 收集器（JDK 9+ 默认）</li></ul><p>GC 器选择：G1 适合大多数场景（堆 &gt; 4G）；ZGC/Shenandoah 适合超低延迟（JDK 11+）；ParallelGC 适合吞吐优先。</p>",
        "scenario": "Spring Boot 应用推荐配置：-Xms512m -Xmx512m -XX:+UseG1GC。线上通过 jstat 监控 GC 频率和耗时。",
        "codeExample": "/**\n * JVM 参数演示\n * 运行: java -Xms256m -Xmx256m -XX:+UseG1GC -verbose:gc JvmParamsDemo\n */\npublic class JvmParamsDemo {\n    public static void main(String[] args) {\n        Runtime rt = Runtime.getRuntime();\n        System.out.println(\"=== JVM 配置信息 ===\");\n        System.out.println(\"最大堆: \" + rt.maxMemory() / 1024 / 1024 + \"MB\");\n        System.out.println(\"当前堆: \" + rt.totalMemory() / 1024 / 1024 + \"MB\");\n\n        System.out.println(\"\\n=== 推荐 JVM 参数 ===\");\n        System.out.println(\"# 堆内存（设相同避免动态扩容）\");\n        System.out.println(\"-Xms512m -Xmx512m\");\n        System.out.println(\"# GC 器（JDK 9+ 默认 G1）\");\n        System.out.println(\"-XX:+UseG1GC\");\n        System.out.println(\"# GC 日志（排查必备）\");\n        System.out.println(\"-Xlog:gc*:file=gc.log:time,tags\");\n        System.out.println(\"\\n=== 常用诊断命令 ===\");\n        System.out.println(\"jstat -gc <pid> 1000   # 每秒打印 GC 统计\");\n        System.out.println(\"jmap -heap <pid>       # 查看堆分布\");\n        System.out.println(\"jmap -dump:format=b,file=heap.hprof <pid>\");\n        System.out.println(\"jstack <pid>           # 线程快照\");\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "进阶",
          "实战"
        ]
      },
      {
        "id": "p6-kp-gc-tools",
        "title": "jstat / jmap / GC 日志分析",
        "shortDesc": "jstat 是 GC 的\"体检报告\"，jmap 是堆内存的\"X光片\"",
        "deepPrinciple": "<p>常用工具：</p><ul><li><strong>jstat -gc pid 1000</strong>：每秒打印 GC 统计（Eden/Survivor/Old 使用量、GC 次数和耗时）</li><li><strong>jmap -heap pid</strong>：查看堆内存分布</li><li><strong>jmap -dump:format=b,file=heap.hprof pid</strong>：导出堆转储文件</li><li><strong>GC 日志</strong>：-Xlog:gc* 开启，用 GCViewer 或 GCEasy 分析</li></ul><p>排查步骤：1.jstat 看 GC 频率 → 2.GC 日志看耗时 → 3.jmap dump → 4.MAT 分析大对象。</p>",
        "scenario": "线上 Full GC 每分钟一次，jstat 发现老年代快速填满，jmap dump 后用 MAT 找到缓存没有上限的 HashMap。",
        "codeExample": "/**\n * 模拟需要 GC 调优的场景\n * 运行: java -Xms64m -Xmx64m -Xlog:gc*:stdout JvmToolsDemo\n */\npublic class JvmToolsDemo {\n    public static void main(String[] args) throws InterruptedException {\n        System.out.println(\"PID: \" + ProcessHandle.current().pid());\n        System.out.println(\"在另一个终端执行:\");\n        System.out.println(\"  jstat -gc \" + ProcessHandle.current().pid() + \" 1000\");\n        System.out.println(\"  jmap -heap \" + ProcessHandle.current().pid());\n\n        // 模拟内存压力\n        java.util.List<byte[]> list = new java.util.ArrayList<>();\n        for (int i = 0; i < 100; i++) {\n            list.add(new byte[1024 * 512]); // 512KB\n            if (list.size() > 20) list.subList(0, 10).clear();\n            Thread.sleep(100);\n        }\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "实战"
        ]
      }
    ]
  },
  {
    "id": "p6-oom",
    "title": "内存溢出排查",
    "description": "OOM 类型与排查方法",
    "estimatedHours": 1,
    "knowledgePoints": [
      {
        "id": "p6-kp-oom-types",
        "title": "OOM 类型（堆/栈/元空间）",
        "shortDesc": "OOM 是 JVM 在喊\"我装不下了\"——不同区域满了报不同错",
        "deepPrinciple": "<p>常见 OOM 类型：</p><ul><li><strong>java.lang.OutOfMemoryError: Java heap space</strong>：堆空间不足，对象太多或太大</li><li><strong>java.lang.StackOverflowError</strong>：栈溢出，递归过深</li><li><strong>java.lang.OutOfMemoryError: Metaspace</strong>：元空间不足，动态生成类过多</li><li><strong>java.lang.OutOfMemoryError: GC overhead limit exceeded</strong>：GC 耗时超过 98% 但回收不到 2% 内存</li></ul>",
        "scenario": "线上告警 heap space OOM，先看监控确认是瞬时高峰还是内存泄漏（持续增长），再 dump 分析。",
        "codeExample": "import java.util.ArrayList;\nimport java.util.List;\n\n/**\n * OOM 演示\n * 堆溢出: java -Xmx32m OomTypesDemo heap\n * 栈溢出: java OomTypesDemo stack\n */\npublic class OomTypesDemo {\n    static List<byte[]> leakList = new ArrayList<>();\n\n    public static void main(String[] args) {\n        String type = args.length > 0 ? args[0] : \"heap\";\n        switch (type) {\n            case \"heap\" -> {\n                // 堆溢出: 不断分配不释放\n                try {\n                    while (true) leakList.add(new byte[1024 * 1024]);\n                } catch (OutOfMemoryError e) {\n                    System.out.println(\"堆溢出: \" + e.getMessage());\n                }\n            }\n            case \"stack\" -> {\n                // 栈溢出: 无限递归\n                try { infiniteRecursion(0); }\n                catch (StackOverflowError e) {\n                    System.out.println(\"栈溢出!\");\n                }\n            }\n        }\n    }\n\n    static void infiniteRecursion(int depth) { infiniteRecursion(depth + 1); }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "必学"
        ]
      },
      {
        "id": "p6-kp-oom-analysis",
        "title": "MAT 分析 dump 与常见 OOM 原因",
        "shortDesc": "MAT 是内存问题的\"法医\"——分析堆转储找到内存泄漏的真凶",
        "deepPrinciple": "<p>排查流程：</p><ul><li>1. 启动参数加 <code>-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/</code>，OOM 时自动 dump</li><li>2. 用 <strong>Eclipse MAT</strong> 或 VisualVM 打开 .hprof 文件</li><li>3. 查看 Leak Suspects（泄漏嫌疑人报告）和 Dominator Tree（内存占用排行）</li></ul><p>常见 OOM 原因：</p><ul><li>集合无限增长（如 static Map 做缓存但没有淘汰策略）</li><li>连接/流未关闭</li><li>ThreadLocal 未 remove</li><li>大量 String 拼接（用 StringBuilder）</li></ul>",
        "scenario": "线上 OOM，MAT 打开 dump 发现 Dominator Tree 中一个 HashMap 占 80% 堆内存，排查发现是本地缓存没有 maxSize 限制。",
        "codeExample": "/**\n * 配合 MAT 分析的 OOM 排查示例\n * 运行: java -Xmx64m\n *   -XX:+HeapDumpOnOutOfMemoryError\n *   -XX:HeapDumpPath=./dump.hprof\n *   OomAnalysisDemo\n */\nimport java.util.*;\n\npublic class OomAnalysisDemo {\n    // 常见问题: static 集合无限增长\n    private static final Map<String, byte[]> cache = new HashMap<>();\n\n    public static void main(String[] args) {\n        System.out.println(\"=== 模拟内存泄漏 ===\");\n        System.out.println(\"JVM 参数建议:\");\n        System.out.println(\"  -XX:+HeapDumpOnOutOfMemoryError\");\n        System.out.println(\"  -XX:HeapDumpPath=./dump.hprof\");\n        System.out.println();\n\n        try {\n            for (int i = 0; i < 10000; i++) {\n                // 模拟缓存无限增长（没有淘汰策略）\n                cache.put(\"key-\" + i, new byte[10240]); // 10KB/个\n                if (i % 1000 == 0) System.out.println(\"已缓存: \" + cache.size());\n            }\n        } catch (OutOfMemoryError e) {\n            System.out.println(\"OOM! 缓存条目: \" + cache.size());\n            System.out.println(\"修复: 使用 LRU 缓存（如 Caffeine/Guava Cache）\");\n        }\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "进阶",
          "实战"
        ]
      }
    ]
  }
];

export const phase7Topics = [
  {
    "id": "p7-jdbc-basic",
    "title": "JDBC 基础",
    "description": "JDBC 核心 API 入门",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p7-kp-driver-manager",
        "title": "DriverManager 与数据库连接",
        "shortDesc": "DriverManager 是 JDBC 的\"前台接待\"——负责管理驱动和建立连接",
        "deepPrinciple": "<p>JDBC（Java Database Connectivity）四大核心类：</p><ul><li><strong>DriverManager</strong>：管理 JDBC 驱动，通过 URL 建立数据库连接</li><li><strong>Connection</strong>：代表一个数据库连接，所有操作的基础</li><li><strong>Statement</strong>：执行 SQL 语句</li><li><strong>ResultSet</strong>：查询结果集</li></ul><p>JDBC URL 格式：<code>jdbc:mysql://host:port/dbname?param=value</code></p><p>JDK 6+ 支持 SPI 自动加载驱动，无需手动 Class.forName()。</p>",
        "scenario": "任何 Java 数据库操作的起点都是获取 Connection。理解 JDBC 是理解 MyBatis、JPA 等 ORM 框架的基础。",
        "codeExample": "import java.sql.*;\n\npublic class JdbcBasicDemo {\n    public static void main(String[] args) {\n        String url = \"jdbc:mysql://localhost:3306/testdb?useSSL=false&serverTimezone=UTC\";\n        String user = \"root\";\n        String password = \"123456\";\n\n        // try-with-resources 自动关闭连接\n        try (Connection conn = DriverManager.getConnection(url, user, password)) {\n            System.out.println(\"连接成功!\");\n            System.out.println(\"数据库: \" + conn.getCatalog());\n            System.out.println(\"驱动: \" + conn.getMetaData().getDriverName());\n\n            // 执行查询\n            try (Statement stmt = conn.createStatement();\n                 ResultSet rs = stmt.executeQuery(\"SELECT 1 AS result\")) {\n                if (rs.next()) {\n                    System.out.println(\"查询结果: \" + rs.getInt(\"result\"));\n                }\n            }\n        } catch (SQLException e) {\n            System.out.println(\"连接失败: \" + e.getMessage());\n            System.out.println(\"SQLState: \" + e.getSQLState());\n        }\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p7-kp-connection",
        "title": "Connection 对象与生命周期",
        "shortDesc": "Connection 是昂贵的资源——创建耗时，用完必须关闭，否则连接泄漏",
        "deepPrinciple": "<p>Connection 的创建涉及 TCP 握手、身份认证、会话建立，非常<strong>耗时</strong>（通常几十到几百毫秒）。</p><p>关键原则：</p><ul><li><strong>用完必须关闭</strong>：Connection、Statement、ResultSet 都要关闭</li><li><strong>关闭顺序</strong>：ResultSet → Statement → Connection</li><li><strong>不要长期持有</strong>：应该在每次操作时获取，操作完释放</li></ul><p>生产环境不应该每次 DriverManager.getConnection()，而是使用<strong>连接池</strong>（HikariCP）。</p>",
        "scenario": "不关闭连接，MySQL 的 max_connections 很快耗尽，新请求全部拒绝。这是生产事故高发原因之一。",
        "codeExample": "import java.sql.*;\n\npublic class ConnectionLifecycleDemo {\n    private static final String URL = \"jdbc:mysql://localhost:3306/testdb\";\n\n    public static void main(String[] args) {\n        // 错误写法: 连接泄漏!\n        // Connection conn = DriverManager.getConnection(URL, \"root\", \"123456\");\n        // conn.createStatement().executeQuery(\"SELECT 1\"); // 忘记关闭\n\n        // 正确写法: try-with-resources 自动关闭\n        try (Connection conn = DriverManager.getConnection(URL, \"root\", \"123456\");\n             Statement stmt = conn.createStatement();\n             ResultSet rs = stmt.executeQuery(\"SELECT NOW() AS now\")) {\n\n            if (rs.next()) {\n                System.out.println(\"服务器时间: \" + rs.getString(\"now\"));\n            }\n\n        } catch (SQLException e) {\n            System.out.println(\"数据库错误: \" + e.getMessage());\n        }\n        // 出了 try 块, conn/stmt/rs 全部自动关闭\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p7-kp-statement",
        "title": "Statement 执行 SQL",
        "shortDesc": "Statement 是 SQL 的\"快递员\"——把你写的 SQL 送到数据库执行",
        "deepPrinciple": "<p>Statement 的三个核心方法：</p><ul><li><code>executeQuery(sql)</code>：SELECT 查询，返回 ResultSet</li><li><code>executeUpdate(sql)</code>：INSERT/UPDATE/DELETE，返回影响行数</li><li><code>execute(sql)</code>：任意 SQL，返回 boolean（是否有 ResultSet）</li></ul><p><strong>注意</strong>：Statement 直接拼接 SQL 有<strong>SQL 注入</strong>风险！生产环境必须用 PreparedStatement。</p>",
        "scenario": "Statement 只适合执行固定 SQL（如建表、DDL），涉及用户输入的查询必须用 PreparedStatement。",
        "codeExample": "import java.sql.*;\n\npublic class StatementDemo {\n    public static void main(String[] args) throws SQLException {\n        try (Connection conn = DriverManager.getConnection(\n                \"jdbc:mysql://localhost:3306/testdb\", \"root\", \"123456\");\n             Statement stmt = conn.createStatement()) {\n\n            // DDL: 建表\n            stmt.execute(\"CREATE TABLE IF NOT EXISTS demo_user (\"\n                + \"id INT AUTO_INCREMENT PRIMARY KEY, \"\n                + \"name VARCHAR(50), age INT)\");\n\n            // INSERT\n            int rows = stmt.executeUpdate(\n                \"INSERT INTO demo_user(name, age) VALUES('张三', 20)\");\n            System.out.println(\"插入 \" + rows + \" 行\");\n\n            // SELECT\n            try (ResultSet rs = stmt.executeQuery(\"SELECT * FROM demo_user\")) {\n                while (rs.next()) {\n                    System.out.printf(\"id=%d, name=%s, age=%d%n\",\n                        rs.getInt(\"id\"), rs.getString(\"name\"), rs.getInt(\"age\"));\n                }\n            }\n\n            // 清理\n            stmt.execute(\"DROP TABLE demo_user\");\n        }\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      }
    ]
  },
  {
    "id": "p7-prepared-statement",
    "title": "PreparedStatement",
    "description": "参数化查询与防注入",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p7-kp-sql-injection",
        "title": "防止 SQL 注入原理",
        "shortDesc": "SQL 注入是黑客在输入框里写 SQL——PreparedStatement 让数据库把它当纯文本",
        "deepPrinciple": "<p><strong>SQL 注入</strong>：攻击者在输入中嵌入恶意 SQL 片段。例如输入 <code>' OR 1=1 --</code> 可绕过登录验证。</p><p><strong>PreparedStatement 防注入原理</strong>：SQL 模板（带 ? 占位符）和参数<strong>分开传输</strong>给数据库。数据库先编译 SQL 模板的结构，再填入参数值。参数值被视为<strong>纯数据</strong>，不会被当作 SQL 语法解析。</p><p>这是<strong>安全编码的底线要求</strong>，严禁用 Statement 拼接用户输入。</p>",
        "scenario": "登录接口用 Statement 拼接恶意输入可绕过验证。改用 PreparedStatement 后整个字符串被视为纯用户名参数，注入失败。",
        "codeExample": "import java.sql.*;\n\npublic class SqlInjectionDemo {\n    public static void main(String[] args) throws SQLException {\n        String url = \"jdbc:mysql://localhost:3306/testdb\";\n        try (Connection conn = DriverManager.getConnection(url, \"root\", \"123456\")) {\n\n            // 危险! SQL 注入（演示用，绝不要这样写）\n            String evilInput = \"' OR 1=1 -- \";\n            String unsafeSql = \"SELECT * FROM users WHERE name='\" + evilInput + \"'\";\n            System.out.println(\"危险SQL: \" + unsafeSql);\n            // 结果: SELECT * FROM users WHERE name='' OR 1=1 -- '\n            // 所有用户数据泄漏!\n\n            // 安全! PreparedStatement 参数化查询\n            String safeSql = \"SELECT * FROM users WHERE name = ? AND password = ?\";\n            try (PreparedStatement ps = conn.prepareStatement(safeSql)) {\n                ps.setString(1, evilInput);  // 被视为纯文本\n                ps.setString(2, \"any\");\n                // 实际执行: WHERE name = \"' OR 1=1 -- \" AND password = \"any\"\n                // 找不到匹配的用户，注入失败\n            }\n        }\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p7-kp-parameterized-query",
        "title": "参数化查询 ?",
        "shortDesc": "? 占位符像填空题——先出题目再填答案，答案不会改变题目的意思",
        "deepPrinciple": "<p>PreparedStatement 使用 <code>?</code> 作为参数占位符，通过 setXxx(index, value) 设置参数（index 从 1 开始）。</p><p>优势：</p><ul><li>防 SQL 注入（参数值不参与 SQL 解析）</li><li><strong>预编译</strong>：SQL 模板只编译一次，多次执行只传参数，提升性能</li><li>类型安全：setInt/setString 自动处理类型转换和转义</li></ul>",
        "scenario": "用户搜索功能：WHERE name LIKE ? AND age > ?，用户输入的关键词不会破坏 SQL 结构。",
        "codeExample": "import java.sql.*;\n\npublic class PreparedStatementDemo {\n    public static void main(String[] args) throws SQLException {\n        String url = \"jdbc:mysql://localhost:3306/testdb\";\n        try (Connection conn = DriverManager.getConnection(url, \"root\", \"123456\")) {\n\n            // INSERT\n            String insertSql = \"INSERT INTO users(name, age, email) VALUES(?, ?, ?)\";\n            try (PreparedStatement ps = conn.prepareStatement(insertSql)) {\n                ps.setString(1, \"李四\");\n                ps.setInt(2, 25);\n                ps.setString(3, \"lisi@example.com\");\n                int rows = ps.executeUpdate();\n                System.out.println(\"插入 \" + rows + \" 行\");\n            }\n\n            // SELECT\n            String querySql = \"SELECT * FROM users WHERE age > ? AND name LIKE ?\";\n            try (PreparedStatement ps = conn.prepareStatement(querySql)) {\n                ps.setInt(1, 18);\n                ps.setString(2, \"%李%\");\n                try (ResultSet rs = ps.executeQuery()) {\n                    while (rs.next()) {\n                        System.out.printf(\"%s, %d岁%n\",\n                            rs.getString(\"name\"), rs.getInt(\"age\"));\n                    }\n                }\n            }\n        }\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p7-kp-batch",
        "title": "批量处理",
        "shortDesc": "批量处理像集中发货——攒一批一起发，比一件件发快得多",
        "deepPrinciple": "<p>PreparedStatement 的 <code>addBatch()</code> + <code>executeBatch()</code> 一次性发送多条 SQL，减少网络往返次数。</p><p>关键：JDBC URL 需要加 <code>rewriteBatchedStatements=true</code> 参数，MySQL 才会真正合并为一条 INSERT ... VALUES (),(),()。否则只是客户端攒批，服务端仍然逐条执行。</p>",
        "scenario": "导入 10 万条 Excel 数据到数据库，逐条插入需要 5 分钟，批量插入只需 3 秒。",
        "codeExample": "import java.sql.*;\n\npublic class BatchInsertDemo {\n    public static void main(String[] args) throws SQLException {\n        // 注意 rewriteBatchedStatements=true\n        String url = \"jdbc:mysql://localhost:3306/testdb?rewriteBatchedStatements=true\";\n        try (Connection conn = DriverManager.getConnection(url, \"root\", \"123456\")) {\n            conn.setAutoCommit(false); // 关闭自动提交\n\n            String sql = \"INSERT INTO users(name, age) VALUES(?, ?)\";\n            try (PreparedStatement ps = conn.prepareStatement(sql)) {\n                long start = System.currentTimeMillis();\n\n                for (int i = 1; i <= 10000; i++) {\n                    ps.setString(1, \"用户\" + i);\n                    ps.setInt(2, 20 + (i % 30));\n                    ps.addBatch();\n\n                    if (i % 1000 == 0) {      // 每 1000 条执行一次\n                        ps.executeBatch();\n                        ps.clearBatch();\n                    }\n                }\n                ps.executeBatch(); // 处理剩余\n                conn.commit();\n\n                System.out.println(\"插入 10000 条耗时: \"\n                    + (System.currentTimeMillis() - start) + \"ms\");\n            } catch (SQLException e) {\n                conn.rollback(); // 失败回滚\n                throw e;\n            }\n        }\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "实战"
        ]
      }
    ]
  },
  {
    "id": "p7-resultset",
    "title": "结果集处理",
    "description": "ResultSet 遍历与元数据",
    "estimatedHours": 1,
    "knowledgePoints": [
      {
        "id": "p7-kp-resultset-traverse",
        "title": "ResultSet 遍历",
        "shortDesc": "ResultSet 像一个带指针的表格——next() 移动指针，getXxx() 读取当前行",
        "deepPrinciple": "<p>ResultSet 游标初始在第一行之前。<code>next()</code> 向下移动一行，返回 true 表示有数据。</p><p>取值方式：<code>getXxx(columnIndex)</code>（从 1 开始）或 <code>getXxx(columnLabel)</code>（推荐用列名）。</p><p>常用类型映射：INT→getInt、VARCHAR→getString、DATETIME→getTimestamp、DECIMAL→getBigDecimal。</p><p>注意 NULL 处理：getInt 遇到 NULL 返回 0 而非 null，应用 <code>wasNull()</code> 判断。</p>",
        "scenario": "查询订单列表并封装为 Java 对象列表（DTO/POJO），是后端最常见的操作。",
        "codeExample": "import java.sql.*;\nimport java.util.ArrayList;\nimport java.util.List;\n\npublic class ResultSetDemo {\n    public static void main(String[] args) throws SQLException {\n        String url = \"jdbc:mysql://localhost:3306/testdb\";\n        try (Connection conn = DriverManager.getConnection(url, \"root\", \"123456\");\n             PreparedStatement ps = conn.prepareStatement(\n                 \"SELECT id, name, age, email FROM users WHERE age > ?\")) {\n\n            ps.setInt(1, 18);\n            try (ResultSet rs = ps.executeQuery()) {\n                List<String> users = new ArrayList<>();\n                while (rs.next()) {\n                    int id = rs.getInt(\"id\");\n                    String name = rs.getString(\"name\");\n                    int age = rs.getInt(\"age\");\n                    String email = rs.getString(\"email\");\n                    if (rs.wasNull()) email = \"未设置\"; // NULL 判断\n                    users.add(String.format(\"#%d %s(%d) %s\", id, name, age, email));\n                }\n                users.forEach(System.out::println);\n                System.out.println(\"共 \" + users.size() + \" 条\");\n            }\n        }\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p7-kp-resultset-metadata",
        "title": "元数据 ResultSetMetaData",
        "shortDesc": "元数据是\"数据的数据\"——不看内容就能知道表有几列、每列叫什么名字什么类型",
        "deepPrinciple": "<p><code>ResultSetMetaData</code> 描述结果集的结构：列数、列名、列类型。通过 <code>rs.getMetaData()</code> 获取。</p><p>核心方法：<code>getColumnCount()</code>、<code>getColumnLabel(i)</code>（别名）、<code>getColumnTypeName(i)</code>、<code>getColumnClassName(i)</code>。</p><p>应用场景：通用 SQL 执行器（不知道查询了哪些列时，用元数据动态处理）；ORM 框架底层就是通过元数据实现自动映射。</p>",
        "scenario": "开发通用的数据导出功能：执行任意 SQL，用元数据动态获取列名生成 CSV 表头。",
        "codeExample": "import java.sql.*;\n\npublic class MetaDataDemo {\n    public static void main(String[] args) throws SQLException {\n        String url = \"jdbc:mysql://localhost:3306/testdb\";\n        try (Connection conn = DriverManager.getConnection(url, \"root\", \"123456\");\n             Statement stmt = conn.createStatement();\n             ResultSet rs = stmt.executeQuery(\"SELECT id, name, age FROM users LIMIT 5\")) {\n\n            ResultSetMetaData meta = rs.getMetaData();\n            int colCount = meta.getColumnCount();\n\n            // 打印表头\n            for (int i = 1; i <= colCount; i++) {\n                System.out.printf(\"%-15s\", meta.getColumnLabel(i)\n                    + \"(\" + meta.getColumnTypeName(i) + \")\");\n            }\n            System.out.println();\n\n            // 打印数据（通用方式，不依赖具体列名）\n            while (rs.next()) {\n                for (int i = 1; i <= colCount; i++) {\n                    System.out.printf(\"%-15s\", rs.getString(i));\n                }\n                System.out.println();\n            }\n        }\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "了解"
        ]
      }
    ]
  },
  {
    "id": "p7-transaction",
    "title": "事务管理",
    "description": "ACID 与事务隔离级别",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p7-kp-acid",
        "title": "ACID 特性",
        "shortDesc": "ACID 是数据库的四大铁律——保证数据\"不丢、不错、不乱、不脏\"",
        "deepPrinciple": "<p>事务四大特性：</p><ul><li><strong>原子性（Atomicity）</strong>：事务中的操作全部成功或全部失败回滚</li><li><strong>一致性（Consistency）</strong>：事务前后数据满足约束规则</li><li><strong>隔离性（Isolation）</strong>：并发事务互不干扰</li><li><strong>持久性（Durability）</strong>：事务提交后数据永久保存</li></ul><p>原子性是基础，一致性是目标，隔离性和持久性是手段。</p>",
        "scenario": "转账操作：A 扣钱 + B 加钱必须在同一事务中。A 扣成功但 B 加失败，必须回滚 A 的扣款。",
        "codeExample": "import java.sql.*;\n\npublic class AcidDemo {\n    public static void main(String[] args) throws SQLException {\n        String url = \"jdbc:mysql://localhost:3306/testdb\";\n        try (Connection conn = DriverManager.getConnection(url, \"root\", \"123456\")) {\n\n            // 关闭自动提交 = 开启事务\n            conn.setAutoCommit(false);\n\n            try {\n                // 转账: A 扣 100\n                try (PreparedStatement ps = conn.prepareStatement(\n                        \"UPDATE account SET balance = balance - ? WHERE name = ?\")) {\n                    ps.setBigDecimal(1, new java.math.BigDecimal(\"100\"));\n                    ps.setString(2, \"A\");\n                    ps.executeUpdate();\n                }\n\n                // 转账: B 加 100\n                try (PreparedStatement ps = conn.prepareStatement(\n                        \"UPDATE account SET balance = balance + ? WHERE name = ?\")) {\n                    ps.setBigDecimal(1, new java.math.BigDecimal(\"100\"));\n                    ps.setString(2, \"B\");\n                    ps.executeUpdate();\n                }\n\n                conn.commit(); // 全部成功才提交\n                System.out.println(\"转账成功\");\n\n            } catch (SQLException e) {\n                conn.rollback(); // 任何失败都回滚\n                System.out.println(\"转账失败，已回滚: \" + e.getMessage());\n            }\n        }\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p7-kp-isolation-level",
        "title": "隔离级别",
        "shortDesc": "隔离级别是安全与性能的权衡——级别越高越安全，但并发越低",
        "deepPrinciple": "<p>四个隔离级别（从低到高）：</p><ul><li><strong>READ_UNCOMMITTED</strong>：脏读（读到未提交数据）</li><li><strong>READ_COMMITTED</strong>：不可重复读（同一事务两次读结果不同）。<strong>Oracle 默认</strong></li><li><strong>REPEATABLE_READ</strong>：幻读（两次查询行数不同）。<strong>MySQL InnoDB 默认</strong>（通过 MVCC+间隙锁解决大部分幻读）</li><li><strong>SERIALIZABLE</strong>：完全串行，最安全但性能最差</li></ul>",
        "scenario": "大多数业务用 MySQL 默认的 REPEATABLE_READ 即可。涉及金融交易的关键操作可能需要更高级别。",
        "codeExample": "import java.sql.*;\n\npublic class IsolationLevelDemo {\n    public static void main(String[] args) throws SQLException {\n        String url = \"jdbc:mysql://localhost:3306/testdb\";\n        try (Connection conn = DriverManager.getConnection(url, \"root\", \"123456\")) {\n\n            // 查看当前隔离级别\n            int level = conn.getTransactionIsolation();\n            System.out.println(\"当前隔离级别: \" + levelName(level));\n\n            // 设置隔离级别（在开启事务前设置）\n            conn.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);\n            System.out.println(\"修改为: \" + levelName(conn.getTransactionIsolation()));\n        }\n    }\n\n    static String levelName(int level) {\n        return switch (level) {\n            case Connection.TRANSACTION_READ_UNCOMMITTED -> \"READ_UNCOMMITTED(脏读)\";\n            case Connection.TRANSACTION_READ_COMMITTED -> \"READ_COMMITTED(不可重复读)\";\n            case Connection.TRANSACTION_REPEATABLE_READ -> \"REPEATABLE_READ(MySQL默认)\";\n            case Connection.TRANSACTION_SERIALIZABLE -> \"SERIALIZABLE(串行)\";\n            default -> \"UNKNOWN(\" + level + \")\";\n        };\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学",
          "面试"
        ]
      },
      {
        "id": "p7-kp-savepoint",
        "title": "setAutoCommit 与回滚",
        "shortDesc": "autoCommit=false 像按下暂停键——所有操作先缓存，确认无误再一起提交",
        "deepPrinciple": "<p>JDBC 默认 autoCommit=true（每条 SQL 自动提交）。手动事务：<code>setAutoCommit(false)</code> → 执行SQL → <code>commit()</code> 或 <code>rollback()</code>。</p><p>Savepoint 支持<strong>部分回滚</strong>：设置保存点后，可以回滚到保存点而非整个事务。适合复杂业务流程中部分步骤可失败。</p>",
        "scenario": "批量导入数据，每 1000 条设一个 Savepoint，某批失败只回滚该批，前面已成功的保留。",
        "codeExample": "import java.sql.*;\n\npublic class SavepointDemo {\n    public static void main(String[] args) throws SQLException {\n        String url = \"jdbc:mysql://localhost:3306/testdb\";\n        try (Connection conn = DriverManager.getConnection(url, \"root\", \"123456\")) {\n            conn.setAutoCommit(false);\n\n            try (Statement stmt = conn.createStatement()) {\n                // 步骤1: 创建订单\n                stmt.executeUpdate(\"INSERT INTO orders(id, amount) VALUES(1, 100)\");\n                System.out.println(\"订单创建成功\");\n\n                // 设置保存点\n                Savepoint sp = conn.setSavepoint(\"after_order\");\n\n                try {\n                    // 步骤2: 扣减库存（可能失败）\n                    stmt.executeUpdate(\"UPDATE stock SET qty = qty - 1 WHERE id = 1\");\n                    System.out.println(\"库存扣减成功\");\n                } catch (SQLException e) {\n                    // 只回滚到保存点，订单保留\n                    conn.rollback(sp);\n                    System.out.println(\"库存失败，回滚到保存点\");\n                }\n\n                conn.commit();\n            } catch (SQLException e) {\n                conn.rollback();\n            }\n        }\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "进阶",
          "实战"
        ]
      }
    ]
  },
  {
    "id": "p7-hikaricp",
    "title": "HikariCP 连接池",
    "description": "高性能连接池配置",
    "estimatedHours": 1,
    "knowledgePoints": [
      {
        "id": "p7-kp-hikari-principle",
        "title": "HikariCP 高性能原理与配置",
        "shortDesc": "HikariCP 是 JDBC 连接池中的\"闪电侠\"——Spring Boot 的默认选择",
        "deepPrinciple": "<p>HikariCP 是目前最快的 JDBC 连接池。高性能秘诀：</p><ul><li>无锁设计 ConcurrentBag（CAS 替代 synchronized）</li><li>字节码级优化（FastList 替代 ArrayList）</li><li>代理连接对象精简（减少方法调用层级）</li></ul><p>核心配置参数：</p><ul><li><code>maximumPoolSize</code>：最大连接数（推荐 CPU核心数*2+1）</li><li><code>minimumIdle</code>：最小空闲连接</li><li><code>connectionTimeout</code>：获取连接超时（默认 30s）</li><li><code>maxLifetime</code>：连接最大存活时间</li></ul>",
        "scenario": "没用连接池：每次请求创建+关闭连接，100ms/次。用 HikariCP：从池中取连接，1ms/次。性能提升 100 倍。",
        "codeExample": "import com.zaxxer.hikari.HikariConfig;\nimport com.zaxxer.hikari.HikariDataSource;\nimport java.sql.*;\n\npublic class HikariCPDemo {\n    public static void main(String[] args) throws SQLException {\n        HikariConfig config = new HikariConfig();\n        config.setJdbcUrl(\"jdbc:mysql://localhost:3306/testdb\");\n        config.setUsername(\"root\");\n        config.setPassword(\"123456\");\n        config.setMaximumPoolSize(10);      // 最大连接数\n        config.setMinimumIdle(5);           // 最小空闲\n        config.setConnectionTimeout(30000); // 30s 超时\n        config.setMaxLifetime(1800000);     // 30min 最大存活\n        config.addDataSourceProperty(\"cachePrepStmts\", \"true\");\n        config.addDataSourceProperty(\"prepStmtCacheSize\", \"250\");\n\n        try (HikariDataSource ds = new HikariDataSource(config)) {\n            // 从连接池获取连接（极快）\n            try (Connection conn = ds.getConnection();\n                 PreparedStatement ps = conn.prepareStatement(\"SELECT NOW()\");\n                 ResultSet rs = ps.executeQuery()) {\n                if (rs.next()) System.out.println(\"时间: \" + rs.getString(1));\n            }\n            // conn.close() 不是真正关闭，而是归还到池中\n            System.out.println(\"活跃连接: \" + ds.getHikariPoolMXBean().getActiveConnections());\n        }\n    }\n}",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p7-kp-hikari-springboot",
        "title": "Spring Boot 自动配置连接池",
        "shortDesc": "Spring Boot 默认就用 HikariCP——只需在 application.yml 配置几行",
        "deepPrinciple": "<p>Spring Boot 2.x 起默认使用 HikariCP。只需在配置文件中设置数据源属性，Spring Boot 自动创建 DataSource Bean。</p><p>配置方式：application.yml 中 spring.datasource.* 开头的配置会自动映射到 HikariConfig。</p>",
        "scenario": "Spring Boot 项目中不需要手动创建 DataSource，配置文件写好后直接 @Autowired DataSource 即可使用。",
        "codeExample": "// application.yml 配置示例（非 Java 代码）\n// spring:\n//   datasource:\n//     url: jdbc:mysql://localhost:3306/testdb\n//     username: root\n//     password: 123456\n//     driver-class-name: com.mysql.cj.jdbc.Driver\n//     hikari:\n//       maximum-pool-size: 10\n//       minimum-idle: 5\n//       connection-timeout: 30000\n//       max-lifetime: 1800000\n\n// Spring Boot 中使用（自动注入）\n// @Service\n// public class UserService {\n//     @Autowired\n//     private DataSource dataSource;\n//\n//     public List<User> findAll() throws SQLException {\n//         try (Connection conn = dataSource.getConnection();\n//              PreparedStatement ps = conn.prepareStatement(\"SELECT * FROM users\");\n//              ResultSet rs = ps.executeQuery()) {\n//             // 处理结果...\n//         }\n//     }\n// }\n\npublic class SpringBootHikariDemo {\n    public static void main(String[] args) {\n        System.out.println(\"Spring Boot 连接池配置要点:\");\n        System.out.println(\"1. 添加依赖: spring-boot-starter-jdbc\");\n        System.out.println(\"2. 配置 application.yml 中 spring.datasource.*\");\n        System.out.println(\"3. 自动创建 HikariDataSource Bean\");\n        System.out.println(\"4. @Autowired DataSource 或 JdbcTemplate 使用\");\n    }\n}",
        "estimatedMinutes": 20,
        "tags": [
          "进阶",
          "实战"
        ]
      }
    ]
  },
  {
    "id": "p7-orm-concept",
    "title": "ORM 概念",
    "description": "JDBC → ORM 的演进",
    "estimatedHours": 1,
    "knowledgePoints": [
      {
        "id": "p7-kp-jdbc-to-orm",
        "title": "JDBC → ORM 演进",
        "shortDesc": "ORM 让你用\"操作对象\"的方式操作数据库——不用手写 SQL 拼接和结果映射",
        "deepPrinciple": "<p>ORM（Object-Relational Mapping）将数据库表映射为 Java 对象：</p><ul><li><strong>纯 JDBC</strong>：手写 SQL + 手动映射 ResultSet → 对象（灵活但繁琐）</li><li><strong>JdbcTemplate</strong>：Spring 封装，简化资源管理和异常处理</li><li><strong>MyBatis</strong>：半自动 ORM，SQL 写在 XML/注解中，自动映射结果</li><li><strong>JPA/Hibernate</strong>：全自动 ORM，SQL 由框架生成</li></ul>",
        "scenario": "从纯 JDBC 的几十行代码，到 MyBatis 的一个接口方法+一行 SQL，再到 JPA 的零 SQL。效率逐步提升。",
        "codeExample": "// 对比三种方式查询用户\n\n// 1. 纯 JDBC（繁琐）\n// PreparedStatement ps = conn.prepareStatement(\"SELECT * FROM users WHERE id=?\");\n// ps.setInt(1, id);\n// ResultSet rs = ps.executeQuery();\n// if (rs.next()) { user.setName(rs.getString(\"name\")); ... }\n\n// 2. MyBatis（半自动，自己写SQL）\n// @Select(\"SELECT * FROM users WHERE id = #{id}\")\n// User findById(int id);\n\n// 3. JPA（全自动，零SQL）\n// public interface UserRepository extends JpaRepository<User, Integer> {\n//     // 自动生成 SELECT * FROM users WHERE id = ?\n// }\n\npublic class OrmCompareDemo {\n    public static void main(String[] args) {\n        System.out.println(\"=== ORM 演进对比 ===\");\n        System.out.println(\"纯 JDBC:    灵活，但代码量大，手动资源管理\");\n        System.out.println(\"MyBatis:    半自动，SQL 可控，自动结果映射\");\n        System.out.println(\"JPA:        全自动，零 SQL，适合简单 CRUD\");\n        System.out.println();\n        System.out.println(\"=== 选型建议 ===\");\n        System.out.println(\"复杂查询多 → MyBatis（SQL 可控）\");\n        System.out.println(\"简单 CRUD 多 → JPA（开发效率高）\");\n        System.out.println(\"国内互联网公司主流 → MyBatis\");\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p7-kp-mybatis-vs-jpa",
        "title": "MyBatis 半自动 vs JPA 全自动",
        "shortDesc": "MyBatis 像手动挡车——你掌控SQL；JPA 像自动挡——省心但控制力弱",
        "deepPrinciple": "<p><strong>MyBatis</strong>（半自动）：开发者写 SQL，框架负责参数绑定和结果映射。优点：SQL 完全可控、性能优化空间大、学习成本低。缺点：SQL 量大。</p><p><strong>JPA/Hibernate</strong>（全自动）：框架根据实体类和方法名自动生成 SQL。优点：开发效率极高、跨数据库。缺点：复杂查询难优化、学习曲线陡（N+1 问题、懒加载等）。</p><p>国内互联网公司主流选 MyBatis（SQL 可控），外企和简单项目多用 JPA。</p>",
        "scenario": "电商系统：商品搜索涉及多表关联+全文检索，用 MyBatis 手写优化 SQL。\n内部管理系统：简单 CRUD，用 JPA 快速开发。",
        "codeExample": "// MyBatis 示例（XML方式）\n// <mapper namespace=\"com.example.UserMapper\">\n//   <select id=\"findByCondition\" resultType=\"User\">\n//     SELECT * FROM users\n//     <where>\n//       <if test=\"name != null\"> AND name LIKE concat('%', #{name}, '%') </if>\n//       <if test=\"age != null\"> AND age > #{age} </if>\n//     </where>\n//     ORDER BY id DESC LIMIT #{offset}, #{limit}\n//   </select>\n// </mapper>\n\n// JPA 示例\n// @Entity\n// @Table(name = \"users\")\n// public class User {\n//     @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n//     private Integer id;\n//     private String name;\n//     private Integer age;\n// }\n// public interface UserRepository extends JpaRepository<User, Integer> {\n//     List<User> findByNameContainingAndAgeGreaterThan(String name, int age);\n// }\n\npublic class MyBatisVsJpaDemo {\n    public static void main(String[] args) {\n        System.out.println(\"MyBatis: SQL 写在 XML/注解，可精确控制\");\n        System.out.println(\"JPA: 方法名自动生成 SQL，零 SQL 开发\");\n        System.out.println(\"MyBatis-Plus: MyBatis 增强，简单 CRUD 也能零 SQL\");\n    }\n}",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      }
    ]
  },
  {
    "id": "p7-db-design",
    "title": "数据库设计基础",
    "description": "三范式、索引与执行计划",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p7-kp-normal-forms",
        "title": "三范式",
        "shortDesc": "三范式是表设计的\"卫生标准\"——消除冗余，保持数据整洁",
        "deepPrinciple": "<p>数据库设计三范式（逐步递进）：</p><ul><li><strong>第一范式（1NF）</strong>：列不可再分（原子性）。例如\"地址\"不应存\"省市区\"在一列</li><li><strong>第二范式（2NF）</strong>：非主键列完全依赖主键（消除部分依赖）。联合主键时每列必须依赖整个主键</li><li><strong>第三范式（3NF）</strong>：非主键列不传递依赖主键。例如\"部门名称\"不应存在员工表中，应通过部门ID关联</li></ul><p>实际开发中可能<strong>适当反范式化</strong>（冗余字段）以提升查询性能。</p>",
        "scenario": "订单表中冗余存储\"商品名称\"（违反3NF），避免每次查询都要关联商品表。这是用空间换时间的权衡。",
        "codeExample": "-- 第一范式: 列不可再分\n-- 错误: address 列存 \"北京市海淀区xxx路\"\n-- 正确: 拆分为 province, city, district, detail\n\n-- 第二范式: 消除部分依赖\n-- 错误: 订单明细表(order_id, product_id, product_name, quantity)\n--   product_name 只依赖 product_id，不依赖 order_id\n-- 正确: 订单明细表(order_id, product_id, quantity) + 商品表(product_id, product_name)\n\n-- 第三范式: 消除传递依赖\n-- 错误: 员工表(emp_id, emp_name, dept_id, dept_name)\n--   dept_name 依赖 dept_id 依赖 emp_id（传递依赖）\n-- 正确:\nCREATE TABLE department (\n    dept_id INT PRIMARY KEY,\n    dept_name VARCHAR(50) NOT NULL\n);\n\nCREATE TABLE employee (\n    emp_id INT PRIMARY KEY,\n    emp_name VARCHAR(50) NOT NULL,\n    dept_id INT,\n    FOREIGN KEY (dept_id) REFERENCES department(dept_id)\n);",
        "estimatedMinutes": 25,
        "tags": [
          "基础",
          "必学"
        ]
      },
      {
        "id": "p7-kp-index",
        "title": "索引优化入门（B+Tree）",
        "shortDesc": "索引就像书的目录——没有目录只能翻遍全书，有了目录直接翻到对应页码",
        "deepPrinciple": "<p>MySQL InnoDB 索引基于 <strong>B+Tree</strong> 结构：</p><ul><li>叶子节点存储完整数据（聚簇索引）或主键值（二级索引）</li><li>所有叶子节点通过双向链表连接，支持范围查询</li><li>树高通常 3~4 层，千万级数据只需 3~4 次磁盘 IO</li></ul><p>索引选择原则：</p><ul><li>WHERE/JOIN/ORDER BY 的列优先建索引</li><li>区分度低的列（如性别）不适合单独建索引</li><li>联合索引遵循<strong>最左前缀原则</strong></li></ul>",
        "scenario": "users 表 100 万行，WHERE name=\"张三\" 全表扫描 500ms，加索引后 1ms。",
        "codeExample": "-- 索引基本操作\n-- 创建单列索引\nCREATE INDEX idx_user_name ON users(name);\n\n-- 创建联合索引（最左前缀原则）\nCREATE INDEX idx_user_name_age ON users(name, age);\n-- 生效: WHERE name='张三'\n-- 生效: WHERE name='张三' AND age>20\n-- 不生效: WHERE age>20 (没有最左列 name)\n\n-- 唯一索引\nCREATE UNIQUE INDEX uk_user_email ON users(email);\n\n-- 查看表的索引\nSHOW INDEX FROM users;\n\n-- EXPLAIN 查看是否使用索引\nEXPLAIN SELECT * FROM users WHERE name = '张三';\n-- type=ref 表示使用了索引\n-- type=ALL 表示全表扫描（需要优化!）\n\n-- 删除索引\nDROP INDEX idx_user_name ON users;",
        "estimatedMinutes": 30,
        "tags": [
          "基础",
          "必学",
          "面试"
        ]
      },
      {
        "id": "p7-kp-explain",
        "title": "EXPLAIN 执行计划",
        "shortDesc": "EXPLAIN 是 SQL 的\"体检报告\"——告诉你这条 SQL 快不快、走没走索引",
        "deepPrinciple": "<p>EXPLAIN 输出的关键字段：</p><ul><li><strong>type</strong>：访问类型（从好到差：const > eq_ref > ref > range > index > ALL）</li><li><strong>key</strong>：实际使用的索引</li><li><strong>rows</strong>：预估扫描行数（越少越好）</li><li><strong>Extra</strong>：Using index（覆盖索引，最好）、Using filesort（文件排序，需优化）、Using temporary（临时表，需优化）</li></ul><p>SQL 优化口诀：避免 ALL 全表扫描、避免 filesort、避免 SELECT *、用覆盖索引。</p>",
        "scenario": "慢查询日志发现某 SQL 耗时 3 秒，EXPLAIN 发现 type=ALL rows=100万。加索引后 type=ref rows=5，耗时 5ms。",
        "codeExample": "-- EXPLAIN 使用示例\nEXPLAIN SELECT * FROM users WHERE name = '张三';\n-- 关注: type, key, rows, Extra\n\n-- type 从好到差:\n-- const:    主键或唯一索引等值查询（最快）\n-- eq_ref:   JOIN 中主键/唯一索引关联\n-- ref:      普通索引等值查询\n-- range:    索引范围查询 (>, <, BETWEEN, IN)\n-- index:    全索引扫描\n-- ALL:      全表扫描（最慢，必须优化!）\n\n-- 优化前\nEXPLAIN SELECT * FROM orders WHERE user_id = 100 ORDER BY create_time DESC;\n-- type=ALL, rows=500000, Extra=Using filesort\n\n-- 优化: 添加联合索引\nCREATE INDEX idx_orders_uid_time ON orders(user_id, create_time);\n\n-- 优化后\nEXPLAIN SELECT * FROM orders WHERE user_id = 100 ORDER BY create_time DESC;\n-- type=ref, rows=50, Extra=Using index",
        "estimatedMinutes": 30,
        "tags": [
          "进阶",
          "必学",
          "面试"
        ]
      }
    ]
  },
  {
    "id": "p7-practice",
    "title": "实战",
    "description": "学生管理系统设计",
    "estimatedHours": 2,
    "knowledgePoints": [
      {
        "id": "p7-kp-er-design",
        "title": "学生管理系统表设计与 ER 图",
        "shortDesc": "表设计是编码前最重要的一步——地基打不好，楼盖得再漂亮也会塌",
        "deepPrinciple": "<p>表设计流程：</p><ul><li>1. 需求分析：确定实体（学生、课程、班级、成绩）和关系</li><li>2. ER 图：实体用矩形，属性用椭圆，关系用菱形（1:N、M:N）</li><li>3. 转为表结构：实体 → 表，M:N 关系 → 中间表</li><li>4. 确定字段类型、约束、索引</li></ul><p>学生管理系统的核心关系：学生 N:1 班级、学生 M:N 课程（通过成绩表关联）。</p>",
        "scenario": "面试手撕表设计：画 ER 图 → 写建表 SQL → 说明索引策略 → 写几个典型查询。",
        "codeExample": "-- ER 关系:\n-- 班级(1) --< 学生(N)\n-- 学生(M) >--< 课程(N)  通过成绩表关联\n\n-- 班级表\nCREATE TABLE class (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(50) NOT NULL COMMENT '班级名称',\n    grade INT NOT NULL COMMENT '年级',\n    created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n) COMMENT '班级表';\n\n-- 学生表\nCREATE TABLE student (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(50) NOT NULL COMMENT '姓名',\n    gender TINYINT NOT NULL DEFAULT 0 COMMENT '性别 0未知 1男 2女',\n    birth_date DATE COMMENT '出生日期',\n    class_id INT NOT NULL COMMENT '班级ID',\n    phone VARCHAR(20) COMMENT '联系电话',\n    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n    INDEX idx_class_id (class_id),\n    FOREIGN KEY (class_id) REFERENCES class(id)\n) COMMENT '学生表';\n\n-- 课程表\nCREATE TABLE course (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(100) NOT NULL COMMENT '课程名称',\n    credit DECIMAL(3,1) NOT NULL COMMENT '学分',\n    teacher VARCHAR(50) COMMENT '授课教师'\n) COMMENT '课程表';\n\n-- 成绩表（M:N 中间表）\nCREATE TABLE score (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    student_id INT NOT NULL,\n    course_id INT NOT NULL,\n    score DECIMAL(5,2) COMMENT '成绩',\n    exam_date DATE COMMENT '考试日期',\n    UNIQUE KEY uk_stu_course (student_id, course_id),\n    INDEX idx_course_id (course_id),\n    FOREIGN KEY (student_id) REFERENCES student(id),\n    FOREIGN KEY (course_id) REFERENCES course(id)\n) COMMENT '成绩表';",
        "estimatedMinutes": 35,
        "tags": [
          "实战",
          "必学"
        ]
      },
      {
        "id": "p7-kp-practice-sql",
        "title": "典型查询 SQL",
        "shortDesc": "学会这些典型查询模式，工作中 80% 的 SQL 需求都能搞定",
        "deepPrinciple": "<p>掌握几类核心查询模式：</p><ul><li><strong>多表 JOIN</strong>：INNER JOIN / LEFT JOIN 关联查询</li><li><strong>聚合统计</strong>：GROUP BY + HAVING + 聚合函数</li><li><strong>子查询</strong>：EXISTS / IN / 标量子查询</li><li><strong>分页查询</strong>：LIMIT offset, size</li></ul><p>写 SQL 的原则：先写出正确的，再优化性能（EXPLAIN 检查）。</p>",
        "scenario": "查询每个班级的平均分和最高分、查询不及格学生名单、查询选课人数排名——这些是日常工作中最常见的需求。",
        "codeExample": "-- 插入测试数据\nINSERT INTO class(name, grade) VALUES ('一班', 2024), ('二班', 2024);\nINSERT INTO student(name, gender, class_id) VALUES\n    ('张三', 1, 1), ('李四', 2, 1), ('王五', 1, 2);\nINSERT INTO course(name, credit, teacher) VALUES\n    ('Java程序设计', 4.0, '赵老师'), ('数据库原理', 3.0, '钱老师');\nINSERT INTO score(student_id, course_id, score) VALUES\n    (1, 1, 92), (1, 2, 85), (2, 1, 58), (2, 2, 76), (3, 1, 88);\n\n-- 1. 查询学生及其班级（JOIN）\nSELECT s.name AS 学生, c.name AS 班级\nFROM student s INNER JOIN class c ON s.class_id = c.id;\n\n-- 2. 查询每个学生的平均分（聚合）\nSELECT s.name, ROUND(AVG(sc.score), 1) AS 平均分, COUNT(*) AS 选课数\nFROM student s LEFT JOIN score sc ON s.id = sc.student_id\nGROUP BY s.id, s.name;\n\n-- 3. 查询不及格学生（多表+条件）\nSELECT s.name AS 学生, co.name AS 课程, sc.score\nFROM score sc\nJOIN student s ON sc.student_id = s.id\nJOIN course co ON sc.course_id = co.id\nWHERE sc.score < 60;\n\n-- 4. 查询每门课最高分学生（子查询）\nSELECT co.name AS 课程, s.name AS 学生, sc.score\nFROM score sc\nJOIN student s ON sc.student_id = s.id\nJOIN course co ON sc.course_id = co.id\nWHERE sc.score = (\n    SELECT MAX(score) FROM score WHERE course_id = sc.course_id\n);\n\n-- 5. 分页查询（第2页，每页10条）\nSELECT * FROM student ORDER BY id LIMIT 10 OFFSET 10;",
        "estimatedMinutes": 30,
        "tags": [
          "实战",
          "必学"
        ]
      }
    ]
  }
];
