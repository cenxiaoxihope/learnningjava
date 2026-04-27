// ============================================================
// Phase 0 ~ Phase 3 Java 学习知识点数据
// ============================================================

// ======================== Phase 0: 前置基础 ========================
export const phase0Topics = [
  {
    id: 'p0-sql-basics',
    title: 'SQL 入门',
    description: '掌握数据库最核心的增删改查操作，为后端开发打下数据基础',
    estimatedHours: 6,
    knowledgePoints: [
      {
        id: 'p0-sql-select',
        title: 'SELECT 查询语句',
        shortDesc: 'SELECT 就像在图书馆按条件找书——告诉数据库你想看哪些数据',
        deepPrinciple: '<p>SELECT 是 SQL 中最常用的语句，用于从表中检索数据。执行顺序与书写顺序不同：FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT。</p><ul><li>解析阶段：检查语法和表/列是否存在</li><li>优化阶段：查询优化器选择最优执行计划</li><li>执行阶段：按计划读取数据并返回结果集</li></ul>',
        scenario: '在电商系统中，运营人员需要查看某时间段内所有订单的商品名称和金额。',
        codeExample: '-- 基础查询\nSELECT * FROM users;\n\n-- 指定列查询\nSELECT name, email FROM users;\n\n-- 使用别名\nSELECT name AS 用户名, email AS 邮箱 FROM users;\n\n-- 去重\nSELECT DISTINCT city FROM users;\n\n-- 限制返回行数\nSELECT * FROM users LIMIT 10;',
        estimatedMinutes: 30,
        tags: ['SQL', '基础', '必学']
      },
      {
        id: 'p0-sql-dml',
        title: 'INSERT / UPDATE / DELETE',
        shortDesc: '增删改三兄弟——INSERT 添新书、UPDATE 改标签、DELETE 扔旧书',
        deepPrinciple: '<p>INSERT、UPDATE、DELETE 是数据操作语言(DML)核心语句。</p><ul><li><strong>INSERT</strong>：插入数据，违反唯一约束会报错</li><li><strong>UPDATE</strong>：修改数据，<strong>务必带 WHERE</strong></li><li><strong>DELETE</strong>：删除数据，<strong>务必带 WHERE</strong></li></ul><p>实际开发中推荐「逻辑删除」（is_deleted=1）而非物理删除。</p>',
        scenario: '用户注册INSERT、修改信息UPDATE、注销DELETE（或逻辑删除）。',
        codeExample: '-- 插入\nINSERT INTO users (name, email, age)\nVALUES (\'张三\', \'zhangsan@example.com\', 25);\n\n-- 批量插入\nINSERT INTO users (name, email, age) VALUES\n(\'李四\', \'lisi@example.com\', 30),\n(\'王五\', \'wangwu@example.com\', 28);\n\n-- 更新\nUPDATE users SET age = 26 WHERE name = \'张三\';\n\n-- 删除\nDELETE FROM users WHERE name = \'王五\';\n\n-- 逻辑删除（推荐）\nUPDATE users SET is_deleted = 1 WHERE id = 3;',
        estimatedMinutes: 30,
        tags: ['SQL', '基础', '必学']
      },
      {
        id: 'p0-sql-where',
        title: 'WHERE 条件过滤',
        shortDesc: 'WHERE 是数据的「筛子」——只放行符合条件的数据',
        deepPrinciple: '<p>WHERE 子句过滤数据行，支持多种条件：</p><ul><li>比较：=、!=、>、<、>=、<=</li><li>范围：BETWEEN ... AND ...</li><li>集合：IN (...)</li><li>模糊：LIKE（% 任意字符，_ 单字符）</li><li>空值：IS NULL / IS NOT NULL</li><li>逻辑：AND、OR、NOT</li></ul><p>条件写法影响性能——利用索引的条件放前面。</p>',
        scenario: '查询「价格100~500且库存>0的上架商品」需要组合多个条件。',
        codeExample: '-- 范围\nSELECT * FROM products WHERE price BETWEEN 100 AND 500;\n\n-- IN 集合\nSELECT * FROM users WHERE city IN (\'北京\', \'上海\');\n\n-- 模糊匹配\nSELECT * FROM users WHERE name LIKE \'张%\';\n\n-- 空值判断\nSELECT * FROM orders WHERE shipped_at IS NULL;\n\n-- 组合条件\nSELECT * FROM products\nWHERE price BETWEEN 100 AND 500\n  AND stock > 0 AND status = \'ON_SALE\';',
        estimatedMinutes: 25,
        tags: ['SQL', '基础', '必学']
      },
      {
        id: 'p0-sql-join',
        title: 'JOIN 联表查询',
        shortDesc: 'JOIN 像拼图——把分散在不同表里的信息拼到一起看',
        deepPrinciple: '<p>JOIN 把多表数据关联起来：</p><ul><li><strong>INNER JOIN</strong>：只返回匹配行（交集）</li><li><strong>LEFT JOIN</strong>：左表全部 + 右表匹配</li><li><strong>RIGHT JOIN</strong>：右表全部 + 左表匹配</li></ul><p>性能关键：ON 条件列需要建索引。</p>',
        scenario: '订单表只存 user_id，要显示下单人姓名就需要 JOIN 用户表。',
        codeExample: '-- INNER JOIN\nSELECT u.name, o.order_no, o.total_amount\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id;\n\n-- LEFT JOIN\nSELECT u.name, o.order_no\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id;\n\n-- 多表联查\nSELECT u.name, o.order_no, p.product_name, oi.quantity\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN order_items oi ON o.id = oi.order_id\nJOIN products p ON oi.product_id = p.id;',
        estimatedMinutes: 40,
        tags: ['SQL', '基础', '必学']
      },
      {
        id: 'p0-sql-group-order',
        title: 'GROUP BY 聚合与 ORDER BY 排序',
        shortDesc: 'GROUP BY 按类分堆统计，ORDER BY 决定排列顺序',
        deepPrinciple: '<p><strong>GROUP BY</strong> 配合聚合函数：COUNT、SUM、AVG、MAX、MIN。HAVING 过滤分组结果。</p><p><strong>ORDER BY</strong>：ASC 升序（默认），DESC 降序。</p><p>注意：SELECT 中非聚合列必须在 GROUP BY 中。</p>',
        scenario: '统计每个品类的商品数量和平均价格，按销量降序。',
        codeExample: '-- 分组统计\nSELECT city, COUNT(*) AS user_count\nFROM users GROUP BY city;\n\n-- 聚合 + 过滤\nSELECT category, AVG(price) AS avg_price\nFROM products\nGROUP BY category\nHAVING AVG(price) > 100;\n\n-- 排序 + 分页\nSELECT user_id, SUM(total_amount) AS total_spent\nFROM orders\nGROUP BY user_id\nORDER BY total_spent DESC\nLIMIT 10;',
        estimatedMinutes: 35,
        tags: ['SQL', '基础', '必学']
      }
    ]
  },
  {
    id: 'p0-db-concepts',
    title: '数据库概念',
    description: '理解关系型数据库的核心概念',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'p0-db-table-row-col',
        title: '表 / 行 / 列',
        shortDesc: '数据库表就像 Excel 表格——列是表头，行是记录',
        deepPrinciple: '<p>关系型数据库以二维表为核心：</p><ul><li><strong>表(Table)</strong>：某类实体的数据集合</li><li><strong>列(Column)</strong>：数据属性，有固定类型</li><li><strong>行(Row)</strong>：一条数据记录</li></ul><p>常见类型：INT、BIGINT、DECIMAL、VARCHAR、TEXT、DATETIME。</p>',
        scenario: '设计用户系统，创建含 id、name、email、created_at 列的 users 表。',
        codeExample: 'CREATE TABLE users (\n    id BIGINT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(50) NOT NULL COMMENT \'姓名\',\n    email VARCHAR(100) NOT NULL UNIQUE,\n    age INT DEFAULT 0,\n    balance DECIMAL(10,2) DEFAULT 0.00,\n    created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
        estimatedMinutes: 25,
        tags: ['数据库', '基础', '必学']
      },
      {
        id: 'p0-db-pk-fk',
        title: '主键与外键',
        shortDesc: '主键是数据的「身份证号」，外键是表间的「关系证明」',
        deepPrinciple: '<p><strong>主键</strong>：唯一标识每行，非空唯一。自增主键最常用。</p><p><strong>外键</strong>：引用另一表主键，保证引用完整性。</p><p>实际开发中常在应用层维护关联而不用数据库外键约束。</p>',
        scenario: '订单表 user_id 引用 users 表 id，保证订单属于真实用户。',
        codeExample: 'CREATE TABLE orders (\n    id BIGINT AUTO_INCREMENT PRIMARY KEY,\n    order_no VARCHAR(32) NOT NULL,\n    user_id BIGINT NOT NULL,\n    total_amount DECIMAL(10,2) NOT NULL,\n    CONSTRAINT fk_user\n        FOREIGN KEY (user_id) REFERENCES users(id)\n);\n\n-- 复合主键\nCREATE TABLE user_roles (\n    user_id BIGINT, role_id BIGINT,\n    PRIMARY KEY (user_id, role_id)\n);',
        estimatedMinutes: 30,
        tags: ['数据库', '基础', '必学']
      },
      {
        id: 'p0-db-index',
        title: '索引概念',
        shortDesc: '索引像书的目录——快速定位而不用翻遍全书',
        deepPrinciple: '<p>索引加速查询，MySQL InnoDB 用 B+ 树：</p><ul><li><strong>主键索引(聚簇)</strong>：数据按主键存储</li><li><strong>普通索引</strong>：加速指定列查询</li><li><strong>唯一索引</strong>：普通索引+唯一约束</li><li><strong>组合索引</strong>：多列组合，遵循最左前缀原则</li></ul><p>代价：占空间、写入时需维护。</p>',
        scenario: '百万级商品表无索引时查询慢，建了索引后瞬间返回。',
        codeExample: '-- 普通索引\nCREATE INDEX idx_email ON users(email);\n\n-- 唯一索引\nCREATE UNIQUE INDEX uk_phone ON users(phone);\n\n-- 组合索引\nCREATE INDEX idx_cat_price ON products(category, price);\n\n-- 分析查询是否走索引\nEXPLAIN SELECT * FROM users WHERE email = \'test@test.com\';',
        estimatedMinutes: 30,
        tags: ['数据库', '基础', '必学']
      }
    ]
  },
  {
    id: 'p0-mysql-install',
    title: 'MySQL 安装与配置',
    description: '搭建 MySQL 本地开发环境',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'p0-mysql-win-install',
        title: 'Windows 安装 MySQL',
        shortDesc: '在 Windows 上安装 MySQL，注意字符集和认证方式的配置',
        deepPrinciple: '<p>两种安装方式：MSI安装包(推荐)或ZIP解压。选择 MySQL 8.0+ LTS 版本，认证方式推荐 caching_sha2_password 或 mysql_native_password。牢记 root 密码。</p>',
        scenario: 'Java 后端开发的第一步，所有数据库练习依赖本地环境。',
        codeExample: '-- 连接\nmysql -u root -p\n\n-- 验证\nSELECT VERSION();\nSHOW DATABASES;\n\n-- 创建学习数据库\nCREATE DATABASE java_learning\nDEFAULT CHARACTER SET utf8mb4;',
        estimatedMinutes: 40,
        tags: ['环境搭建', '必学']
      },
      {
        id: 'p0-mysql-config',
        title: 'MySQL 基本配置',
        shortDesc: '配置字符集、端口、连接数等基础参数',
        deepPrinciple: '<p>配置文件 my.ini/my.cnf 核心项：字符集 utf8mb4、端口 3306、引擎 InnoDB、max_connections。生产环境需创建专用账号。</p>',
        scenario: '统一团队配置标准，避免中文乱码。',
        codeExample: 'SHOW VARIABLES LIKE \'character%\';\n\n-- 创建开发账号\nCREATE USER \'dev\'@\'localhost\'\n    IDENTIFIED BY \'DevPass@2024\';\nGRANT ALL ON java_learning.* TO \'dev\'@\'localhost\';\nFLUSH PRIVILEGES;',
        estimatedMinutes: 30,
        tags: ['环境搭建', '必学']
      }
    ]
  },
  {
    id: 'p0-linux-basics',
    title: 'Linux 基础命令',
    description: '后端开发必备的服务器操作技能',
    estimatedHours: 5,
    knowledgePoints: [
      {
        id: 'p0-linux-file-ops',
        title: 'ls / cd / mkdir / rm / cp / mv',
        shortDesc: '文件管理器的命令行版——查看、进入、新建、删除、复制、移动',
        deepPrinciple: '<p>Linux 一切皆文件：ls(-la详细)、cd(~家目录)、mkdir(-p递归)、rm(-rf极危险)、cp(-r目录)、mv(移动/重命名)。路径分绝对(/)和相对。</p>',
        scenario: '部署Java应用到服务器：创建目录、上传JAR、备份旧版本。',
        codeExample: 'ls -la\nmkdir -p /opt/apps/myproject/logs\ncp app.jar app.jar.bak\ncp -r config/ config_backup/\nmv app-new.jar app.jar\nrm -rf /tmp/old-logs/',
        estimatedMinutes: 30,
        tags: ['Linux', '基础', '必学']
      },
      {
        id: 'p0-linux-chmod',
        title: '权限 chmod',
        shortDesc: '文件权限就像门禁——谁能看(r=4)、谁能改(w=2)、谁能执行(x=1)',
        deepPrinciple: '<p>权限基于 User/Group/Others 三维度，每维度有 rwx 三权限。chmod 755 = rwxr-xr-x。</p>',
        scenario: '启动脚本需要可执行权限，配置文件限制读取权限。',
        codeExample: 'chmod +x start.sh\nchmod 755 start.sh    # rwxr-xr-x\nchmod 644 config.yml  # rw-r--r--\nchmod 600 secret.key  # rw-------\nchown deploy:deploy app.jar',
        estimatedMinutes: 25,
        tags: ['Linux', '基础', '必学']
      },
      {
        id: 'p0-linux-pipe-redirect',
        title: '管道 | 和重定向 >',
        shortDesc: '管道把命令串联起来，重定向把输出导向文件',
        deepPrinciple: '<p>管道 | 将前命令输出作为后命令输入。重定向：> 覆盖、>> 追加、2>&1 合并错误输出。组合简单命令完成复杂任务是Linux哲学核心。</p>',
        scenario: '从海量日志中筛选错误：grep过滤 → sort排序 → uniq去重。',
        codeExample: 'cat app.log | grep "ERROR" | wc -l\nps aux | sort -k4 -rn | head -5\nps -ef | grep java\njava -jar app.jar > app.log 2>&1 &',
        estimatedMinutes: 30,
        tags: ['Linux', '基础', '必学']
      },
      {
        id: 'p0-linux-vim',
        title: 'Vim 基础操作',
        shortDesc: '掌握 Vim 的三种模式和基本操作就能应对紧急修改',
        deepPrinciple: '<p>三种模式：普通(默认)、插入(i进入)、命令(:进入)。核心操作：i插入、Esc退出、:wq保存退出、:q!强制退出、/搜索。</p>',
        scenario: '线上服务器紧急修改配置文件，只有Vim可用。',
        codeExample: '# vim application.yml\n# i       插入\n# Esc     回普通模式\n# dd      删除行\n# yy/p    复制/粘贴行\n# u       撤销\n# /word   搜索\n# :%s/old/new/g  全局替换\n# :wq     保存退出\n# :q!     不保存退出',
        estimatedMinutes: 30,
        tags: ['Linux', '基础', '必学']
      },
      {
        id: 'p0-linux-grep-find-tail',
        title: 'grep / find / tail',
        shortDesc: '排查问题必备——搜索文本、查找文件、实时追踪日志',
        deepPrinciple: '<p>grep 搜文本(-rn递归带行号)、find 找文件(-name/-mtime/-size)、tail -f 实时追踪日志(后端最常用命令之一)。</p>',
        scenario: '应用报错：tail -f看日志 → grep搜关键字 → find找配置文件。',
        codeExample: 'tail -f app.log\ntail -f app.log | grep "ERROR"\ngrep -rn "NullPointerException" logs/\ngrep -C 3 "OutOfMemory" app.log\nfind /opt -name "*.yml"\nfind /opt -name "*.log" -mtime +7',
        estimatedMinutes: 30,
        tags: ['Linux', '基础', '必学']
      }
    ]
  },
  {
    id: 'p0-git-basics',
    title: 'Git 基础',
    description: '版本控制工具 Git 核心操作',
    estimatedHours: 4,
    knowledgePoints: [
      {
        id: 'p0-git-clone-init',
        title: 'clone 与仓库初始化',
        shortDesc: 'clone 下载完整项目历史，init 在本地建立版本仓库',
        deepPrinciple: '<p>Git 是分布式VCS，本地有完整副本。git init 初始化仓库，git clone 复制远程仓库。三个区域：工作区→暂存区(add)→仓库(commit)。</p>',
        scenario: '入职第一天从 GitLab clone 项目代码。',
        codeExample: 'git clone https://github.com/company/project.git\ngit init\ngit remote add origin https://github.com/you/repo.git\ngit status\ngit remote -v',
        estimatedMinutes: 20,
        tags: ['Git', '基础', '必学']
      },
      {
        id: 'p0-git-workflow',
        title: 'add / commit / push / pull',
        shortDesc: 'add打包、commit存档、push上传、pull下载——日常四步曲',
        deepPrinciple: '<p>git add 添加到暂存区，git commit 记录到本地仓库(生成SHA-1哈希)，git push 推送远程，git pull 拉取并合并(=fetch+merge)。好的commit message很重要。</p>',
        scenario: '修Bug：add修改 → commit说明 → push提交 → 同事pull获取。',
        codeExample: 'git status\ngit add .\ngit commit -m "fix(user): 修复登录校验失败"\ngit push origin main\ngit pull origin main\ngit log --oneline -10',
        estimatedMinutes: 30,
        tags: ['Git', '基础', '必学']
      },
      {
        id: 'p0-git-branch',
        title: '分支 branch',
        shortDesc: '分支就像平行宇宙——不影响主线地做开发',
        deepPrinciple: '<p>分支是指向commit的轻量指针，创建切换几乎零成本。常见策略：main→develop→feature/xxx。</p>',
        scenario: '开发购物车功能，创建 feature/cart 分支独立开发。',
        codeExample: 'git branch\ngit switch -c feature/cart\ngit push -u origin feature/cart\ngit branch -d feature/cart\ngit push origin --delete feature/cart',
        estimatedMinutes: 25,
        tags: ['Git', '基础', '必学']
      },
      {
        id: 'p0-git-merge-rebase',
        title: 'merge 与 rebase',
        shortDesc: 'merge 合流保留历史，rebase 变基让历史更干净',
        deepPrinciple: '<p>merge 创建合并提交保留历史，rebase 将提交搬到目标分支后面形成直线。绝不在公共分支rebase。规范：合并到主分支用merge，更新个人分支用rebase。</p>',
        scenario: '同步main最新改动到feature分支(rebase)，完成后合并回main(merge)。',
        codeExample: '# Merge\ngit switch main && git merge feature/cart\n\n# Rebase\ngit switch feature/cart && git rebase main\n\n# 冲突后\ngit add . && git rebase --continue',
        estimatedMinutes: 35,
        tags: ['Git', '基础', '必学']
      }
    ]
  },
  {
    id: 'p0-jdk-install',
    title: 'JDK 安装与配置',
    description: '安装 Java 开发工具包',
    estimatedHours: 1,
    knowledgePoints: [
      {
        id: 'p0-jdk17-install',
        title: 'JDK 17 安装',
        shortDesc: 'JDK 是 Java 的「翻译官+工具箱」，包含编译器和运行环境',
        deepPrinciple: '<p>JDK = JRE(运行环境) + 开发工具(javac等)。JDK 17 是 LTS 版本，Spring Boot 3.x 要求最低 JDK 17。推荐 Eclipse Temurin。</p>',
        scenario: 'JDK 是 Java 开发的起点，现代企业项目要求 JDK 17+。',
        codeExample: '// 验证安装\n// java -version → openjdk 17.x.x\n// javac -version → javac 17.x.x\n\npublic class VersionCheck {\n    public static void main(String[] args) {\n        System.out.println("Java: "\n            + System.getProperty("java.version"));\n    }\n}',
        estimatedMinutes: 20,
        tags: ['环境搭建', '必学']
      },
      {
        id: 'p0-jdk-env-var',
        title: 'JAVA_HOME 环境变量配置',
        shortDesc: 'JAVA_HOME 告诉系统和工具 Java 装在哪里',
        deepPrinciple: '<p>JAVA_HOME 指向 JDK 安装目录，Maven/Gradle/IDEA/Tomcat 都依赖它。PATH 添加 %JAVA_HOME%\\bin 使命令全局可用。多版本切换只需改 JAVA_HOME。</p>',
        scenario: '项目启动提示「找不到JDK」通常是 JAVA_HOME 配置问题。',
        codeExample: '// Windows:\n// setx JAVA_HOME "C:\\Program Files\\Java\\jdk-17" /M\n\n// Linux (~/.bashrc):\n// export JAVA_HOME=/usr/lib/jvm/java-17\n// export PATH=$JAVA_HOME/bin:$PATH\n\npublic class EnvCheck {\n    public static void main(String[] args) {\n        System.out.println("JAVA_HOME = "\n            + System.getenv("JAVA_HOME"));\n    }\n}',
        estimatedMinutes: 15,
        tags: ['环境搭建', '必学']
      }
    ]
  },
  {
    id: 'p0-idea-setup',
    title: 'IntelliJ IDEA 使用',
    description: '掌握最流行的 Java IDE',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'p0-idea-install',
        title: '安装与创建项目',
        shortDesc: 'IDEA 是 Java 开发者的「驾驶舱」',
        deepPrinciple: '<p>Community版免费满足基础开发，Ultimate支持Spring等企业功能。项目结构：src/main/java(源码)、src/main/resources(配置)、src/test/java(测试)。</p>',
        scenario: '学 Java 第一步安装 IDEA 并创建项目。',
        codeExample: '// Maven 项目目录结构\n// src/main/java/com/example/App.java\n// src/main/resources/\n// src/test/java/\n// pom.xml\n\npackage com.example;\n\npublic class App {\n    public static void main(String[] args) {\n        System.out.println("项目创建成功！");\n    }\n}',
        estimatedMinutes: 30,
        tags: ['工具', '必学']
      },
      {
        id: 'p0-idea-debug',
        title: '调试与断点',
        shortDesc: '断点调试像给代码装了「慢动作摄像头」',
        deepPrinciple: '<p>断点让程序暂停：Step Over(F8)下一行、Step Into(F7)进入方法、Step Out(Shift+F8)跳出、Resume(F9)继续。可查看变量值、调用栈、设置条件断点。</p>',
        scenario: '计算结果不对时，断点逐步查看中间值定位问题。',
        codeExample: 'public class DebugDemo {\n    public static void main(String[] args) {\n        int[] nums = {3, 7, 2, 9, 4};\n        int max = findMax(nums); // 设断点\n        System.out.println("最大值: " + max);\n    }\n\n    static int findMax(int[] arr) {\n        int max = arr[0];\n        for (int i = 1; i < arr.length; i++) {\n            if (arr[i] > max) {\n                max = arr[i]; // 观察变化\n            }\n        }\n        return max;\n    }\n}',
        estimatedMinutes: 35,
        tags: ['工具', '必学']
      },
      {
        id: 'p0-idea-shortcuts',
        title: '常用快捷键',
        shortDesc: '记住10个核心快捷键就能事半功倍',
        deepPrinciple: '<p>高频：双击Shift全局搜索、Alt+Enter快速修复、Ctrl+D复制行、Ctrl+Alt+L格式化、Alt+Insert生成代码、Shift+F6重命名、Shift+F9调试。</p>',
        scenario: '编码时频繁需要格式化、生成代码、查找文件。',
        codeExample: '// 搜索: Shift Shift / Ctrl+N / Ctrl+Shift+F\n// 编辑: Alt+Enter / Ctrl+D / Ctrl+/ / Ctrl+Alt+L\n// 生成: Alt+Insert / Ctrl+O\n// 重构: Shift+F6 / Ctrl+Alt+M\n// 运行: Shift+F10 / Shift+F9',
        estimatedMinutes: 25,
        tags: ['工具', '效率']
      }
    ]
  },
  {
    id: 'p0-first-java',
    title: '第一个 Java 程序',
    description: '编写 HelloWorld，理解编译和运行过程',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'p0-hello-world',
        title: 'Hello World',
        shortDesc: '每个程序员的第一行代码——Java 旅程的起点',
        deepPrinciple: '<p>核心要素：一切代码在class中、文件名=public class名、分号结尾、区分大小写。程序需先编译(javac)再运行(java)。</p>',
        scenario: '第一个 Java 程序，理解每部分含义。',
        codeExample: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        System.out.println("你好，Java！");\n\n        String name = "小明";\n        int age = 18;\n        System.out.printf("我叫%s，今年%d岁%n", name, age);\n    }\n}',
        estimatedMinutes: 20,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p0-main-method',
        title: 'main 方法签名详解',
        shortDesc: 'main 是程序的「大门」——JVM 从这里开始执行',
        deepPrinciple: '<p>public(外部可调) static(无需对象) void(无返回值) main(约定名) String[] args(命令行参数)。签名写错能编译但运行报错。</p>',
        scenario: '命令行工具通过 args 接收参数。',
        codeExample: 'public class MainDemo {\n    public static void main(String[] args) {\n        if (args.length == 0) {\n            System.out.println("用法: java MainDemo <参数>");\n            return;\n        }\n        for (int i = 0; i < args.length; i++) {\n            System.out.println("args[" + i + "]=" + args[i]);\n        }\n    }\n}',
        estimatedMinutes: 25,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p0-javac-java',
        title: '编译(javac)与运行(java)',
        shortDesc: 'javac 翻译源码为字节码，java 运行字节码',
        deepPrinciple: '<p>编译(.java→.class)检查语法类型错误，运行(JVM执行.class)时出现运行时错误(NPE/越界)。分两步实现跨平台：字节码平台无关，各OS的JVM负责翻译。</p>',
        scenario: '区分编译期错误（语法错）和运行时错误（空指针）。',
        codeExample: 'public class Calculator {\n    public static void main(String[] args) {\n        int a = 10, b = 3;\n        System.out.println("加: " + (a + b)); // 13\n        System.out.println("除: " + (a / b)); // 3\n        System.out.println("余: " + (a % b)); // 1\n    }\n}\n// javac Calculator.java  → 编译\n// java Calculator         → 运行',
        estimatedMinutes: 25,
        tags: ['Java基础', '必学']
      }
    ]
  }
];

// ======================== Phase 1: Java 核心语法 ========================
export const phase1Topics = [
  {
    id: 'p1-variables-types',
    title: '变量与数据类型',
    description: '掌握 Java 的基本数据类型和变量声明',
    estimatedHours: 4,
    knowledgePoints: [
      {
        id: 'p1-primitive-types',
        title: '8 种基本数据类型',
        shortDesc: '基本类型像不同规格的「容器」——byte小水杯，long大水缸',
        deepPrinciple: '<p>Java 有 8 种基本类型，直接存储值：</p><ul><li><strong>整数</strong>：byte(1字节,-128~127)、short(2字节)、int(4字节,±21亿)、long(8字节)</li><li><strong>浮点</strong>：float(4字节,6-7位精度)、double(8字节,15位精度)</li><li><strong>字符</strong>：char(2字节,Unicode)</li><li><strong>布尔</strong>：boolean(true/false)</li></ul><p>实际开发整数默认int，小数默认double。<strong>金额绝不能用float/double</strong>，必须用BigDecimal。</p>',
        scenario: '定义用户信息：年龄int，身高double，性别boolean，余额BigDecimal。',
        codeExample: 'public class PrimitiveTypes {\n    public static void main(String[] args) {\n        byte age = 25;\n        short year = 2024;\n        int population = 1400000000;\n        long worldPop = 8000000000L; // 加L\n\n        float height = 1.75f;  // 加f\n        double pi = 3.141592653589793;\n\n        char grade = \'A\';\n        boolean isActive = true;\n\n        // 浮点精度陷阱\n        System.out.println(0.1 + 0.2);\n        // 0.30000000000000004\n\n        System.out.println("int最大: " + Integer.MAX_VALUE);\n    }\n}',
        estimatedMinutes: 30,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p1-reference-types',
        title: '引用类型',
        shortDesc: '引用类型像「遥控器」——变量存的是对象的地址而非对象本身',
        deepPrinciple: '<p>除8种基本类型外都是引用类型：类、接口、数组、枚举。</p><ul><li>引用变量在<strong>栈</strong>，对象在<strong>堆</strong></li><li>两个引用指向同一对象时修改会互相影响</li><li>null表示不指向任何对象</li><li>== 比较地址，equals() 比较内容</li></ul>',
        scenario: '方法中传递List参数，方法内修改List内容会影响调用者。',
        codeExample: 'public class ReferenceDemo {\n    public static void main(String[] args) {\n        // 基本类型：值拷贝\n        int a = 10;\n        int b = a;\n        b = 20;\n        System.out.println("a=" + a); // 10\n\n        // 引用类型：地址拷贝\n        int[] arr1 = {1, 2, 3};\n        int[] arr2 = arr1;\n        arr2[0] = 99;\n        System.out.println("arr1[0]=" + arr1[0]); // 99\n\n        // == vs equals\n        String s1 = new String("hello");\n        String s2 = new String("hello");\n        System.out.println(s1 == s2);      // false\n        System.out.println(s1.equals(s2)); // true\n    }\n}',
        estimatedMinutes: 30,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p1-type-conversion',
        title: '类型转换（自动/强制）',
        shortDesc: '自动转换「小杯倒大杯」安全，强制转换「大杯倒小杯」可能溢出',
        deepPrinciple: '<p>Java强类型，转换规则严格：</p><ul><li><strong>自动转换</strong>：小→大安全。byte→short→int→long→float→double</li><li><strong>强制转换</strong>：大→小可能丢精度，需(类型)转换</li></ul><p>注意：byte/short/char运算自动提升为int；整数字面量默认int，小数默认double。</p>',
        scenario: '数据库BIGINT赋给Java int，超范围会溢出——不报错但结果不对。',
        codeExample: 'public class TypeConversion {\n    public static void main(String[] args) {\n        // 自动转换\n        int intVal = 100;\n        long longVal = intVal;\n        double dVal = intVal; // 100.0\n\n        // 强制转换\n        double price = 99.99;\n        int intPrice = (int) price; // 99（截断）\n\n        // 溢出陷阱\n        int max = Integer.MAX_VALUE;\n        System.out.println(max + 1); // -2147483648\n\n        // byte运算提升为int\n        byte b1 = 10, b2 = 20;\n        // byte b3 = b1 + b2; // 编译错误\n        int b3 = b1 + b2;     // 正确\n    }\n}',
        estimatedMinutes: 25,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p1-var-keyword',
        title: 'var 局部变量类型推断',
        shortDesc: 'var让编译器猜类型——简化长类型声明，但仅限局部变量',
        deepPrinciple: '<p>Java 10引入var，编译器根据右侧值推断类型：</p><ul><li>仅限局部变量，不能用于参数/返回值/成员变量</li><li>必须在声明时初始化</li><li>编译期推断，非动态类型</li><li>不能赋null</li></ul><p>类型不明显时建议写明类型保证可读性。</p>',
        scenario: '泛型嵌套时类型声明很长，var能简化。',
        codeExample: 'import java.util.*;\n\npublic class VarDemo {\n    public static void main(String[] args) {\n        var name = "张三";     // String\n        var age = 25;          // int\n        var list = new ArrayList<String>();\n\n        // 长类型名时优势明显\n        var map = new HashMap<String, List<Integer>>();\n\n        for (var num : List.of(1, 2, 3)) {\n            System.out.println(num);\n        }\n\n        // 错误: var x; var y = null;\n    }\n}',
        estimatedMinutes: 20,
        tags: ['Java基础', 'Java10+']
      }
    ]
  },
  {
    id: 'p1-operators',
    title: '运算符',
    description: '掌握 Java 各种运算符及常见陷阱',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'p1-all-operators',
        title: '算术 / 关系 / 逻辑 / 位运算符',
        shortDesc: '运算符是「计算工具箱」——加减乘除、比大小、判真假各司其职',
        deepPrinciple: '<p>分类：</p><ul><li><strong>算术</strong>：+、-、*、/、%。整数除法截断(5/2=2)</li><li><strong>关系</strong>：==、!=、>、<、>=、<=，返回boolean</li><li><strong>逻辑</strong>：&&(与)、||(或)、!(非)</li><li><strong>位运算</strong>：&、|、^、~、<<、>>。左移一位=乘2</li><li><strong>三元</strong>：条件 ? 值1 : 值2</li></ul>',
        scenario: '计算购物车总价用算术，判断优惠条件用关系，组合条件用逻辑。',
        codeExample: 'public class OperatorDemo {\n    public static void main(String[] args) {\n        System.out.println(10 / 3);   // 3（整数除法）\n        System.out.println(10 % 3);   // 1\n        System.out.println(10.0 / 3); // 3.333...\n\n        boolean isVip = true;\n        double amount = 200.0;\n        if (isVip || amount >= 100) {\n            System.out.println("享受优惠");\n        }\n\n        int score = 85;\n        String level = score >= 90 ? "优秀"\n            : score >= 60 ? "及格" : "不及格";\n\n        System.out.println(8 << 1); // 16\n        System.out.println(8 >> 1); // 4\n    }\n}',
        estimatedMinutes: 30,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p1-increment',
        title: '++/-- 前缀与后缀区别',
        shortDesc: '++i先加后用，i++先用后加——时机不同结果不同',
        deepPrinciple: '<p>前缀++i：先加1再返回新值。后缀i++：先返回旧值再加1。单独使用效果相同，区别在参与表达式时。<strong>避免在复杂表达式中使用</strong>，单独一行即可。</p>',
        scenario: '面试常考：int a=5; int b=a++; → a=6,b=5。',
        codeExample: 'public class IncrementDemo {\n    public static void main(String[] args) {\n        int a = 5;\n        int b = a++; // b=5, a=6\n        System.out.println("a=" + a + " b=" + b);\n\n        int c = 5;\n        int d = ++c; // c=6, d=6\n        System.out.println("c=" + c + " d=" + d);\n\n        // 推荐写法\n        int count = 0;\n        count++;\n    }\n}',
        estimatedMinutes: 20,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p1-short-circuit',
        title: '短路与(&&)和逻辑与(&)',
        shortDesc: '短路运算像「懒人」——前面能出结果，后面就不看了',
        deepPrinciple: '<p>&& ||（短路）：左侧能确定结果就跳过右侧。& |（非短路）：两侧都执行。实际开发<strong>绝大多数用 && ||</strong>，可避免空指针。</p>',
        scenario: '先检null再检长度：str != null && str.length() > 0。',
        codeExample: 'public class ShortCircuitDemo {\n    public static void main(String[] args) {\n        String name = null;\n\n        // 安全：&& 短路\n        if (name != null && name.length() > 0) {\n            System.out.println(name);\n        }\n\n        // 危险：& 不短路，null时右侧NPE\n        // if (name != null & name.length() > 0) {}\n\n        int[] arr = null;\n        if (arr != null && arr.length > 0) {\n            System.out.println(arr[0]);\n        }\n    }\n}',
        estimatedMinutes: 20,
        tags: ['Java基础', '必学']
      }
    ]
  },
  {
    id: 'p1-string',
    title: '字符串 String',
    description: '深入理解 Java 中最常用的 String 类型',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'p1-string-immutable',
        title: 'String 不可变性原理',
        shortDesc: '字符串创建后不能修改——看起来改了其实是创建了新字符串',
        deepPrinciple: '<p>String是不可变的，内部用private final byte[] value存储。修改操作返回新String。</p><p>为什么不可变？线程安全、hashCode可缓存、安全性、支持字符串池共享。</p><p>循环拼接字符串应用StringBuilder。</p>',
        scenario: '循环中用+拼接每次创建新对象，性能极差。',
        codeExample: 'public class StringImmutable {\n    public static void main(String[] args) {\n        String s = "Hello";\n        String s2 = s;\n        s = s + " World";\n        System.out.println(s);  // Hello World\n        System.out.println(s2); // Hello（原对象不变）\n\n        // 错误：循环+拼接\n        // String bad = ""; for(...) bad += i;\n\n        // 正确：StringBuilder\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < 1000; i++) {\n            sb.append(i);\n        }\n        String result = sb.toString();\n    }\n}',
        estimatedMinutes: 30,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p1-string-pool',
        title: '字符串池（String Pool）',
        shortDesc: '字符串池像「共享书架」——相同内容只存一份',
        deepPrinciple: '<p>JVM维护字符串常量池：字面量"hello"自动入池，池中已有则返回同一引用；new String("hello")在堆创建新对象。intern()手动入池。</p><p><strong>比较字符串永远用equals()</strong>。</p>',
        scenario: '用==比字符串，字面量时碰巧对了，数据库读出的就失败了。',
        codeExample: 'public class StringPool {\n    public static void main(String[] args) {\n        String s1 = "Hello";\n        String s2 = "Hello";\n        System.out.println(s1 == s2);      // true\n\n        String s3 = new String("Hello");\n        System.out.println(s1 == s3);      // false\n        System.out.println(s1.equals(s3)); // true\n\n        String s4 = s3.intern();\n        System.out.println(s1 == s4); // true\n\n        // 编译期常量折叠\n        String s5 = "Hel" + "lo";\n        System.out.println(s1 == s5); // true\n\n        // 最佳实践：常量写前面避免NPE\n        if ("admin".equals(name)) { }\n    }\n}',
        estimatedMinutes: 30,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p1-string-methods',
        title: '常用方法：equals / substring / indexOf',
        shortDesc: 'String方法像「瑞士军刀」——查找、截取、替换应有尽有',
        deepPrinciple: '<p>高频方法：equals/equalsIgnoreCase(比较)、indexOf/contains/startsWith(搜索)、substring(截取,左闭右开)、toUpperCase/toLowerCase/strip(转换)、replace/replaceAll(替换)、split(分割)、isEmpty/isBlank(判空)。</p>',
        scenario: '解析邮箱：contains("@")判断格式，substring截取用户名和域名。',
        codeExample: 'public class StringMethods {\n    public static void main(String[] args) {\n        String email = "  User@Example.COM  ";\n        String cleaned = email.strip().toLowerCase();\n\n        int at = cleaned.indexOf("@");\n        String user = cleaned.substring(0, at);\n        String domain = cleaned.substring(at + 1);\n\n        String csv = "苹果,香蕉,橘子";\n        String[] arr = csv.split(",");\n\n        // 手机号脱敏\n        String masked = "13812345678".replaceAll(\n            "(\\\\d{3})\\\\d{4}(\\\\d{4})", "$1****$2");\n        // 138****5678\n\n        System.out.println("".isEmpty());   // true\n        System.out.println("  ".isBlank()); // true\n\n        String joined = String.join("-", "A", "B", "C");\n        // A-B-C\n    }\n}',
        estimatedMinutes: 30,
        tags: ['Java基础', '必学']
      }
    ]
  },
  {
    id: 'p1-control-flow',
    title: '控制流',
    description: '掌握分支和循环结构',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'p1-if-else',
        title: 'if-else / else if',
        shortDesc: 'if-else像岔路口的指示牌——根据条件选不同的路',
        deepPrinciple: '<p>条件必须boolean类型，多个else if从上到下匹配。<strong>始终加大括号</strong>。推荐卫语句模式：提前return减少嵌套。</p>',
        scenario: '会员折扣：普通无折扣，银卡95折，金卡9折。',
        codeExample: 'public class IfElseDemo {\n    public static void main(String[] args) {\n        int score = 85;\n        if (score >= 90) {\n            System.out.println("优秀");\n        } else if (score >= 80) {\n            System.out.println("良好");\n        } else if (score >= 60) {\n            System.out.println("及格");\n        } else {\n            System.out.println("不及格");\n        }\n    }\n\n    // 卫语句模式\n    static double discount(String lv, double amt) {\n        if ("DIAMOND".equals(lv)) return amt * 0.85;\n        if ("GOLD".equals(lv)) return amt * 0.9;\n        if ("SILVER".equals(lv)) return amt * 0.95;\n        return amt;\n    }\n}',
        estimatedMinutes: 20,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p1-switch',
        title: 'switch（含Java14+箭头语法）',
        shortDesc: 'switch是「多路开关」——比长串if-else更整洁',
        deepPrinciple: '<p>传统switch需break防穿透。Java 14+箭头语法 -> 不穿透更安全，可作为表达式返回值(yield)。支持byte/short/int/char/String/枚举。</p>',
        scenario: '根据订单状态码显示中文名。',
        codeExample: 'public class SwitchDemo {\n    public static void main(String[] args) {\n        int day = 3;\n        String name = switch (day) {\n            case 1 -> "周一";\n            case 2 -> "周二";\n            case 3 -> "周三";\n            case 4 -> "周四";\n            case 5 -> "周五";\n            case 6, 7 -> "周末";\n            default -> "未知";\n        };\n        System.out.println(name);\n\n        // 多行逻辑用yield\n        int status = 2;\n        String text = switch (status) {\n            case 0 -> "待支付";\n            case 2 -> {\n                System.out.println("查询物流...");\n                yield "已发货";\n            }\n            default -> "其他";\n        };\n    }\n}',
        estimatedMinutes: 25,
        tags: ['Java基础', 'Java14+']
      },
      {
        id: 'p1-loops',
        title: 'for / while / do-while 循环',
        shortDesc: '循环就像「复读机」——重复执行直到条件不满足',
        deepPrinciple: '<p>for：知道次数时用。while：先判后执行。do-while：先执行后判，至少一次。for-each：遍历数组/集合的简洁写法。</p>',
        scenario: '遍历商品算总价、重试网络请求直到成功或达上限。',
        codeExample: 'public class LoopDemo {\n    public static void main(String[] args) {\n        for (int i = 0; i < 5; i++) {\n            System.out.print(i + " ");\n        }\n\n        String[] names = {"张三", "李四", "王五"};\n        for (String name : names) {\n            System.out.println("你好, " + name);\n        }\n\n        // while重试\n        int retry = 0;\n        boolean ok = false;\n        while (!ok && retry < 3) {\n            ok = Math.random() > 0.5;\n            retry++;\n        }\n\n        // do-while至少一次\n        int n = 1;\n        do {\n            System.out.print(n + " ");\n            n *= 2;\n        } while (n <= 16);\n    }\n}',
        estimatedMinutes: 25,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p1-break-continue',
        title: 'break / continue',
        shortDesc: 'break直接跳出循环，continue跳过本轮进入下一轮',
        deepPrinciple: '<p>break：跳出当前循环（嵌套中只跳最内层）。continue：跳过本次剩余代码进入下一迭代。带标签的break/continue可跳出外层循环。</p>',
        scenario: '在列表中找到目标后停止(break)，或跳过无效数据(continue)。',
        codeExample: 'public class BreakContinueDemo {\n    public static void main(String[] args) {\n        // break：找到后停止\n        int[] nums = {3, 7, 2, 9, 4};\n        for (int n : nums) {\n            if (n == 9) {\n                System.out.println("找到: " + n);\n                break;\n            }\n        }\n\n        // continue：跳过偶数\n        for (int i = 1; i <= 10; i++) {\n            if (i % 2 == 0) continue;\n            System.out.print(i + " "); // 1 3 5 7 9\n        }\n\n        // 带标签跳出外层\n        outer:\n        for (int i = 0; i < 3; i++) {\n            for (int j = 0; j < 3; j++) {\n                if (i == 1 && j == 1) break outer;\n                System.out.println(i + "," + j);\n            }\n        }\n    }\n}',
        estimatedMinutes: 20,
        tags: ['Java基础', '必学']
      }
    ]
  },
  {
    id: 'p1-array',
    title: '数组',
    description: '掌握 Java 数组的创建、遍历和常用操作',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'p1-array-declare',
        title: '声明与初始化',
        shortDesc: '数组像一排编号的储物柜——大小固定，通过下标存取',
        deepPrinciple: '<p>数组存储固定数量同类型元素：创建后长度不可变，下标从0开始，越界抛ArrayIndexOutOfBoundsException，引用类型默认null，数值类型默认0。</p>',
        scenario: '存储一个班级所有学生成绩。',
        codeExample: 'public class ArrayDemo {\n    public static void main(String[] args) {\n        int[] nums = {1, 2, 3, 4, 5};\n\n        String[] names = new String[3];\n        names[0] = "张三";\n        names[1] = "李四";\n        names[2] = "王五";\n\n        System.out.println(nums[0]);     // 1\n        System.out.println(nums.length); // 5\n\n        int[] arr = new int[3];\n        System.out.println(arr[0]); // 0(默认值)\n    }\n}',
        estimatedMinutes: 20,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p1-array-traverse-utils',
        title: '遍历与 Arrays 工具类',
        shortDesc: 'for适合需要下标，for-each适合只读，Arrays提供排序搜索工具',
        deepPrinciple: '<p>普通for能获取下标和修改元素，for-each简洁但无下标。Arrays工具类：sort排序、binarySearch查找(需先排序)、toString可读输出、copyOf复制、fill填充。</p>',
        scenario: '成绩排序后查找某分数是否存在。',
        codeExample: 'import java.util.Arrays;\n\npublic class ArrayUtils {\n    public static void main(String[] args) {\n        int[] scores = {85, 92, 78, 95, 88};\n\n        // for-each求和\n        int sum = 0;\n        for (int s : scores) sum += s;\n        System.out.println("平均: " + sum / scores.length);\n\n        // 排序\n        Arrays.sort(scores);\n        System.out.println(Arrays.toString(scores));\n\n        // 二分查找\n        int idx = Arrays.binarySearch(scores, 92);\n        System.out.println("92在位置: " + idx);\n\n        // 复制\n        int[] copy = Arrays.copyOf(scores, 10);\n    }\n}',
        estimatedMinutes: 25,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p1-array-2d',
        title: '二维数组',
        shortDesc: '二维数组就像Excel表格——用行号和列号定位格子',
        deepPrinciple: '<p>本质是「数组的数组」，每行可有不同长度(锯齿数组)。实际开发中更常用List&lt;List&lt;T&gt;&gt;，但算法题常见。</p>',
        scenario: '存储棋盘状态或多学生多科成绩。',
        codeExample: 'public class Array2D {\n    public static void main(String[] args) {\n        int[][] matrix = {\n            {1, 2, 3},\n            {4, 5, 6},\n            {7, 8, 9}\n        };\n\n        for (int[] row : matrix) {\n            for (int val : row) {\n                System.out.printf("%3d", val);\n            }\n            System.out.println();\n        }\n\n        // 锯齿数组\n        int[][] jagged = new int[3][];\n        jagged[0] = new int[]{1, 2};\n        jagged[1] = new int[]{3, 4, 5};\n        jagged[2] = new int[]{6};\n    }\n}',
        estimatedMinutes: 20,
        tags: ['Java基础', '进阶']
      }
    ]
  },
  {
    id: 'p1-method',
    title: '方法定义',
    description: '掌握方法声明、参数传递和返回值',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'p1-method-signature',
        title: '方法签名',
        shortDesc: '方法签名是方法的「身份证」——由方法名+参数列表唯一确定',
        deepPrinciple: '<p>方法签名=方法名+参数类型列表（不含返回值）。组成：访问修饰符、返回类型、方法名、参数列表。方法应遵循单一职责，不超过20-30行。</p>',
        scenario: '用户服务类中注册、登录、查询各为独立方法。',
        codeExample: 'public class MethodDemo {\n    /** 计算两数之和 */\n    public static int add(int a, int b) {\n        return a + b;\n    }\n\n    /** 无返回值 */\n    public static void printLine(String text) {\n        System.out.println("=== " + text + " ===");\n    }\n\n    /** 返回布尔 */\n    public static boolean isAdult(int age) {\n        return age >= 18;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(add(10, 20));\n        printLine("测试");\n        System.out.println(isAdult(16));\n    }\n}',
        estimatedMinutes: 25,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p1-pass-by-value',
        title: '参数传递（Java只有值传递）',
        shortDesc: 'Java永远值传递——基本类型传「值副本」，引用类型传「地址副本」',
        deepPrinciple: '<p>Java只有值传递。基本类型传值副本，方法内修改不影响外部。引用类型传地址副本，修改对象<strong>属性</strong>有影响，重新赋值引用本身无影响。面试高频考点。</p>',
        scenario: 'swap(a,b)交换两个int，外部不会变——传的是副本。',
        codeExample: 'public class PassByValue {\n    public static void main(String[] args) {\n        int num = 10;\n        changeValue(num);\n        System.out.println(num); // 10（不变）\n\n        int[] arr = {1, 2, 3};\n        changeArray(arr);\n        System.out.println(arr[0]); // 99（变了）\n\n        String str = "Hello";\n        changeString(str);\n        System.out.println(str); // Hello（不变）\n    }\n\n    static void changeValue(int x) { x = 99; }\n    static void changeArray(int[] a) { a[0] = 99; }\n    static void changeString(String s) { s = "World"; }\n}',
        estimatedMinutes: 30,
        tags: ['Java基础', '必学', '面试']
      },
      {
        id: 'p1-varargs',
        title: '可变参数',
        shortDesc: '可变参数让方法接受「任意数量」同类型参数——底层是数组',
        deepPrinciple: '<p>语法Type... name，编译后变数组。可传0到多个参数，一个方法最多一个可变参数且必须是最后一个。</p>',
        scenario: 'System.out.printf和String.format就是用可变参数实现的。',
        codeExample: 'public class VarargsDemo {\n    public static int sum(int... numbers) {\n        int total = 0;\n        for (int n : numbers) total += n;\n        return total;\n    }\n\n    public static void log(String level,\n            String msg, Object... params) {\n        System.out.printf("[%s] %s%n",\n            level, String.format(msg, params));\n    }\n\n    public static void main(String[] args) {\n        System.out.println(sum());        // 0\n        System.out.println(sum(1, 2));    // 3\n        System.out.println(sum(1,2,3,4)); // 10\n        log("INFO", "用户%s登录", "张三");\n    }\n}',
        estimatedMinutes: 20,
        tags: ['Java基础', '必学']
      }
    ]
  },
  {
    id: 'p1-overload',
    title: '方法重载',
    description: '理解方法重载的规则和应用',
    estimatedHours: 1,
    knowledgePoints: [
      {
        id: 'p1-overload-rules',
        title: '同名不同参与重载解析规则',
        shortDesc: '重载像同家店的不同套餐——名字一样但内容不同',
        deepPrinciple: '<p>方法重载：同类中方法名相同但参数列表不同（数量/类型/顺序）。返回值不同不构成重载。编译器根据调用参数选最匹配的方法。</p>',
        scenario: 'println就是重载典型：可打印int/double/String等。',
        codeExample: 'public class OverloadDemo {\n    public static int add(int a, int b) {\n        return a + b;\n    }\n    public static int add(int a, int b, int c) {\n        return a + b + c;\n    }\n    public static double add(double a, double b) {\n        return a + b;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(add(1, 2));     // int版\n        System.out.println(add(1, 2, 3));  // 三参版\n        System.out.println(add(1.5, 2.5)); // double版\n    }\n}',
        estimatedMinutes: 25,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p1-overload-vs-override',
        title: '重载与重写的区别',
        shortDesc: '重载是同类同名不同参，重写是子类覆盖父类方法',
        deepPrinciple: '<p>重载(Overload)：同类，参数不同，编译期确定。重写(Override)：父子类，签名相同，运行期确定(多态)。</p>',
        scenario: 'Shape的draw()被Circle和Rectangle重写，Circle内draw()和draw(Color)是重载。',
        codeExample: 'class Animal {\n    public void speak() {\n        System.out.println("动物叫");\n    }\n    // 重载\n    public void speak(int times) {\n        for (int i = 0; i < times; i++) speak();\n    }\n}\n\nclass Dog extends Animal {\n    @Override // 重写\n    public void speak() {\n        System.out.println("汪汪汪！");\n    }\n}\n\npublic class CompareDemo {\n    public static void main(String[] args) {\n        Animal dog = new Dog();\n        dog.speak();    // 汪汪汪（重写）\n        dog.speak(3);   // 汪x3（重载+重写）\n    }\n}',
        estimatedMinutes: 25,
        tags: ['Java基础', '面试']
      }
    ]
  },
  {
    id: 'p1-scope',
    title: '变量作用域',
    description: '理解变量的作用范围和生命周期',
    estimatedHours: 1,
    knowledgePoints: [
      {
        id: 'p1-scope-block',
        title: '块级作用域与成员变量vs局部变量',
        shortDesc: '变量的「活动范围」由花括号{}决定',
        deepPrinciple: '<p>局部变量：方法内声明，作用域在{}内，必须手动初始化。成员变量：类中方法外，属于对象，有默认值。块级作用域：if/for的{}内声明出了{}不可用。同名时局部优先，访问成员变量用this。</p>',
        scenario: '方法中定义与成员变量同名的局部变量，导致成员变量没被修改。',
        codeExample: 'public class ScopeDemo {\n    int count = 0; // 成员变量，有默认值\n\n    public void demo() {\n        int x = 10; // 局部变量，必须初始化\n        if (x > 5) {\n            int y = 20; // 块级作用域\n        }\n        // y 不可用\n\n        for (int i = 0; i < 3; i++) { }\n        // i 不可用\n    }\n\n    public void setCount(int count) {\n        // this.count 指成员变量\n        this.count = count;\n    }\n}',
        estimatedMinutes: 20,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p1-static-lifetime',
        title: 'static 变量生命周期',
        shortDesc: 'static变量属于类——类加载时创建，全局唯一一份',
        deepPrinciple: '<p>生命周期：局部变量(方法调用→方法结束,栈)、实例变量(对象创建→GC回收,堆)、static变量(类加载→程序结束,方法区,所有对象共享)。static常用于计数器、配置常量。</p>',
        scenario: '统计创建了多少User对象。',
        codeExample: 'public class LifecycleDemo {\n    static int count = 0;  // 类变量，全局唯一\n    String name;           // 实例变量，每对象一份\n\n    public LifecycleDemo(String name) {\n        this.name = name;\n        count++;\n    }\n\n    public static void main(String[] args) {\n        new LifecycleDemo("A");\n        new LifecycleDemo("B");\n        new LifecycleDemo("C");\n        System.out.println("创建了 "\n            + LifecycleDemo.count + " 个对象");\n    }\n}',
        estimatedMinutes: 20,
        tags: ['Java基础', '必学']
      }
    ]
  },
  {
    id: 'p1-wrapper',
    title: '包装类',
    description: '理解基本类型的包装类及自动装箱拆箱',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'p1-wrapper-intro',
        title: 'Integer / Long / Boolean 等',
        shortDesc: '包装类给基本类型穿上「对象外衣」，让它能放进集合',
        deepPrinciple: '<p>int→Integer, long→Long, double→Double等。需要包装类因为：集合只能存对象、提供类型转换方法(parseInt)、允许null值。</p>',
        scenario: '数据库年龄字段可能NULL，用Integer接收可表达null，用int会NPE。',
        codeExample: 'import java.util.*;\n\npublic class WrapperDemo {\n    public static void main(String[] args) {\n        List<Integer> list = new ArrayList<>();\n        list.add(1);  // 自动装箱\n        int val = list.get(0); // 自动拆箱\n\n        int num = Integer.parseInt("123");\n        String str = Integer.toString(456);\n        String hex = Integer.toHexString(255);\n\n        Integer age = null; // 合法\n        // int age2 = null; // 编译错误\n    }\n}',
        estimatedMinutes: 25,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p1-autoboxing',
        title: '自动装箱与拆箱',
        shortDesc: '装箱：基本→对象，拆箱：对象→基本，Java自动转换',
        deepPrinciple: '<p>自动装箱：编译器插入Integer.valueOf()。自动拆箱：编译器插入intValue()。陷阱：包装类为null时拆箱抛NullPointerException；循环中频繁装箱有性能开销。</p>',
        scenario: '数据库返回Integer为NULL时，代码用int接收会拆箱NPE。',
        codeExample: 'public class AutoboxingDemo {\n    public static void main(String[] args) {\n        Integer a = 100;  // Integer.valueOf(100)\n        int b = a;        // a.intValue()\n\n        // 拆箱NPE\n        Integer nullVal = null;\n        // int x = nullVal; // NPE!\n        int safe = nullVal != null ? nullVal : 0;\n\n        // 性能：循环中用基本类型\n        int sum = 0; // 不要用 Integer sum = 0;\n        for (int i = 0; i < 10000; i++) {\n            sum += i;\n        }\n    }\n}',
        estimatedMinutes: 20,
        tags: ['Java基础', '必学']
      },
      {
        id: 'p1-integer-cache',
        title: '缓存机制（-128~127）',
        shortDesc: 'Integer缓存了-128~127，这范围内==碰巧对了，范围外就错了',
        deepPrinciple: '<p>Integer.valueOf()对-128~127缓存：范围内返回同一对象(==true)，范围外每次新对象(==false)。</p><p><strong>包装类比较永远用equals()</strong>。</p>',
        scenario: '生产Bug：两个Integer金额用==比，小金额OK，大金额失败。',
        codeExample: 'public class IntegerCache {\n    public static void main(String[] args) {\n        Integer a = 127, b = 127;\n        System.out.println(a == b);      // true\n        System.out.println(a.equals(b)); // true\n\n        Integer c = 128, d = 128;\n        System.out.println(c == d);      // false!\n        System.out.println(c.equals(d)); // true\n\n        // 最佳实践：永远equals\n        Integer p1 = 200, p2 = 200;\n        if (p1.equals(p2)) {\n            System.out.println("价格相同");\n        }\n    }\n}',
        estimatedMinutes: 20,
        tags: ['Java基础', '面试']
      }
    ]
  },
  {
    id: 'p1-lambda',
    title: 'Lambda 表达式',
    description: '掌握 Java 8 函数式编程基础',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'p1-functional-interface',
        title: '函数式接口',
        shortDesc: '函数式接口只有一个抽象方法——这是Lambda能工作的前提',
        deepPrinciple: '<p>函数式接口(Functional Interface)：只有一个抽象方法的接口，可用@FunctionalInterface注解标记。JDK内置四大函数式接口：</p><ul><li>Function&lt;T,R&gt;：T→R 转换</li><li>Predicate&lt;T&gt;：T→boolean 判断</li><li>Consumer&lt;T&gt;：T→void 消费</li><li>Supplier&lt;T&gt;：()→T 提供</li></ul>',
        scenario: 'Stream的filter需要Predicate，map需要Function，forEach需要Consumer。',
        codeExample: 'import java.util.function.*;\n\npublic class FunctionalDemo {\n    public static void main(String[] args) {\n        // Function: 转换\n        Function<String, Integer> strLen = s -> s.length();\n        System.out.println(strLen.apply("Hello")); // 5\n\n        // Predicate: 判断\n        Predicate<Integer> isAdult = age -> age >= 18;\n        System.out.println(isAdult.test(20)); // true\n\n        // Consumer: 消费\n        Consumer<String> printer = s -> System.out.println(s);\n        printer.accept("你好");\n\n        // Supplier: 提供\n        Supplier<Double> random = () -> Math.random();\n        System.out.println(random.get());\n    }\n}',
        estimatedMinutes: 30,
        tags: ['Java基础', 'Java8+']
      },
      {
        id: 'p1-lambda-syntax',
        title: 'Lambda 语法',
        shortDesc: 'Lambda是匿名函数的简写——(参数) -> { 方法体 }',
        deepPrinciple: '<p>Lambda语法：(参数) -> { 方法体 }。简化规则：</p><ul><li>单参数可省括号：x -> x * 2</li><li>单表达式可省大括号和return：x -> x * 2</li><li>参数类型可省(编译器推断)</li></ul><p>Lambda本质是函数式接口的实例，替代了匿名内部类的冗长写法。</p>',
        scenario: '集合排序、线程创建、事件处理都能用Lambda简化。',
        codeExample: 'import java.util.*;\n\npublic class LambdaSyntax {\n    public static void main(String[] args) {\n        // 匿名内部类（旧写法）\n        Runnable r1 = new Runnable() {\n            @Override\n            public void run() {\n                System.out.println("旧写法");\n            }\n        };\n\n        // Lambda（新写法）\n        Runnable r2 = () -> System.out.println("Lambda");\n\n        // 集合排序\n        List<String> names = new ArrayList<>(\n            List.of("Charlie", "Alice", "Bob"));\n\n        // 完整写法\n        names.sort((String a, String b) -> {\n            return a.compareTo(b);\n        });\n\n        // 简写\n        names.sort((a, b) -> a.compareTo(b));\n\n        names.forEach(name -> System.out.println(name));\n    }\n}',
        estimatedMinutes: 25,
        tags: ['Java基础', 'Java8+']
      },
      {
        id: 'p1-method-reference',
        title: '方法引用 ::',
        shortDesc: '方法引用是Lambda的进一步简写——当Lambda只是调用已有方法时',
        deepPrinciple: '<p>方法引用是Lambda的语法糖，四种形式：</p><ul><li>静态方法：Integer::parseInt</li><li>实例方法(对象)：System.out::println</li><li>实例方法(类)：String::toLowerCase</li><li>构造方法：ArrayList::new</li></ul><p>当Lambda体只是调用一个已有方法时，用方法引用更简洁。</p>',
        scenario: 'list.forEach(System.out::println) 比 list.forEach(s -> System.out.println(s)) 更简洁。',
        codeExample: 'import java.util.*;\nimport java.util.stream.*;\n\npublic class MethodRefDemo {\n    public static void main(String[] args) {\n        List<String> names = List.of("Alice", "Bob", "Charlie");\n\n        // Lambda写法\n        names.forEach(s -> System.out.println(s));\n\n        // 方法引用\n        names.forEach(System.out::println);\n\n        // 静态方法引用\n        List<String> nums = List.of("1", "2", "3");\n        List<Integer> ints = nums.stream()\n            .map(Integer::parseInt)\n            .collect(Collectors.toList());\n\n        // 实例方法引用(类)\n        List<String> upper = names.stream()\n            .map(String::toUpperCase)\n            .collect(Collectors.toList());\n\n        // 构造方法引用\n        Supplier<List<String>> listFactory = ArrayList::new;\n        List<String> newList = listFactory.get();\n    }\n}',
        estimatedMinutes: 25,
        tags: ['Java基础', 'Java8+']
      }
    ]
  }
];

// ======================== Phase 2: 面向对象编程 ========================
export const phase2Topics = [
  {
    id: 'p2-class-object',
    title: '类与对象',
    description: '理解面向对象的最基本概念——类的定义和对象的创建',
    estimatedHours: 4,
    knowledgePoints: [
      {
        id: 'p2-class-define',
        title: 'class 定义与 new 实例化',
        shortDesc: '类是「设计图纸」，对象是按图纸造出来的「实物」',
        deepPrinciple: '<p>类(class)是对象的模板，定义了属性(字段)和行为(方法)。通过new关键字在堆上创建对象实例。</p><ul><li>字段(Field)：对象的数据/状态</li><li>方法(Method)：对象的行为/能力</li><li>new 过程：分配堆内存 → 初始化字段默认值 → 执行构造方法 → 返回引用</li></ul>',
        scenario: '设计电商系统的商品类Product，包含名称、价格、库存等属性和上架、下架等方法。',
        codeExample: 'public class Product {\n    String name;\n    double price;\n    int stock;\n\n    /** 展示商品信息 */\n    public void display() {\n        System.out.printf("%s - ¥%.2f (库存:%d)%n",\n            name, price, stock);\n    }\n\n    /** 购买商品 */\n    public boolean buy(int quantity) {\n        if (stock >= quantity) {\n            stock -= quantity;\n            return true;\n        }\n        return false;\n    }\n\n    public static void main(String[] args) {\n        Product p = new Product();\n        p.name = "Java编程思想";\n        p.price = 99.0;\n        p.stock = 100;\n        p.display();\n        p.buy(2);\n        p.display(); // 库存98\n    }\n}',
        estimatedMinutes: 30,
        tags: ['OOP', '必学']
      },
      {
        id: 'p2-constructor',
        title: '构造方法',
        shortDesc: '构造方法是对象出生时的「初始化仪式」——创建对象时自动调用',
        deepPrinciple: '<p>构造方法特点：方法名与类名相同、无返回值类型、创建对象时自动调用。</p><ul><li>不写构造方法时，编译器自动提供无参构造</li><li>一旦定义了有参构造，无参构造不再自动提供（需手动添加）</li><li>构造方法不能被继承</li></ul>',
        scenario: '创建用户对象时必须提供姓名和邮箱，通过有参构造强制保证。',
        codeExample: 'public class User {\n    private String name;\n    private String email;\n    private int age;\n\n    /** 无参构造 */\n    public User() {\n        this.name = "未命名";\n        this.email = "";\n    }\n\n    /** 有参构造 */\n    public User(String name, String email) {\n        this.name = name;\n        this.email = email;\n    }\n\n    /** 全参构造 */\n    public User(String name, String email, int age) {\n        this.name = name;\n        this.email = email;\n        this.age = age;\n    }\n\n    public static void main(String[] args) {\n        User u1 = new User();\n        User u2 = new User("张三", "zs@test.com");\n        User u3 = new User("李四", "ls@test.com", 25);\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '必学']
      },
      {
        id: 'p2-constructor-overload',
        title: '构造方法重载',
        shortDesc: '多个构造方法提供不同的创建方式——像餐厅有套餐也能单点',
        deepPrinciple: '<p>同一个类可以有多个构造方法(参数不同)，通过this()可以在一个构造方法中调用另一个，避免代码重复。this()必须在构造方法第一行。</p>',
        scenario: '订单对象有时只需要基本信息，有时需要完整信息，用不同构造方法满足。',
        codeExample: 'public class Order {\n    private String orderNo;\n    private String userId;\n    private double amount;\n    private String remark;\n\n    public Order(String orderNo, String userId, double amount) {\n        this.orderNo = orderNo;\n        this.userId = userId;\n        this.amount = amount;\n        this.remark = "";\n    }\n\n    public Order(String orderNo, String userId,\n            double amount, String remark) {\n        this(orderNo, userId, amount); // 复用\n        this.remark = remark;\n    }\n\n    public static void main(String[] args) {\n        Order o1 = new Order("ORD001", "U001", 99.0);\n        Order o2 = new Order("ORD002", "U001", 199.0, "加急");\n    }\n}',
        estimatedMinutes: 20,
        tags: ['OOP', '必学']
      },
      {
        id: 'p2-object-memory',
        title: '对象的内存模型',
        shortDesc: '对象在堆中存储，引用变量在栈中——理解内存是理解OOP的关键',
        deepPrinciple: '<p>Java内存模型：</p><ul><li><strong>栈(Stack)</strong>：存储局部变量和引用，方法结束自动释放</li><li><strong>堆(Heap)</strong>：存储new出来的对象，由GC负责回收</li><li><strong>方法区</strong>：存储类信息、static变量、常量池</li></ul><p>对象生命周期：new创建→使用→无引用指向→GC回收。</p>',
        scenario: '理解为什么方法中new的对象方法结束后还存在（堆上），而局部变量消失了（栈上）。',
        codeExample: 'public class MemoryDemo {\n    static User globalUser; // 方法区(static)\n\n    public static void main(String[] args) {\n        // user引用在栈上，User对象在堆上\n        User user = new User("张三", "zs@test.com");\n\n        // 两个引用指向同一对象\n        User ref = user;\n\n        // user置null，但ref还指向对象，不会被GC\n        user = null;\n        System.out.println(ref.getName()); // 张三\n\n        // 方法调用：参数是引用的副本\n        modifyUser(ref);\n    }\n\n    static void modifyUser(User u) {\n        // u是ref的副本，修改对象属性影响外部\n        u.setAge(30);\n        // 重新赋值u本身不影响外部ref\n        u = new User("新用户", "new@test.com");\n    }\n}',
        estimatedMinutes: 30,
        tags: ['OOP', '必学']
      }
    ]
  },
  {
    id: 'p2-encapsulation',
    title: '封装',
    description: '学习如何通过访问控制保护数据',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'p2-access-modifiers',
        title: 'private / public / protected / default',
        shortDesc: '访问修饰符就像不同级别的「门禁卡」——控制谁能访问',
        deepPrinciple: '<p>四种访问级别（从小到大）：</p><ul><li><strong>private</strong>：仅本类可访问</li><li><strong>default(包访问)</strong>：同包内可访问</li><li><strong>protected</strong>：同包 + 子类可访问</li><li><strong>public</strong>：所有类可访问</li></ul><p>原则：字段用private，通过public方法(getter/setter)访问，在方法中可加验证逻辑。</p>',
        scenario: '用户的密码字段必须private，不能直接访问，通过方法设置时可以校验密码强度。',
        codeExample: 'public class BankAccount {\n    private String accountNo;\n    private double balance; // 绝不能直接访问\n\n    public BankAccount(String accountNo, double balance) {\n        this.accountNo = accountNo;\n        this.balance = balance;\n    }\n\n    public double getBalance() {\n        return balance;\n    }\n\n    /** 存款 */\n    public void deposit(double amount) {\n        if (amount <= 0) {\n            throw new IllegalArgumentException("金额必须>0");\n        }\n        this.balance += amount;\n    }\n\n    /** 取款 */\n    public boolean withdraw(double amount) {\n        if (amount > balance) return false;\n        this.balance -= amount;\n        return true;\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '必学']
      },
      {
        id: 'p2-getter-setter',
        title: 'getter / setter',
        shortDesc: 'getter读数据、setter写数据——是访问private字段的「官方通道」',
        deepPrinciple: '<p>getter/setter是JavaBean规范的核心，几乎所有框架(Spring、MyBatis、Jackson)都依赖它们来访问对象属性。命名规范：getXxx()/setXxx()，boolean类型getter用isXxx()。</p><p>可以在setter中加入验证逻辑保证数据合法性。IDEA可以一键生成(Alt+Insert)。</p>',
        scenario: '所有与数据库对应的实体类(Entity)都需要getter/setter，框架通过反射调用它们。',
        codeExample: 'public class UserEntity {\n    private Long id;\n    private String name;\n    private String email;\n    private boolean active;\n\n    // Getter\n    public Long getId() { return id; }\n    public String getName() { return name; }\n    public String getEmail() { return email; }\n    public boolean isActive() { return active; } // boolean\n\n    // Setter（可加校验）\n    public void setName(String name) {\n        if (name == null || name.isBlank()) {\n            throw new IllegalArgumentException("姓名不能为空");\n        }\n        this.name = name;\n    }\n\n    public void setEmail(String email) {\n        if (!email.contains("@")) {\n            throw new IllegalArgumentException("邮箱格式错误");\n        }\n        this.email = email;\n    }\n\n    public void setActive(boolean active) {\n        this.active = active;\n    }\n}',
        estimatedMinutes: 20,
        tags: ['OOP', '必学']
      },
      {
        id: 'p2-package',
        title: '包(package)的概念',
        shortDesc: '包像文件夹一样组织类——避免命名冲突，控制访问范围',
        deepPrinciple: '<p>package 用于组织类，本质是目录结构。命名惯例用反转域名：com.company.project.module。</p><ul><li>同包内的类可以直接使用</li><li>不同包的类需要import导入</li><li>import java.util.* 导入包下所有类（不含子包）</li></ul>',
        scenario: '大型项目中不同模块可能有同名类(如 User)，通过包名区分：com.project.entity.User 和 com.project.dto.User。',
        codeExample: '// 文件: com/example/entity/User.java\npackage com.example.entity;\n\npublic class User {\n    private String name;\n    // ...\n}\n\n// 文件: com/example/service/UserService.java\npackage com.example.service;\n\nimport com.example.entity.User; // 导入\n\npublic class UserService {\n    public User findById(Long id) {\n        User user = new User();\n        // ...\n        return user;\n    }\n}',
        estimatedMinutes: 15,
        tags: ['OOP', '必学']
      }
    ]
  },
  {
    id: 'p2-this',
    title: 'this 关键字',
    description: '理解 this 的含义和用法',
    estimatedHours: 1,
    knowledgePoints: [
      {
        id: 'p2-this-current',
        title: 'this 指向当前对象',
        shortDesc: 'this就是「我自己」——在方法中指向调用该方法的对象',
        deepPrinciple: '<p>this是对当前对象的引用，用于：</p><ul><li>区分成员变量和同名局部变量</li><li>作为参数传递当前对象</li><li>链式调用(return this)</li></ul>',
        scenario: '构建器模式(Builder)中用return this实现链式调用。',
        codeExample: 'public class QueryBuilder {\n    private String table;\n    private String where;\n    private int limit;\n\n    public QueryBuilder table(String table) {\n        this.table = table;\n        return this; // 链式调用\n    }\n\n    public QueryBuilder where(String where) {\n        this.where = where;\n        return this;\n    }\n\n    public QueryBuilder limit(int limit) {\n        this.limit = limit;\n        return this;\n    }\n\n    public String build() {\n        return String.format("SELECT * FROM %s WHERE %s LIMIT %d",\n            table, where, limit);\n    }\n\n    public static void main(String[] args) {\n        String sql = new QueryBuilder()\n            .table("users")\n            .where("age > 18")\n            .limit(10)\n            .build();\n        System.out.println(sql);\n    }\n}',
        estimatedMinutes: 20,
        tags: ['OOP', '必学']
      },
      {
        id: 'p2-this-constructor',
        title: 'this() 调用构造器',
        shortDesc: 'this()在构造方法中调用另一个构造方法——避免初始化代码重复',
        deepPrinciple: '<p>this(参数)用于在一个构造方法中调用本类的另一个构造方法，必须放在第一行。目的是复用初始化逻辑。this()和super()不能同时出现。</p>',
        scenario: '类有多个构造方法，核心初始化逻辑只写一份。',
        codeExample: 'public class Connection {\n    private String host;\n    private int port;\n    private int timeout;\n\n    public Connection() {\n        this("localhost", 3306); // 调用两参构造\n    }\n\n    public Connection(String host, int port) {\n        this(host, port, 30000); // 调用三参构造\n    }\n\n    public Connection(String host, int port, int timeout) {\n        // 核心初始化只写一次\n        this.host = host;\n        this.port = port;\n        this.timeout = timeout;\n        System.out.printf("连接 %s:%d (超时%dms)%n",\n            host, port, timeout);\n    }\n\n    public static void main(String[] args) {\n        new Connection();\n        // 连接 localhost:3306 (超时30000ms)\n    }\n}',
        estimatedMinutes: 20,
        tags: ['OOP', '必学']
      }
    ]
  },
  {
    id: 'p2-static',
    title: 'static 静态',
    description: '理解静态成员的含义和使用场景',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'p2-static-var',
        title: '静态变量（类变量）',
        shortDesc: '静态变量属于类而非对象——所有对象共享同一份',
        deepPrinciple: '<p>static变量在类加载时初始化，所有实例共享。通过类名访问(推荐)或对象访问(不推荐)。常用于：常量(static final)、计数器、配置信息。</p>',
        scenario: '统计在线用户数、定义应用常量。',
        codeExample: 'public class AppConfig {\n    // 常量\n    public static final String APP_NAME = "MyApp";\n    public static final int MAX_RETRY = 3;\n\n    // 计数器\n    private static int onlineCount = 0;\n\n    public static void userLogin() {\n        onlineCount++;\n    }\n    public static void userLogout() {\n        onlineCount--;\n    }\n    public static int getOnlineCount() {\n        return onlineCount;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(AppConfig.APP_NAME);\n        AppConfig.userLogin();\n        AppConfig.userLogin();\n        System.out.println("在线: " + AppConfig.getOnlineCount());\n    }\n}',
        estimatedMinutes: 20,
        tags: ['OOP', '必学']
      },
      {
        id: 'p2-static-method',
        title: '静态方法',
        shortDesc: '静态方法属于类——不需要创建对象就能调用',
        deepPrinciple: '<p>static方法通过类名调用，不能访问实例变量和this（因为没有对象）。只能访问static成员。常用于工具方法。</p>',
        scenario: 'Math.random()、Collections.sort()、Integer.parseInt()都是静态方法。',
        codeExample: 'public class MathUtils {\n    private MathUtils() {} // 工具类私有构造\n\n    /** 计算阶乘 */\n    public static long factorial(int n) {\n        if (n < 0) throw new IllegalArgumentException();\n        long result = 1;\n        for (int i = 2; i <= n; i++) {\n            result *= i;\n        }\n        return result;\n    }\n\n    /** 判断是否为质数 */\n    public static boolean isPrime(int n) {\n        if (n < 2) return false;\n        for (int i = 2; i * i <= n; i++) {\n            if (n % i == 0) return false;\n        }\n        return true;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(MathUtils.factorial(5)); // 120\n        System.out.println(MathUtils.isPrime(17));  // true\n    }\n}',
        estimatedMinutes: 20,
        tags: ['OOP', '必学']
      },
      {
        id: 'p2-static-block',
        title: '静态代码块与静态内部类',
        shortDesc: '静态代码块在类加载时执行一次——适合复杂的初始化逻辑',
        deepPrinciple: '<p>static {} 在类第一次被加载时执行，且只执行一次。用于复杂的静态变量初始化。执行顺序：静态代码块 → 实例代码块 → 构造方法。</p><p>静态内部类：不持有外部类引用，可独立使用，常用于Builder模式。</p>',
        scenario: '加载数据库驱动、初始化配置映射表等一次性操作。',
        codeExample: 'import java.util.*;\n\npublic class StatusMapper {\n    private static final Map<Integer, String> STATUS_MAP;\n\n    // 静态代码块：类加载时执行一次\n    static {\n        STATUS_MAP = new HashMap<>();\n        STATUS_MAP.put(0, "待支付");\n        STATUS_MAP.put(1, "已支付");\n        STATUS_MAP.put(2, "已发货");\n        STATUS_MAP.put(3, "已完成");\n        STATUS_MAP.put(4, "已取消");\n        System.out.println("状态映射表已加载");\n    }\n\n    public static String getStatusName(int code) {\n        return STATUS_MAP.getOrDefault(code, "未知");\n    }\n\n    // 静态内部类\n    public static class StatusCode {\n        public static final int PENDING = 0;\n        public static final int PAID = 1;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(getStatusName(StatusCode.PAID));\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '必学']
      }
    ]
  },
  {
    id: 'p2-inheritance',
    title: '继承',
    description: '掌握面向对象的继承机制',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'p2-extends',
        title: 'extends 继承',
        shortDesc: '继承让子类「站在父类肩膀上」——自动获得父类的属性和方法',
        deepPrinciple: '<p>extends实现单继承（Java不支持多继承类）。子类继承父类所有非private成员。继承表达「is-a」关系：Dog is an Animal。</p><p>继承层次不宜过深(建议≤3层)，优先考虑组合。</p>',
        scenario: '电商系统中 Product 是基类，ElectronicProduct 和 FoodProduct 是子类。',
        codeExample: 'public class Animal {\n    protected String name;\n    protected int age;\n\n    public Animal(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n\n    public void eat() {\n        System.out.println(name + "在吃东西");\n    }\n}\n\npublic class Dog extends Animal {\n    private String breed;\n\n    public Dog(String name, int age, String breed) {\n        super(name, age); // 调用父类构造\n        this.breed = breed;\n    }\n\n    public void bark() {\n        System.out.println(name + "汪汪叫！");\n    }\n\n    public static void main(String[] args) {\n        Dog dog = new Dog("旺财", 3, "金毛");\n        dog.eat();  // 继承自Animal\n        dog.bark(); // Dog自己的\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '必学']
      },
      {
        id: 'p2-super',
        title: 'super 调用父类',
        shortDesc: 'super是「打给父类的电话」——访问父类的构造器和方法',
        deepPrinciple: '<p>super用途：</p><ul><li>super()：调用父类构造方法(必须在子类构造器第一行)</li><li>super.method()：调用父类被重写的方法</li><li>super.field：访问父类字段</li></ul><p>如果子类构造器没有显式调用super()，编译器自动插入super()调用父类无参构造。父类没有无参构造时，子类必须显式调用super(参数)。</p>',
        scenario: '子类重写了toString()，但想在父类基础上追加信息。',
        codeExample: 'public class Shape {\n    protected String color;\n\n    public Shape(String color) {\n        this.color = color;\n    }\n\n    public double area() { return 0; }\n\n    @Override\n    public String toString() {\n        return "Shape(color=" + color + ")";\n    }\n}\n\npublic class Circle extends Shape {\n    private double radius;\n\n    public Circle(String color, double radius) {\n        super(color); // 必须调用\n        this.radius = radius;\n    }\n\n    @Override\n    public double area() {\n        return Math.PI * radius * radius;\n    }\n\n    @Override\n    public String toString() {\n        return super.toString() // 父类信息\n            + " Circle(r=" + radius + ")";\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '必学']
      },
      {
        id: 'p2-override',
        title: '方法重写 @Override',
        shortDesc: '重写是子类「改写」父类的方法——同样的方法名，不同的实现',
        deepPrinciple: '<p>重写(Override)规则：</p><ul><li>方法签名必须相同</li><li>返回值可以是子类型(协变返回)</li><li>访问权限不能更严格(public不能改private)</li><li>不能重写final方法和static方法</li><li>@Override注解让编译器检查是否正确重写</li></ul>',
        scenario: '所有图形都有area()方法，但圆形、矩形的计算方式不同。',
        codeExample: 'public class Rectangle extends Shape {\n    private double width;\n    private double height;\n\n    public Rectangle(String color, double w, double h) {\n        super(color);\n        this.width = w;\n        this.height = h;\n    }\n\n    @Override // 编译器检查\n    public double area() {\n        return width * height;\n    }\n\n    // @Override\n    // public double area(int x) { } // 编译错误！参数不同不是重写\n\n    public static void main(String[] args) {\n        Shape s = new Rectangle("蓝", 5, 3);\n        System.out.println("面积: " + s.area()); // 15.0\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '必学']
      },
      {
        id: 'p2-final',
        title: 'final 类和方法',
        shortDesc: 'final是「最终裁定」——final类不能被继承，final方法不能被重写',
        deepPrinciple: '<p>final的三种用法：</p><ul><li><strong>final 变量</strong>：赋值后不能修改(常量)</li><li><strong>final 方法</strong>：不能被子类重写</li><li><strong>final 类</strong>：不能被继承(如String、Integer)</li></ul><p>String被设计为final类是为了安全性和不可变性保证。</p>',
        scenario: '核心安全校验方法用final防止子类篡改逻辑。',
        codeExample: 'public class SecurityService {\n    // final常量\n    public static final int MAX_LOGIN_ATTEMPTS = 5;\n\n    // final方法：子类不能重写\n    public final boolean validateToken(String token) {\n        return token != null && token.length() > 10;\n    }\n\n    // 普通方法：子类可以重写\n    public String getWelcomeMessage() {\n        return "欢迎";\n    }\n}\n\n// final类：不能被继承\n// public final class StringUtils { ... }\n\nclass AdminService extends SecurityService {\n    // 可以重写\n    @Override\n    public String getWelcomeMessage() {\n        return "管理员你好";\n    }\n\n    // 不能重写final方法\n    // @Override\n    // public boolean validateToken(String t) { }\n}',
        estimatedMinutes: 20,
        tags: ['OOP', '必学']
      }
    ]
  },
  {
    id: 'p2-polymorphism',
    title: '多态',
    description: '理解面向对象最强大的特性——多态',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'p2-upcasting',
        title: '向上转型',
        shortDesc: '子类对象赋给父类引用——像用「动物」标签指向一只「狗」',
        deepPrinciple: '<p>向上转型(Upcasting)：子类对象赋给父类类型的引用变量。自动进行，安全无风险。转型后只能调用父类声明的方法，但实际执行的是子类重写的版本。</p>',
        scenario: '方法参数类型声明为父类，可以接受所有子类对象——这是多态的基础。',
        codeExample: 'public class PolymorphismDemo {\n    public static void main(String[] args) {\n        // 向上转型\n        Animal a1 = new Dog("旺财", 3, "金毛");\n        Animal a2 = new Cat("咪咪", 2);\n\n        a1.eat(); // Dog的eat\n        a2.eat(); // Cat的eat\n\n        // 统一处理\n        Animal[] animals = {a1, a2, new Dog("来福", 5, "哈士奇")};\n        feedAll(animals);\n    }\n\n    // 参数类型是父类，接受所有子类\n    static void feedAll(Animal[] animals) {\n        for (Animal a : animals) {\n            a.eat(); // 自动调用正确的子类方法\n        }\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '必学']
      },
      {
        id: 'p2-dynamic-binding',
        title: '动态绑定',
        shortDesc: '运行时才决定调用哪个方法——这是多态的核心机制',
        deepPrinciple: '<p>动态绑定(Dynamic Binding)：方法调用在运行时根据对象的实际类型决定。编译时看引用类型(决定能调什么方法)，运行时看对象类型(决定调哪个版本)。</p><p>注意：static方法、private方法、final方法是静态绑定（编译时确定）。字段访问也是静态绑定。</p>',
        scenario: '策略模式中，根据运行时选择的策略对象，自动调用正确的算法实现。',
        codeExample: 'interface PayStrategy {\n    void pay(double amount);\n}\n\nclass AliPay implements PayStrategy {\n    @Override\n    public void pay(double amount) {\n        System.out.println("支付宝支付: " + amount);\n    }\n}\n\nclass WechatPay implements PayStrategy {\n    @Override\n    public void pay(double amount) {\n        System.out.println("微信支付: " + amount);\n    }\n}\n\npublic class PayService {\n    // 运行时决定调用哪个pay\n    public void checkout(PayStrategy strategy, double amount) {\n        strategy.pay(amount); // 动态绑定\n    }\n\n    public static void main(String[] args) {\n        PayService svc = new PayService();\n        svc.checkout(new AliPay(), 100);\n        svc.checkout(new WechatPay(), 200);\n    }\n}',
        estimatedMinutes: 30,
        tags: ['OOP', '必学']
      },
      {
        id: 'p2-instanceof',
        title: 'instanceof 与多态的好处',
        shortDesc: 'instanceof 判断对象的真实类型——向下转型前必须先检查',
        deepPrinciple: '<p>instanceof 检查对象是否为指定类型（含子类）。向下转型(Downcasting)前必须用instanceof检查，否则可能ClassCastException。</p><p>Java 16+支持模式匹配instanceof，自动转型：if (obj instanceof String s)。</p><p>多态的好处：可扩展性(新增子类不改已有代码)、可替换性、灵活性。</p>',
        scenario: '处理不同类型的消息：文本消息、图片消息、视频消息。',
        codeExample: 'public class InstanceofDemo {\n    public static void process(Animal animal) {\n        // Java 16+ 模式匹配\n        if (animal instanceof Dog dog) {\n            dog.bark(); // 自动转型\n        } else if (animal instanceof Cat cat) {\n            cat.meow();\n        }\n\n        // 传统写法\n        if (animal instanceof Dog) {\n            Dog d = (Dog) animal; // 手动转型\n            d.bark();\n        }\n    }\n\n    public static void main(String[] args) {\n        process(new Dog("旺财", 3, "金毛"));\n        process(new Cat("咪咪", 2));\n\n        // 多态的好处：新增子类无需改process\n        // process(new Bird("小鸟", 1));\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '必学']
      }
    ]
  },
  {
    id: 'p2-abstract',
    title: '抽象类',
    description: '理解抽象类的用途和模板方法模式',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'p2-abstract-class',
        title: 'abstract 修饰与模板方法模式',
        shortDesc: '抽象类是「半成品」——定义了框架但留了空给子类填',
        deepPrinciple: '<p>abstract类不能被实例化，可以有抽象方法(无实现)和具体方法。子类必须实现所有抽象方法(除非子类也是抽象类)。</p><p><strong>模板方法模式</strong>：抽象类定义算法骨架，将某些步骤延迟到子类实现。</p>',
        scenario: '数据导出功能：流程固定(准备→获取数据→转换→输出)，但不同格式(CSV/Excel/PDF)的转换和输出不同。',
        codeExample: '/** 模板方法模式 */\npublic abstract class DataExporter {\n    // 模板方法（final防止子类改流程）\n    public final void export() {\n        prepare();\n        Object data = fetchData();\n        String result = convert(data);\n        output(result);\n    }\n\n    private void prepare() {\n        System.out.println("准备导出...");\n    }\n\n    protected Object fetchData() {\n        return "模拟数据";\n    }\n\n    // 抽象方法：子类必须实现\n    protected abstract String convert(Object data);\n    protected abstract void output(String result);\n}\n\nclass CsvExporter extends DataExporter {\n    @Override\n    protected String convert(Object data) {\n        return "CSV:" + data;\n    }\n    @Override\n    protected void output(String result) {\n        System.out.println("写入CSV文件: " + result);\n    }\n}',
        estimatedMinutes: 30,
        tags: ['OOP', '设计模式']
      },
      {
        id: 'p2-abstract-vs-interface',
        title: '抽象类与接口的区别',
        shortDesc: '抽象类是「是什么」的关系，接口是「能做什么」的能力',
        deepPrinciple: '<p>核心区别：</p><ul><li>抽象类：单继承，可有构造器/字段/具体方法，表达is-a关系</li><li>接口：多实现，Java 8+可有default方法，表达can-do能力</li></ul><p>选择原则：如果类之间有层次关系用抽象类，如果只是共享行为能力用接口。</p>',
        scenario: '「鸟」是抽象类(is-a Animal)，「可飞行」是接口(can-do Flyable)。鸵鸟是鸟但不能飞。',
        codeExample: '// 接口：能力\ninterface Flyable {\n    void fly();\n}\n\ninterface Swimmable {\n    void swim();\n}\n\n// 抽象类：本质\nabstract class Bird {\n    protected String name;\n    public Bird(String name) { this.name = name; }\n    public abstract void sound();\n}\n\n// 鸭子：是鸟，能飞，能游泳\nclass Duck extends Bird implements Flyable, Swimmable {\n    public Duck(String name) { super(name); }\n\n    @Override\n    public void sound() { System.out.println("嘎嘎"); }\n    @Override\n    public void fly() { System.out.println(name + "飞"); }\n    @Override\n    public void swim() { System.out.println(name + "游"); }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '必学', '面试']
      }
    ]
  },
  {
    id: 'p2-interface',
    title: '接口',
    description: '掌握接口的定义、实现和Java 8+新特性',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'p2-interface-define',
        title: 'interface 定义与 implements',
        shortDesc: '接口是「契约」——规定了你必须提供哪些能力',
        deepPrinciple: '<p>接口定义一组方法签名，实现类必须实现所有方法。一个类可以实现多个接口(Java多继承的替代方案)。接口中的字段默认public static final，方法默认public abstract。</p>',
        scenario: '定义Comparable接口让对象可排序，Serializable接口让对象可序列化。',
        codeExample: 'public interface Sortable {\n    int comparePriority();\n}\n\npublic interface Displayable {\n    String toDisplayString();\n}\n\n// 实现多个接口\npublic class Task implements Sortable, Displayable {\n    private String title;\n    private int priority;\n\n    public Task(String title, int priority) {\n        this.title = title;\n        this.priority = priority;\n    }\n\n    @Override\n    public int comparePriority() {\n        return this.priority;\n    }\n\n    @Override\n    public String toDisplayString() {\n        return String.format("[P%d] %s", priority, title);\n    }\n\n    public static void main(String[] args) {\n        Task t = new Task("修复Bug", 1);\n        System.out.println(t.toDisplayString());\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '必学']
      },
      {
        id: 'p2-default-method',
        title: '默认方法 default',
        shortDesc: 'default方法让接口也能有实现——给接口加新方法不破坏旧代码',
        deepPrinciple: '<p>Java 8引入default方法，允许接口提供默认实现。目的是在不破坏已有实现类的前提下给接口添加新方法。实现类可以选择重写default方法。</p><p>如果一个类实现的两个接口有同名default方法，必须手动重写解决冲突。</p>',
        scenario: 'JDK的Collection接口在Java 8添加了stream()默认方法，所有已有实现类自动获得了stream能力。',
        codeExample: 'public interface Logger {\n    void log(String message);\n\n    // 默认方法\n    default void info(String msg) {\n        log("[INFO] " + msg);\n    }\n\n    default void error(String msg) {\n        log("[ERROR] " + msg);\n    }\n\n    // 静态方法(Java 8+)\n    static Logger console() {\n        return msg -> System.out.println(msg);\n    }\n}\n\nclass FileLogger implements Logger {\n    @Override\n    public void log(String message) {\n        System.out.println("写入文件: " + message);\n    }\n    // info/error 自动继承默认实现\n}\n\npublic class DefaultMethodDemo {\n    public static void main(String[] args) {\n        Logger logger = new FileLogger();\n        logger.info("应用启动");  // 用default方法\n        logger.error("发生错误");\n\n        Logger console = Logger.console();\n        console.info("控制台日志");\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', 'Java8+']
      },
      {
        id: 'p2-functional-interface',
        title: '函数式接口',
        shortDesc: '只有一个抽象方法的接口——Lambda表达式的「入场券」',
        deepPrinciple: '<p>函数式接口只有一个抽象方法(default和static方法不算)。@FunctionalInterface注解让编译器检查。Lambda表达式本质是函数式接口的实例。</p><p>常用内置函数式接口：Runnable、Callable、Comparator、Function、Predicate、Consumer、Supplier。</p>',
        scenario: '自定义函数式接口用于回调、事件处理、策略模式。',
        codeExample: '@FunctionalInterface\npublic interface Validator<T> {\n    boolean validate(T value);\n\n    // default不影响函数式接口\n    default Validator<T> and(Validator<T> other) {\n        return value -> this.validate(value)\n            && other.validate(value);\n    }\n}\n\npublic class ValidatorDemo {\n    public static void main(String[] args) {\n        Validator<String> notEmpty = s -> !s.isBlank();\n        Validator<String> maxLen = s -> s.length() <= 20;\n        Validator<String> hasAt = s -> s.contains("@");\n\n        // 组合验证器\n        Validator<String> emailValidator =\n            notEmpty.and(maxLen).and(hasAt);\n\n        System.out.println(emailValidator.validate("a@b.com")); // true\n        System.out.println(emailValidator.validate(""));        // false\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', 'Java8+']
      }
    ]
  },
  {
    id: 'p2-inner-class',
    title: '内部类',
    description: '理解四种内部类及其适用场景',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'p2-member-inner',
        title: '成员内部类与静态内部类',
        shortDesc: '成员内部类绑定外部对象，静态内部类独立存在',
        deepPrinciple: '<p>成员内部类：持有外部类引用，能访问外部类所有成员。创建需先有外部类对象。</p><p>静态内部类：不持有外部类引用，只能访问外部类static成员。最常用，适合Builder模式和独立的辅助类。</p>',
        scenario: 'LinkedList的Node是静态内部类，HashMap的Entry也是。Builder模式用静态内部类。',
        codeExample: 'public class Outer {\n    private String name = "外部类";\n\n    // 成员内部类\n    class Inner {\n        void show() {\n            System.out.println("访问: " + name);\n        }\n    }\n\n    // 静态内部类(推荐)\n    static class StaticInner {\n        void show() {\n            // 不能访问name(非static)\n            System.out.println("静态内部类");\n        }\n    }\n\n    // Builder模式（静态内部类经典用法）\n    public static class Builder {\n        private String field1;\n        private int field2;\n        public Builder field1(String v) {\n            field1 = v; return this;\n        }\n        public Builder field2(int v) {\n            field2 = v; return this;\n        }\n        public Outer build() { return new Outer(); }\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '进阶']
      },
      {
        id: 'p2-local-anonymous',
        title: '局部内部类与匿名内部类',
        shortDesc: '匿名内部类是「一次性」的类——用完即弃，现在大多被Lambda替代',
        deepPrinciple: '<p>局部内部类：定义在方法内，作用域仅限该方法，很少使用。</p><p>匿名内部类：没有类名的一次性实现，用于接口或抽象类的快速实现。Java 8后大部分被Lambda替代，但多方法接口仍需匿名内部类。</p>',
        scenario: 'Swing/Android的事件监听器、Thread创建、Comparator排序。',
        codeExample: 'import java.util.*;\n\npublic class AnonymousDemo {\n    public static void main(String[] args) {\n        // 匿名内部类（多方法接口）\n        List<String> names = new ArrayList<>(\n            List.of("Charlie", "Alice", "Bob"));\n\n        // Java 8前的写法\n        Collections.sort(names, new Comparator<String>() {\n            @Override\n            public int compare(String a, String b) {\n                return a.compareTo(b);\n            }\n        });\n\n        // Lambda替代（单方法接口）\n        names.sort((a, b) -> a.compareTo(b));\n\n        // 匿名内部类实现抽象类\n        Thread t = new Thread() {\n            @Override\n            public void run() {\n                System.out.println("线程运行中");\n            }\n        };\n        t.start();\n\n        // Lambda更简洁\n        new Thread(() -> System.out.println("Lambda线程")).start();\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '进阶']
      },
      {
        id: 'p2-inner-usage',
        title: '内部类实际应用场景',
        shortDesc: '内部类最常见于迭代器、Builder模式和事件处理',
        deepPrinciple: '<p>内部类使用场景：</p><ul><li>静态内部类：Builder模式、数据结构节点(Node/Entry)、独立辅助类</li><li>匿名内部类/Lambda：回调函数、事件监听、线程创建</li><li>成员内部类：需要访问外部类实例状态时（如迭代器）</li></ul>',
        scenario: '自定义集合类的迭代器通常实现为成员内部类。',
        codeExample: 'import java.util.Iterator;\n\npublic class SimpleList<E> implements Iterable<E> {\n    private Object[] data;\n    private int size;\n\n    public SimpleList(int capacity) {\n        data = new Object[capacity];\n    }\n\n    public void add(E element) {\n        data[size++] = element;\n    }\n\n    // 成员内部类实现迭代器\n    @Override\n    public Iterator<E> iterator() {\n        return new SimpleIterator();\n    }\n\n    private class SimpleIterator implements Iterator<E> {\n        private int cursor = 0;\n\n        @Override\n        public boolean hasNext() {\n            return cursor < size; // 访问外部类的size\n        }\n\n        @Override\n        @SuppressWarnings("unchecked")\n        public E next() {\n            return (E) data[cursor++];\n        }\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '进阶']
      }
    ]
  },
  {
    id: 'p2-enum',
    title: '枚举',
    description: '掌握 Java 枚举类型的定义和使用',
    estimatedHours: 1,
    knowledgePoints: [
      {
        id: 'p2-enum-basics',
        title: 'enum 定义与构造器',
        shortDesc: '枚举把有限的选项定义为类型安全的常量——比int常量靠谱得多',
        deepPrinciple: '<p>enum是特殊的类，每个枚举值都是该类的单例实例。比int/String常量更安全(编译期检查)。</p><ul><li>可以有字段、构造器(private)和方法</li><li>values()返回所有枚举值数组</li><li>valueOf(String)将字符串转为枚举值</li><li>name()返回枚举名，ordinal()返回序号</li></ul>',
        scenario: '订单状态、支付方式、用户角色等有限选项都应该用枚举。',
        codeExample: 'public enum OrderStatus {\n    PENDING(0, "待支付"),\n    PAID(1, "已支付"),\n    SHIPPED(2, "已发货"),\n    COMPLETED(3, "已完成"),\n    CANCELLED(4, "已取消");\n\n    private final int code;\n    private final String desc;\n\n    OrderStatus(int code, String desc) {\n        this.code = code;\n        this.desc = desc;\n    }\n\n    public int getCode() { return code; }\n    public String getDesc() { return desc; }\n\n    /** 根据code查找枚举 */\n    public static OrderStatus fromCode(int code) {\n        for (OrderStatus s : values()) {\n            if (s.code == code) return s;\n        }\n        throw new IllegalArgumentException("未知状态码: " + code);\n    }\n\n    public static void main(String[] args) {\n        OrderStatus status = OrderStatus.PAID;\n        System.out.println(status.getDesc()); // 已支付\n\n        // 遍历\n        for (OrderStatus s : OrderStatus.values()) {\n            System.out.println(s.getCode() + ": " + s.getDesc());\n        }\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '必学']
      },
      {
        id: 'p2-enum-method',
        title: '枚举方法与 switch',
        shortDesc: '枚举可以有方法和行为——不只是简单的常量',
        deepPrinciple: '<p>枚举可以实现接口、定义抽象方法(每个枚举值各自实现)。switch语句对枚举有天然支持(不需要写类名前缀)。枚举单例是线程安全的。</p>',
        scenario: '不同支付方式有不同的手续费计算逻辑。',
        codeExample: 'public enum PayMethod {\n    ALIPAY("支付宝") {\n        @Override\n        public double fee(double amount) {\n            return amount * 0.006; // 0.6%\n        }\n    },\n    WECHAT("微信") {\n        @Override\n        public double fee(double amount) {\n            return amount * 0.006;\n        }\n    },\n    CREDIT_CARD("信用卡") {\n        @Override\n        public double fee(double amount) {\n            return amount * 0.01; // 1%\n        }\n    };\n\n    private final String displayName;\n    PayMethod(String displayName) {\n        this.displayName = displayName;\n    }\n\n    public abstract double fee(double amount);\n\n    public static void main(String[] args) {\n        PayMethod method = PayMethod.CREDIT_CARD;\n\n        // switch枚举\n        String msg = switch (method) {\n            case ALIPAY -> "使用支付宝";\n            case WECHAT -> "使用微信";\n            case CREDIT_CARD -> "使用信用卡";\n        };\n        System.out.printf("%s 手续费: %.2f%n",\n            msg, method.fee(1000));\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '进阶']
      }
    ]
  },
  {
    id: 'p2-annotation',
    title: '注解',
    description: '理解 Java 注解的作用和自定义方式',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'p2-builtin-annotations',
        title: '@Override / @Deprecated / @SuppressWarnings',
        shortDesc: '注解是代码的「标签」——给编译器和框架提供额外信息',
        deepPrinciple: '<p>内置注解：</p><ul><li>@Override：标记方法重写，编译器检查正确性</li><li>@Deprecated：标记已过时，调用时产生警告</li><li>@SuppressWarnings：抑制编译器警告</li><li>@FunctionalInterface：标记函数式接口</li></ul><p>注解不直接影响代码逻辑，但编译器和框架会读取注解信息做相应处理。</p>',
        scenario: 'Spring的@Service、@Autowired，MyBatis的@Select等都是注解驱动的。',
        codeExample: 'public class AnnotationDemo {\n\n    @Override // 编译器检查是否正确重写\n    public String toString() {\n        return "AnnotationDemo";\n    }\n\n    @Deprecated(since = "2.0", forRemoval = true)\n    public void oldMethod() {\n        System.out.println("请使用newMethod");\n    }\n\n    public void newMethod() {\n        System.out.println("新方法");\n    }\n\n    @SuppressWarnings("unchecked")\n    public void suppressDemo() {\n        // 抑制未检查转换警告\n        java.util.List list = new java.util.ArrayList();\n        list.add("test");\n    }\n\n    public static void main(String[] args) {\n        AnnotationDemo demo = new AnnotationDemo();\n        demo.oldMethod(); // IDE会显示删除线\n    }\n}',
        estimatedMinutes: 20,
        tags: ['OOP', '必学']
      },
      {
        id: 'p2-meta-annotations',
        title: '元注解',
        shortDesc: '元注解是「注解的注解」——定义注解的作用范围和生命周期',
        deepPrinciple: '<p>元注解用于修饰自定义注解：</p><ul><li>@Target：注解可以用在哪里(TYPE/METHOD/FIELD等)</li><li>@Retention：注解保留到什么阶段(SOURCE/CLASS/RUNTIME)</li><li>@Documented：包含在Javadoc中</li><li>@Inherited：子类可继承父类的注解</li><li>@Repeatable：允许重复使用</li></ul><p>框架通过反射读取RUNTIME注解来实现功能。</p>',
        scenario: '自定义@Log注解实现方法日志，@RequiresRole注解实现权限控制。',
        codeExample: 'import java.lang.annotation.*;\n\n// 自定义注解\n@Target(ElementType.METHOD) // 用在方法上\n@Retention(RetentionPolicy.RUNTIME) // 运行时可读取\npublic @interface ApiLog {\n    String value() default "";\n    String module() default "default";\n}\n\n// 使用自定义注解\nclass UserController {\n    @ApiLog(value = "查询用户", module = "用户管理")\n    public void getUser(Long id) {\n        System.out.println("查询用户: " + id);\n    }\n\n    @ApiLog("删除用户")\n    public void deleteUser(Long id) {\n        System.out.println("删除用户: " + id);\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '进阶']
      },
      {
        id: 'p2-custom-annotation',
        title: '自定义注解',
        shortDesc: '创建自己的注解——结合反射可以实现强大的框架功能',
        deepPrinciple: '<p>自定义注解使用 @interface 定义。注解的属性本质是方法，可以设默认值。结合反射在运行时读取注解信息，是Spring等框架的核心机制。</p>',
        scenario: '实现@Retry注解：标记方法失败后自动重试。',
        codeExample: 'import java.lang.annotation.*;\nimport java.lang.reflect.Method;\n\n@Target(ElementType.METHOD)\n@Retention(RetentionPolicy.RUNTIME)\n@interface Retry {\n    int maxAttempts() default 3;\n    long delay() default 1000;\n}\n\nclass OrderService {\n    @Retry(maxAttempts = 5, delay = 2000)\n    public void createOrder() {\n        System.out.println("创建订单...");\n        if (Math.random() > 0.5) {\n            throw new RuntimeException("网络超时");\n        }\n    }\n}\n\npublic class RetryProcessor {\n    public static void main(String[] args) throws Exception {\n        Method method = OrderService.class\n            .getMethod("createOrder");\n\n        if (method.isAnnotationPresent(Retry.class)) {\n            Retry retry = method.getAnnotation(Retry.class);\n            System.out.println("最大重试: " + retry.maxAttempts());\n            System.out.println("延迟: " + retry.delay() + "ms");\n        }\n    }\n}',
        estimatedMinutes: 30,
        tags: ['OOP', '进阶']
      }
    ]
  },
  {
    id: 'p2-reflection',
    title: '反射',
    description: '理解 Java 反射机制及其应用场景',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'p2-class-object-get',
        title: 'Class 类获取',
        shortDesc: '反射让程序在运行时「照镜子」——动态查看和操作类的结构',
        deepPrinciple: '<p>反射(Reflection)允许在运行时获取类的信息并操作。获取Class对象的三种方式：</p><ul><li>类名.class：编译时就知道类</li><li>对象.getClass()：运行时从对象获取</li><li>Class.forName("全限定名")：运行时动态加载</li></ul><p>反射是Spring IoC、ORM框架、JSON序列化等的基础技术。</p>',
        scenario: 'Spring通过反射创建Bean实例并注入依赖。',
        codeExample: 'public class ReflectionBasic {\n    public static void main(String[] args) throws Exception {\n        // 三种获取Class的方式\n        Class<?> c1 = String.class;\n        Class<?> c2 = "hello".getClass();\n        Class<?> c3 = Class.forName("java.lang.String");\n\n        System.out.println(c1 == c2); // true\n        System.out.println(c1 == c3); // true\n\n        // 查看类信息\n        System.out.println("类名: " + c1.getSimpleName());\n        System.out.println("包名: " + c1.getPackageName());\n        System.out.println("父类: " + c1.getSuperclass().getSimpleName());\n\n        // 查看接口\n        for (Class<?> iface : c1.getInterfaces()) {\n            System.out.println("接口: " + iface.getSimpleName());\n        }\n    }\n}',
        estimatedMinutes: 25,
        tags: ['OOP', '进阶']
      },
      {
        id: 'p2-field-method-constructor',
        title: 'Field / Method / Constructor',
        shortDesc: '通过反射动态读写字段、调用方法、创建对象',
        deepPrinciple: '<p>反射可以获取并操作类的成员：</p><ul><li>Field：读写字段值，包括private字段</li><li>Method：动态调用方法</li><li>Constructor：动态创建对象</li><li>setAccessible(true)：突破private访问限制(慎用)</li></ul>',
        scenario: 'ORM框架通过反射将数据库查询结果映射到Java对象的字段上。',
        codeExample: 'import java.lang.reflect.*;\n\npublic class ReflectionOps {\n    public static void main(String[] args) throws Exception {\n        Class<?> clazz = User.class;\n\n        // 创建对象\n        Constructor<?> ctor = clazz.getConstructor(\n            String.class, String.class);\n        Object user = ctor.newInstance("张三", "zs@test.com");\n\n        // 读取字段\n        Field nameField = clazz.getDeclaredField("name");\n        nameField.setAccessible(true); // 访问private\n        System.out.println("name=" + nameField.get(user));\n\n        // 修改字段\n        nameField.set(user, "李四");\n\n        // 调用方法\n        Method method = clazz.getMethod("toString");\n        System.out.println(method.invoke(user));\n\n        // 遍历所有方法\n        for (Method m : clazz.getDeclaredMethods()) {\n            System.out.println("方法: " + m.getName());\n        }\n    }\n}',
        estimatedMinutes: 30,
        tags: ['OOP', '进阶']
      },
      {
        id: 'p2-reflection-usage',
        title: '反射应用场景',
        shortDesc: '反射是框架的「魔法」——Spring、MyBatis、Jackson都靠它工作',
        deepPrinciple: '<p>反射的典型应用：</p><ul><li>Spring IoC：根据配置/注解动态创建对象并注入依赖</li><li>ORM框架：数据库结果集映射到Java对象</li><li>JSON序列化：Jackson/Gson通过反射读写对象字段</li><li>单元测试：测试框架通过反射调用测试方法</li></ul><p>反射的代价：性能开销(比直接调用慢)、绕过编译检查(类型安全降低)。应在框架级别使用，业务代码避免直接使用。</p>',
        scenario: '实现一个简单的JSON序列化器，通过反射读取对象所有字段并输出JSON。',
        codeExample: 'import java.lang.reflect.Field;\n\npublic class SimpleJsonSerializer {\n\n    /**\n     * 将对象序列化为JSON字符串（简化版）\n     */\n    public static String toJson(Object obj) throws Exception {\n        Class<?> clazz = obj.getClass();\n        StringBuilder sb = new StringBuilder("{");\n        Field[] fields = clazz.getDeclaredFields();\n\n        for (int i = 0; i < fields.length; i++) {\n            fields[i].setAccessible(true);\n            String name = fields[i].getName();\n            Object value = fields[i].get(obj);\n\n            sb.append(String.format("\\"%s\\\":", name));\n            if (value instanceof String) {\n                sb.append(String.format("\\"%s\\\"\", value));\n            } else {\n                sb.append(value);\n            }\n            if (i < fields.length - 1) sb.append(",");\n        }\n        sb.append("}");\n        return sb.toString();\n    }\n\n    public static void main(String[] args) throws Exception {\n        User user = new User("张三", "zs@test.com");\n        System.out.println(toJson(user));\n        // {"name":"张三","email":"zs@test.com"}\n    }\n}',
        estimatedMinutes: 30,
        tags: ['OOP', '进阶', '面试']
      }
    ]
  }
];

// ======================== Phase 3: 核心类库与集合框架 ========================
export const phase3Topics = [
  {
    id: 'p3-string-advanced',
    title: 'String 进阶',
    description: '掌握 StringBuilder、正则表达式和字符串格式化',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'p3-string-builder-buffer',
        title: 'StringBuilder 与 StringBuffer',
        shortDesc: 'StringBuilder是可修改的字符串——循环拼接时比String快上百倍',
        deepPrinciple: '<p>StringBuilder和StringBuffer都是可变字符串：</p><ul><li><strong>StringBuilder</strong>：非线程安全，性能高，<strong>单线程首选</strong></li><li><strong>StringBuffer</strong>：线程安全(方法加了synchronized)，多线程场景用</li></ul><p>内部维护一个可扩容的char数组，append时不创建新对象。初始容量16，容量不足时扩容为(旧容量*2+2)。</p><p>性能对比：循环拼接10000次，String用时约800ms，StringBuilder约1ms。</p>',
        scenario: '拼接SQL语句、生成HTML、循环构建字符串都应使用StringBuilder。',
        codeExample: 'public class StringBuilderDemo {\n    public static void main(String[] args) {\n        // 基本用法\n        StringBuilder sb = new StringBuilder();\n        sb.append("SELECT * FROM users");\n        sb.append(" WHERE age > ");\n        sb.append(18);\n        sb.append(" ORDER BY name");\n        String sql = sb.toString();\n\n        // 链式调用\n        String html = new StringBuilder()\n            .append("<div>")\n            .append("<h1>标题</h1>")\n            .append("<p>内容</p>")\n            .append("</div>")\n            .toString();\n\n        // 其他方法\n        StringBuilder buf = new StringBuilder("Hello");\n        buf.insert(5, " World");  // Hello World\n        buf.delete(5, 11);        // Hello\n        buf.reverse();            // olleH\n        buf.replace(0, 2, "HE");  // HElleH\n\n        // StringBuffer用法相同，但线程安全\n        StringBuffer safe = new StringBuffer();\n        safe.append("线程安全的拼接");\n    }\n}',
        estimatedMinutes: 25,
        tags: ['核心类库', '必学']
      },
      {
        id: 'p3-regex',
        title: '正则表达式匹配',
        shortDesc: '正则是字符串匹配的「万能钥匙」——用模式描述文本规则',
        deepPrinciple: '<p>Java正则通过Pattern和Matcher类使用：</p><ul><li>\\d 数字、\\w 字母数字下划线、\\s 空白</li><li>. 任意字符、* 0+次、+ 1+次、? 0或1次</li><li>{n,m} 重复n到m次</li><li>() 分组、[] 字符集、| 或</li></ul><p>String类的matches/replaceAll/split底层也使用Pattern。频繁使用时应预编译Pattern提升性能。</p>',
        scenario: '校验手机号格式、提取URL参数、日志解析。',
        codeExample: 'import java.util.regex.*;\n\npublic class RegexDemo {\n    // 预编译正则（性能优化）\n    private static final Pattern PHONE_PATTERN =\n        Pattern.compile("^1[3-9]\\\\d{9}$");\n    private static final Pattern EMAIL_PATTERN =\n        Pattern.compile("^[\\\\w.-]+@[\\\\w.-]+\\\\.\\\\w{2,}$");\n\n    public static boolean isPhone(String input) {\n        return PHONE_PATTERN.matcher(input).matches();\n    }\n\n    public static void main(String[] args) {\n        // 校验\n        System.out.println(isPhone("13812345678")); // true\n        System.out.println(isPhone("12345"));       // false\n\n        // 提取匹配内容\n        String text = "订单号:ORD001 金额:99.5 订单号:ORD002 金额:199";\n        Pattern p = Pattern.compile("订单号:(\\\\w+) 金额:([\\\\d.]+)");\n        Matcher m = p.matcher(text);\n        while (m.find()) {\n            System.out.printf("订单:%s 金额:%s%n",\n                m.group(1), m.group(2));\n        }\n\n        // 替换\n        String cleaned = "abc  def   ghi".replaceAll("\\\\s+", " ");\n        System.out.println(cleaned); // "abc def ghi"\n    }\n}',
        estimatedMinutes: 30,
        tags: ['核心类库', '必学']
      },
      {
        id: 'p3-string-format',
        title: 'String.format 格式化',
        shortDesc: '格式化输出像填空题——用占位符控制数字精度和对齐方式',
        deepPrinciple: '<p>String.format使用占位符格式化字符串：</p><ul><li>%s 字符串、%d 整数、%f 浮点数、%b 布尔</li><li>%.2f 保留2位小数、%10d 右对齐占10位、%-10s 左对齐</li><li>%n 平台无关换行(推荐用于format)</li><li>%tF 日期(yyyy-MM-dd)、%tT 时间(HH:mm:ss)</li></ul><p>Java 15+引入了文本块(Text Block)和formatted()方法。</p>',
        scenario: '生成报表、格式化日志输出、构建邮件内容。',
        codeExample: 'import java.time.LocalDateTime;\n\npublic class FormatDemo {\n    public static void main(String[] args) {\n        // 基本格式化\n        String msg = String.format("用户%s，余额%.2f元", "张三", 1234.5);\n        System.out.println(msg);\n\n        // 数字格式化\n        System.out.println(String.format("%,d", 1000000));  // 1,000,000\n        System.out.println(String.format("%010d", 42));      // 0000000042\n        System.out.println(String.format("%-10s|%10s", "左对齐", "右对齐"));\n\n        // 日期格式化\n        LocalDateTime now = LocalDateTime.now();\n        System.out.println(String.format("%tF %tT", now, now));\n\n        // Java 15+ 文本块\n        String json = \"\"\"\n            {\n                "name": "%s",\n                "age": %d\n            }\n            \"\"\".formatted("张三", 25);\n        System.out.println(json);\n    }\n}',
        estimatedMinutes: 20,
        tags: ['核心类库', '必学']
      },
      {
        id: 'p3-string-join-repeat',
        title: '字符串实用技巧',
        shortDesc: 'String.join拼接、repeat重复、chars流处理等实用方法',
        deepPrinciple: '<p>Java 8-17新增的字符串实用方法：</p><ul><li>String.join(分隔符, 元素...)：拼接字符串</li><li>str.repeat(n)：重复n次(Java 11)</li><li>str.strip()/stripLeading()/stripTrailing()：去空白(Java 11)</li><li>str.lines()：按行分割为Stream(Java 11)</li><li>str.indent(n)：缩进(Java 12)</li></ul>',
        scenario: '生成CSV行、构建SQL的IN条件、格式化输出。',
        codeExample: 'import java.util.List;\n\npublic class StringTipsDemo {\n    public static void main(String[] args) {\n        // String.join\n        List<String> ids = List.of("1", "2", "3");\n        String inClause = "(" + String.join(",", ids) + ")";\n        System.out.println(inClause); // (1,2,3)\n\n        // repeat (Java 11)\n        String separator = "=".repeat(40);\n        System.out.println(separator);\n\n        // strip vs trim\n        String s = "\\u3000 Hello \\u3000"; // 全角空格\n        System.out.println(s.trim().length());  // 含全角空格\n        System.out.println(s.strip().length()); // 去除全角空格\n\n        // lines (Java 11)\n        String multiline = "第一行\\n第二行\\n第三行";\n        multiline.lines()\n            .map(line -> "  > " + line)\n            .forEach(System.out::println);\n\n        // isBlank (Java 11)\n        System.out.println("  ".isBlank());  // true\n        System.out.println("  ".isEmpty());  // false\n    }\n}',
        estimatedMinutes: 20,
        tags: ['核心类库', 'Java11+']
      }
    ]
  },
  {
    id: 'p3-wrapper-deep',
    title: '包装类深入',
    description: '深入理解包装类的陷阱和最佳实践',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'p3-integer-cache-deep',
        title: 'Integer 缓存（-128~127）深入',
        shortDesc: '缓存范围内valueOf返回同一对象——这是==陷阱的根源',
        deepPrinciple: '<p>Integer.valueOf()源码在-128~127范围内返回缓存数组中的对象。缓存上限可通过JVM参数-XX:AutoBoxCacheMax调整。Long也有-128~127的缓存。</p><p>这个设计是为了性能——小数字使用频率高，缓存避免重复创建对象。</p>',
        scenario: '理解为什么相同的代码在不同数值范围表现不同，避免线上Bug。',
        codeExample: 'public class CacheDeepDive {\n    public static void main(String[] args) {\n        // Integer缓存\n        Integer a = 127, b = 127;\n        System.out.println(a == b); // true（缓存）\n\n        Integer c = 128, d = 128;\n        System.out.println(c == d); // false（新对象）\n\n        // Long也有缓存\n        Long l1 = 127L, l2 = 127L;\n        System.out.println(l1 == l2); // true\n        Long l3 = 128L, l4 = 128L;\n        System.out.println(l3 == l4); // false\n\n        // Double没有缓存\n        Double d1 = 1.0, d2 = 1.0;\n        System.out.println(d1 == d2); // false\n\n        // Boolean缓存了TRUE和FALSE\n        Boolean b1 = true, b2 = true;\n        System.out.println(b1 == b2); // true\n    }\n}',
        estimatedMinutes: 20,
        tags: ['核心类库', '面试']
      },
      {
        id: 'p3-equals-trap',
        title: '== vs equals 陷阱',
        shortDesc: '包装类用==是在比地址不是比值——这是最常见的Bug之一',
        deepPrinciple: '<p>包装类比较规则：</p><ul><li>==：比较引用地址（除了缓存范围内的碰巧相等）</li><li>equals()：比较数值内容</li><li>不同包装类型之间不能equals（Integer.equals(Long)返回false）</li></ul><p>最佳实践：包装类比较永远用equals()或拆箱为基本类型后用==。</p>',
        scenario: '比较从不同来源获取的ID是否相等——数据库返回Long，代码中用Integer。',
        codeExample: 'public class EqualsTraps {\n    public static void main(String[] args) {\n        // 陷阱1：==比的是地址\n        Integer x = 200, y = 200;\n        System.out.println(x == y);      // false!\n        System.out.println(x.equals(y)); // true\n\n        // 陷阱2：不同类型equals\n        Integer intVal = 1;\n        Long longVal = 1L;\n        System.out.println(intVal.equals(longVal)); // false!\n        // 类型不同，直接返回false\n\n        // 正确做法：统一类型\n        System.out.println(intVal.longValue() == longVal); // true\n\n        // 陷阱3：compareTo的正确用法\n        Integer a = 100, b = 200;\n        System.out.println(a.compareTo(b)); // -1 (a < b)\n        System.out.println(Integer.compare(100, 200)); // -1\n    }\n}',
        estimatedMinutes: 20,
        tags: ['核心类库', '面试']
      },
      {
        id: 'p3-unbox-npe',
        title: '拆箱 NPE 风险',
        shortDesc: '包装类为null时拆箱会空指针——这是生产环境最常见的NPE之一',
        deepPrinciple: '<p>自动拆箱时如果包装类为null，JVM调用intValue()等方法触发NullPointerException。三元运算符、方法返回值、算术运算都可能触发意外拆箱。</p><p>防御方式：使用前判null、使用Optional、数据库映射类型用包装类。</p>',
        scenario: '数据库字段可能为NULL映射到Java对象，直接参与计算就会NPE。',
        codeExample: 'public class UnboxNpeDemo {\n    public static void main(String[] args) {\n        // 直接拆箱NPE\n        Integer count = null;\n        // int c = count; // NPE!\n\n        // 三元运算符陷阱\n        boolean flag = true;\n        Integer a = null;\n        Integer b = 10;\n        // int result = flag ? a : b; // NPE! a被拆箱\n\n        // 安全写法\n        int safeCount = count != null ? count : 0;\n\n        // 使用Objects工具类\n        Integer val = null;\n        int safe = java.util.Objects.requireNonNullElse(val, 0);\n\n        // 数据库实体类建议用包装类型\n        // private Integer age;  // 推荐，可表达null\n        // private int age;      // 不推荐，null映射时NPE\n\n        // 计算前判null\n        Integer price = getPrice();\n        Integer qty = getQuantity();\n        if (price != null && qty != null) {\n            int total = price * qty; // 安全\n        }\n    }\n\n    static Integer getPrice() { return null; }\n    static Integer getQuantity() { return 5; }\n}',
        estimatedMinutes: 25,
        tags: ['核心类库', '必学']
      }
    ]
  },
  {
    id: 'p3-arraylist',
    title: 'ArrayList',
    description: '深入理解最常用的集合类 ArrayList',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'p3-arraylist-basics',
        title: '底层数组与基本操作',
        shortDesc: 'ArrayList底层是数组——随机访问O(1)快，中间插入O(n)慢',
        deepPrinciple: '<p>ArrayList内部维护一个Object[]数组：</p><ul><li>get(i)/set(i)：直接下标访问，O(1)</li><li>add(末尾)：均摊O(1)，可能触发扩容</li><li>add(i,e)/remove(i)：需要移动元素，O(n)</li><li>默认初始容量10，可在构造时指定</li></ul>',
        scenario: '存储用户列表、订单列表、查询结果——大多数场景ArrayList是首选。',
        codeExample: 'import java.util.*;\n\npublic class ArrayListBasic {\n    public static void main(String[] args) {\n        // 创建（指定初始容量优化性能）\n        List<String> names = new ArrayList<>(100);\n\n        // 添加\n        names.add("张三");\n        names.add("李四");\n        names.add("王五");\n        names.add(1, "赵六"); // 在索引1插入\n\n        // 访问\n        String first = names.get(0); // O(1)\n        int size = names.size();\n\n        // 修改\n        names.set(0, "张三丰");\n\n        // 删除\n        names.remove("李四");    // 按内容删\n        names.remove(0);          // 按索引删\n\n        // 遍历\n        for (String name : names) {\n            System.out.println(name);\n        }\n\n        // 快速创建不可变List\n        List<String> immutable = List.of("A", "B", "C");\n    }\n}',
        estimatedMinutes: 25,
        tags: ['集合', '必学']
      },
      {
        id: 'p3-arraylist-resize',
        title: '扩容机制（1.5倍）',
        shortDesc: '容量不够时自动扩容为1.5倍——频繁扩容影响性能，建议预估大小',
        deepPrinciple: '<p>ArrayList扩容流程：</p><ul><li>add时检查容量是否足够</li><li>不够则扩容：新容量 = 旧容量 + 旧容量/2（即1.5倍）</li><li>创建新数组，Arrays.copyOf复制旧数据</li></ul><p>扩容涉及数组复制，如果预知元素数量，在构造时指定容量可避免多次扩容。</p>',
        scenario: '从数据库查询10000条记录放入List，new ArrayList<>(10000)比默认容量10扩容多次要快。',
        codeExample: 'import java.util.*;\n\npublic class ArrayListResize {\n    public static void main(String[] args) {\n        // 默认容量10，超过后扩容\n        // 10 → 15 → 22 → 33 → 49 → ...\n\n        // 预估大小避免扩容\n        int expectedSize = 10000;\n        List<Integer> list = new ArrayList<>(expectedSize);\n\n        // 性能测试\n        long start = System.nanoTime();\n        List<Integer> noCapacity = new ArrayList<>();\n        for (int i = 0; i < 100000; i++) {\n            noCapacity.add(i);\n        }\n        long t1 = System.nanoTime() - start;\n\n        start = System.nanoTime();\n        List<Integer> withCapacity = new ArrayList<>(100000);\n        for (int i = 0; i < 100000; i++) {\n            withCapacity.add(i);\n        }\n        long t2 = System.nanoTime() - start;\n\n        System.out.printf("无初始容量: %dms%n", t1 / 1000000);\n        System.out.printf("有初始容量: %dms%n", t2 / 1000000);\n\n        // trimToSize() 缩小到实际大小，释放多余空间\n        ((ArrayList<Integer>) withCapacity).trimToSize();\n    }\n}',
        estimatedMinutes: 25,
        tags: ['集合', '面试']
      },
      {
        id: 'p3-arraylist-vs-linked',
        title: 'ArrayList vs LinkedList',
        shortDesc: 'ArrayList随机访问快，LinkedList中间插删快——但实际大多数场景ArrayList胜出',
        deepPrinciple: '<p>对比：</p><ul><li>ArrayList：数组实现，随机访问O(1)，中间插删O(n)，内存连续CPU缓存友好</li><li>LinkedList：双向链表，随机访问O(n)，头尾操作O(1)，每个节点额外开销(指针)</li></ul><p>实际测试中，由于CPU缓存命中率，<strong>ArrayList几乎在所有场景都比LinkedList快</strong>，除非是大量在头部插入/删除的场景。</p>',
        scenario: '日常开发默认用ArrayList。只有在需要高频头部操作(如实现队列)时考虑LinkedList。',
        codeExample: 'import java.util.*;\n\npublic class ListCompare {\n    public static void main(String[] args) {\n        List<Integer> arrayList = new ArrayList<>();\n        List<Integer> linkedList = new LinkedList<>();\n\n        // 尾部添加：两者都快\n        int n = 100000;\n        for (int i = 0; i < n; i++) {\n            arrayList.add(i);\n            linkedList.add(i);\n        }\n\n        // 随机访问：ArrayList快得多\n        long start = System.nanoTime();\n        for (int i = 0; i < 10000; i++) {\n            arrayList.get(i * 10); // O(1)\n        }\n        System.out.printf("ArrayList随机访问: %dms%n",\n            (System.nanoTime() - start) / 1000000);\n\n        start = System.nanoTime();\n        for (int i = 0; i < 10000; i++) {\n            linkedList.get(i * 10); // O(n)!\n        }\n        System.out.printf("LinkedList随机访问: %dms%n",\n            (System.nanoTime() - start) / 1000000);\n\n        // 结论：绝大多数场景用ArrayList\n    }\n}',
        estimatedMinutes: 25,
        tags: ['集合', '面试']
      },
      {
        id: 'p3-fail-fast',
        title: 'fail-fast 迭代器',
        shortDesc: '遍历时修改集合会抛异常——这是Java集合的保护机制',
        deepPrinciple: '<p>fail-fast机制：遍历集合时如果集合被修改(add/remove)，迭代器抛出ConcurrentModificationException。通过modCount计数器检测。</p><p>正确做法：使用迭代器的remove()方法，或使用removeIf()，或用CopyOnWriteArrayList。</p>',
        scenario: '遍历用户列表时删除不活跃用户——直接for-each+remove就会报错。',
        codeExample: 'import java.util.*;\n\npublic class FailFastDemo {\n    public static void main(String[] args) {\n        List<String> list = new ArrayList<>(\n            Arrays.asList("张三", "李四", "王五", "赵六"));\n\n        // 错误：for-each中直接删除\n        // for (String s : list) {\n        //     if (s.equals("李四")) list.remove(s);\n        //     // ConcurrentModificationException!\n        // }\n\n        // 方式1：使用迭代器remove\n        Iterator<String> it = list.iterator();\n        while (it.hasNext()) {\n            if (it.next().equals("李四")) {\n                it.remove(); // 安全\n            }\n        }\n\n        // 方式2：removeIf（推荐，最简洁）\n        list.removeIf(s -> s.equals("王五"));\n\n        // 方式3：倒序遍历删除\n        for (int i = list.size() - 1; i >= 0; i--) {\n            if (list.get(i).equals("赵六")) {\n                list.remove(i);\n            }\n        }\n\n        System.out.println(list);\n    }\n}',
        estimatedMinutes: 25,
        tags: ['集合', '必学']
      }
    ]
  },
  {
    id: 'p3-linkedlist',
    title: 'LinkedList',
    description: '理解 LinkedList 的双向链表实现和 Deque 接口',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'p3-linkedlist-structure',
        title: '双向链表结构',
        shortDesc: 'LinkedList是双向链表——每个节点有前后两个指针',
        deepPrinciple: '<p>LinkedList内部由Node节点组成，每个Node包含：prev(前驱指针)、item(数据)、next(后继指针)。维护first和last引用指向头尾节点。</p><ul><li>头尾操作O(1)</li><li>随机访问O(n)(需要从头或尾遍历)</li><li>已知节点位置时插删O(1)</li></ul>',
        scenario: '实现LRU缓存、消息队列等需要频繁在两端操作的场景。',
        codeExample: 'import java.util.LinkedList;\n\npublic class LinkedListDemo {\n    public static void main(String[] args) {\n        LinkedList<String> list = new LinkedList<>();\n\n        // 头尾操作 O(1)\n        list.addFirst("头部");\n        list.addLast("尾部");\n        list.add("中间");  // 默认加到尾部\n\n        System.out.println(list.getFirst()); // 头部\n        System.out.println(list.getLast());  // 中间\n\n        // 删除头尾\n        String head = list.removeFirst();\n        String tail = list.removeLast();\n\n        // 注意：避免对LinkedList使用get(i)\n        // 这段代码是O(n^2)\n        // for (int i = 0; i < list.size(); i++) {\n        //     list.get(i); // 每次O(n)\n        // }\n\n        // 正确：使用迭代器或for-each\n        for (String s : list) {\n            System.out.println(s);\n        }\n    }\n}',
        estimatedMinutes: 25,
        tags: ['集合', '必学']
      },
      {
        id: 'p3-deque',
        title: 'Deque 接口',
        shortDesc: 'Deque是双端队列接口——LinkedList实现了它，可当队列也可当栈',
        deepPrinciple: '<p>Deque(Double Ended Queue)支持两端操作：</p><ul><li>作为队列(FIFO)：offer(入队)、poll(出队)</li><li>作为栈(LIFO)：push(入栈)、pop(出栈)</li></ul><p>官方推荐：用ArrayDeque替代Stack类，用ArrayDeque或LinkedList实现队列。ArrayDeque基于数组，通常比LinkedList更快。</p>',
        scenario: '实现BFS用队列、括号匹配/撤销操作用栈。',
        codeExample: 'import java.util.*;\n\npublic class DequeDemo {\n    public static void main(String[] args) {\n        // 用作队列（FIFO）\n        Deque<String> queue = new ArrayDeque<>();\n        queue.offer("任务1"); // 入队\n        queue.offer("任务2");\n        queue.offer("任务3");\n        while (!queue.isEmpty()) {\n            System.out.println("处理: " + queue.poll()); // 出队\n        }\n\n        // 用作栈（LIFO）\n        Deque<Character> stack = new ArrayDeque<>();\n        String expr = "((a+b)*c)";\n        for (char ch : expr.toCharArray()) {\n            if (ch == \'(\') {\n                stack.push(ch);\n            } else if (ch == \')\') {\n                if (stack.isEmpty()) {\n                    System.out.println("括号不匹配");\n                    return;\n                }\n                stack.pop();\n            }\n        }\n        System.out.println(stack.isEmpty()\n            ? "括号匹配" : "括号不匹配");\n    }\n}',
        estimatedMinutes: 25,
        tags: ['集合', '必学']
      },
      {
        id: 'p3-linkedlist-as-queue',
        title: '用作队列和栈',
        shortDesc: 'LinkedList既实现了List又实现了Deque——一类多用但要选对接口',
        deepPrinciple: '<p>LinkedList同时实现List和Deque接口。声明时用接口类型：</p><ul><li>当List用：List&lt;T&gt; list = new LinkedList&lt;&gt;()</li><li>当队列用：Queue&lt;T&gt; queue = new LinkedList&lt;&gt;()</li><li>当双端队列用：Deque&lt;T&gt; deque = new LinkedList&lt;&gt;()</li></ul><p>推荐：队列用ArrayDeque(更快)，只有需要null元素或已有LinkedList时才用LinkedList当队列。</p>',
        scenario: '实现简单的消息队列或任务调度器。',
        codeExample: 'import java.util.*;\n\npublic class LinkedListUsage {\n    // 简单任务调度器\n    static class TaskScheduler {\n        private final Queue<Runnable> taskQueue = new LinkedList<>();\n\n        public void submit(Runnable task) {\n            taskQueue.offer(task);\n        }\n\n        public void executeAll() {\n            while (!taskQueue.isEmpty()) {\n                Runnable task = taskQueue.poll();\n                task.run();\n            }\n        }\n    }\n\n    public static void main(String[] args) {\n        TaskScheduler scheduler = new TaskScheduler();\n        scheduler.submit(() -> System.out.println("发送邮件"));\n        scheduler.submit(() -> System.out.println("生成报表"));\n        scheduler.submit(() -> System.out.println("清理缓存"));\n        scheduler.executeAll();\n    }\n}',
        estimatedMinutes: 20,
        tags: ['集合', '进阶']
      }
    ]
  },
  {
    id: 'p3-hashmap',
    title: 'HashSet 与 HashMap',
    description: '深入理解哈希表的原理和使用',
    estimatedHours: 4,
    knowledgePoints: [
      {
        id: 'p3-hash-principle',
        title: '哈希表原理',
        shortDesc: '哈希表像字典的「拼音索引」——通过计算直接定位，不用逐页翻',
        deepPrinciple: '<p>HashMap底层是<strong>数组+链表+红黑树</strong>：</p><ul><li>通过hashCode()计算哈希值确定数组下标</li><li>不同key可能映射到同一下标（哈希冲突）</li><li>冲突时用链表存储（JDK8+链表长度>8转红黑树）</li><li>get/put平均O(1)，最坏O(log n)（红黑树）</li></ul><p>HashSet底层就是HashMap（value用固定PRESENT对象）。</p>',
        scenario: '用户ID查用户信息、缓存数据、统计词频。',
        codeExample: 'import java.util.*;\n\npublic class HashMapBasic {\n    public static void main(String[] args) {\n        // HashMap基本操作\n        Map<String, Integer> scores = new HashMap<>();\n        scores.put("张三", 85);\n        scores.put("李四", 92);\n        scores.put("王五", 78);\n\n        int score = scores.get("张三"); // 85\n        scores.getOrDefault("赵六", 0); // 0\n        scores.containsKey("李四");      // true\n\n        // 遍历\n        for (Map.Entry<String, Integer> entry : scores.entrySet()) {\n            System.out.println(entry.getKey() + ": " + entry.getValue());\n        }\n\n        // HashSet去重\n        Set<String> set = new HashSet<>();\n        set.add("A"); set.add("B"); set.add("A");\n        System.out.println(set.size()); // 2\n\n        // 词频统计\n        String[] words = "the cat sat on the mat the cat".split(" ");\n        Map<String, Integer> freq = new HashMap<>();\n        for (String w : words) {\n            freq.merge(w, 1, Integer::sum);\n        }\n        System.out.println(freq);\n    }\n}',
        estimatedMinutes: 30,
        tags: ['集合', '必学']
      },
      {
        id: 'p3-hashcode-equals',
        title: 'hashCode / equals 契约',
        shortDesc: '重写equals必须重写hashCode——这是HashMap正确工作的前提',
        deepPrinciple: '<p>核心契约：</p><ul><li>equals相等的对象，hashCode<strong>必须</strong>相等</li><li>hashCode相等的对象，equals<strong>不一定</strong>相等</li><li>只重写equals不重写hashCode会导致HashMap失效</li></ul><p>HashMap查找过程：先用hashCode定位桶，再用equals比较key。如果hashCode不一致，根本不会调用equals。</p>',
        scenario: '自定义类作为HashMap的key时必须正确重写hashCode和equals。',
        codeExample: 'import java.util.*;\n\npublic class HashCodeEquals {\n    static class Point {\n        int x, y;\n        Point(int x, int y) { this.x = x; this.y = y; }\n\n        @Override\n        public boolean equals(Object o) {\n            if (this == o) return true;\n            if (!(o instanceof Point p)) return false;\n            return x == p.x && y == p.y;\n        }\n\n        @Override\n        public int hashCode() {\n            return Objects.hash(x, y);\n        }\n    }\n\n    public static void main(String[] args) {\n        Map<Point, String> map = new HashMap<>();\n        map.put(new Point(1, 2), "A点");\n\n        // 正确重写后能找到\n        System.out.println(map.get(new Point(1, 2))); // A点\n\n        // 如果没重写hashCode，这里返回null！\n        // 因为两个new Point的hashCode不同，HashMap找不到\n    }\n}',
        estimatedMinutes: 30,
        tags: ['集合', '必学', '面试']
      },
      {
        id: 'p3-hashmap-resize',
        title: '扩容与负载因子',
        shortDesc: '负载因子0.75时扩容为2倍——平衡了空间和时间效率',
        deepPrinciple: '<p>HashMap扩容机制：</p><ul><li>默认初始容量16，负载因子0.75</li><li>当元素数 > 容量 * 负载因子时扩容</li><li>扩容为原来的2倍，所有元素重新哈希(rehash)</li><li>容量始终是2的幂（为了用位运算替代取模提升性能）</li></ul><p>预知元素数量时指定初始容量：new HashMap<>(expectedSize * 4 / 3 + 1)。</p>',
        scenario: '知道要存1000个元素，初始容量设为1400+避免扩容。',
        codeExample: 'import java.util.*;\n\npublic class HashMapResize {\n    public static void main(String[] args) {\n        // 默认：容量16，负载因子0.75\n        // 元素>12时扩容到32\n        Map<String, String> map1 = new HashMap<>();\n\n        // 预估大小，避免扩容\n        // 存100个元素，100/0.75 ≈ 134，取2的幂=256\n        Map<String, String> map2 = new HashMap<>(256);\n\n        // 或者简单计算\n        int expected = 100;\n        Map<String, String> map3 = new HashMap<>(\n            expected * 4 / 3 + 1);\n\n        // Map.of 快速创建不可变Map（Java 9+）\n        Map<String, Integer> scores = Map.of(\n            "张三", 85, "李四", 92, "王五", 78);\n\n        // Map.ofEntries 超过10对时\n        Map<String, Integer> large = Map.ofEntries(\n            Map.entry("A", 1),\n            Map.entry("B", 2)\n        );\n    }\n}',
        estimatedMinutes: 25,
        tags: ['集合', '面试']
      },
      {
        id: 'p3-tree-conversion',
        title: '链表转红黑树（8→6）',
        shortDesc: '链表长度>8时转红黑树提升查询效率，<6时退化回链表',
        deepPrinciple: '<p>JDK 8优化：</p><ul><li>链表长度 > 8 且数组长度 >= 64：链表转为红黑树，查询从O(n)变O(log n)</li><li>红黑树节点 < 6：退化回链表（维护红黑树开销大于链表）</li><li>为什么是8？泊松分布计算，正常hashCode分布下链表长度>8的概率极低(约千万分之六)</li></ul>',
        scenario: '理解HashMap的性能保障机制，面试高频考点。',
        codeExample: 'import java.util.*;\n\npublic class TreeConversion {\n    // 模拟hashCode冲突：所有对象返回相同hashCode\n    static class BadKey {\n        String value;\n        BadKey(String value) { this.value = value; }\n\n        @Override\n        public int hashCode() {\n            return 1; // 故意制造冲突\n        }\n\n        @Override\n        public boolean equals(Object o) {\n            return o instanceof BadKey bk\n                && Objects.equals(value, bk.value);\n        }\n    }\n\n    public static void main(String[] args) {\n        Map<BadKey, String> map = new HashMap<>();\n\n        // 所有元素都在同一个桶中\n        for (int i = 0; i < 20; i++) {\n            map.put(new BadKey("key" + i), "val" + i);\n        }\n        // 链表 → 红黑树（>8时转换）\n        // get仍能工作，但性能从O(n)优化为O(log n)\n\n        System.out.println(map.get(new BadKey("key15")));\n\n        // 正常使用时hash分布均匀，不会触发树化\n        Map<String, Integer> normal = new HashMap<>();\n        for (int i = 0; i < 10000; i++) {\n            normal.put("key" + i, i);\n        }\n    }\n}',
        estimatedMinutes: 25,
        tags: ['集合', '面试']
      }
    ]
  },
  {
    id: 'p3-treemap',
    title: 'TreeSet 与 TreeMap',
    description: '理解有序集合的红黑树实现',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'p3-treemap-rbtree',
        title: '红黑树原理',
        shortDesc: 'TreeMap用红黑树存储——元素自动排序，增删查都是O(log n)',
        deepPrinciple: '<p>TreeMap基于红黑树（自平衡二叉搜索树），所有操作O(log n)。元素按key的自然顺序或指定Comparator排序。TreeSet底层是TreeMap。</p><p>与HashMap对比：HashMap无序O(1)，TreeMap有序O(log n)。需要排序时用TreeMap，否则用HashMap。</p>',
        scenario: '按成绩排名、按时间范围查询、维护有序的配置项。',
        codeExample: 'import java.util.*;\n\npublic class TreeMapDemo {\n    public static void main(String[] args) {\n        // TreeMap：按key自动排序\n        TreeMap<String, Integer> scores = new TreeMap<>();\n        scores.put("Charlie", 85);\n        scores.put("Alice", 92);\n        scores.put("Bob", 78);\n        System.out.println(scores); // 按字母序\n\n        // 范围查询\n        scores.put("David", 95);\n        scores.put("Eve", 88);\n        System.out.println("B-D范围: "\n            + scores.subMap("B", "E")); // Bob,Charlie,David\n        System.out.println("最高分: " + scores.lastEntry());\n        System.out.println("最低分: " + scores.firstEntry());\n\n        // TreeSet：有序去重\n        TreeSet<Integer> numSet = new TreeSet<>(\n            Arrays.asList(5, 3, 8, 1, 9, 3, 5));\n        System.out.println(numSet); // [1, 3, 5, 8, 9]\n        System.out.println(">=5的: " + numSet.tailSet(5));\n    }\n}',
        estimatedMinutes: 25,
        tags: ['集合', '必学']
      },
      {
        id: 'p3-comparable',
        title: '自然排序 Comparable',
        shortDesc: 'Comparable让对象「自带排序能力」——实现compareTo方法',
        deepPrinciple: '<p>Comparable&lt;T&gt;接口的compareTo方法定义自然排序：</p><ul><li>返回负数：this < other</li><li>返回0：this == other</li><li>返回正数：this > other</li></ul><p>String、Integer等JDK类已实现Comparable。自定义类要放入TreeSet/TreeMap就必须实现Comparable或提供Comparator。</p>',
        scenario: '学生按成绩排名，成绩相同按姓名排。',
        codeExample: 'import java.util.*;\n\npublic class ComparableDemo {\n    static class Student implements Comparable<Student> {\n        String name;\n        int score;\n\n        Student(String name, int score) {\n            this.name = name;\n            this.score = score;\n        }\n\n        @Override\n        public int compareTo(Student other) {\n            // 先按分数降序\n            int result = Integer.compare(other.score, this.score);\n            if (result != 0) return result;\n            // 分数相同按姓名升序\n            return this.name.compareTo(other.name);\n        }\n\n        @Override\n        public String toString() {\n            return name + ":" + score;\n        }\n    }\n\n    public static void main(String[] args) {\n        List<Student> students = Arrays.asList(\n            new Student("张三", 85),\n            new Student("李四", 92),\n            new Student("王五", 85));\n\n        Collections.sort(students);\n        System.out.println(students);\n        // [李四:92, 王五:85, 张三:85]\n    }\n}',
        estimatedMinutes: 25,
        tags: ['集合', '必学']
      },
      {
        id: 'p3-comparator',
        title: '比较器 Comparator',
        shortDesc: 'Comparator是外部排序策略——不修改类本身就能定义不同排序方式',
        deepPrinciple: '<p>Comparator是外部比较器，可以定义多种排序策略而不修改原类。Java 8+提供了丰富的工厂方法：</p><ul><li>Comparator.comparing(keyExtractor)</li><li>.thenComparing() 多级排序</li><li>.reversed() 反转</li><li>Comparator.naturalOrder() / reverseOrder()</li></ul>',
        scenario: '同一批数据需要按不同字段排序：按价格、按销量、按评分。',
        codeExample: 'import java.util.*;\n\npublic class ComparatorDemo {\n    record Product(String name, double price, int sales) {}\n\n    public static void main(String[] args) {\n        List<Product> products = List.of(\n            new Product("手机", 3999, 1000),\n            new Product("耳机", 199, 5000),\n            new Product("平板", 3999, 800),\n            new Product("手表", 1999, 3000));\n\n        var list = new ArrayList<>(products);\n\n        // 按价格升序\n        list.sort(Comparator.comparingDouble(Product::price));\n\n        // 按价格降序\n        list.sort(Comparator.comparingDouble(Product::price)\n            .reversed());\n\n        // 多级排序：价格升序，同价按销量降序\n        list.sort(Comparator\n            .comparingDouble(Product::price)\n            .thenComparing(\n                Comparator.comparingInt(Product::sales).reversed()));\n\n        list.forEach(p -> System.out.printf(\n            "%s ¥%.0f 销量%d%n", p.name(), p.price(), p.sales()));\n    }\n}',
        estimatedMinutes: 25,
        tags: ['集合', '必学']
      }
    ]
  },
  {
    id: 'p3-generics',
    title: '泛型',
    description: '掌握 Java 泛型的核心概念和高级用法',
    estimatedHours: 3,
    knowledgePoints: [
      {
        id: 'p3-type-erasure',
        title: '类型擦除',
        shortDesc: '泛型信息在编译后被擦除——运行时List<String>和List<Integer>是同一个类',
        deepPrinciple: '<p>Java泛型通过<strong>类型擦除</strong>实现，编译后泛型信息被移除：</p><ul><li>List&lt;String&gt; 和 List&lt;Integer&gt; 运行时都是 List</li><li>类型参数被替换为上界(默认Object)</li><li>编译器在必要处插入类型转换(checkcast)</li></ul><p>类型擦除的限制：不能new T()、不能instanceof T、不能创建泛型数组。</p>',
        scenario: '理解为什么泛型不能用于instanceof检查，为什么不能创建new T[]。',
        codeExample: 'import java.util.*;\n\npublic class TypeErasureDemo {\n    public static void main(String[] args) {\n        List<String> strList = new ArrayList<>();\n        List<Integer> intList = new ArrayList<>();\n\n        // 运行时类型相同（类型擦除）\n        System.out.println(strList.getClass() == intList.getClass());\n        // true\n\n        // 编译后等价于：\n        // List strList = new ArrayList();\n        // String s = (String) strList.get(0); // 编译器插入转换\n\n        // 不能用泛型做instanceof\n        // if (strList instanceof List<String>) {} // 编译错误\n        if (strList instanceof List<?>) {} // 可以用通配符\n    }\n\n    // 泛型方法\n    public static <T> T firstOrNull(List<T> list) {\n        return list.isEmpty() ? null : list.get(0);\n    }\n\n    // 泛型类\n    static class Box<T> {\n        private T value;\n        public void set(T value) { this.value = value; }\n        public T get() { return value; }\n    }\n}',
        estimatedMinutes: 30,
        tags: ['泛型', '必学']
      },
      {
        id: 'p3-wildcard',
        title: '通配符 ? / extends / super',
        shortDesc: '通配符让泛型更灵活——?是任意类型，extends限定上界，super限定下界',
        deepPrinciple: '<p>通配符解决泛型的协变/逆变问题：</p><ul><li><strong>?</strong>：无界通配符，只读不写</li><li><strong>? extends T</strong>：上界通配符，可以读取(as T)不能写入</li><li><strong>? super T</strong>：下界通配符，可以写入(T及子类)读取只能是Object</li></ul>',
        scenario: '方法参数用? extends Number接受Integer/Double/Long等所有Number子类。',
        codeExample: 'import java.util.*;\n\npublic class WildcardDemo {\n    // ? extends：只读（生产者）\n    public static double sum(List<? extends Number> list) {\n        double total = 0;\n        for (Number n : list) {\n            total += n.doubleValue();\n        }\n        // list.add(1); // 编译错误！不能写入\n        return total;\n    }\n\n    // ? super：可写（消费者）\n    public static void addNumbers(List<? super Integer> list) {\n        list.add(1);\n        list.add(2);\n        // Integer n = list.get(0); // 编译错误！只能读Object\n    }\n\n    public static void main(String[] args) {\n        // extends：接受Number及其子类的List\n        System.out.println(sum(List.of(1, 2, 3)));       // Integer\n        System.out.println(sum(List.of(1.5, 2.5)));      // Double\n\n        // super：接受Integer及其父类的List\n        List<Number> numList = new ArrayList<>();\n        addNumbers(numList);\n        System.out.println(numList);\n    }\n}',
        estimatedMinutes: 30,
        tags: ['泛型', '必学']
      },
      {
        id: 'p3-pecs',
        title: 'PECS 原则',
        shortDesc: 'Producer Extends, Consumer Super——读用extends，写用super',
        deepPrinciple: '<p><strong>PECS</strong> = Producer Extends, Consumer Super：</p><ul><li>如果参数是数据的<strong>生产者</strong>(只从中读取)：用 ? extends T</li><li>如果参数是数据的<strong>消费者</strong>(只向其写入)：用 ? super T</li><li>既读又写：不用通配符，直接用T</li></ul><p>Collections.copy(dest, src) 是PECS的经典应用：dest是消费者(? super T)，src是生产者(? extends T)。</p>',
        scenario: '设计通用的工具方法时，正确使用PECS让API更灵活。',
        codeExample: 'import java.util.*;\n\npublic class PecsDemo {\n    /**\n     * 将src中满足条件的元素复制到dest\n     * src是生产者(读) → extends\n     * dest是消费者(写) → super\n     */\n    public static <T> void copyIf(\n            List<? super T> dest,\n            List<? extends T> src,\n            java.util.function.Predicate<? super T> filter) {\n        for (T item : src) {\n            if (filter.test(item)) {\n                dest.add(item);\n            }\n        }\n    }\n\n    public static void main(String[] args) {\n        List<Integer> source = List.of(1, 2, 3, 4, 5, 6);\n        List<Number> target = new ArrayList<>();\n\n        // Integer extends Number，Number super Integer\n        copyIf(target, source, n -> n % 2 == 0);\n        System.out.println(target); // [2, 4, 6]\n\n        // Comparable的PECS\n        // Collections.sort(List<T>) 中T extends Comparable<? super T>\n        // 允许Student实现Comparable<Person>也能排序\n    }\n}',
        estimatedMinutes: 25,
        tags: ['泛型', '面试']
      }
    ]
  },
  {
    id: 'p3-optional',
    title: 'Optional',
    description: '使用 Optional 优雅处理可能为空的值',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'p3-optional-create',
        title: '创建与 ofNullable',
        shortDesc: 'Optional是「可能有值也可能没有」的容器——消灭空指针的利器',
        deepPrinciple: '<p>Optional&lt;T&gt;是一个容器对象，可以包含或不包含非null值：</p><ul><li>Optional.of(value)：value不能为null</li><li>Optional.ofNullable(value)：value可以为null</li><li>Optional.empty()：空的Optional</li></ul><p>Optional不应该用于：字段声明、方法参数、集合元素。主要用于方法返回值表达「可能没有结果」。</p>',
        scenario: '根据ID查询用户，用户可能不存在，返回Optional<User>比返回null更安全。',
        codeExample: 'import java.util.Optional;\n\npublic class OptionalCreate {\n    public static void main(String[] args) {\n        // 创建\n        Optional<String> opt1 = Optional.of("Hello");\n        Optional<String> opt2 = Optional.ofNullable(null);\n        Optional<String> opt3 = Optional.empty();\n\n        // 判断是否有值\n        System.out.println(opt1.isPresent()); // true\n        System.out.println(opt2.isEmpty());   // true (Java 11)\n\n        // 获取值\n        String val = opt1.get(); // 有值时获取\n        // opt2.get(); // NoSuchElementException!\n\n        // 安全获取\n        String safe = opt2.orElse("默认值");\n        String lazy = opt2.orElseGet(() -> computeDefault());\n    }\n\n    // 方法返回Optional\n    static Optional<String> findUserName(Long id) {\n        if (id == 1L) return Optional.of("张三");\n        return Optional.empty();\n    }\n\n    static String computeDefault() {\n        return "计算的默认值";\n    }\n}',
        estimatedMinutes: 25,
        tags: ['核心类库', '必学']
      },
      {
        id: 'p3-optional-chain',
        title: 'map / flatMap / orElse 链式操作',
        shortDesc: 'Optional的链式操作让null检查变得优雅——告别层层嵌套的if-null',
        deepPrinciple: '<p>Optional链式操作：</p><ul><li><strong>map(f)</strong>：有值时转换，无值返回empty</li><li><strong>flatMap(f)</strong>：f返回Optional时用，避免嵌套Optional</li><li><strong>filter(p)</strong>：满足条件保留，否则变empty</li><li><strong>orElse(v)</strong>：无值时返回默认值</li><li><strong>orElseThrow()</strong>：无值时抛异常</li><li><strong>ifPresent(c)</strong>：有值时执行操作</li></ul>',
        scenario: '链式获取 user.getAddress().getCity().getName()，任意一环为null都安全返回默认值。',
        codeExample: 'import java.util.Optional;\n\npublic class OptionalChain {\n    record Address(String city) {}\n    record User(String name, Address address) {}\n\n    public static void main(String[] args) {\n        User user = new User("张三", new Address("北京"));\n        User noAddr = new User("李四", null);\n\n        // 传统写法（层层null检查）\n        String city1 = "未知";\n        if (noAddr.address() != null) {\n            city1 = noAddr.address().city();\n        }\n\n        // Optional链式写法\n        String city2 = Optional.ofNullable(noAddr.address())\n            .map(Address::city)\n            .orElse("未知");\n        System.out.println(city2); // 未知\n\n        // 完整链式\n        Optional.ofNullable(user)\n            .map(User::address)\n            .map(Address::city)\n            .filter(c -> c.length() > 1)\n            .ifPresent(c -> System.out.println("城市: " + c));\n\n        // orElseThrow\n        String name = Optional.ofNullable(user)\n            .map(User::name)\n            .orElseThrow(() ->\n                new RuntimeException("用户不存在"));\n    }\n}',
        estimatedMinutes: 30,
        tags: ['核心类库', '必学']
      }
    ]
  },
  {
    id: 'p3-datetime',
    title: '日期时间 API',
    description: '掌握 Java 8+ 的新日期时间API',
    estimatedHours: 2,
    knowledgePoints: [
      {
        id: 'p3-local-datetime',
        title: 'LocalDate / LocalDateTime',
        shortDesc: '新日期API不可变且线程安全——彻底告别老旧的Date和Calendar',
        deepPrinciple: '<p>Java 8 引入java.time包：</p><ul><li><strong>LocalDate</strong>：只有日期（年月日）</li><li><strong>LocalTime</strong>：只有时间（时分秒）</li><li><strong>LocalDateTime</strong>：日期+时间</li><li><strong>ZonedDateTime</strong>：带时区的日期时间</li><li><strong>Instant</strong>：时间戳（UTC纪元秒）</li></ul><p>所有类都是不可变的、线程安全的。修改操作返回新对象。</p>',
        scenario: '记录用户注册日期、计算订单有效期、显示格式化时间。',
        codeExample: 'import java.time.*;\n\npublic class DateTimeDemo {\n    public static void main(String[] args) {\n        // 获取当前\n        LocalDate today = LocalDate.now();\n        LocalTime now = LocalTime.now();\n        LocalDateTime dateTime = LocalDateTime.now();\n\n        // 指定日期\n        LocalDate birthday = LocalDate.of(2000, 1, 15);\n\n        // 日期运算（返回新对象）\n        LocalDate tomorrow = today.plusDays(1);\n        LocalDate lastMonth = today.minusMonths(1);\n        LocalDate nextYear = today.plusYears(1);\n\n        // 比较\n        System.out.println(today.isAfter(birthday)); // true\n        System.out.println(today.isBefore(tomorrow)); // true\n\n        // 获取信息\n        System.out.println("年: " + today.getYear());\n        System.out.println("月: " + today.getMonthValue());\n        System.out.println("星期: " + today.getDayOfWeek());\n\n        // Instant时间戳\n        Instant timestamp = Instant.now();\n        System.out.println("纪元秒: " + timestamp.getEpochSecond());\n    }\n}',
        estimatedMinutes: 25,
        tags: ['核心类库', '必学']
      },
      {
        id: 'p3-datetime-format',
        title: '格式化 DateTimeFormatter',
        shortDesc: '用DateTimeFormatter格式化和解析日期——线程安全的替代SimpleDateFormat',
        deepPrinciple: '<p>DateTimeFormatter是线程安全的（SimpleDateFormat不是）。</p><ul><li>预定义格式：ISO_LOCAL_DATE(yyyy-MM-dd)等</li><li>自定义格式：DateTimeFormatter.ofPattern("yyyy年MM月dd日")</li><li>格式化：format(formatter)</li><li>解析：LocalDate.parse(str, formatter)</li></ul>',
        scenario: '将日期显示为"2024年01月15日"或"2024-01-15 10:30:00"。',
        codeExample: 'import java.time.*;\nimport java.time.format.DateTimeFormatter;\n\npublic class DateTimeFormat {\n    // 线程安全，可以定义为常量\n    static final DateTimeFormatter CN_DATE =\n        DateTimeFormatter.ofPattern("yyyy年MM月dd日");\n    static final DateTimeFormatter CN_DATETIME =\n        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");\n\n    public static void main(String[] args) {\n        LocalDate today = LocalDate.now();\n        LocalDateTime now = LocalDateTime.now();\n\n        // 格式化\n        System.out.println(today.format(CN_DATE));\n        System.out.println(now.format(CN_DATETIME));\n\n        // 解析\n        LocalDate parsed = LocalDate.parse("2024-06-15");\n        LocalDate cnParsed = LocalDate.parse(\n            "2024年06月15日", CN_DATE);\n        System.out.println(parsed);\n        System.out.println(cnParsed);\n\n        // ISO格式（默认）\n        System.out.println(today.format(\n            DateTimeFormatter.ISO_LOCAL_DATE));\n    }\n}',
        estimatedMinutes: 20,
        tags: ['核心类库', '必学']
      },
      {
        id: 'p3-period-duration',
        title: '计算 Period / Duration',
        shortDesc: 'Period计算日期间隔（年月日），Duration计算时间间隔（时分秒）',
        deepPrinciple: '<p>两种时间间隔：</p><ul><li><strong>Period</strong>：基于日期的间隔（年、月、日），用于LocalDate</li><li><strong>Duration</strong>：基于时间的间隔（秒、纳秒），用于LocalTime/LocalDateTime/Instant</li><li>ChronoUnit可以计算两个时间之间的具体单位差值</li></ul>',
        scenario: '计算用户年龄、会员剩余天数、方法执行耗时。',
        codeExample: 'import java.time.*;\nimport java.time.temporal.ChronoUnit;\n\npublic class PeriodDurationDemo {\n    public static void main(String[] args) {\n        // Period：日期间隔\n        LocalDate birthday = LocalDate.of(2000, 6, 15);\n        LocalDate today = LocalDate.now();\n        Period age = Period.between(birthday, today);\n        System.out.printf("年龄: %d年%d月%d天%n",\n            age.getYears(), age.getMonths(), age.getDays());\n\n        // ChronoUnit：精确单位计算\n        long totalDays = ChronoUnit.DAYS.between(birthday, today);\n        System.out.println("共计: " + totalDays + "天");\n\n        // Duration：时间间隔\n        Instant start = Instant.now();\n        // 模拟耗时操作\n        for (int i = 0; i < 1000000; i++) {}\n        Instant end = Instant.now();\n        Duration elapsed = Duration.between(start, end);\n        System.out.println("耗时: " + elapsed.toMillis() + "ms");\n\n        // 创建间隔\n        Duration twoHours = Duration.ofHours(2);\n        Period threeMonths = Period.ofMonths(3);\n\n        // VIP到期时间\n        LocalDateTime vipExpiry = LocalDateTime.now()\n            .plus(threeMonths);\n        System.out.println("VIP到期: " + vipExpiry);\n    }\n}',
        estimatedMinutes: 25,
        tags: ['核心类库', '必学']
      }
    ]
  },
  {
    id: 'p3-stream',
    title: 'Stream API',
    description: '掌握 Java 8 Stream 流式编程',
    estimatedHours: 4,
    knowledgePoints: [
      {
        id: 'p3-stream-create',
        title: '创建流',
        shortDesc: 'Stream是数据的「流水线」——声明式地处理集合数据',
        deepPrinciple: '<p>Stream是对集合数据进行函数式操作的高级抽象。特点：</p><ul><li>不存储数据，只是数据的视图</li><li>惰性求值：中间操作不立即执行，终端操作触发计算</li><li>一次性使用：终端操作后流不能再使用</li><li>可以并行处理</li></ul><p>创建方式：collection.stream()、Arrays.stream()、Stream.of()、Stream.generate()、Stream.iterate()。</p>',
        scenario: '从用户列表中筛选活跃用户、按注册时间排序、取前10个。',
        codeExample: 'import java.util.*;\nimport java.util.stream.*;\n\npublic class StreamCreate {\n    public static void main(String[] args) {\n        // 从集合创建\n        List<String> names = List.of("Alice", "Bob", "Charlie");\n        Stream<String> s1 = names.stream();\n\n        // 从数组创建\n        int[] arr = {1, 2, 3, 4, 5};\n        IntStream s2 = Arrays.stream(arr);\n\n        // 直接创建\n        Stream<String> s3 = Stream.of("A", "B", "C");\n\n        // 无限流 + limit\n        Stream<Integer> randoms = Stream\n            .generate(() -> (int)(Math.random() * 100))\n            .limit(5);\n        randoms.forEach(System.out::println);\n\n        // iterate（等差数列）\n        Stream.iterate(0, n -> n + 2)\n            .limit(5)\n            .forEach(n -> System.out.print(n + " "));\n        // 0 2 4 6 8\n\n        // 范围\n        IntStream.range(1, 6)\n            .forEach(n -> System.out.print(n + " "));\n        // 1 2 3 4 5\n    }\n}',
        estimatedMinutes: 25,
        tags: ['Stream', '必学']
      },
      {
        id: 'p3-stream-intermediate',
        title: '中间操作：map / filter / sorted',
        shortDesc: '中间操作像流水线上的工序——筛选、转换、排序环环相扣',
        deepPrinciple: '<p>中间操作返回新Stream，惰性执行：</p><ul><li><strong>filter</strong>：过滤不满足条件的元素</li><li><strong>map</strong>：将每个元素转换为另一个值</li><li><strong>flatMap</strong>：将每个元素转换为流并合并（一对多展开）</li><li><strong>sorted</strong>：排序</li><li><strong>distinct</strong>：去重</li><li><strong>peek</strong>：查看中间结果（调试用）</li><li><strong>limit/skip</strong>：截取/跳过</li></ul>',
        scenario: '从订单列表中：筛选已支付订单 → 提取金额 → 排序 → 取前5。',
        codeExample: 'import java.util.*;\nimport java.util.stream.*;\n\npublic class StreamIntermediate {\n    record Order(String id, String status, double amount) {}\n\n    public static void main(String[] args) {\n        List<Order> orders = List.of(\n            new Order("O1", "PAID", 99.0),\n            new Order("O2", "PENDING", 199.0),\n            new Order("O3", "PAID", 59.0),\n            new Order("O4", "PAID", 299.0),\n            new Order("O5", "CANCELLED", 159.0));\n\n        // 筛选→转换→排序→取前N\n        List<Double> topPaid = orders.stream()\n            .filter(o -> "PAID".equals(o.status()))\n            .map(Order::amount)\n            .sorted(Comparator.reverseOrder())\n            .limit(2)\n            .collect(Collectors.toList());\n        System.out.println("最高已付金额: " + topPaid);\n\n        // flatMap展开\n        List<List<String>> nested = List.of(\n            List.of("A", "B"), List.of("C", "D"));\n        List<String> flat = nested.stream()\n            .flatMap(Collection::stream)\n            .collect(Collectors.toList());\n        System.out.println(flat); // [A, B, C, D]\n\n        // 去重\n        List<Integer> unique = List.of(1,2,2,3,3,3).stream()\n            .distinct()\n            .collect(Collectors.toList());\n        System.out.println(unique); // [1, 2, 3]\n    }\n}',
        estimatedMinutes: 30,
        tags: ['Stream', '必学']
      },
      {
        id: 'p3-stream-terminal',
        title: '终端操作：collect / reduce',
        shortDesc: '终端操作触发流水线运转——收集结果、聚合计算、遍历消费',
        deepPrinciple: '<p>终端操作触发实际计算并产生结果：</p><ul><li><strong>collect</strong>：收集到集合(toList/toSet/toMap/groupingBy)</li><li><strong>reduce</strong>：聚合为单个值</li><li><strong>forEach</strong>：遍历消费</li><li><strong>count/min/max/sum/average</strong>：统计</li><li><strong>findFirst/findAny</strong>：查找</li><li><strong>allMatch/anyMatch/noneMatch</strong>：判断</li></ul>',
        scenario: '按城市分组统计用户数、计算订单总金额、查找第一个满足条件的元素。',
        codeExample: 'import java.util.*;\nimport java.util.stream.*;\n\npublic class StreamTerminal {\n    record User(String name, String city, int age) {}\n\n    public static void main(String[] args) {\n        List<User> users = List.of(\n            new User("张三", "北京", 25),\n            new User("李四", "上海", 30),\n            new User("王五", "北京", 28),\n            new User("赵六", "上海", 22));\n\n        // 按城市分组\n        Map<String, List<User>> byCity = users.stream()\n            .collect(Collectors.groupingBy(User::city));\n        byCity.forEach((city, list) ->\n            System.out.println(city + ": " + list.size() + "人"));\n\n        // 收集为Map\n        Map<String, Integer> nameAge = users.stream()\n            .collect(Collectors.toMap(User::name, User::age));\n\n        // reduce聚合\n        int totalAge = users.stream()\n            .map(User::age)\n            .reduce(0, Integer::sum);\n        System.out.println("总年龄: " + totalAge);\n\n        // 统计\n        IntSummaryStatistics stats = users.stream()\n            .mapToInt(User::age)\n            .summaryStatistics();\n        System.out.printf("平均年龄:%.1f 最大:%d 最小:%d%n",\n            stats.getAverage(), stats.getMax(), stats.getMin());\n\n        // 判断\n        boolean allAdult = users.stream()\n            .allMatch(u -> u.age() >= 18);\n        System.out.println("全部成年: " + allAdult);\n\n        // 拼接字符串\n        String names = users.stream()\n            .map(User::name)\n            .collect(Collectors.joining(", "));\n        System.out.println("用户: " + names);\n    }\n}',
        estimatedMinutes: 35,
        tags: ['Stream', '必学']
      },
      {
        id: 'p3-parallel-stream',
        title: '并行流',
        shortDesc: '并行流自动利用多核CPU——一行代码开启并行处理',
        deepPrinciple: '<p>并行流(parallelStream)利用ForkJoinPool实现多线程处理：</p><ul><li>适合：大数据量、CPU密集、元素无依赖</li><li>不适合：小数据量、IO密集、有状态操作、线程不安全的集合</li><li>并行流的forEach不保证顺序，用forEachOrdered保序</li></ul><p>不要盲目使用并行流——小数据量时线程调度开销反而更慢。建议数据量>10000时考虑。</p>',
        scenario: '处理百万级数据的转换和聚合计算。',
        codeExample: 'import java.util.*;\nimport java.util.stream.*;\n\npublic class ParallelStreamDemo {\n    public static void main(String[] args) {\n        List<Integer> bigList = IntStream.rangeClosed(1, 10000000)\n            .boxed()\n            .collect(Collectors.toList());\n\n        // 串行\n        long start = System.currentTimeMillis();\n        long sum1 = bigList.stream()\n            .mapToLong(Integer::longValue)\n            .sum();\n        long t1 = System.currentTimeMillis() - start;\n\n        // 并行\n        start = System.currentTimeMillis();\n        long sum2 = bigList.parallelStream()\n            .mapToLong(Integer::longValue)\n            .sum();\n        long t2 = System.currentTimeMillis() - start;\n\n        System.out.printf("串行: %dms, 并行: %dms%n", t1, t2);\n        System.out.println("结果一致: " + (sum1 == sum2));\n\n        // 注意：并行流中不要使用线程不安全的操作\n        // 错误：\n        // List<Integer> unsafeList = new ArrayList<>();\n        // bigList.parallelStream().forEach(unsafeList::add);\n\n        // 正确：用collect\n        List<Integer> safeList = bigList.parallelStream()\n            .filter(n -> n % 2 == 0)\n            .collect(Collectors.toList());\n    }\n}',
        estimatedMinutes: 25,
        tags: ['Stream', '进阶']
      }
    ]
  }
];
