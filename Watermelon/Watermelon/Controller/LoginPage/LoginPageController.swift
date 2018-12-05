//
//  ViewController.swift
//  Watermelon
//
//  Created by Paul Rouillard on 28/11/2018.
//  Copyright © 2018 Paul Rouillard. All rights reserved.
//

import UIKit

class LoginPageController: UIViewController
{

    override func viewDidLoad()
    {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

//alert to sign in. Need to implement database for user input.

    @IBAction func signIn(_ sender: UIButton)
    {
        let alert = UIAlertController(title: "Sign in", message: "This is an alert.", preferredStyle: .alert)
        alert.addTextField {
            (logIn : UITextField) in
            logIn.placeholder = "ID"
        }
        alert.addTextField {
            (passwd : UITextField) in
            passwd.placeholder = "Password"
            passwd.isSecureTextEntry = true
        }
        alert.addAction(UIAlertAction(title: NSLocalizedString("Sign in", comment: "Default action"), style: .default, handler: { _ in
            NSLog("The user is logged")
            self.performSegue(withIdentifier: "isConnected", sender: nil)
        }))
        self.present(alert, animated: true, completion: nil)
    }

    
    
}

