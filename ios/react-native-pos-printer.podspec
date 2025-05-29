require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name         = "react-native-pos-printer"
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']
  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platform     = :ios, "11.0"
  s.source       = { :git => "https://github.com/sanjeevkumarraob/react-native-pos-printer.git", :tag => "#{s.version}" }
  s.source_files = "*.{h,m}"
  s.requires_arc = true
  
  s.dependency "React-Core"
  
  # Include Epson SDK framework
  s.vendored_frameworks = 'Frameworks/libepos2.xcframework'
  
  # Required frameworks for Epson SDK
  s.frameworks = 'ExternalAccessory'
  
  # Required libraries
  s.library = 'xml2'
  
  # Build settings
  s.pod_target_xcconfig = { 'HEADER_SEARCH_PATHS' => '$(PODS_TARGET_SRCROOT)/Frameworks/libepos2.xcframework/Headers' }
end
