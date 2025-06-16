import { Suspense } from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            个人网盘资源分享
          </h1>
          <p className="text-lg text-gray-600">
            发现和分享优质资源，让知识传播更简单
          </p>
        </header>

        <main className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                欢迎来到资源分享平台
              </h2>
              <p className="text-gray-600 mb-8">
                这里汇集了各类优质资源，包括电子书籍、学习资料、文档资源等
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    📚 电子书籍
                  </h3>
                  <p className="text-blue-600">
                    精选各类电子书籍，涵盖技术、文学、科学等领域
                  </p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    📖 学习资料
                  </h3>
                  <p className="text-green-600">
                    优质学习资源，助力个人成长和技能提升
                  </p>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">
                    📄 文档资料
                  </h3>
                  <p className="text-purple-600">
                    实用文档模板和参考资料，提高工作效率
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  开始浏览资源
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
