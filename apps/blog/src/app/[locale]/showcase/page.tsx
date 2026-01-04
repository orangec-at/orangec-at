import { components } from "@/lib/design-tokens";
import { Badge } from "@orangec-at/design";

export default function ShowcasePage() {
  // MUJI 진열대처럼 다양한 컴포넌트 배치
  const items = [
    // Row 1
    { type: 'product', title: 'Design', category: 'Creative', colorClass: 'bg-gray-200 dark:bg-gray-700' },
    { type: 'product', title: 'Code', category: 'Tech', colorClass: 'bg-wood-200 dark:bg-wood-800' },
    { type: 'product', title: 'Art', category: 'Visual', colorClass: 'bg-gray-200 dark:bg-gray-700' },
    { type: 'product', title: 'Writing', category: 'Content', colorClass: 'bg-steel-200 dark:bg-steel-800' },
    { type: 'product', title: 'Music', category: 'Audio', colorClass: 'bg-gray-200 dark:bg-gray-700' },
    { type: 'product', title: 'Photo', category: 'Image', colorClass: 'bg-wood-200 dark:bg-wood-800' },

    // Row 2
    { type: 'image', bgClass: 'bg-wood-100 dark:bg-wood-900' },
    { type: 'image', bgClass: 'bg-gray-100 dark:bg-gray-800' },
    { type: 'image', bgClass: 'bg-steel-100 dark:bg-steel-900' },
    { type: 'image', bgClass: 'bg-wood-100 dark:bg-wood-900' },
    { type: 'image', bgClass: 'bg-gray-100 dark:bg-gray-800' },
    { type: 'image', bgClass: 'bg-wood-200 dark:bg-wood-800' },

    // Row 3
    { type: 'info', title: 'Portfolio', subtitle: 'Work Collection', bgClass: 'bg-white dark:bg-gray-800' },
    { type: 'info', title: 'Archive', subtitle: 'Past Projects', bgClass: 'bg-wood-50 dark:bg-wood-900' },
    { type: 'info', title: 'Gallery', subtitle: 'Visual Works', bgClass: 'bg-white dark:bg-gray-800' },
    { type: 'info', title: 'Journal', subtitle: 'Thoughts', bgClass: 'bg-gray-50 dark:bg-gray-800' },
    { type: 'info', title: 'Library', subtitle: 'Resources', bgClass: 'bg-white dark:bg-gray-800' },
    { type: 'info', title: 'Studio', subtitle: 'Workshop', bgClass: 'bg-wood-50 dark:bg-wood-900' },

    // Row 4
    { type: 'small', label: '01', bgClass: 'bg-gray-100 dark:bg-gray-800' },
    { type: 'small', label: '02', bgClass: 'bg-wood-100 dark:bg-wood-900' },
    { type: 'small', label: '03', bgClass: 'bg-gray-100 dark:bg-gray-800' },
    { type: 'small', label: '04', bgClass: 'bg-steel-100 dark:bg-steel-900' },
    { type: 'small', label: '05', bgClass: 'bg-gray-100 dark:bg-gray-800' },
    { type: 'small', label: '06', bgClass: 'bg-wood-100 dark:bg-wood-900' },

    // Row 5
    { type: 'product', title: 'Featured', category: 'Special', colorClass: 'bg-steel-200 dark:bg-steel-800' },
    { type: 'image', bgClass: 'bg-gray-200 dark:bg-gray-700' },
    { type: 'info', title: 'About', subtitle: 'Profile', bgClass: 'bg-white dark:bg-gray-800' },
    { type: 'small', label: '07', bgClass: 'bg-gray-100 dark:bg-gray-800' },
    { type: 'product', title: 'Latest', category: 'New', colorClass: 'bg-wood-200 dark:bg-wood-800' },
    { type: 'image', bgClass: 'bg-wood-200 dark:bg-wood-800' },

    // Row 6
    { type: 'info', title: 'Notes', subtitle: 'Ideas', bgClass: 'bg-gray-50 dark:bg-gray-800' },
    { type: 'small', label: '08', bgClass: 'bg-steel-100 dark:bg-steel-900' },
    { type: 'product', title: 'Archive', category: 'History', colorClass: 'bg-gray-200 dark:bg-gray-700' },
    { type: 'image', bgClass: 'bg-gray-100 dark:bg-gray-800' },
    { type: 'info', title: 'Links', subtitle: 'Network', bgClass: 'bg-white dark:bg-gray-800' },
    { type: 'small', label: '09', bgClass: 'bg-wood-100 dark:bg-wood-900' },

    // Row 7
    { type: 'image', bgClass: 'bg-steel-100 dark:bg-steel-900' },
    { type: 'product', title: 'Tools', category: 'Utilities', colorClass: 'bg-gray-200 dark:bg-gray-700' },
    { type: 'small', label: '10', bgClass: 'bg-gray-100 dark:bg-gray-800' },
    { type: 'info', title: 'Contact', subtitle: 'Connect', bgClass: 'bg-wood-50 dark:bg-wood-900' },
    { type: 'image', bgClass: 'bg-wood-100 dark:bg-wood-900' },
    { type: 'small', label: '11', bgClass: 'bg-steel-100 dark:bg-steel-900' },

    // Row 8
    { type: 'small', label: '12', bgClass: 'bg-wood-100 dark:bg-wood-900' },
    { type: 'info', title: 'Blog', subtitle: 'Articles', bgClass: 'bg-white dark:bg-gray-800' },
    { type: 'image', bgClass: 'bg-gray-200 dark:bg-gray-700' },
    { type: 'product', title: 'System', category: 'Design', colorClass: 'bg-steel-200 dark:bg-steel-800' },
    { type: 'small', label: '13', bgClass: 'bg-gray-100 dark:bg-gray-800' },
    { type: 'image', bgClass: 'bg-wood-200 dark:bg-wood-800' },
  ];

  return (
    <div className="w-full h-screen bg-wood-50 dark:bg-gray-900 overflow-auto">
      {/* 전체화면 그리드 - MUJI 진열대 스타일 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative border-r border-b border-gray-200 dark:border-gray-700 aspect-square hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {/* Product Card */}
            {item.type === 'product' && (
              <div className="h-full flex flex-col justify-between p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex-1 flex items-center justify-center">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full ${item.colorClass}`}></div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-900 dark:text-white text-center truncate">
                    {item.title}
                  </h3>
                  <div className="flex justify-center">
                    <Badge className="text-[10px] sm:text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Image Placeholder */}
            {item.type === 'image' && (
              <div className={`h-full w-full ${item.bgClass} flex items-center justify-center`}>
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl opacity-20">📷</span>
              </div>
            )}

            {/* Info Card */}
            {item.type === 'info' && (
              <div className={`h-full flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6 ${item.bgClass}`}>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 text-center truncate w-full">
                  {item.title}
                </h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center truncate w-full">
                  {item.subtitle}
                </p>
              </div>
            )}

            {/* Small Item */}
            {item.type === 'small' && (
              <div className={`h-full flex items-center justify-center ${item.bgClass}`}>
                <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-300 font-medium">
                  {item.label}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
