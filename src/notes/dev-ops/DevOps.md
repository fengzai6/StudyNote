## DevOps

1、模式： 编写代码 ➡️ git提交到仓库 ➡️ CI工具识别到变化，进行自动化Build， Test， Package ➡️ 测试通过后进行CD自动化发布到指定环境 ➡️ 成功上线

2、好处：降低出错几率，能够很早的发现错误；能够降本提效，自动化的步骤使开发人员更加专注的编写代码；能够驱动人员对PR进行编写相关的测试，提前发现错误并处理

#### git flow

​	分支主要有： master（主要分支）、 develop（主要开发分支）、feature（新功能分支）、release（发布分支，上线前的测试分支）、hotfix（热修复分支）

​	其中主要维护分支为：master、develop

​	该流程较为复杂，在使用的时候会增加开发的时间周期

#### github flow

​	一种更为简单的工作流程

​	master > feature > PR > Approved > Test > Merge > Build

​	PR应该有测试，并且需要小而精，太大会导致不好review

#### CI	Continuous integration（持续集成）

​	开发人员频繁的将代码更改合并，就能在每次合并后，自动运行构建和测试流程，以确保新代码的更改不会破坏产品的功能或者质量

​	有 TeamCity、Jenkins、GitHub Actions

#### CD	Continuous delivery（持续交付）

​	在 CI 的基础上，自动化将代码更改部署到测试环境或者生产环境当中，以便进行更多的测试和质量保证

​	有Octopus Deploy



​	