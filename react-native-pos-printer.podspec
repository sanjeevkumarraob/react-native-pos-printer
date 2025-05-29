require "json"

package = JSON.parse(File.read(File.join(__dir__, "..", "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-pos-printer"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => package["repository"]["url"], :tag => "#{s.version}" }

  s.source_files = "ios/*.{h,m}"
  
  # Include Epson SDK framework
  s.vendored_frameworks = 'ios/Frameworks/libepos2.xcframework'
  
  # Required frameworks for Epson SDK
  s.frameworks = 'ExternalAccessory'
  
  # Required libraries
  s.library = 'xml2'
  
  # Build settings
  s.pod_target_xcconfig = { 'HEADER_SEARCH_PATHS' => '$(PODS_TARGET_SRCROOT)/Frameworks/libepos2.xcframework/Headers' }

  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
  end
end
