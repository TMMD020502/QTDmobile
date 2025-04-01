import UIKit
import React

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

  var window: UIWindow?

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // ...existing code...

    // Add fade-in animation
    let launchScreenVC = UIStoryboard(name: "LaunchScreen", bundle: nil).instantiateInitialViewController()
    let mainVC = UIStoryboard(name: "Main", bundle: nil).instantiateInitialViewController()

    self.window?.rootViewController = launchScreenVC
    self.window?.makeKeyAndVisible()

    UIView.animate(withDuration: 1.0, animations: {
      launchScreenVC?.view.alpha = 1.0
    }) { _ in
      UIView.animate(withDuration: 1.0, delay: 1.0, options: [], animations: {
        launchScreenVC?.view.alpha = 0.0
      }) { _ in
        self.window?.rootViewController = mainVC
      }
    }

    // Ensure the app respects the system's appearance settings
    if #available(iOS 13.0, *) {
      window?.overrideUserInterfaceStyle = .unspecified
    }

    return true
  }

  // ...existing code...
}
